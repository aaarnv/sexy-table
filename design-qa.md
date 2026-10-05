# Design QA

final result: passed

The October 5 rewrite supersedes the original QA report. That report accepted approximate animation and invented demo actions; those did not satisfy the user's requirement to match the reference.

## Target and captures

Reference: https://kobra.systems/components/grouped-table. Local app: http://localhost:4173/. The table and its toolbar are the comparison target.

Both versions were captured with all four groups expanded, 13 issues, dark theme, Issues selected, and the scroll area at its origin:

- Desktop: 998 × 767 CSS viewport; table 932 × 637.
- Mobile: 390 × 844 CSS viewport; table 324 × 637.
- Native source screenshots were normalized from 992 × 762 and 384 × 831 to the measured CSS viewports before cropping the table. Local captures used their CSS dimensions directly.
- Source and implementation were inspected together in `docs/comparison-desktop.png` and `docs/comparison-mobile.png`.
- All 91 FLIP targets were compared by their DOM rectangles in each viewport. Position and size differences stayed below 0.01 CSS pixel. Hidden elements were included in the comparison.

The card, headers, rows, typography, original icon and avatar assets, badges, column widths, wrapping, and narrow horizontal layout match. Source screenshots appear slightly softer because their native capture is resampled; this is a P3 capture limitation.

## Motion fidelity

The original's publicly served runtime was inspectable with a standard browser user agent. Observed behavior and timing informed the independently written hooks; the gated component source was not obtained.

The rewrite matches these observed parameters:

| Motion | Duration | Curve / sequence |
| --- | --- | --- |
| Columns, groups, rows and pieces | 460ms | cubic-bezier(.32, .72, 0, 1) |
| Row staggering | 18ms per visible group/row | capped at eight steps |
| Piece staggering | 30ms per piece | relative to its row |
| Avatar hiding | 260ms | fade to zero, scale to .75 |
| Appearing glyphs / labels | 320ms | cubic-bezier(.23, 1, .32, 1), 60ms + 24ms stagger |
| Disappearing glyphs / labels | 280ms | cubic-bezier(.25, .46, .45, .94), 14ms stagger |
| Panel collapse / expansion | 200ms | cubic-bezier(.23, 1, .32, 1) |
| Tab pill and clipped active text | 250ms | cubic-bezier(.22, 1, .36, 1) |

Large width jumps suppress staggering, matching the reference. Pieces measure coordinates relative to their moving row/group; avatar fans anchor to the trailing edge of the stack. Disappearing content leaves a temporary visual clone until its exit finishes. Panels allow overflow while the columns glide.

Both versions were sampled during a 640 → 624px width change. `docs/motion-samples.json` contains computed translations, opacity, and scale from 36 observations per version. Samples are asynchronous browser observations, not synchronized video frames. After starting from a settled 640px layout, both versions produced identical initial avatar offsets of −11.5px/−2.5px and −25.5px/−2.5px for the second and third assignees. Continuous movement and completion were observed in both directions, and rapid reversal retained motion instead of finishing every animation on the next resize callback.

`docs/motion-proof.gif` records the local component folding into rows and returning to columns, including fan and icon motion. It uses actual rendered browser screenshots. The underlying UI uses the measured durations above; the GIF's capture cadence is lower than the browser's frame rate.

This is a recreation, not a claim of identical source code or synchronized frame-for-frame rendering across browsers.

## Browser proof

Verified on the running Vite app in the Codex in-app browser:

- Crossed both responsive breakpoints with arrow keys; observed column movement, label exits/entrances, avatar collapse/expansion and row wrapping.
- Reversed the 632px breakpoint repeatedly while animation was active; transitions settled without stuck transforms or leftover visual clones.
- Collapsed and reopened In Review using the group trigger; Base UI maintained expanded state and panel height transitions.
- Switched Overview, Activity and Issues; the moving pill and clipped active labels follow selection while preserving the table.
- Clicked View options and Add; neither opened an invented menu or changed the 13 issues.
- Disabled Animated, crossed the breakpoint, and observed no glide; re-enabled it.
- Dragged the width edge from 932px to 700px. Dragged the corner to 750 × 480. Pointer capture released correctly after both actions.
- Reset dimensions with double-click and End; height arrows changed 637px to 621px and back.
- Scrolled the narrow viewport horizontally (scrollLeft reached 207.5px with a 322px viewport and 529px content), then vertically through Done; headers remain sticky.
- Checked light and dark themes.
- Checked browser error/warning logs: none.
- Production build passed with `npm run build`.

No remaining P0/P1/P2 mismatch was identified in these comparisons and interactions. Browser-native capture softness and GIF sampling cadence remain P3 evidence limitations. The reusable component's tooltips and reduced-motion rules use Base UI and CSS; an OS-level reduced-motion preference change was not exercised in this browser session.
