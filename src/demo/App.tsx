import { useState } from "react";
import { SexyTable, SlidingTabs } from "../index";
import { DemoIcon } from "./DemoIcon";
import "../grouped-table.css";
import { initialGroups } from "./data";

const tabs = ["Overview", "Activity", "Issues"].map((value) => ({
  value,
  label: value,
}));

export function App() {
  const [tab, setTab] = useState("Issues");
  const [light, setLight] = useState(false);
  const [animated, setAnimated] = useState(true);
  return (
    <main className={`demo ${light ? "light" : ""}`}>
      <header className="demo-header">
        <span>Sexy Table</span>
        <button
          type="button"
          className="icon-button"
          aria-label="Toggle color theme"
          onClick={() => setLight(!light)}
        >
          <DemoIcon name={light ? "sun" : "moon"} />
        </button>
      </header>
      <div className="demo-stage">
        <SexyTable
          groups={initialGroups}
          theme={light ? "light" : "dark"}
          animated={animated}
          toolbar={
            <>
              <SlidingTabs items={tabs} value={tab} onValueChange={setTab} />
              <button
                type="button"
                className="kgt-icon-button view-options"
                aria-label="View options"
              >
                <DemoIcon name="stack-2" />
              </button>
            </>
          }
        />
      </div>
      <div className="demo-controls">
        <label htmlFor="animated">Animated</label>
        <button
          id="animated"
          type="button"
          className="animation-switch"
          role="switch"
          aria-label="Animated"
          aria-checked={animated}
          onClick={() => setAnimated(!animated)}
        >
          <span />
        </button>
      </div>
    </main>
  );
}
