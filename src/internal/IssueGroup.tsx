import { useRef } from "react";
import type { MouseEvent, RefObject } from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { Tooltip } from "@base-ui/react/tooltip";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { IssueRow } from "./IssueRow";
import type { SexyTableGroup, SexyTableProps } from "../types";

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

interface IssueGroupProps {
  readonly group: SexyTableGroup;
  readonly onAdd: SexyTableProps["onAdd"];
  readonly showColumns: boolean;
  readonly portalContainer: RefObject<HTMLDivElement | null>;
}

export function IssueGroup({
  group,
  onAdd,
  showColumns,
  portalContainer,
}: IssueGroupProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  function handleHeaderClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    const ElementType = event.currentTarget.ownerDocument.defaultView?.Element;
    if (!ElementType || !(target instanceof ElementType)) return;
    if (target.closest("button")) return;
    triggerRef.current?.click();
  }

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
        onClick={handleHeaderClick}
      >
        <span data-appear className="kgt-glyph">
          {group.icon}
        </span>
        <Collapsible.Trigger ref={triggerRef} className="kgt-group-trigger">
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
