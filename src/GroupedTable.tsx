import { forwardRef, useCallback, useRef, useState } from "react";
import type { RefObject } from "react";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { Avatar } from "@base-ui/react/avatar";
import { Collapsible } from "@base-ui/react/collapsible";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { Tooltip } from "@base-ui/react/tooltip";
import { Icon } from "./internal/Icon";
import type { IconName } from "./internal/Icon";
import { useLayoutGlide } from "./internal/useLayoutGlide";
import { useTableResize } from "./internal/useTableResize";
import type {
  GroupedTableGroup,
  GroupedTableIssue,
  GroupedTableProps,
  GroupedTablePullRequestState,
} from "./types";

const pullIcons: Record<GroupedTablePullRequestState, IconName> = {
  open: "git-pull-request",
  draft: "git-pull-request-draft",
  closed: "git-pull-request-closed",
  merged: "git-merge",
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.slice(0, 1))
    .slice(0, 2)
    .join("");
}

function IssueRow({ issue }: { readonly issue: GroupedTableIssue }) {
  const assignees = issue.assignees ?? [];
  const priority = issue.priority ?? "none";
  return (
    <li>
      <div
        data-slot="grouped-table-row"
        data-flip="row"
        className="kgt-table-grid kgt-issue-row"
      >
        <span data-appear className="kgt-glyph kgt-priority">
          <Icon
            name={
              priority === "urgent"
                ? "urgent"
                : priority === "none"
                  ? "no-priority"
                  : `${priority}-priority`
            }
            label={`${priority} priority`}
            className={priority === "urgent" ? "kgt-danger" : ""}
          />
        </span>
        <span className="kgt-inline-fields">
          <span className="kgt-issue-title" data-flip="piece">
            {issue.title}
          </span>
          {issue.pullRequest && (
            <span
              className="kgt-pill kgt-pull"
              data-flip="piece"
              aria-label={`Pull request ${issue.pullRequest.label}, ${issue.pullRequest.state}`}
            >
              <Icon
                name={pullIcons[issue.pullRequest.state]}
                className={`kgt-${issue.pullRequest.state}`}
              />
              {issue.pullRequest.label}
            </span>
          )}
          {issue.estimate !== undefined && (
            <span
              className="kgt-estimate"
              data-flip="piece"
              aria-label={`${issue.estimate} ${issue.estimate === 1 ? "point" : "points"}`}
            >
              <Icon name="estimate-filled" />
              {issue.estimate}
            </span>
          )}
        </span>
        {issue.label && (
          <span data-appear className="kgt-label-cell">
            <span className="kgt-pill kgt-label">
              <span
                className="kgt-label-dot"
                style={{ background: issue.label.color ?? "currentColor" }}
              />
              {issue.label.name}
            </span>
          </span>
        )}
        {issue.due && (
          <span className="kgt-due" data-flip="piece">
            {issue.due}
          </span>
        )}
        <span
          className="kgt-people"
          aria-label={
            assignees.length
              ? `Assigned to ${assignees.map((person) => person.name).join(", ")}`
              : undefined
          }
        >
          <span className="kgt-avatar-stack" data-flip-end>
            {assignees.map((person, index) => (
              <Avatar.Root
                key={person.id}
                className="kgt-avatar"
                data-flip={index ? "fan" : undefined}
                style={{ zIndex: assignees.length - index }}
              >
                {person.image && <Avatar.Image src={person.image} alt="" />}
                <Avatar.Fallback>{initials(person.name)}</Avatar.Fallback>
              </Avatar.Root>
            ))}
          </span>
        </span>
      </div>
    </li>
  );
}

interface ColumnHeadingProps {
  readonly name: string;
  readonly icon: IconName;
  readonly area: "pull" | "label" | "estimate" | "due";
  readonly portalContainer: RefObject<HTMLDivElement | null>;
}

function ColumnHeading({
  name,
  icon,
  area,
  portalContainer,
}: ColumnHeadingProps) {
  return (
    <span
      data-flip="piece"
      data-appear
      className={`kgt-column-heading kgt-${area}-heading`}
    >
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <span role="img" aria-label={name} className="kgt-column-icon" />
          }
        >
          <Icon name={icon} />
        </Tooltip.Trigger>
        <Tooltip.Portal container={portalContainer}>
          <Tooltip.Positioner
            side="top"
            sideOffset={6}
            className="kgt-column-tooltip-positioner"
          >
            <Tooltip.Popup className="kgt-column-tooltip">{name}</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </span>
  );
}

interface GroupProps {
  readonly group: GroupedTableGroup;
  readonly onAdd: GroupedTableProps["onAdd"];
  readonly showColumns: boolean;
  readonly portalContainer: RefObject<HTMLDivElement | null>;
}

