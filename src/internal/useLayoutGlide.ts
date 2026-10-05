import type { RefObject } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

interface Position {
  readonly start: number;
  readonly end: number;
  readonly y: number;
  readonly top: number;
  readonly bottom: number;
  readonly anchored: boolean;
  readonly opacity: number;
}
interface Appearance {
  readonly box: DOMRect;
  readonly start: number;
}
interface Translation {
  readonly x: number;
  readonly y: number;
}

const animationId = "grouped-table-glide";
const glide: KeyframeAnimationOptions = {
  id: animationId,
  duration: 460,
  easing: "cubic-bezier(0.32, 0.72, 0, 1)",
  fill: "backwards",
};

function snapshot(
  groups: HTMLElement,
  container: HTMLElement,
  rtl: boolean,
  view: Window,
) {
  const positions = new Map<HTMLElement, Position>();
  const appearances = new Map<HTMLElement, Appearance>();
  const edge = container.getBoundingClientRect();
  for (const element of groups.querySelectorAll<HTMLElement>("[data-flip]")) {
    const box = element.getBoundingClientRect();
    if (!box.width && !box.height) continue;
    const parent =
      element.parentElement?.closest<HTMLElement>(
        "[data-flip], [data-flip-end]",
      ) ?? groups;
    const parentBox = parent.getBoundingClientRect();
    positions.set(element, {
      start: rtl ? parentBox.right - box.right : box.left - parentBox.left,
      end: rtl ? box.left - parentBox.left : parentBox.right - box.right,
      y: box.top - parentBox.top,
      top: box.top,
      bottom: box.bottom,
      anchored: parent.hasAttribute("data-flip-end"),
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
      start: rtl ? edge.right - box.right : box.left - edge.left,
    });
  }
  return { positions, appearances, edge };
}

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
    let previousLayout: number | undefined;
    let generation = 0;
    const active = new Map<Animation, HTMLElement>();
    const ghosts = new Set<HTMLElement>();

    function track(
      element: HTMLElement,
      keyframes: Keyframe[] | PropertyIndexedKeyframes,
      options: KeyframeAnimationOptions,
    ) {
      const animation = element.animate(keyframes, options);
      active.set(animation, element);
      animation.finished.then(
        () => active.delete(animation),
        () => active.delete(animation),
      );
      return animation;
    }

    const transition = (oldWidth: number, immediate: boolean) => {
      const rtl = view.getComputedStyle(container).direction === "rtl";
      const direction = rtl ? -1 : 1;
      const interrupted = new Map<HTMLElement, Translation>();
      for (const [animation, element] of active) {
        if (animation.id !== animationId) continue;
        const [x, y = "0"] = view
          .getComputedStyle(element)
          .translate.split(" ");
        interrupted.set(element, {
          x: parseFloat(x ?? "0") || 0,
          y: parseFloat(y) || 0,
        });
      }
      for (const animation of active.keys()) {
        if (animation.id === animationId) animation.cancel();
      }

      const scrollTop = viewport.scrollTop;
      const inlineWidth = container.style.width;
      container.style.width = `${oldWidth}px`;
      const before = snapshot(groups, container, rtl, view);
      container.style.width = inlineWidth;
      viewport.scrollTop = scrollTop;
      const after = snapshot(groups, container, rtl, view);
      const viewportBox = viewport.getBoundingClientRect();
      const scale = container.offsetWidth
        ? container.getBoundingClientRect().width / container.offsetWidth
        : 1;
      const visible = (box: Pick<DOMRect, "top" | "bottom"> | undefined) =>
        box && box.bottom > viewportBox.top && box.top < viewportBox.bottom;
      const animations: Animation[] = [];
      let rowIndex = -1;
      let pieceIndex = 0;

      for (const [element, target] of after.positions) {
        const origin = before.positions.get(element);
        const onScreen = visible(origin) || visible(target);
        if (element.dataset.flip === "piece" || element.dataset.flip === "fan")
          pieceIndex += 1;
        else {
          if (onScreen) rowIndex += 1;
          pieceIndex = 0;
        }
        if (!origin || !onScreen) continue;
        const pending = interrupted.get(element) ?? { x: 0, y: 0 };
        const dx =
          ((target.anchored
            ? target.end - origin.end
            : origin.start - target.start) *
            direction) /
            scale +
          pending.x;
        const dy = (origin.y - target.y) / scale + pending.y;
        const fading = origin.opacity !== target.opacity;
        const hiding = fading && target.opacity === 0;
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && !fading) continue;
        const delay =
          immediate || interrupted.has(element)
            ? 0
            : Math.min(Math.max(rowIndex, 0), 8) * 18 +
              (hiding ? 0 : pieceIndex * 30);
        animations.push(
          track(
            element,
            {
              translate: [`${dx}px ${dy}px`, "0 0"],
              ...(fading
                ? {
                    opacity: [origin.opacity, target.opacity],
                    scale: [
                      origin.opacity ? 1 : 0.75,
                      target.opacity ? 1 : 0.75,
                    ],
                  }
                : {}),
            },
            { ...glide, delay, duration: hiding ? 260 : 460 },
          ),
        );
      }

      let enterIndex = 0;
      for (const [element, { box }] of after.appearances) {
        if (before.appearances.has(element) || !visible(box)) continue;
        animations.push(
          track(
            element,
            {
              opacity: [0, 1],
              filter: ["blur(4px)", "blur(0px)"],
              scale: [0.85, 1],
            },
            {
              id: animationId,
              duration: 320,
              easing: "cubic-bezier(0.23, 1, 0.32, 1)",
              fill: "backwards",
              delay: immediate ? 0 : 60 + Math.min(enterIndex++, 16) * 24,
            },
          ),
        );
      }

      let exitIndex = 0;
      for (const [element, { box, start }] of before.appearances) {
        if (after.appearances.has(element) || !visible(box)) continue;
        const ghost = element.cloneNode(true);
        if (!(ghost instanceof view.HTMLElement)) continue;
        ghost.removeAttribute("data-appear");
        ghost.removeAttribute("data-flip");
        ghost.setAttribute("aria-hidden", "true");
        ghost
          .querySelectorAll("[id]")
          .forEach((child) => child.removeAttribute("id"));
        ghost.removeAttribute("id");
        Object.assign(ghost.style, {
          display: "flex",
          position: "absolute",
          margin: "0",
          top: `${(box.top - before.edge.top) / scale}px`,
          insetInlineStart: `${start / scale}px`,
          width: `${box.width / scale}px`,
          height: `${box.height / scale}px`,
          pointerEvents: "none",
        });
        if (element.closest('[data-slot="grouped-table-row"]'))
          container.prepend(ghost);
        else {
          ghost.style.zIndex = "20";
          container.append(ghost);
        }
        ghosts.add(ghost);
        const animation = track(
          ghost,
          { opacity: [1, 0], scale: [1, 0.6] },
          {
            duration: 280,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            delay: immediate ? 0 : Math.min(exitIndex++, 16) * 14,
            fill: "both",
          },
        );
        const remove = () => {
          ghost.remove();
          ghosts.delete(ghost);
        };
        animation.finished.then(remove, remove);
      }

      if (animations.length) {
        const current = ++generation;
        groups.dataset.gliding = "";
        void Promise.allSettled(
          animations.map((animation) => animation.finished),
        ).then(() => {
          if (current === generation) delete groups.dataset.gliding;
        });
      }
    };

    const observer = new view.ResizeObserver((entries) => {
      const width =
        entries[0]?.contentBoxSize[0]?.inlineSize ?? container.clientWidth;
      const rem =
        parseFloat(
          view.getComputedStyle(container.ownerDocument.documentElement)
            .fontSize,
        ) || 16;
      const layout = [39.5, 47.5].filter(
        (breakpoint) => width >= breakpoint * rem,
      ).length;
      if (
        previousWidth !== undefined &&
        previousLayout !== undefined &&
        layout !== previousLayout &&
        !reducedMotion.matches
      ) {
        transition(previousWidth, Math.abs(width - previousWidth) > 24);
      }
      previousWidth = width;
      previousLayout = layout;
    });
    observer.observe(container);
    const cancel = () => {
      generation += 1;
      for (const animation of active.keys()) animation.cancel();
      active.clear();
      for (const ghost of ghosts) ghost.remove();
      ghosts.clear();
      delete groups.dataset.gliding;
    };
    reducedMotion.addEventListener("change", cancel);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", cancel);
      cancel();
    };
  }, [animated, containerRef, groupsRef, viewportRef]);
}
