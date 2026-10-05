import { useRef } from "react";
import type { KeyboardEvent } from "react";
import { useSlidingTabLayout } from "./internal/useSlidingTabLayout";
import type { SlidingTabsProps } from "./types";

function getNextTabIndex(
  key: string,
  focused: number,
  count: number,
  rtl: boolean,
) {
  switch (key) {
    case "Home":
      return 0;
    case "End":
      return count - 1;
    case "ArrowRight":
      return (focused + (rtl ? -1 : 1) + count) % count;
    case "ArrowLeft":
      return (focused + (rtl ? 1 : -1) + count) % count;
    default:
      return -1;
  }
}

export function SlidingTabs<Value extends string>({
  items,
  value,
  onValueChange,
  theme,
  className = "",
  onKeyDown,
  ...props
}: SlidingTabsProps<Value>) {
  const root = useRef<HTMLDivElement>(null);
  const geometry = useSlidingTabLayout(root, items, value);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || !items.length) return;
    const buttons = [
      ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
        ".kgt-tab-button",
      ),
    ];
    const focused = buttons.findIndex((button) => button === event.target);
    if (focused < 0) return;
    const rtl =
      event.currentTarget.ownerDocument.defaultView?.getComputedStyle(
        event.currentTarget,
      ).direction === "rtl";
    const next = getNextTabIndex(event.key, focused, items.length, rtl);
    const item = items[next];
    if (!item) return;
    event.preventDefault();
    buttons[next]?.focus();
    onValueChange(item.value);
  }

  const hasSelection = items.some((item) => item.value === value);
  return (
    <div
      {...props}
      ref={root}
      data-kgt-theme={theme}
      className={`kgt-tabs ${className}`}
      role="group"
      aria-label={props["aria-label"] ?? "View"}
      onKeyDown={handleKeyDown}
    >
      {geometry && (
        <span
          className="kgt-tab-pill"
          style={{
            transform: `translateX(${geometry.x}px)`,
            width: geometry.width,
          }}
        />
      )}
      {items.map((item, index) => {
        const label = geometry?.labels[index];
        const activeLabelClip =
          label && geometry
            ? `inset(0 ${label.x + label.width - geometry.x - geometry.width}px 0 ${geometry.x - label.x}px)`
            : undefined;
        return (
          <button
            key={item.value}
            type="button"
            className="kgt-tab-button"
            aria-pressed={value === item.value}
            tabIndex={
              value === item.value || (!hasSelection && index === 0) ? 0 : -1
            }
            data-current={value === item.value ? "" : undefined}
            onClick={() => onValueChange(item.value)}
          >
            <span className="kgt-tab-label">
              <span>{item.label}</span>
              {geometry && label && (
                <span
                  aria-hidden="true"
                  className="kgt-tab-active-label"
                  style={{
                    clipPath: activeLabelClip,
                  }}
                >
                  {item.label}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
