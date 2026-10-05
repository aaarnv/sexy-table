# Sexy Table

A reusable TypeScript React table based on the [Kobra grouped-table preview](https://kobra.systems/components/grouped-table). Includes responsive columns, interruptible 460ms layout glides, avatar fans, collapsible groups, scrolling, and optional resizing.

![Desktop preview](docs/sexy-table-preview.png)

![Responsive transition](docs/motion-proof.gif)

## Install

Download the built `aaarnv-sexy-table-0.2.0.tgz` archive from the [v0.2.0 release](https://github.com/aaarnv/sexy-table/releases/tag/v0.2.0) and install it in your React app:

```sh
npm install ./aaarnv-sexy-table-0.2.0.tgz
```

The package is not published to the npm registry. To build an archive from this repository, run `npm ci` followed by `npm pack`. React and React DOM 18.3 or 19 are peer dependencies. Base UI is installed automatically.

## Use

```tsx
import { SexyTable, SexyTableStatusIcon } from "@aaarnv/sexy-table";
import type { SexyTableGroup } from "@aaarnv/sexy-table";
import "@aaarnv/sexy-table/styles.css";

const groups: readonly SexyTableGroup[] = [
  {
    id: "backlog",
    label: "Backlog",
    icon: <SexyTableStatusIcon status="todo" />,
    issues: [
      {
        id: "issue-1",
        title: "Ship the new dashboard",
        priority: "high",
        pullRequest: { label: "#42", state: "open" },
        estimate: 3,
        label: { name: "Feature", color: "#9b75e8" },
        due: "Oct 12",
        assignees: [
          { id: "ada", name: "Ada Lovelace", image: "/my-avatars/ada.jpg" },
        ],
      },
    ],
  },
];

export function Issues() {
  return (
    <SexyTable
      groups={groups}
      theme="dark"
      onAdd={(group) => console.log(group.id)}
    />
  );
}
```

Group and issue IDs must be stable and unique within their respective lists. Labels are arbitrary. An issue only requires `id` and `title`; every other field is optional. Missing or failed avatar images show initials. Groups start expanded unless `defaultOpen` is false. To reset a group's initial open state, give it a new ID.

`SexyTable` forwards its root div ref and accepts native div props, including event handlers and ARIA attributes. `onAdd` receives the group object. Without a handler, the add button is a no-op. `toolbar` accepts your own React content.

| Prop                        | Default  | Behavior                                            |
| --------------------------- | -------- | --------------------------------------------------- |
| `groups`                    | Required | Readonly group data                                 |
| `theme`                     | `system` | `light`, `dark`, or system preference               |
| `animated`                  | `true`   | Layout and collapse motion; respects reduced motion |
| `resizable`                 | `true`   | Pointer and keyboard resize handles                 |
| `toolbar`                   | —        | Content above the groups                            |
| `onAdd`                     | —        | Callback for a group's add button                   |
| `className`, `style`, `ref` | —        | Root customization                                  |

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

## Develop

```sh
npm ci
npm run dev
```

The demo lives in `src/demo`. Public components and models live in `src`; DOM animation and resize hooks live in `src/internal`.

- `npm run build:lib`: package output in `dist/lib`.
- `npm run build:demo`: demo and existing Sites worker output.
- `npm run build`: both builds.
- `npm run typecheck`, `npm run lint`, `npm run format:check`: strict TypeScript, lint, and formatting.
- `npm run test:package`: ESM/CommonJS, SSR, and distribution checks after a library build.
- `npm run test:consumer`: pack and build independent apps against React 18 and 19, checking both ESM and CommonJS declarations.
- `npm run test:sites`: existing Sites worker checks.
- `npm pack`: build and pack the library, excluding demo assets and source.

[Design QA](design-qa.md) records the reference comparison and library verification. The motion GIF contains frames from the running app.

## Attribution

This implementation was written from the reference's publicly rendered DOM, styles, assets, and observed runtime. No paid component source or registry access was obtained. SVG marks include Tabler icons and simple status/priority geometries observed in the preview. Reference assets retain their owners' rights.

The **demo only** includes captured ABC Diatype font and avatar photos from Pravatar and Kobra's preview. Those assets are excluded from the library archive and are not relicensed by this repository. Use your own licensed font and photos when distributing the demo.
