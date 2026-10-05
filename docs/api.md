# API

## Data

`SexyTableGroup` describes each section:

| Field         | Type                          | Required |
| ------------- | ----------------------------- | -------- |
| `id`          | `string`                      | Yes      |
| `label`       | `string`                      | Yes      |
| `issues`      | `readonly SexyTableIssue[]`   | Yes      |
| `icon`        | `ReactNode`                   | No       |
| `defaultOpen` | `boolean`, defaults to `true` | No       |

Each `SexyTableIssue` has these fields:

| Field         | Type                                                                  | Required |
| ------------- | --------------------------------------------------------------------- | -------- |
| `id`          | `string`                                                              | Yes      |
| `title`       | `string`                                                              | Yes      |
| `priority`    | `none`, `low`, `medium`, `high`, or `urgent`                          | No       |
| `pullRequest` | `{ label: string; state: 'open' \| 'draft' \| 'closed' \| 'merged' }` | No       |
| `estimate`    | `number`, including zero                                              | No       |
| `label`       | `{ name: string; color?: string }`                                    | No       |
| `due`         | Display string                                                        | No       |
| `assignees`   | Readonly list of `{ id: string; name: string; image?: string }`       | No       |

Group and issue IDs must be stable and unique within their respective lists. Labels are arbitrary. An issue only requires `id` and `title`; every other field is optional. Missing or failed avatar images show initials. Groups start expanded unless `defaultOpen` is false. To reset a group's initial open state, give it a new ID.

## Component props

`SexyTable` forwards its root div ref and accepts native div props, including event handlers and ARIA attributes. `onAdd` receives the group object. Without a handler, the add button is a no-op. `toolbar` accepts your own React content.

| Prop                        | Default  | Behavior                                              |
| --------------------------- | -------- | ----------------------------------------------------- |
| `groups`                    | Required | Readonly group data                                   |
| `theme`                     | `system` | `light`, `dark`, or system preference                 |
| `dir`                       | `ltr`    | `ltr` or `rtl` layout, scrolling, and resize controls |
| `animated`                  | `true`   | Layout and collapse motion; respects reduced motion   |
| `resizable`                 | `true`   | Pointer and keyboard resize handles                   |
| `toolbar`                   | —        | Content above the groups                              |
| `onAdd`                     | —        | Callback for a group's add button                     |
| `className`, `style`, `ref` | —        | Root customization                                    |

Default size is 100% of the parent width and 637px high. Set `style={{ height: 480 }}` or a CSS class to choose a different initial size. User resizing overrides that initial size until an edge is double-clicked. Arrow keys resize by 16px, Home chooses the minimum, and End restores the available width or original height. Narrow parents can be smaller than the usual 320px width minimum.

The library inherits your font and includes no font files or avatar photos. The demo opts into the reference's font and photos separately. The package exports ESM and CommonJS, declarations for both, and a separate CSS entry marked as a side effect. Import the CSS once in your app's stylesheet entry; for Next.js, use the root layout. Import interactive components from a client component.

## Sliding toolbar

```tsx
import { useState } from "react";
import { SexyTable, SlidingTabs } from "@aaarnv/sexy-table";
import "@aaarnv/sexy-table/styles.css";

const views = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
  { value: "issues", label: "Issues" },
];

export function Project() {
  const [view, setView] = useState("issues");
  return (
    <SexyTable
      groups={[]}
      toolbar={
        <SlidingTabs
          items={views}
          value={view}
          onValueChange={setView}
          aria-label="Project view"
        />
      }
    />
  );
}
```

`SlidingTabs` is a controlled button group. It changes selection and animates the pill; the caller decides what content to display. Arrow keys, Home, and End move selection. Item values can be a string union. Empty items or a missing selected value render without a pill. Within a table, the tabs inherit its theme; standalone tabs follow the system preference unless you set `theme`.

## Styling

Classes and theme variables use the `kgt-` prefix. Styles are scoped to the library's elements. Override the variables on a component with a class or typed `style`:

```tsx
<SexyTable
  groups={groups}
  style={{ "--kgt-card": "#18181b", "--kgt-success": "#69cda1" }}
/>
```

Available theme variables: `--kgt-card`, `--kgt-foreground`, `--kgt-muted`, `--kgt-muted-foreground`, `--kgt-border`, `--kgt-success`, `--kgt-warning`, `--kgt-destructive`, `--kgt-ring`, and `--kgt-tooltip-bg`, `--kgt-tooltip-fg`, `--kgt-tooltip-shadow`, `--kgt-tooltip-border`.

Columns respond to the component's width, with container breakpoints at 39.5rem and 47.5rem. Below 39.5rem, rows become inline and can scroll horizontally. Set `dir="rtl"` on the table for right-to-left layout, scrolling, and resize controls.
