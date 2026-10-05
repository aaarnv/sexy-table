import { useRef, useState } from "react";
import type { HTMLAttributes, PointerEvent, RefObject } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

type Axis = "width" | "height";
type ResizeAxis = Axis | "both";
interface Dimensions {
  readonly width: number;
  readonly height: number;
}
interface Gesture extends Dimensions {
  readonly id: number;
  readonly axis: ResizeAxis;
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly direction: number;
}
interface ResizeHandleProps extends HTMLAttributes<HTMLDivElement> {
  readonly "data-dragging": string | undefined;
}
const axes: readonly Axis[] = ["width", "height"];

export function useTableResize(
  tableRef: RefObject<HTMLDivElement | null>,
  resizable: boolean,
) {
  const [size, setSize] = useState<Partial<Dimensions>>({});
  const [natural, setNatural] = useState<Dimensions>({ width: 0, height: 0 });
  const [dragging, setDragging] = useState<ResizeAxis | null>(null);
  const pointer = useRef<Gesture | null>(null);
  const autoWidth = size.width === undefined;
  const autoHeight = size.height === undefined;

  useIsomorphicLayoutEffect(() => {
    if (!resizable) {
      pointer.current = null;
      setDragging(null);
    }
  }, [resizable]);

  useIsomorphicLayoutEffect(() => {
    const table = tableRef.current;
    const view = table?.ownerDocument.defaultView;
    if (!resizable || !table || !view) return;
    const parent = table.parentElement;
    const measure = () =>
      setNatural((previous) => {
        const parentStyle = parent ? view.getComputedStyle(parent) : null;
        const available =
          parent && parentStyle
            ? parent.clientWidth -
              parseFloat(parentStyle.paddingLeft) -
              parseFloat(parentStyle.paddingRight)
            : previous.width;
        const next = {
          width: autoWidth ? table.offsetWidth : Math.max(0, available),
          height: autoHeight ? table.offsetHeight : previous.height,
        };
        return next.width === previous.width && next.height === previous.height
          ? previous
          : next;
      });
    measure();
    const observer = new view.ResizeObserver(measure);
    observer.observe(table);
    if (parent) observer.observe(parent);
    return () => observer.disconnect();
  }, [tableRef, resizable, autoWidth, autoHeight]);

  const minimum = { width: Math.min(320, natural.width || 320), height: 200 };
  const dimensions = {
    width: Math.min(size.width ?? natural.width, natural.width),
    height: size.height ?? natural.height,
  };
  const update = (next: Partial<Dimensions>) =>
    setSize((previous) => ({
      ...previous,
      ...(next.width === undefined
        ? {}
        : {
            width: Math.round(
              Math.min(Math.max(next.width, minimum.width), natural.width),
            ),
          }),
      ...(next.height === undefined
        ? {}
        : { height: Math.round(Math.max(next.height, minimum.height)) }),
    }));
  const end = (event: PointerEvent<HTMLDivElement>) => {
    if (pointer.current?.id !== event.pointerId) return;
    pointer.current = null;
    setDragging(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };

  function handle(axis: ResizeAxis): ResizeHandleProps {
    return {
      "data-dragging": dragging === axis ? "" : undefined,
      onPointerDown(event) {
        const table = tableRef.current;
        const view = table?.ownerDocument.defaultView;
        if (event.button !== 0 || pointer.current || !table || !view) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        pointer.current = {
          id: event.pointerId,
          axis,
          x: event.clientX,
          y: event.clientY,
          width: table.offsetWidth,
          height: table.offsetHeight,
          scale: table.offsetWidth
            ? table.getBoundingClientRect().width / table.offsetWidth
            : 1,
          direction: view.getComputedStyle(table).direction === "rtl" ? -1 : 1,
        };
        setDragging(axis);
      },
      onPointerMove(event) {
        const start = pointer.current;
        if (!start || start.id !== event.pointerId || start.axis !== axis)
          return;
        const next: { width?: number; height?: number } = {};
        if (axis !== "height")
          next.width =
            start.width +
            ((event.clientX - start.x) * start.direction) / start.scale;
        if (axis !== "width")
          next.height = start.height + (event.clientY - start.y) / start.scale;
        update(next);
      },
      onPointerUp: end,
      onPointerCancel: end,
      onLostPointerCapture: end,
      onDoubleClick() {
        setSize((previous) => {
          const next = { ...previous };
          if (axis !== "height") delete next.width;
          if (axis !== "width") delete next.height;
          return next;
        });
      },
      onKeyDown(event) {
        if (axis === "both") return;
        const table = tableRef.current;
        const view = table?.ownerDocument.defaultView;
        if (!table || !view) return;
        const direction =
          view.getComputedStyle(table).direction === "rtl" ? -1 : 1;
        let step = 0;
        if (axis === "width") {
          if (event.key === "ArrowLeft") step = -16 * direction;
          if (event.key === "ArrowRight") step = 16 * direction;
        } else {
          if (event.key === "ArrowUp") step = -16;
          if (event.key === "ArrowDown") step = 16;
        }
        const next =
          event.key === "Home"
            ? minimum[axis]
            : event.key === "End"
              ? natural[axis]
              : step
                ? dimensions[axis] + step
                : undefined;
        if (next === undefined) return;
        event.preventDefault();
        update(axis === "width" ? { width: next } : { height: next });
      },
    };
  }
  return {
    size: resizable ? size : {},
    dimensions,
    natural,
    minimum,
    dragging: resizable ? dragging : null,
    axes,
    handle,
  };
}
