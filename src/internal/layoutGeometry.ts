interface ElementPosition {
  readonly inlineStart: number;
  readonly inlineEnd: number;
  readonly blockOffset: number;
  readonly top: number;
  readonly bottom: number;
  readonly anchoredToInlineEnd: boolean;
  readonly opacity: number;
}
interface ElementAppearance {
  readonly box: DOMRect;
  readonly inlineStart: number;
}
export interface Translation {
  readonly x: number;
  readonly y: number;
}

export function measureLayout(
  groups: HTMLElement,
  container: HTMLElement,
  rtl: boolean,
  view: Window,
) {
  const positions = new Map<HTMLElement, ElementPosition>();
  const appearances = new Map<HTMLElement, ElementAppearance>();
  const containerBounds = container.getBoundingClientRect();
  for (const element of groups.querySelectorAll<HTMLElement>("[data-flip]")) {
    const box = element.getBoundingClientRect();
    if (!box.width && !box.height) continue;
    // Parent-relative coordinates prevent a row glide from moving its children twice.
    const parent =
      element.parentElement?.closest<HTMLElement>(
        "[data-flip], [data-flip-end]",
      ) ?? groups;
    const parentBox = parent.getBoundingClientRect();
    positions.set(element, {
      inlineStart: rtl
        ? parentBox.right - box.right
        : box.left - parentBox.left,
      inlineEnd: rtl ? box.left - parentBox.left : parentBox.right - box.right,
      blockOffset: box.top - parentBox.top,
      top: box.top,
      bottom: box.bottom,
      anchoredToInlineEnd: parent.hasAttribute("data-flip-end"),
      opacity:
        element.dataset.flip === "fan"
          ? Number(view.getComputedStyle(element).opacity)
          : 1,
    });
  }
  for (const element of groups.querySelectorAll<HTMLElement>("[data-appear]")) {
    const box = element.getBoundingClientRect();
    if (!box.width && !box.height) continue;
    appearances.set(element, {
      box,
      inlineStart: rtl
        ? containerBounds.right - box.right
        : box.left - containerBounds.left,
    });
  }
  return { positions, appearances, containerBounds };
}
