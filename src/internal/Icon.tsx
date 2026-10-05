import type { SVGProps } from "react";

const icons = {
  "calendar-event": (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"></path>
      <path d="M16 3l0 4"></path>
      <path d="M8 3l0 4"></path>
      <path d="M4 11l16 0"></path>
      <path d="M8 15h2v2h-2l0 -2"></path>
    </svg>
  ),
  "chevron-down": (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9l6 6l6 -6"></path>
    </svg>
  ),
  done: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 14 14" {...props}>
      <circle cx="7" cy="7" r="6.5" fill="currentColor"></circle>
      <path
        d="M4.4 7.2 6.2 9l3.4-3.7"
        fill="none"
        stroke="var(--kgt-card)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  ),
  "estimate-filled": (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 14 14" {...props}>
      <path
        d="M7 2.25 12.25 11.5H1.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      ></path>
      <path d="M7 2.25V11.5H1.75Z" fill="currentColor"></path>
    </svg>
  ),
  "git-merge": (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M5 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M15 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M7 8l0 8"></path>
      <path d="M7 8a4 4 0 0 0 4 4h4"></path>
    </svg>
  ),
  "git-pull-request": (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M4 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M6 8l0 8"></path>
      <path d="M11 6h5a2 2 0 0 1 2 2v8"></path>
      <path d="M14 9l-3 -3l3 -3"></path>
    </svg>
  ),
  "git-pull-request-closed": (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M4 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M6 8v8"></path>
      <path d="M18 11v5"></path>
      <path d="M16 4l4 4m0 -4l-4 4"></path>
    </svg>
  ),
  "git-pull-request-draft": (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M4 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M6 8v8"></path>
      <path d="M18 11h.01"></path>
      <path d="M18 6h.01"></path>
    </svg>
  ),
  "high-priority": (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 14 14" {...props}>
      <rect
        x="1.75"
        y="7.5"
        width="2.5"
        height="4.5"
        rx="0.75"
        fill="currentColor"
        opacity="1"
      ></rect>
      <rect
        x="5.75"
        y="5"
        width="2.5"
        height="7"
        rx="0.75"
        fill="currentColor"
        opacity="1"
      ></rect>
      <rect
        x="9.75"
        y="2.5"
        width="2.5"
        height="9.5"
        rx="0.75"
        fill="currentColor"
        opacity="1"
      ></rect>
    </svg>
  ),
  "in-progress": (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 14 14" {...props}>
      <circle
        cx="7"
        cy="7"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      ></circle>
      <path
        d="M7 7V3.75A3.25 3.25 0 0 1 7.00 10.25Z"
        fill="currentColor"
      ></path>
    </svg>
  ),
  "in-review": (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 14 14" {...props}>
      <circle
        cx="7"
        cy="7"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      ></circle>
      <path d="M7 7V3.75A3.25 3.25 0 1 1 3.75 7.00Z" fill="currentColor"></path>
    </svg>
  ),
  "low-priority": (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 14 14" {...props}>
      <rect
        x="1.75"
        y="7.5"
        width="2.5"
        height="4.5"
        rx="0.75"
        fill="currentColor"
        opacity="1"
      ></rect>
      <rect
        x="5.75"
        y="5"
        width="2.5"
        height="7"
        rx="0.75"
        fill="currentColor"
        opacity="0.3"
      ></rect>
      <rect
        x="9.75"
        y="2.5"
        width="2.5"
        height="9.5"
        rx="0.75"
        fill="currentColor"
        opacity="0.3"
      ></rect>
    </svg>
  ),
  "medium-priority": (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 14 14" {...props}>
      <rect
        x="1.75"
        y="7.5"
        width="2.5"
        height="4.5"
        rx="0.75"
        fill="currentColor"
        opacity="1"
      ></rect>
      <rect
        x="5.75"
        y="5"
        width="2.5"
        height="7"
        rx="0.75"
        fill="currentColor"
        opacity="1"
      ></rect>
      <rect
        x="9.75"
        y="2.5"
        width="2.5"
        height="9.5"
        rx="0.75"
        fill="currentColor"
        opacity="0.3"
      ></rect>
    </svg>
  ),
  "no-priority": (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 14 14" {...props}>
      <path
        d="M2.5 7h1.5M6.25 7h1.5M10 7h1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
    </svg>
  ),
  plus: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5l0 14"></path>
      <path d="M5 12l14 0"></path>
    </svg>
  ),
  "resize-corner": (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 10 10" {...props}>
      <path
        d="M8.5 3.5 3.5 8.5M8.5 6.5 6.5 8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  ),
  tag: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
      <path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3"></path>
    </svg>
  ),
  todo: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 14 14" {...props}>
      <circle
        cx="7"
        cy="7"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      ></circle>
    </svg>
  ),
  triangle: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0"></path>
    </svg>
  ),
  urgent: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M12 2l.642 .005l.616 .017l.299 .013l.579 .034l.553 .046c4.687 .455 6.65 2.333 7.166 6.906l.03 .29l.046 .553l.041 .727l.006 .15l.017 .617l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.455 4.687 -2.333 6.65 -6.906 7.166l-.29 .03l-.553 .046l-.727 .041l-.15 .006l-.617 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.687 -.455 -6.65 -2.333 -7.166 -6.906l-.03 -.29l-.046 -.553l-.041 -.727l-.006 -.15l-.017 -.617l-.004 -.318v-.648l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.455 -4.687 2.333 -6.65 6.906 -7.166l.29 -.03l.553 -.046l.727 -.041l.15 -.006l.617 -.017c.21 -.003 .424 -.005 .642 -.005zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"></path>
    </svg>
  ),
};

export type IconName = keyof typeof icons;

interface IconProps extends SVGProps<SVGSVGElement> {
  readonly name: IconName;
  readonly label?: string;
}

export function Icon({ name, label, className = "", ...props }: IconProps) {
  const Shape = icons[name];
  const accessibleLabel = label ?? props["aria-label"];
  const accessible = Boolean(
    accessibleLabel || props["aria-labelledby"] || props.role === "img",
  );
  return (
    <Shape
      {...props}
      className={`kgt-icon ${className}`}
      role={props.role ?? (accessible ? "img" : undefined)}
      aria-label={accessibleLabel}
      aria-hidden={props["aria-hidden"] ?? (accessible ? undefined : true)}
    />
  );
}
