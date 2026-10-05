# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

The user requires a faithful recreation of the Kobra grouped table, including its animations. Treat the live reference as the target: preserve its responsive columns, staggered 460ms glides, avatar fans, label enter/exit motion, and Base UI collapse behavior. Keep the source demo's add and view-options actions as no-ops; do not invent extra menus or forms. Verify motion as well as settled screenshots before claiming fidelity.

The user requires an exportable TypeScript React library with clean code. Keep package exports, types, scoped styles, inline icons, and caller-owned data independent from the demo. Preserve the observed layout and motion when changing packaging. Prove the packed package in a separate consuming application, not just through source imports.

The project is branded Sexy Table. The GitHub repo is `aaarnv/sexy-table`, the package is `@aaarnv/sexy-table`, and the component and model types use the `SexyTable` prefix. Preserve the reference attribution and existing styling variables.
