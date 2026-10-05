import { useState } from 'react';
import { GroupedTable, Icon } from './GroupedTable.jsx';
import { SlidingTabs } from './SlidingTabs.jsx';
import { initialGroups } from './data.js';

const tabs = ['Overview', 'Activity', 'Issues'];

export function App() {
  const [tab, setTab] = useState('Issues');
  const [light, setLight] = useState(false);
  const [animated, setAnimated] = useState(true);
  return <main className={`demo ${light ? 'light' : ''}`}>
    <header className="demo-header"><span>Grouped Table</span><button type="button" className="icon-button" aria-label="Toggle color theme" onClick={() => setLight(!light)}><Icon name={light ? 'sun' : 'moon'} /></button></header>
    <div className="demo-stage">
      <GroupedTable groups={initialGroups} animated={animated} toolbar={<>
        <SlidingTabs items={tabs} value={tab} onChange={setTab} />
        <button type="button" className="icon-button view-options" aria-label="View options"><Icon name="stack-2" /></button>
      </>} />
    </div>
    <div className="demo-controls"><label htmlFor="animated">Animated</label><button id="animated" type="button" className="animation-switch" role="switch" aria-label="Animated" aria-checked={animated} onClick={() => setAnimated(!animated)}><span /></button></div>
  </main>;
}
