import type { SVGProps } from "react";
import { Icon } from "./internal/Icon";
import type { GroupedTableStatus } from "./types";

export interface GroupedTableStatusIconProps extends SVGProps<SVGSVGElement> {
  readonly status: GroupedTableStatus;
}

export function GroupedTableStatusIcon({
  status,
  className = "",
  ...props
}: GroupedTableStatusIconProps) {
  return (
    <Icon
      {...props}
      name={status}
      className={`kgt-status-${status} ${className}`}
    />
  );
}
