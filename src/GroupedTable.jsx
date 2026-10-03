import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import './grouped-table.css';

export function Icon({ name, label, className = '' }) {
  return <span role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={`icon ${className}`} style={{ maskImage: `url(/assets/${name}.svg)` }} />;
}

function ResizeHandle({ axis, tableRef, setSize, value }) {
  const horizontal = axis === 'width';
  const minimum = horizontal ? 320 : 200;
  const maximum = () => horizontal ? tableRef.current.parentElement.clientWidth : 1000;
  const update = (next) => setSize(size => ({ ...size, [axis]: Math.min(maximum(), Math.max(minimum, next)) }));
  return <div role="separator" aria-label={`Resize the table's ${axis}`} aria-orientation={horizontal ? 'vertical' : 'horizontal'} aria-valuemin={minimum} aria-valuemax={horizontal ? tableRef.current?.parentElement.clientWidth ?? value : 1000} aria-valuenow={Math.round(value)} tabIndex={0} className={`resize-handle resize-${axis}`}
    onPointerDown={event => {
      event.preventDefault();
      const handle = event.currentTarget;
      handle.setPointerCapture(event.pointerId);
      const start = horizontal ? event.clientX : event.clientY;
      const initial = horizontal ? tableRef.current.offsetWidth : tableRef.current.offsetHeight;
      const move = event => update(initial + (horizontal ? event.clientX : event.clientY) - start);
      const end = () => { handle.removeEventListener('pointermove', move); handle.removeEventListener('pointerup', end); handle.removeEventListener('pointercancel', end); };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', end);
      handle.addEventListener('pointercancel', end);
    }}
    onKeyDown={event => {
      const backward = horizontal ? 'ArrowLeft' : 'ArrowUp';
      const forward = horizontal ? 'ArrowRight' : 'ArrowDown';
      if (![backward, forward, 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      update(event.key === 'Home' ? minimum : event.key === 'End' ? maximum() : value + (event.key === backward ? -1 : 1) * (event.shiftKey ? 64 : 16));
    }} />;
}

function IssueRow({ issue }) {
  const pullIcon = { open: 'git-pull-request', draft: 'git-pull-request-draft', closed: 'git-pull-request-closed', merged: 'git-merge' };
  return <li><div data-slot="grouped-table-row" className="table-grid issue-row">
    <span className="glyph priority"><Icon name={issue.priority === 'urgent' ? 'urgent' : `${issue.priority}-priority`} label={issue.priority === 'urgent' ? 'Urgent' : `${issue.priority} priority`} className={issue.priority === 'urgent' ? 'danger' : ''} /></span>
    <span className="inline-fields">
      <span className="issue-title" data-motion>{issue.title}</span>
      <span className="pill pull" data-motion aria-label={`Pull request #${issue.pull.number}, ${issue.pull.state}`}><Icon name={pullIcon[issue.pull.state]} className={issue.pull.state} />#{issue.pull.number}</span>
      <span className="estimate" data-motion aria-label={`${issue.estimate} ${issue.estimate === 1 ? 'point' : 'points'}`}><Icon name="estimate-filled" />{issue.estimate}</span>
    </span>
    <span className={`pill label label-${issue.label.toLowerCase()}`}><span className="label-dot" />{issue.label}</span>
    <span className="due" data-motion>{issue.due}</span>
    <span className="people" aria-label={`Assigned to ${issue.assignees.map(p => p.name).join(', ')}`}><span className="avatar-stack" data-motion>{issue.assignees.map((person, index) => <img key={person.name} src={person.avatar} alt="" className="avatar" style={{ zIndex: issue.assignees.length - index }} />)}</span></span>
  </div></li>;
}

function Group({ group, onAdd, showColumns }) {
  const [open, setOpen] = useState(true);
  const id = useId();
  return <section aria-label={group.status} className="issue-group" data-open={open}>
    <div className="table-grid group-header">
      <span className={`glyph status-${group.icon}`}><Icon name={group.icon} label={group.status} /></span>
      <button className="group-trigger" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}><span>{group.status}</span><span className="count">{group.issues.length}</span></button>
      {showColumns && <><span className="column-heading pull-heading" title="Pull request"><Icon name="git-pull-request" label="Pull request" /></span><span className="column-heading label-heading" title="Label"><Icon name="tag" label="Label" /></span><span className="column-heading estimate-heading" title="Estimate"><Icon name="triangle" label="Estimate" /></span><span className="column-heading due-heading" title="Due"><Icon name="calendar-event" label="Due" /></span></>}
      <span className="group-actions"><button className="add-button icon-button" aria-label={`Add an issue to ${group.status}`} onClick={() => onAdd?.(group.status)}><Icon name="plus" /></button><button className="collapse-button icon-button" aria-label={`${open ? 'Collapse' : 'Expand'} ${group.status}`} onClick={() => setOpen(!open)}><Icon name="chevron-down" /></button></span>
    </div>
    <div id={id} className="group-panel" inert={!open}><div><ul>{group.issues.map(issue => <IssueRow key={issue.id} issue={issue} />)}</ul></div></div>
  </section>;
}

/** Container-responsive issue list. Each group has status, icon and issues; see data.js. */
export function GroupedTable({ groups, toolbar, resizable = true, animated = true, onAdd, className = '', ...props }) {
  const ref = useRef(null);
  const previous = useRef(new Map());
  const previousLayout = useRef(null);
  const [size, setSize] = useState({ width: null, height: 637 });
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const observer = new ResizeObserver(() => {
      const root = ref.current;
      setWidth(root.clientWidth);
      const layout = root.clientWidth >= 760 ? 2 : root.clientWidth >= 632 ? 1 : 0;
      const changed = previousLayout.current !== null && previousLayout.current !== layout;
      root.querySelectorAll('[data-motion]').forEach(el => el.getAnimations().forEach(animation => animation.finish()));
      const boxes = new Map();
      root.querySelectorAll('[data-motion]').forEach(el => {
        const box = el.getBoundingClientRect();
        boxes.set(el, box);
        const before = previous.current.get(el);
        if (changed && animated && before && !matchMedia('(prefers-reduced-motion: reduce)').matches && Math.abs(box.x - before.x) > 24) {
          el.getAnimations().forEach(animation => animation.cancel());
          el.animate([{ transform: `translate(${before.x - box.x}px, ${before.y - box.y}px)` }, { transform: 'translate(0, 0)' }], { duration: 220, easing: 'cubic-bezier(.23,1,.32,1)' });
        }
      });
      previous.current = boxes;
      previousLayout.current = layout;
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animated]);
  useEffect(() => {
    const reset = () => setSize(size => ({ ...size, width: null }));
    window.addEventListener('resize', reset);
    return () => window.removeEventListener('resize', reset);
  }, []);
  return <div {...props} ref={ref} data-slot="grouped-table" data-animated={animated} className={`grouped-table ${className}`} style={{ width: size.width ?? '100%', height: size.height }}>
    <div className="table-container">
      {toolbar && <div data-slot="grouped-table-toolbar" className="table-toolbar">{toolbar}</div>}
      <div className="table-scroll" tabIndex={0} aria-label="Issues, scroll for more">
        <div className="groups">{groups.map((group, index) => <Group key={group.status} group={group} onAdd={onAdd} showColumns={index === 0} />)}</div>
      </div>
    </div>
    {resizable && <><ResizeHandle axis="width" tableRef={ref} setSize={setSize} value={width} /><ResizeHandle axis="height" tableRef={ref} setSize={setSize} value={size.height} /></>}
  </div>;
}
