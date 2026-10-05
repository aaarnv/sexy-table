import {
  SexyTable,
  SexyTableStatusIcon,
  SlidingTabs,
} from "@aaarnv/sexy-table";
import type { SexyTableGroup, SlidingTab } from "@aaarnv/sexy-table";
export const components = { SexyTable, SexyTableStatusIcon, SlidingTabs };
export const groups: readonly SexyTableGroup[] = [
  { id: "id", label: "Custom", issues: [{ id: "row", title: "Minimal" }] },
];
export const tabs: readonly SlidingTab<"first" | "second">[] = [
  { value: "first", label: "First" },
];
