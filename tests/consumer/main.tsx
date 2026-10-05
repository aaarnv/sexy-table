import { createElement, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  SexyTable,
  SexyTableStatusIcon,
  SlidingTabs,
} from "@aaarnv/sexy-table";
import type {
  SexyTableGroup,
  SexyTableTheme,
  SlidingTab,
} from "@aaarnv/sexy-table";
import "@aaarnv/sexy-table/styles.css";

type View = "board" | "requests";
const items: readonly SlidingTab<View>[] = [
  { value: "board", label: "Board" },
  { value: "requests", label: "Requests" },
];
const groups: readonly SexyTableGroup[] = [
  {
    id: "customer-id",
    label: "Customer requests",
    icon: createElement(SexyTableStatusIcon, {
      status: "todo",
      "aria-label": "Backlog status",
    }),
    issues: [
      { id: "minimal", title: "An issue with only a title" },
      {
        id: "full",
        title: "Bring your own data and styles",
        priority: "urgent",
        pullRequest: { label: "PR-42", state: "merged" },
        estimate: 0,
        label: { name: "Your label", color: "#9b75e8" },
        due: "Tomorrow",
        assignees: [
          { id: "ada", name: "Ada Lovelace" },
          { id: "grace", name: "Grace Hopper" },
          { id: "margaret", name: "Margaret Hamilton" },
        ],
      },
    ],
  },
  {
    id: "done-id",
    label: "Completed work",
    defaultOpen: false,
    icon: createElement(SexyTableStatusIcon, { status: "done" }),
    issues: [{ id: "closed", title: "Starts collapsed" }],
  },
];

function App() {
  const [view, setView] = useState<View>("requests");
  const [theme, setTheme] = useState<SexyTableTheme>("dark");
  const [mounted, setMounted] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [rtl, setRtl] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [added, setAdded] = useState("None");
  const [events, setEvents] = useState(0);
  const [refResult, setRefResult] = useState("Unchecked");
  const [minimal, setMinimal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <main>
      <h1>Installed package verification</h1>
      <div className="controls">
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          Toggle theme
        </button>
        <button onClick={() => setMounted(!mounted)}>Toggle mount</button>
        <button onClick={() => setAnimated(!animated)}>
          Toggle animations
        </button>
        <button onClick={() => setRtl(!rtl)}>Toggle direction</button>
        <button onClick={() => setNarrow(!narrow)}>Constrain parent</button>
        <button onClick={() => setMinimal(!minimal)}>Toggle empty data</button>
        <button onClick={() => setRefResult(ref.current?.tagName ?? "Missing")}>
          Check forwarded ref
        </button>
      </div>
      <output>
        View: {view}; Added: {added}; Captured events: {events}; Ref:{" "}
        {refResult}; Animated: {String(animated)}
      </output>
      <div
        id="consumer-parent"
        style={{ maxWidth: narrow ? 280 : 960 }}
        dir={rtl ? "rtl" : "ltr"}
      >
        {mounted && (
          <SexyTable
            ref={ref}
            dir={rtl ? "rtl" : "ltr"}
            groups={minimal ? [] : groups}
            theme={theme}
            animated={animated}
            style={{ height: 440, "--kgt-success": "#69cda1" }}
            data-consumer="installed"
            onAdd={(group) => setAdded(group.id)}
            onPointerDownCapture={() => setEvents((previous) => previous + 1)}
            onKeyDownCapture={() => setEvents((previous) => previous + 1)}
            toolbar={
              <SlidingTabs
                items={items}
                value={view}
                onValueChange={setView}
                aria-label="Consumer views"
              />
            }
          />
        )}
      </div>
      <button id="outside-button">Outside button keeps host styles</button>
    </main>
  );
}
const root = document.getElementById("root");
if (!root) throw new Error("Consumer root is missing");
createRoot(root).render(createElement(App));
