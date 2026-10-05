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
  const [requestedSize, setRequestedSize] = useState<Partial<Dimensions>>({});
  const [naturalSize, setNaturalSize] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const [dragging, setDragging] = useState<ResizeAxis | null>(null);
  const gestureRef = useRef<Gesture | null>(null);
  const hasAutomaticWidth = requestedSize.width === undefined;
  const hasAutomaticHeight = requestedSize.height === undefined;

  useIsomorphicLayoutEffect(() => {
    if (!resizable) {
      gestureRef.current = null;
      setDragging(null);
    }
  }, [resizable]);

  useIsomorphicLayoutEffect(() => {
    const table = tableRef.current;
    const view = table?.ownerDocument.defaultView;
    if (!resizable || !table || !view) return;
    const parent = table.parentElement;
    const measure = () =>
      setNaturalSize((previous) => {
        const parentStyle = parent ? view.getComputedStyle(parent) : null;
        const available =
          parent && parentStyle
            ? parent.clientWidth -
              parseFloat(parentStyle.paddingLeft) -
              parseFloat(parentStyle.paddingRight)
            : previous.width;
        const next = {
          width: hasAutomaticWidth ? table.offsetWidth : Math.max(0, available),
          height: hasAutomaticHeight ? table.offsetHeight : previous.height,
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
  }, [tableRef, resizable, hasAutomaticWidth, hasAutomaticHeight]);

  const minimum = {
    width: Math.min(320, naturalSize.width || 320),
    height: 200,
  };
  const dimensions = {
    width: Math.min(
      requestedSize.width ?? naturalSize.width,
      naturalSize.width,
    ),
    height: requestedSize.height ?? naturalSize.height,
  };
  function updateSize(next: Partial<Dimensions>) {
    setRequestedSize((previous) => {
      const updatedSize = { ...previous };
      if (next.width !== undefined) {
        updatedSize.width = Math.round(
          Math.min(Math.max(next.width, minimum.width), naturalSize.width),
        );
      }
      if (next.height !== undefined) {
        updatedSize.height = Math.round(Math.max(next.height, minimum.height));
      }
      return updatedSize;
    });
  }

  const endGesture = (event: PointerEvent<HTMLDivElement>) => {
    if (gestureRef.current?.id !== event.pointerId) return;
    gestureRef.current = null;
    setDragging(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };

  function getHandleProps(axis: ResizeAxis): ResizeHandleProps {
    return {
      "data-dragging": dragging === axis ? "" : undefined,
      onPointerDown(event) {
        const table = tableRef.current;
        const view = table?.ownerDocument.defaultView;
        if (event.button !== 0 || gestureRef.current || !table || !view) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        gestureRef.current = {
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
        const start = gestureRef.current;
        if (!start || start.id !== event.pointerId || start.axis !== axis)
          return;
        const next: { width?: number; height?: number } = {};
        if (axis !== "height")
          next.width =
            start.width +
            ((event.clientX - start.x) * start.direction) / start.scale;
        if (axis !== "width")
          next.height = start.height + (event.clientY - start.y) / start.scale;
        updateSize(next);
      },
      onPointerUp: endGesture,
      onPointerCancel: endGesture,
      onLostPointerCapture: endGesture,
      onDoubleClick() {
        setRequestedSize((previous) => {
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
        let next: number | undefined;
        if (event.key === "Home") next = minimum[axis];
        else if (event.key === "End") next = naturalSize[axis];
        else if (step) next = dimensions[axis] + step;
        if (next === undefined) return;
        event.preventDefault();
        updateSize(axis === "width" ? { width: next } : { height: next });
      },
    };
  }
  return {
    size: resizable ? requestedSize : {},
    dimensions,
    natural: naturalSize,
    minimum,
    dragging: resizable ? dragging : null,
    axes,
    getHandleProps,
  };
}
