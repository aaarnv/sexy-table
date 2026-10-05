# TypeScript component library

The existing reference behavior remains the target. Package the component for React web applications without assumptions about a host application's routes, global styles, fonts, or sample data.

The public entry exports GroupedTable, SlidingTabs, GroupedTableStatusIcon, and readonly data/prop types. Groups use stable identifiers and arbitrary labels; callers own issue and assignee data. Optional fields remain optional throughout rendering. Callbacks return the selected group, and native div props and a forwarded ref remain usable.

Library SVG icons are inline. Avatars are caller-supplied URLs with initials as a fallback. The reference's photos and commercial font stay in the demo and are excluded from the package. The component inherits the host font. All library selectors and theme variables use the kgt prefix; light, dark, and system themes provide standalone defaults.

Separate DOM measurement, animation, resize gestures, and rendering into typed modules. Preserve the original timings and relative FLIP measurements. Treat DOM lifetimes and browser capabilities as boundaries. Cancel animations and remove exit clones on cleanup and reduced-motion changes. Preserve consumer event handlers.

Use Vite to build externalized ESM and CommonJS modules. Generate bundled TypeScript declarations for both module formats. Export a separate CSS entry and mark only CSS as side-effectful. React and React DOM are peers; Base UI is the runtime component dependency. Keep the existing Vite demo and Sites build files.

Enable strict TypeScript, unchecked-index checking, exact optional properties, and typed linting. Keep a single formatter configuration. Verify exports, declarations, SSR, package contents, and the installed tarball in an independent consumer app. Exercise both responsive breakpoints, collapse, tabs, resizing, and cleanup in the real browser before pushing.
