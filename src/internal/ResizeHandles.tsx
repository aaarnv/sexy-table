import { Icon } from "./Icon";
import type { useTableResize } from "./useTableResize";

interface ResizeHandlesProps {
  readonly resizable: boolean;
  readonly resize: ReturnType<typeof useTableResize>;
}

export function ResizeHandles({ resizable, resize }: ResizeHandlesProps) {
  return (
    <>
      {resizable && (
        <>
          {resize.axes.map((axis) => (
            <div
              key={axis}
              role="separator"
              aria-label={`Resize the table's ${axis}`}
              aria-orientation={axis === "width" ? "vertical" : "horizontal"}
              aria-valuemin={resize.minimum[axis]}
              aria-valuemax={
                axis === "width" ? resize.natural.width : undefined
              }
              aria-valuenow={resize.dimensions[axis]}
              aria-valuetext={`${resize.dimensions[axis]} pixels`}
              tabIndex={0}
              className={`kgt-resize-handle kgt-resize-${axis}`}
              {...resize.getHandleProps(axis)}
            />
          ))}
          <div
            aria-hidden="true"
            className="kgt-resize-corner"
            {...resize.getHandleProps("both")}
          >
            <Icon name="resize-corner" />
          </div>
        </>
      )}
      {resize.dragging && (
        <div
          className={`kgt-resize-overlay kgt-resize-overlay-${resize.dragging}`}
        />
      )}
    </>
  );
}
