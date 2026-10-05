import { useLayoutEffect, useRef, useState } from 'react';

export function SlidingTabs({ items, value, onChange }) {
  const root = useRef(null);
  const [geometry, setGeometry] = useState(null);
  useLayoutEffect(() => {
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const buttons = [...root.current.querySelectorAll('button')];
      const selected = buttons[items.indexOf(value)];
      const labels = buttons.map(button => {
        const label = button.querySelector('.tab-label');
        return { x: button.offsetLeft + label.offsetLeft, width: label.offsetWidth };
      });
      setGeometry({ x: selected.offsetLeft, width: selected.offsetWidth, labels });
    };
    measure();
    document.fonts.ready.then(measure);
    return () => { alive = false; };
  }, [value, items]);

  return <div ref={root} className="tabs" role="tablist" aria-label="Project view">
    {geometry && <span className="tab-pill" style={{ transform: `translateX(${geometry.x}px)`, width: geometry.width }} />}
    {items.map((name, index) => <button key={name} type="button" role="tab" aria-selected={value === name} data-current={value === name ? '' : undefined} onClick={() => onChange(name)}>
      <span className="tab-label"><span>{name}</span>{geometry && <span aria-hidden="true" className="tab-active-label" style={{ clipPath: `inset(0 ${geometry.labels[index].x + geometry.labels[index].width - geometry.x - geometry.width}px 0 ${geometry.x - geometry.labels[index].x}px)` }}>{name}</span>}</span>
    </button>)}
  </div>;
}
