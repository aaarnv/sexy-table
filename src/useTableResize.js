import { useLayoutEffect, useRef, useState } from 'react';

export function useTableResize(tableRef, resizable) {
  const [size, setSize] = useState({});
  const [natural, setNatural] = useState({ width: 0, height: 0 });
  const [dragging, setDragging] = useState(null);
  const pointer = useRef(null);
  const autoWidth = size.width === undefined;
  const autoHeight = size.height === undefined;

  useLayoutEffect(() => {
    if (!resizable) return;
    const table = tableRef.current;
    const measure = () => setNatural(previous => {
      const next = {
        width: autoWidth ? table.offsetWidth : previous.width,
        height: autoHeight ? table.offsetHeight : previous.height,
      };
      return next.width === previous.width && next.height === previous.height ? previous : next;
    });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(table);
    return () => observer.disconnect();
  }, [tableRef, resizable, autoWidth, autoHeight]);

  const dimensions = { width: size.width ?? natural.width, height: size.height ?? natural.height };
  const update = next => setSize(previous => ({
    ...previous,
    ...(next.width === undefined ? {} : { width: Math.round(Math.min(Math.max(next.width, 320), Math.max(320, natural.width))) }),
    ...(next.height === undefined ? {} : { height: Math.round(Math.max(next.height, 200)) }),
  }));
  const end = event => {
    pointer.current = null;
    setDragging(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  function handle(axis) {
    return {
      'data-dragging': dragging === axis ? '' : undefined,
      onPointerDown(event) {
        if (event.button !== 0) return;
        event.preventDefault();
        const table = tableRef.current;
        event.currentTarget.setPointerCapture(event.pointerId);
        pointer.current = {
          x: event.clientX, y: event.clientY, ...dimensions,
          scale: table.getBoundingClientRect().width / table.offsetWidth,
          direction: getComputedStyle(table).direction === 'rtl' ? -1 : 1,
        };
        setDragging(axis);
      },
      onPointerMove(event) {
        const start = pointer.current;
        if (!start) return;
        update({
          width: axis === 'height' ? undefined : start.width + (event.clientX - start.x) * start.direction / start.scale,
          height: axis === 'width' ? undefined : start.height + (event.clientY - start.y) / start.scale,
        });
      },
      onPointerUp: end,
      onPointerCancel: end,
      onLostPointerCapture() { pointer.current = null; setDragging(null); },
      onDoubleClick() {
        setSize(previous => ({
          width: axis === 'height' ? previous.width : undefined,
          height: axis === 'width' ? previous.height : undefined,
        }));
      },
      onKeyDown(event) {
        const direction = getComputedStyle(tableRef.current).direction === 'rtl' ? -1 : 1;
        const steps = axis === 'width' ? { ArrowLeft: -16 * direction, ArrowRight: 16 * direction } : { ArrowUp: -16, ArrowDown: 16 };
        const next = event.key === 'Home' ? (axis === 'width' ? 320 : 200) : event.key === 'End' ? natural[axis] : steps[event.key] ? dimensions[axis] + steps[event.key] : undefined;
        if (next === undefined) return;
        event.preventDefault();
        update({ [axis]: next });
      },
    };
  }
  return { size, dimensions, natural, dragging, handle };
}
