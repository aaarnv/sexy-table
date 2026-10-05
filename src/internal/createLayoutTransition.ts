import { glideOptions, layoutAnimationId, layoutMotion } from "./layoutMotion";
import { measureLayout } from "./layoutGeometry";
import type { Translation } from "./layoutGeometry";

interface LayoutTransitionElements {
  readonly container: HTMLDivElement;
  readonly groups: HTMLDivElement;
  readonly viewport: HTMLDivElement;
  readonly view: NonNullable<Document["defaultView"]>;
}

export function createLayoutTransition({
  container,
  groups,
  viewport,
  view,
}: LayoutTransitionElements) {
  let generation = 0;
  const activeAnimations = new Map<Animation, HTMLElement>();
  const exitGhosts = new Set<HTMLElement>();

  function animateElement(
    element: HTMLElement,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: KeyframeAnimationOptions,
  ) {
    const animation = element.animate(keyframes, options);
    activeAnimations.set(animation, element);
    animation.finished.then(
      () => activeAnimations.delete(animation),
      () => activeAnimations.delete(animation),
    );
    return animation;
  }

  function transition(oldWidth: number, immediate: boolean) {
    const rtl = view.getComputedStyle(container).direction === "rtl";
    const direction = rtl ? -1 : 1;
    const interrupted = new Map<HTMLElement, Translation>();
    for (const [animation, element] of activeAnimations) {
      if (animation.id !== layoutAnimationId) continue;
      const [x, y = "0"] = view.getComputedStyle(element).translate.split(" ");
      interrupted.set(element, {
        x: parseFloat(x ?? "0") || 0,
        y: parseFloat(y) || 0,
      });
    }
    for (const animation of activeAnimations.keys()) {
      if (animation.id === layoutAnimationId) animation.cancel();
    }

    const scrollTop = viewport.scrollTop;
    const inlineWidth = container.style.width;
    // Restore the old width briefly to measure the layout before its breakpoint changed.
    container.style.width = `${oldWidth}px`;
    const before = measureLayout(groups, container, rtl, view);
    container.style.width = inlineWidth;
    viewport.scrollTop = scrollTop;
    const after = measureLayout(groups, container, rtl, view);
    const viewportBox = viewport.getBoundingClientRect();
    const scale = container.offsetWidth
      ? container.getBoundingClientRect().width / container.offsetWidth
      : 1;
    const isVisibleInViewport = (
      box: Pick<DOMRect, "top" | "bottom"> | undefined,
    ) => box && box.bottom > viewportBox.top && box.top < viewportBox.bottom;
    const animations: Animation[] = [];
    function animatePositions() {
      let rowIndex = -1;
      let pieceIndex = 0;

      for (const [element, target] of after.positions) {
        const origin = before.positions.get(element);
        const onScreen =
          isVisibleInViewport(origin) || isVisibleInViewport(target);
        if (element.dataset.flip === "piece" || element.dataset.flip === "fan")
          pieceIndex += 1;
        else {
          if (onScreen) rowIndex += 1;
          pieceIndex = 0;
        }
        if (!origin || !onScreen) continue;
        const interruptedTranslation = interrupted.get(element) ?? {
          x: 0,
          y: 0,
        };
        const offsetX =
          ((target.anchoredToInlineEnd
            ? target.inlineEnd - origin.inlineEnd
            : origin.inlineStart - target.inlineStart) *
            direction) /
            scale +
          interruptedTranslation.x;
        const offsetY =
          (origin.blockOffset - target.blockOffset) / scale +
          interruptedTranslation.y;
        const opacityChanged = origin.opacity !== target.opacity;
        const isHidingAvatar = opacityChanged && target.opacity === 0;
        if (
          Math.abs(offsetX) < 0.5 &&
          Math.abs(offsetY) < 0.5 &&
          !opacityChanged
        )
          continue;
        const delay =
          immediate || interrupted.has(element)
            ? 0
            : Math.min(
                Math.max(rowIndex, 0),
                layoutMotion.maximumStaggeredRow,
              ) *
                layoutMotion.rowStagger +
              (isHidingAvatar ? 0 : pieceIndex * layoutMotion.pieceStagger);
        const keyframes: PropertyIndexedKeyframes = {
          translate: [`${offsetX}px ${offsetY}px`, "0 0"],
        };
        if (opacityChanged) {
          keyframes.opacity = [origin.opacity, target.opacity];
          keyframes.scale = [
            origin.opacity ? 1 : layoutMotion.avatarHiddenScale,
            target.opacity ? 1 : layoutMotion.avatarHiddenScale,
          ];
        }
        animations.push(
          animateElement(element, keyframes, {
            ...glideOptions,
            delay,
            duration: isHidingAvatar
              ? layoutMotion.hiddenAvatarDuration
              : glideOptions.duration,
          }),
        );
      }
    }

    function animateEnteringElements() {
      let enterIndex = 0;
      for (const [element, { box }] of after.appearances) {
        if (before.appearances.has(element) || !isVisibleInViewport(box))
          continue;
        animations.push(
          animateElement(
            element,
            {
              opacity: [0, 1],
              filter: ["blur(4px)", "blur(0px)"],
              scale: [0.85, 1],
            },
            {
              id: layoutAnimationId,
              duration: layoutMotion.enterDuration,
              easing: "cubic-bezier(0.23, 1, 0.32, 1)",
              fill: "backwards",
              delay: immediate
                ? 0
                : layoutMotion.enterDelay +
                  Math.min(enterIndex++, layoutMotion.maximumAppearanceIndex) *
                    layoutMotion.enterStagger,
            },
          ),
        );
      }
    }

    function animateLeavingElements() {
      let exitIndex = 0;
      for (const [element, { box, inlineStart }] of before.appearances) {
        if (after.appearances.has(element) || !isVisibleInViewport(box))
          continue;
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
          top: `${(box.top - before.containerBounds.top) / scale}px`,
          insetInlineStart: `${inlineStart / scale}px`,
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
        exitGhosts.add(ghost);
        const animation = animateElement(
          ghost,
          { opacity: [1, 0], scale: [1, 0.6] },
          {
            duration: layoutMotion.exitDuration,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            delay: immediate
              ? 0
              : Math.min(exitIndex++, layoutMotion.maximumAppearanceIndex) *
                layoutMotion.exitStagger,
            fill: "both",
          },
        );
        const remove = () => {
          ghost.remove();
          exitGhosts.delete(ghost);
        };
        animation.finished.then(remove, remove);
      }
    }

    animatePositions();
    animateEnteringElements();
    animateLeavingElements();

    if (animations.length) {
      const current = ++generation;
      groups.dataset.gliding = "";
      void Promise.allSettled(
        animations.map((animation) => animation.finished),
      ).then(() => {
        if (current === generation) delete groups.dataset.gliding;
      });
    }
  }

  function cancel() {
    generation += 1;
    for (const animation of activeAnimations.keys()) animation.cancel();
    activeAnimations.clear();
    for (const ghost of exitGhosts) ghost.remove();
    exitGhosts.clear();
    delete groups.dataset.gliding;
  }

  return { transition, cancel };
}
