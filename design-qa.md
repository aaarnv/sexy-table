# Design QA

final result: passed

## Comparison target and evidence

Source: https://kobra.systems/components/grouped-table, publicly rendered preview. Implementation: http://localhost:4173.

State: dark theme, Issues selected, four groups expanded, initial 13 issues, scroll at top. Only the component is compared; the surrounding Kobra library and paid source editor are outside scope.

- Desktop CSS viewport: 998 × 767. Component CSS size: 932 × 637.
- Mobile CSS viewport: 390 × 844. Component CSS size: 324 × 637.
- Source native captures: 992 × 762 desktop and 384 × 831 mobile. Native browser capture scaling was normalized to each CSS viewport before cropping the component's measured DOM rectangle.
- Implementation native captures: 998 × 767 desktop and 390 × 844 mobile. No rescaling needed.
- Normalized source visual truth: `docs/source-desktop.png`, `docs/source-mobile.png`.
- Implementation evidence: `docs/implementation-desktop.png`, `docs/implementation-mobile.png`.
- Full component side-by-side comparisons: `docs/comparison-desktop.png`, `docs/comparison-mobile.png`.
- Focused readable header, font, icon, badge and avatar comparison: `docs/comparison-detail.png`. Reference above; implementation below.

## Findings and required fidelity checks

No remaining P0/P1/P2 mismatch in the normalized settled component comparisons.

- Fonts and typography: local ABC Diatype regular, 14px/20px rows and headers, 13px tabs, 12px counts. Font wrapping and narrow horizontal layout match. Native reference resampling makes its screenshot slightly softer, accepted as capture quality rather than a font substitution.
- Spacing and layout: matching 637px frame, 36px headers, 44px rows, 4px group spacing, 20px row insets, pill sizes, 632px and 760px container breakpoints. Native scrollbars differ in their visibility timing, a P3 platform detail.
- Colors and tokens: measured OKLCH card, muted, foreground, border, success, warning and destructive colors reproduced. Label colors match the rendered reference.
- Image and asset fidelity: original observed SVG assets and avatar photos copied locally. No hand-drawn replacements or hotlinks. Image stacks collapse to a single visible avatar at the narrow breakpoint. Commercial font and source asset provenance recorded in README.
- Copy and content: all 13 original issue titles, four statuses, priorities, pull request numbers/states, estimates, labels, due dates and assignees reproduced.

## Comparison history

1. Initial comparison found P2 font weight rendering drift, a 6px frame-width mismatch and transient overlap from layout animation. Corrected the regular font-face declaration, antialiasing, frame width and toolbar height. Restricted the layout animation to container breakpoint changes and finished preceding animations before measuring another layout.
2. Direct clipped browser screenshots disturbed the capture geometry and sampled transition frames. Switched to native full-viewport captures, density normalization and DOM-measured offline crops. Excluded invalid transition captures from final evidence.
3. Compared the revised desktop and mobile pairs together and inspected the focused header/row comparison. No actionable P0/P1/P2 issue remained.

## End-to-end verification

Driven in the Codex in-app browser against the running local Vite app:

- Collapsed and reopened In Review; its count stayed at 3.
- Switched Overview/Activity/Issues toolbar selection. Table stays present, matching source behavior.
- Resized width with Home/End and arrow keys; narrow layout becomes horizontally scrollable.
- Dragged the width edge from 932px to 700px; labels disappeared at the expected container breakpoint.
- Resized height with arrow keys, 637px to 621px and back.
- Scrolled to Done and returned to the top; group headers remain sticky.
- Switched dark/light theme and returned to dark.
- Toggled Animated off and on through View options.
- Added “Verify offline maps” to In Review; count changed from 3 to 4 and the row appeared. Reset restored the original 13 issues.
- Checked captured console error/warning logs: none.
- Production build passed with `npm run build`.

## Intentional demo behavior

The source preview's add button and view-options button do not change the displayed data. The standalone demo supplies an add-issue form and animation menu to make the exported callback and prop reviewable. Added data is in memory. The component implementation uses native React state and CSS collapse mechanics, independently of the paid source implementation.

## Follow-up polish

P3: Native scrollbar appearance can vary with OS preferences. Animation timing is an independent approximation, not a frame-by-frame copy of the paid implementation.

## Implementation checklist

- [x] Capture source and component at desktop and mobile.
- [x] Match layout, type, tokens, visible assets and sample content.
- [x] Compare normalized full-view and focused evidence.
- [x] Drive the actual demo's primary interactions.
- [x] Pass production build and check browser logs.
