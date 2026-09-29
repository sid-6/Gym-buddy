import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function Base({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
      aria-hidden
      {...props}
    />
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 10.8 12 4l8 6.8V20a1 1 0 0 1-1 1h-4.8v-6.2H9.8V21H5a1 1 0 0 1-1-1z" />
    </Base>
  );
}

export function DumbbellIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 9v6M8 8v8M16 8v8M18 9v6M8 12h8M4 10.5v3M20 10.5v3" />
    </Base>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-6", props.className)}
      fill="currentColor"
      aria-hidden
    >
      <path d="M8.5 6.8v10.4L18 12z" />
    </svg>
  );
}

export function AppleIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12.2 7.2c.8-1.6 2.2-2.6 3.4-2.8-.2 1.6-.8 2.8-2 3.8" />
      <path d="M12 8.2c.6 0 1.6-.4 2.8-.4 2.2 0 4.4 1.4 4.4 4.6 0 3.4-2.4 7.6-4.8 7.6-1 0-1.6-.6-2.4-.6s-1.4.6-2.4.6C6.8 20 4.8 16.2 4.8 12.8c0-3 2-4.8 4.2-4.8 1.2 0 2.2.2 3 .2Z" />
    </Base>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19.5c.8-3.4 3.3-5 6.5-5s5.7 1.6 6.5 5" />
    </Base>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6.5 16.5h11l-1.2-2.2V11a4.3 4.3 0 1 0-8.6 0v3.3Z" />
      <path d="M10 16.5a2 2 0 0 0 4 0" />
    </Base>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3.8 18 7.4v9.2L12 20.2 6 16.6V7.4Z" />
      <circle cx="12" cy="12" r="2.7" />
    </Base>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4.5" y="6" width="15" height="14" rx="2.2" />
      <path d="M8 4.5V7.5M16 4.5V7.5M4.5 10.5h15" />
    </Base>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M14.5 6.5 9 12l5.5 5.5" />
    </Base>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9.5 6.5 15 12l-5.5 5.5" />
    </Base>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Base {...props} strokeWidth={2.2}>
      <path d="M12 6v12M6 12h12" />
    </Base>
  );
}

export function OverflowIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8.5V12l2.5 1.8" />
    </Base>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 19c3.2 0 5-2.2 5-5.2 0-3.4-2.6-5.3-4.2-7.8-.3 2.2-1.6 3.2-1.6 3.2S9.4 6.8 9 4.8C7.6 7.2 7 9.6 7 12.2 7 16 9.2 19 12 19Z" />
    </Base>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M13 3 6.5 13h5L11 21l6.5-10h-5Z" />
    </Base>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6.5 12.5 10 16l7.5-8" />
    </Base>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 7h11M8 12h11M8 17h11M4.5 7h.1M4.5 12h.1M4.5 17h.1" />
    </Base>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 6.5A2.5 2.5 0 0 1 8.5 4H19v14.5H8.5A2.5 2.5 0 0 0 6 21Z" />
      <path d="M6 6.5v14.5" />
    </Base>
  );
}

export function RunIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="5.2" r="2.1" />
      <path d="M12 7.6v6.4" />
      <path d="M8.4 11.6 12 10l3.6 1.6" />
      <path d="M9.2 20.4 12 14l2.8 6.4" />
    </Base>
  );
}

export function PostureIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2.8v18.4" opacity={0.35} />
      <circle cx="12" cy="5.4" r="2" />
      <path d="M12 7.6v6.2" />
      <path d="M8.6 11.8 12 10.2l3.4 1.6" />
      <path d="M9.4 20.5 12 13.8l2.6 6.7" />
    </Base>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 16.5V7.8A2.8 2.8 0 0 1 7.8 5h8.4A2.8 2.8 0 0 1 19 7.8v5.4A2.8 2.8 0 0 1 16.2 16H9L5 19.2Z" />
    </Base>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4.5 19.5h15M7 16v-4M12 16V8M17 16v-7" />
    </Base>
  );
}

export function DropletIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 19.5c3 0 5-2.2 5-5.2C17 10.4 12 4.5 12 4.5S7 10.4 7 14.3c0 3 2 5.2 5 5.2Z" />
    </Base>
  );
}

export function PeopleIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="9" cy="8.5" r="2.4" />
      <circle cx="16" cy="9" r="2" />
      <path d="M4.5 18.5c.6-2.8 2.6-4.2 4.8-4.2 2.3 0 4.2 1.4 4.8 4.2M13.5 14.6c1.6-.4 3.4.4 4.2 3.9" />
    </Base>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Base>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 72"
      className={cn("text-navy", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="32" cy="16" r="11" />
      <circle cx="32" cy="16" r="5" />
      <circle cx="32" cy="16" r="1.8" fill="currentColor" stroke="none" />
      <path d="M21 16h-5M43 16h5" />
      <path d="M27 27c2-3 8-4 11 0 2 2.5 1.5 6-1.5 8-3.5 2.4-8.5 1.2-12-1.5" />
      <path d="M24.5 34c-9 3.5-14 16-9 26 4 7 14 9 23 6" />
      <path d="M18 54c8 8 20 10 30 4" />
    </svg>
  );
}
