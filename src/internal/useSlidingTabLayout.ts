import { useState } from "react";
import type { RefObject } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import type { SlidingTab } from "../types";

interface LabelGeometry {
  readonly x: number;
  readonly width: number;
}
interface TabLayout extends LabelGeometry {
  readonly labels: readonly LabelGeometry[];
}

function hasSameLayout(previous: TabLayout | null, next: TabLayout | null) {
  if (!previous || !next) return previous === next;
  return (
    previous.x === next.x &&
    previous.width === next.width &&
    previous.labels.length === next.labels.length &&
    previous.labels.every((label, index) => {
      const other = next.labels[index];
      return other?.x === label.x && other.width === label.width;
    })
  );
}

export function useSlidingTabLayout<Value extends string>(
  rootRef: RefObject<HTMLDivElement | null>,
  items: readonly SlidingTab<Value>[],
  value: Value,
) {
  const [layout, setLayout] = useState<TabLayout | null>(null);
  useIsomorphicLayoutEffect(() => {
    const element = rootRef.current;
    const view = element?.ownerDocument.defaultView;
    if (!element || !view) return;
    let isMounted = true;
    const measure = () => {
      if (!isMounted) return;
      const buttons = [
        ...element.querySelectorAll<HTMLButtonElement>(".kgt-tab-button"),
      ];
      const selected = buttons[items.findIndex((item) => item.value === value)];
      const labels = buttons.map((button) => {
        const label = button.querySelector<HTMLElement>(".kgt-tab-label");
        return {
          x: button.offsetLeft + (label?.offsetLeft ?? 0),
          width: label?.offsetWidth ?? 0,
        };
      });
      const nextLayout = selected
        ? { x: selected.offsetLeft, width: selected.offsetWidth, labels }
        : null;
      setLayout((previous) =>
        hasSameLayout(previous, nextLayout) ? previous : nextLayout,
      );
    };
    measure();
    const observer = new view.ResizeObserver(measure);
    observer.observe(element);
    void element.ownerDocument.fonts.ready.then(measure);
    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [rootRef, value, items]);

  return layout;
}
