# Sexy Table

The repository is `aaarnv/sexy-table`, the package is `@aaarnv/sexy-table`, and public component and model types use the `SexyTable` prefix.

## Component

- Keep the library independent of demo data, fonts, photos, routes, and global styles. Use scoped CSS, inline icons, caller-owned data, strict TypeScript, and clean exports.
- Preserve the [Kobra grouped-table reference](https://kobra.systems/components/grouped-table): responsive columns, staggered 460ms layout glides, avatar fans, label transitions, and Base UI collapse behavior.
- Keep the demo's add and view-options actions as no-ops. The library's `onAdd` callback belongs to the caller.
- Keep attribution and existing CSS variables. Record durable user decisions here.
- Keep the implementation readable: give rendering, measurements, and interaction logic clear module boundaries; use descriptive names and explain only non-obvious behavior.
- Before substantial visual changes, use the Product Design context skill if the visual source is unclear. For a selected mock, treat that mock as the visual target.

## Verification

Run the server and drive the browser yourself. Verify motion and settled layout for visual changes. For package changes, prove the packed archive in an independent consuming application. Keep the repeatable consumer checks in `tests/consumer` and `scripts/verify-consumer.mjs`.

## Demo hosting

Build UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact. Before a Sites handoff, run `npm run build` and `npm run test:sites`. The build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
