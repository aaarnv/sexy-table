import { forwardRef, useCallback, useRef, useState } from "react";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { Tooltip } from "@base-ui/react/tooltip";
import { IssueGroup } from "./internal/IssueGroup";
import { ResizeHandles } from "./internal/ResizeHandles";
import { useLayoutGlide } from "./internal/useLayoutGlide";
import { useTableResize } from "./internal/useTableResize";
import type { SexyTableProps } from "./types";

export const SexyTable = forwardRef<HTMLDivElement, SexyTableProps>(
  function SexyTable(
    {
      groups,
      toolbar,
      theme = "system",
      dir = "ltr",
      resizable = true,
      animated = true,
      onAdd,
      className = "",
      style,
      onPointerDownCapture,
      onKeyDownCapture,
      ...props
    },
    forwardedRef,
  ) {
    const tableRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const groupsRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const resize = useTableResize(tableRef, resizable);
    useLayoutGlide(containerRef, groupsRef, viewportRef, animated);
    const setTableRef = useCallback(
      (element: HTMLDivElement | null) => {
        tableRef.current = element;
        if (typeof forwardedRef === "function") return forwardedRef(element);
        if (forwardedRef) forwardedRef.current = element;
      },
      [forwardedRef],
    );

    return (
      <DirectionProvider direction={dir}>
        <Tooltip.Provider delay={0} closeDelay={140}>
          <div
            {...props}
            dir={dir}
            ref={setTableRef}
            data-kgt-theme={theme}
            data-slot="grouped-table"
            data-animated={animated}
            data-resizing={resize.dragging ? "" : undefined}
            className={`kgt-grouped-table ${className}`}
            style={{ ...style, ...resize.size }}
            onPointerDownCapture={(event) => {
              setHasInteracted(true);
              onPointerDownCapture?.(event);
            }}
            onKeyDownCapture={(event) => {
              setHasInteracted(true);
              onKeyDownCapture?.(event);
            }}
          >
            <div ref={containerRef} className="kgt-table-container">
              {toolbar && (
                <div
                  data-slot="grouped-table-toolbar"
                  className="kgt-table-toolbar"
                >
                  {toolbar}
                </div>
              )}
              <ScrollArea.Root
                data-slot="scroll-area"
                className="kgt-table-scroll-area"
              >
                <ScrollArea.Viewport
                  ref={viewportRef}
                  data-slot="scroll-area-viewport"
                  className="kgt-table-scroll"
                  aria-label="Issues, scroll for more"
                >
                  <div
                    ref={groupsRef}
                    className="kgt-groups"
                    data-settled={animated && hasInteracted ? "" : undefined}
                  >
                    {groups.map((group, index) => (
                      <IssueGroup
                        key={group.id}
                        group={group}
                        onAdd={onAdd}
                        showColumns={index === 0}
                        portalContainer={tableRef}
                      />
                    ))}
                  </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                  className="kgt-table-scrollbar"
                  orientation="vertical"
                >
                  <ScrollArea.Thumb className="kgt-table-scroll-thumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Scrollbar
                  className="kgt-table-scrollbar"
                  orientation="horizontal"
                >
                  <ScrollArea.Thumb className="kgt-table-scroll-thumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner />
              </ScrollArea.Root>
            </div>
            <ResizeHandles resizable={resizable} resize={resize} />
          </div>
        </Tooltip.Provider>
      </DirectionProvider>
    );
  },
);
