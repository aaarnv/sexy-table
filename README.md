# Grouped Table

A standalone React recreation of the [Kobra grouped-table preview](https://kobra.systems/components/grouped-table). The implementation was written independently from the publicly rendered component, without obtaining the paid component source.

![Desktop preview](docs/preview.png)

## Run

```sh
npm install
npm run dev
```

`npm run build` creates the production app in `dist/client`. `npm run preview` serves it locally.

## Component

```jsx
import { GroupedTable } from './src/GroupedTable.jsx';
import { initialGroups } from './src/data.js';

<GroupedTable
  groups={initialGroups}
  toolbar={<div>Your toolbar</div>}
  animated
  resizable
  onAdd={status => console.log(status)}
/>
```

Each group has `status`, `icon`, and `issues`. See `src/data.js` for the issue schema and all 13 sample issues. Copy `src/grouped-table.css` and the referenced `public/assets` with the component. Set the theme variables on its parent; the demo's dark and light values are in `src/styles.css`.

- Collapsible sections with sticky headers and keyboard support.
- Container queries at 632px and 760px, including horizontal scrolling on narrow layouts.
- Pointer and arrow-key resizing. Home/End select the minimum/maximum; Shift accelerates arrow keys.
- Animated layout changes and reduced-motion support.
- Demo tabs preserve the same table, as the source preview does.
- A local add-issue form and animation options demonstrate the callback and props. Added issues live only in memory.

## Assets and attribution

The demo uses locally captured SVG marks, the ABC Diatype regular font and sample avatar images loaded by the reference. Avatar photos come from Pravatar and Kobra's preview image. These assets retain their original owners' rights and are not relicensed by this repository. ABC Diatype is a commercial font; substitute a font you are licensed to use before distributing this demo. No Kobra subscription, registry access, paid source files, or backend is included.

Browser verification and visual comparison are recorded in `design-qa.md`.