function Group({ group, onAdd, showColumns, portalContainer }: GroupProps) {
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <Collapsible.Root
      defaultOpen={group.defaultOpen ?? true}
      render={
        <section
          aria-label={group.label}
          data-flip="group"
          className="kgt-issue-group"
        />
      }
    >
      <div
        className="kgt-table-grid kgt-group-header"
        onClick={(event) => {
          const target = event.target;
          const ElementType =
            event.currentTarget.ownerDocument.defaultView?.Element;
          if (
            ElementType &&
            target instanceof ElementType &&
            !target.closest("button")
          )
            trigger.current?.click();
        }}
      >
        <span data-appear className="kgt-glyph">
          {group.icon}
        </span>
        <Collapsible.Trigger ref={trigger} className="kgt-group-trigger">
          <span data-flip="piece" className="kgt-group-name">
            <span>{group.label}</span>
            <span className="kgt-count">{group.issues.length}</span>
          </span>
        </Collapsible.Trigger>
        {showColumns && (
          <>
            <ColumnHeading
              portalContainer={portalContainer}
              name="Pull request"
              icon="git-pull-request"
              area="pull"
            />
            <ColumnHeading
              portalContainer={portalContainer}
              name="Label"
              icon="tag"
              area="label"
            />
            <ColumnHeading
              portalContainer={portalContainer}
              name="Estimate"
              icon="triangle"
              area="estimate"
            />
            <ColumnHeading
              portalContainer={portalContainer}
              name="Due"
              icon="calendar-event"
              area="due"
            />
          </>
        )}
        <span className="kgt-group-actions">
          <button
            type="button"
            className="kgt-add-button kgt-icon-button"
            aria-label={`Add an issue to ${group.label}`}
            onClick={() => onAdd?.(group)}
          >
            <Icon name="plus" />
          </button>
          <span aria-hidden="true" className="kgt-collapse-indicator">
            <Icon name="chevron-down" />
          </span>
        </span>
      </div>
      <Collapsible.Panel className="kgt-group-panel">
        <ul>
          {group.issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} />
          ))}
        </ul>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export const GroupedTable = forwardRef<HTMLDivElement, GroupedTableProps>(
  function GroupedTable(
    {
      groups,
      toolbar,
      theme = "system",
      dir = "ltr",
      resizable = true,
      animated = true,
      onAdd,
      className = "",
      style,
      onPointerDownCapture,
      onKeyDownCapture,
      ...props
    },
    forwardedRef,
  ) {
    const table = useRef<HTMLDivElement>(null);
    const container = useRef<HTMLDivElement>(null);
    const list = useRef<HTMLDivElement>(null);
    const viewport = useRef<HTMLDivElement>(null);
    const [settled, setSettled] = useState(false);
    const resize = useTableResize(table, resizable);
    useLayoutGlide(container, list, viewport, animated);
    const setTableRef = useCallback(
      (element: HTMLDivElement | null) => {
        table.current = element;
        if (typeof forwardedRef === "function") return forwardedRef(element);
        if (forwardedRef) forwardedRef.current = element;
      },
      [forwardedRef],
    );

    return (
      <DirectionProvider direction={dir}>
        <Tooltip.Provider delay={0} closeDelay={140}>
          <div
            {...props}
            dir={dir}
            ref={setTableRef}
            data-kgt-theme={theme}
            data-slot="grouped-table"
            data-animated={animated}
            data-resizing={resize.dragging ? "" : undefined}
            className={`kgt-grouped-table ${className}`}
            style={{ ...style, ...resize.size }}
            onPointerDownCapture={(event) => {
              setSettled(true);
              onPointerDownCapture?.(event);
            }}
            onKeyDownCapture={(event) => {
              setSettled(true);
              onKeyDownCapture?.(event);
            }}
          >
            <div ref={container} className="kgt-table-container">
              {toolbar && (
                <div
                  data-slot="grouped-table-toolbar"
                  className="kgt-table-toolbar"
                >
                  {toolbar}
                </div>
              )}
              <ScrollArea.Root
                data-slot="scroll-area"
                className="kgt-table-scroll-area"
              >
                <ScrollArea.Viewport
                  ref={viewport}
                  data-slot="scroll-area-viewport"
                  className="kgt-table-scroll"
                  aria-label="Issues, scroll for more"
                >
                  <div
                    ref={list}
                    className="kgt-groups"
                    data-settled={animated && settled ? "" : undefined}
                  >
                    {groups.map((group, index) => (
                      <Group
                        key={group.id}
                        group={group}
                        onAdd={onAdd}
                        showColumns={index === 0}
                        portalContainer={table}
                      />
                    ))}
                  </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                  className="kgt-table-scrollbar"
                  orientation="vertical"
                >
                  <ScrollArea.Thumb className="kgt-table-scroll-thumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Scrollbar
                  className="kgt-table-scrollbar"
                  orientation="horizontal"
                >
                  <ScrollArea.Thumb className="kgt-table-scroll-thumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner />
              </ScrollArea.Root>
            </div>
            {resizable && (
              <>
                {resize.axes.map((axis) => (
                  <div
                    key={axis}
                    role="separator"
                    aria-label={`Resize the table's ${axis}`}
                    aria-orientation={
                      axis === "width" ? "vertical" : "horizontal"
                    }
                    aria-valuemin={resize.minimum[axis]}
                    aria-valuemax={
                      axis === "width" ? resize.natural.width : undefined
                    }
                    aria-valuenow={resize.dimensions[axis]}
                    aria-valuetext={`${resize.dimensions[axis]} pixels`}
                    tabIndex={0}
                    className={`kgt-resize-handle kgt-resize-${axis}`}
                    {...resize.handle(axis)}
                  />
                ))}
                <div
                  aria-hidden="true"
                  className="kgt-resize-corner"
                  {...resize.handle("both")}
                >
                  <Icon name="resize-corner" />
                </div>
              </>
            )}
            {resize.dragging && (
              <div
                className={`kgt-resize-overlay kgt-resize-overlay-${resize.dragging}`}
              />
            )}
          </div>
        </Tooltip.Provider>
      </DirectionProvider>
    );
  },
);
