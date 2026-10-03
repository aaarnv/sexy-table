# Grouped table recreation

Recreate only the grouped issue component at https://kobra.systems/components/grouped-table. The reference supplies the design, so no new visual direction is needed. Use React and Vite, an exported GroupedTable component, local source assets, and a small demo shell.

Match four status groups, 13 issues, 36px sticky headers, 44px rows, avatar stacks, priority marks, pull request states and 632px/760px container breakpoints. Narrow layouts retain horizontal scrolling and move pull request and estimate into the title region. Expose groups, toolbar, animated, resizable, onAdd and className props.

The demo supplies theme switching, toolbar selection, animation controls and a local add-issue callback. No backend or account is required. Verify by driving the real local browser at desktop and 390px mobile, compare normalized component captures, test collapse, keyboard resize, scrolling, theme, animation and adding an issue. Create a private standalone GitHub repository under the authenticated account.
