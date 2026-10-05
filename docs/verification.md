# Verification

## Package

`npm run test:consumer` packs the built library and installs it into separate React 18.3.1 and React 19.2 applications. Each application checks strict NodeNext TypeScript imports through ESM and CommonJS, CSS imports with `noUncheckedSideEffectImports`, a production Vite build, and server rendering through both entry formats.

`npm run test:package` checks component exports, server rendering with minimal and complete caller data, and distribution contents. The archive includes JavaScript, TypeScript declarations, scoped CSS, README, and metadata. Demo data, fonts, and photos stay outside the package.

GitHub Actions also checks lint, formatting, the demo build, and the existing Sites worker.

## Browser

The installed package was tested under an `/app/` base path with custom data, system typography, avatar initials, and different host button, SVG, and list styles. Verified callbacks, forwarded refs, native props and event handlers, group collapse, keyboard toolbar selection, themes, pointer and keyboard resizing, changing parent constraints, RTL scrolling, and unmount/remount. Fresh demo and consumer production tabs had no browser errors or warnings.

## Reference comparison

The [reference](https://kobra.systems/components/grouped-table) and demo were compared at 998 × 767 and 390 × 844 CSS viewports. With all 13 issues expanded, all 91 measured layout targets had identical positions and dimensions in both settled comparisons.

| Motion                          | Timing                               |
| ------------------------------- | ------------------------------------ |
| Group, row, and column movement | 460ms, cubic-bezier(.32, .72, 0, 1)  |
| Row stagger                     | 18ms, capped at eight steps          |
| Field stagger                   | 30ms                                 |
| Avatar hiding                   | 260ms, fade to zero and scale to .75 |
| Glyph and label entrance        | 320ms, 60ms + 24ms stagger           |
| Glyph and label exit            | 280ms, 14ms stagger                  |
| Panel collapse and expansion    | 200ms                                |
| Toolbar pill and active text    | 250ms                                |

Live computed-style samples showed continuous movement, avatar fading and scaling, and settled transforms after crossing the responsive breakpoints. Rapid reversal retained active motion. The [motion recording](motion-proof.gif) contains screenshots from the running demo.

Settled geometry equality does not imply identical animation frames across browsers. OS-level reduced-motion preference changes were not exercised in the browser session.
