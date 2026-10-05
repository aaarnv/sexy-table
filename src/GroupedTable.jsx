import { useRef, useState } from 'react';
import { Collapsible } from '@base-ui/react/collapsible';
import { ScrollArea } from '@base-ui/react/scroll-area';
import { Tooltip } from '@base-ui/react/tooltip';
import { useLayoutGlide } from './useLayoutGlide.js';
import { useTableResize } from './useTableResize.js';
import './grouped-table.css';

export function Icon({ name, label, className = '' }) {
  return <span role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={`icon ${className}`} style={{ maskImage: `url(/assets/${name}.svg)` }} />;
}

const pullIcons = {
  open: 'git-pull-request', draft: 'git-pull-request-draft',
  closed: 'git-pull-request-closed', merged: 'git-merge',
};

function IssueRow({ issue }) {
  return <li>
    <div data-slot="grouped-table-row" data-flip="row" className="table-grid issue-row">
      <span data-appear className="glyph priority">
        <Icon name={issue.priority === 'urgent' ? 'urgent' : `${issue.priority}-priority`} label={issue.priority === 'urgent' ? 'Urgent' : `${issue.priority} priority`} className={issue.priority === 'urgent' ? 'danger' : ''} />
      </span>
      <span className="inline-fields">
        <span className="issue-title" data-flip="piece">{issue.title}</span>
        <span className="pill pull" data-flip="piece" aria-label={`Pull request #${issue.pull.number}, ${issue.pull.state}`}>
          <Icon name={pullIcons[issue.pull.state]} className={issue.pull.state} />#{issue.pull.number}
        </span>
        <span className="estimate" data-flip="piece" aria-label={`${issue.estimate} ${issue.estimate === 1 ? 'point' : 'points'}`}>
          <Icon name="estimate-filled" />{issue.estimate}
        </span>
      </span>
      <span data-appear className="label-cell"><span className={`pill label label-${issue.label.toLowerCase()}`}><span className="label-dot" />{issue.label}</span></span>
      <span className="due" data-flip="piece">{issue.due}</span>
      <span className="people" aria-label={`Assigned to ${issue.assignees.map(person => person.name).join(', ')}`}>
        <span className="avatar-stack" data-flip-end>
          {issue.assignees.map((person, index) => <span key={person.name} className="avatar" data-flip={index ? 'fan' : undefined} style={{ zIndex: issue.assignees.length - index }}><img src={person.avatar} alt="" /></span>)}
        </span>
      </span>
    </div>
  </li>;
}

function ColumnHeading({ name, icon, area, portalContainer }) {
  return <span data-flip="piece" data-appear className={`column-heading ${area}-heading`}>
    <Tooltip.Root>
      <Tooltip.Trigger render={<span role="img" aria-label={name} className="column-icon" />}><Icon name={icon} /></Tooltip.Trigger>
      <Tooltip.Portal container={portalContainer}><Tooltip.Positioner side="top" sideOffset={6} className="column-tooltip-positioner"><Tooltip.Popup className="column-tooltip">{name}</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal>
    </Tooltip.Root>
  </span>;
}

function Group({ group, onAdd, showColumns, portalContainer }) {
  const trigger = useRef(null);
  return <Collapsible.Root defaultOpen render={<section aria-label={group.status} data-flip="group" className="issue-group" />}>
    <div className="table-grid group-header" onClick={event => { if (!event.target.closest('button')) trigger.current.click(); }}>
      <span data-appear className={`glyph status-${group.icon}`}><Icon name={group.icon} label={group.status} /></span>
      <Collapsible.Trigger ref={trigger} className="group-trigger"><span data-flip="piece" className="group-name"><span>{group.status}</span><span className="count">{group.issues.length}</span></span></Collapsible.Trigger>
      {showColumns && <>
        <ColumnHeading portalContainer={portalContainer} name="Pull request" icon="git-pull-request" area="pull" />
        <ColumnHeading portalContainer={portalContainer} name="Label" icon="tag" area="label" />
        <ColumnHeading portalContainer={portalContainer} name="Estimate" icon="triangle" area="estimate" />
        <ColumnHeading portalContainer={portalContainer} name="Due" icon="calendar-event" area="due" />
      </>}
      <span className="group-actions">
        <button type="button" className="add-button icon-button" aria-label={`Add an issue to ${group.status}`} onClick={() => onAdd?.(group.status)}><Icon name="plus" /></button>
        <span aria-hidden="true" className="collapse-indicator"><Icon name="chevron-down" /></span>
      </span>
    </div>
    <Collapsible.Panel className="group-panel"><ul>{group.issues.map(issue => <IssueRow key={issue.id} issue={issue} />)}</ul></Collapsible.Panel>
  </Collapsible.Root>;
}

export function GroupedTable({ groups, toolbar, resizable = true, animated = true, onAdd, className = '', style, ...props }) {
  const table = useRef(null);
  const container = useRef(null);
  const list = useRef(null);
  const viewport = useRef(null);
  const [settled, setSettled] = useState(false);
  const resize = useTableResize(table, resizable);
  useLayoutGlide(container, list, viewport, animated);

  return <Tooltip.Provider delay={0} closeDelay={140}>
    <div {...props} ref={table} data-slot="grouped-table" data-animated={animated} data-resizing={resize.dragging ? '' : undefined}
      className={`grouped-table ${className}`} style={{ ...resize.size, ...style }} onPointerDownCapture={() => setSettled(true)} onKeyDownCapture={() => setSettled(true)}>
      <div ref={container} className="table-container">
        {toolbar && <div data-slot="grouped-table-toolbar" className="table-toolbar">{toolbar}</div>}
        <ScrollArea.Root data-slot="scroll-area" className="table-scroll-area">
          <ScrollArea.Viewport ref={viewport} data-slot="scroll-area-viewport" className="table-scroll" aria-label="Issues, scroll for more">
            <div ref={list} className="groups" data-settled={animated && settled ? '' : undefined}>{groups.map((group, index) => <Group key={group.status} group={group} onAdd={onAdd} showColumns={index === 0} portalContainer={table} />)}</div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className="table-scrollbar" orientation="vertical"><ScrollArea.Thumb className="table-scroll-thumb" /></ScrollArea.Scrollbar>
          <ScrollArea.Scrollbar className="table-scrollbar" orientation="horizontal"><ScrollArea.Thumb className="table-scroll-thumb" /></ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Root>
      </div>
      {resizable && <>
        {['width', 'height'].map(axis => <div key={axis} role="separator" aria-label={`Resize the table's ${axis}`} aria-orientation={axis === 'width' ? 'vertical' : 'horizontal'} aria-valuemin={axis === 'width' ? 320 : 200} aria-valuemax={axis === 'width' ? resize.natural.width : undefined} aria-valuenow={resize.dimensions[axis]} tabIndex={0} className={`resize-handle resize-${axis}`} {...resize.handle(axis)} />)}
        <div aria-hidden="true" className="resize-corner" {...resize.handle('both')}><Icon name="resize-corner" /></div>
      </>}
      {resize.dragging && <div className={`resize-overlay resize-overlay-${resize.dragging}`} />}
    </div>
  </Tooltip.Provider>;
}
