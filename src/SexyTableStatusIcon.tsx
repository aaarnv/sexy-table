import type { SVGProps } from "react";
import { Icon } from "./internal/Icon";
import type { SexyTableStatus } from "./types";

export interface SexyTableStatusIconProps extends SVGProps<SVGSVGElement> {
  readonly status: SexyTableStatus;
}

export function SexyTableStatusIcon({
  status,
  className = "",
  ...props
}: SexyTableStatusIconProps) {
  return (
    <Icon
      {...props}
      name={status}
      className={`kgt-status-${status} ${className}`}
    />
  );
}
