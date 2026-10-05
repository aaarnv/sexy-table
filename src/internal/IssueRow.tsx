import { Avatar } from "@base-ui/react/avatar";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import type {
  SexyTableIssue,
  SexyTablePriority,
  SexyTablePullRequestState,
} from "../types";

const priorityIcons: Record<SexyTablePriority, IconName> = {
  none: "no-priority",
  low: "low-priority",
  medium: "medium-priority",
  high: "high-priority",
  urgent: "urgent",
};

const pullRequestIcons: Record<SexyTablePullRequestState, IconName> = {
  open: "git-pull-request",
  draft: "git-pull-request-draft",
  closed: "git-pull-request-closed",
  merged: "git-merge",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.slice(0, 1))
    .slice(0, 2)
    .join("");
}

export function IssueRow({ issue }: { readonly issue: SexyTableIssue }) {
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
            name={priorityIcons[priority]}
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
                name={pullRequestIcons[issue.pullRequest.state]}
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
                <Avatar.Fallback>{getInitials(person.name)}</Avatar.Fallback>
              </Avatar.Root>
            ))}
          </span>
        </span>
      </div>
    </li>
  );
}
