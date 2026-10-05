import {
  GroupedTable,
  GroupedTableStatusIcon,
  SlidingTabs,
} from "@aaarnv/grouped-table";
import type { GroupedTableGroup, SlidingTab } from "@aaarnv/grouped-table";
export const components = { GroupedTable, GroupedTableStatusIcon, SlidingTabs };
export const groups: readonly GroupedTableGroup[] = [
  { id: "id", label: "Custom", issues: [{ id: "row", title: "Minimal" }] },
];
export const tabs: readonly SlidingTab<"first" | "second">[] = [
  { value: "first", label: "First" },
];
