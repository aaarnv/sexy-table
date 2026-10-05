import type { RefObject } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { createLayoutTransition } from "./createLayoutTransition";
import { layoutMotion } from "./layoutMotion";

export function useLayoutGlide(
  containerRef: RefObject<HTMLDivElement | null>,
  groupsRef: RefObject<HTMLDivElement | null>,
  viewportRef: RefObject<HTMLDivElement | null>,
  animated: boolean,
) {
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const groups = groupsRef.current;
    const viewport = viewportRef.current;
    const view = container?.ownerDocument.defaultView;
    if (!animated || !container || !groups || !viewport || !view) return;
    const reducedMotion = view.matchMedia("(prefers-reduced-motion: reduce)");
    let previousWidth: number | undefined;
    let previousLayoutMode: number | undefined;
    const { transition, cancel } = createLayoutTransition({
      container,
      groups,
      viewport,
      view,
    });

    const observer = new view.ResizeObserver((entries) => {
      const width =
        entries[0]?.contentBoxSize[0]?.inlineSize ?? container.clientWidth;
      const rem =
        parseFloat(
          view.getComputedStyle(container.ownerDocument.documentElement)
            .fontSize,
        ) || 16;
      const layoutMode = layoutMotion.breakpointsRem.filter(
        (breakpoint) => width >= breakpoint * rem,
      ).length;
      if (
        previousWidth !== undefined &&
        previousLayoutMode !== undefined &&
        layoutMode !== previousLayoutMode &&
        !reducedMotion.matches
      ) {
        transition(
          previousWidth,
          Math.abs(width - previousWidth) >
            layoutMotion.immediateResizeThreshold,
        );
      }
      previousWidth = width;
      previousLayoutMode = layoutMode;
    });
    observer.observe(container);
    reducedMotion.addEventListener("change", cancel);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", cancel);
      cancel();
    };
  }, [animated, containerRef, groupsRef, viewportRef]);
}
