import { useRef, useState } from 'react';
import { GroupedTable, Icon } from './GroupedTable.jsx';
import { initialGroups } from './data.js';

export function App() {
  const [tab, setTab] = useState('Issues');
  const [light, setLight] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [groups, setGroups] = useState(initialGroups);
  const [status, setStatus] = useState('Todo');
  const dialog = useRef(null);
  const [options, setOptions] = useState(false);
  return <main className={`demo ${light ? 'light' : ''}`}>
    <header className="demo-header"><span>Grouped Table</span><button className="icon-button" aria-label="Toggle color theme" title="Toggle color theme" onClick={() => setLight(!light)}><Icon name={light ? 'sun' : 'moon'} /></button></header>
    <div className="demo-stage">
      <GroupedTable groups={groups} animated={animated} onAdd={status => { setStatus(status); dialog.current.showModal(); }} toolbar={<>
        <div className="tabs" role="tablist" aria-label="Project view"><span className="tab-pill" style={{ left: { Overview: 0, Activity: 79, Issues: 146 }[tab], width: { Overview: 79, Activity: 67, Issues: 58 }[tab] }} />{['Overview', 'Activity', 'Issues'].map(name => <button key={name} role="tab" aria-selected={tab === name} onClick={() => setTab(name)}>{name}</button>)}</div>
        <div className="options-wrapper"><button className="icon-button" aria-label="View options" aria-expanded={options} onClick={() => setOptions(!options)}><Icon name="stack-2" /></button>{options && <div className="options-menu"><label><input type="checkbox" checked={animated} onChange={event => setAnimated(event.target.checked)} />Animated</label><button onClick={() => { setGroups(initialGroups); setOptions(false); }}>Reset demo data</button></div>}</div>
      </>} />
    </div>
    <p className="demo-hint">Drag the edges to explore the responsive columns.</p>
    <dialog ref={dialog} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <form onSubmit={event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const title = String(form.get('title') ?? '').trim();
        if (!title) return;
        setGroups(groups => groups.map(group => group.status !== status ? group : { ...group, issues: [...group.issues, { id: crypto.randomUUID(), title, priority: 'medium', pull: { number: 1185, state: 'draft' }, estimate: 1, label: 'Feature', due: 'No date', assignees: [] }] }));
        event.currentTarget.reset();
        dialog.current.close();
      }}>
        <h2>Add an issue</h2><p>{status}</p><label htmlFor="issue-title">Issue title</label><input id="issue-title" name="title" autoFocus required maxLength={160} placeholder="What needs to be done?" /><div className="dialog-actions"><button type="button" onClick={() => dialog.current.close()}>Cancel</button><button type="submit" className="primary">Add issue</button></div>
      </form>
    </dialog>
  </main>;
}
