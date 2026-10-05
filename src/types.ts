import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

export type SexyTableTheme = "light" | "dark" | "system";
export type SexyTablePriority = "none" | "low" | "medium" | "high" | "urgent";
export type SexyTablePullRequestState = "open" | "draft" | "closed" | "merged";
export type SexyTableStatus = "in-review" | "in-progress" | "todo" | "done";

export interface SexyTableAssignee {
  readonly id: string;
  readonly name: string;
  readonly image?: string;
}

export interface SexyTablePullRequest {
  readonly label: string;
  readonly state: SexyTablePullRequestState;
}

export interface SexyTableLabel {
  readonly name: string;
  readonly color?: string;
}

export interface SexyTableIssue {
  readonly id: string;
  readonly title: string;
  readonly priority?: SexyTablePriority;
  readonly pullRequest?: SexyTablePullRequest;
  readonly estimate?: number;
  readonly label?: SexyTableLabel;
  readonly due?: string;
  readonly assignees?: readonly SexyTableAssignee[];
}

export interface SexyTableGroup {
  readonly id: string;
  readonly label: string;
  readonly icon?: ReactNode;
  readonly issues: readonly SexyTableIssue[];
  readonly defaultOpen?: boolean;
}

export type SexyTableStyle = CSSProperties & {
  readonly [variable: `--kgt-${string}`]: string | number | undefined;
};

export interface SexyTableProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "style" | "dir"
> {
  readonly groups: readonly SexyTableGroup[];
  readonly dir?: "ltr" | "rtl";
  readonly toolbar?: ReactNode;
  readonly theme?: SexyTableTheme;
  readonly animated?: boolean;
  readonly resizable?: boolean;
  readonly onAdd?: (group: SexyTableGroup) => void;
  readonly style?: SexyTableStyle;
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
  readonly theme?: SexyTableTheme;
  readonly style?: SexyTableStyle;
}
