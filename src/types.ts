import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

export type GroupedTableTheme = "light" | "dark" | "system";
export type GroupedTablePriority =
  "none" | "low" | "medium" | "high" | "urgent";
export type GroupedTablePullRequestState =
  "open" | "draft" | "closed" | "merged";
export type GroupedTableStatus = "in-review" | "in-progress" | "todo" | "done";

export interface GroupedTableAssignee {
  readonly id: string;
  readonly name: string;
  readonly image?: string;
}

export interface GroupedTablePullRequest {
  readonly label: string;
  readonly state: GroupedTablePullRequestState;
}

export interface GroupedTableLabel {
  readonly name: string;
  readonly color?: string;
}

export interface GroupedTableIssue {
  readonly id: string;
  readonly title: string;
  readonly priority?: GroupedTablePriority;
  readonly pullRequest?: GroupedTablePullRequest;
  readonly estimate?: number;
  readonly label?: GroupedTableLabel;
  readonly due?: string;
  readonly assignees?: readonly GroupedTableAssignee[];
}

export interface GroupedTableGroup {
  readonly id: string;
  readonly label: string;
  readonly icon?: ReactNode;
  readonly issues: readonly GroupedTableIssue[];
  readonly defaultOpen?: boolean;
}

export type GroupedTableStyle = CSSProperties & {
  readonly [variable: `--kgt-${string}`]: string | number | undefined;
};

export interface GroupedTableProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "style" | "dir"
> {
  readonly groups: readonly GroupedTableGroup[];
  readonly dir?: "ltr" | "rtl";
  readonly toolbar?: ReactNode;
  readonly theme?: GroupedTableTheme;
  readonly animated?: boolean;
  readonly resizable?: boolean;
  readonly onAdd?: (group: GroupedTableGroup) => void;
  readonly style?: GroupedTableStyle;
}

export interface SlidingTab<Value extends string = string> {
  readonly value: Value;
  readonly label: ReactNode;
}

export interface SlidingTabsProps<Value extends string = string> extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "style"
> {
  readonly items: readonly SlidingTab<Value>[];
  readonly value: Value;
  readonly onValueChange: (value: Value) => void;
  readonly theme?: GroupedTableTheme;
  readonly style?: GroupedTableStyle;
}
