"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppleIcon, ChatIcon, DumbbellIcon, HomeIcon, PersonIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

const tabs = [
  { href: routes.home, label: "Home", icon: HomeIcon, match: ["/home"] },
  {
    href: routes.workout,
    label: "Workout",
    icon: DumbbellIcon,
    match: ["/workout"],
  },
  {
    href: routes.diet,
    label: "Diet",
    icon: AppleIcon,
    match: ["/diet"],
  },
  {
    href: routes.profile,
    label: "Profile",
    icon: PersonIcon,
    match: ["/profile", "/progress", "/settings"],
  },
] as const;

export function TabBar() {
  const pathname = usePathname();
  const hide =
    pathname.startsWith("/workout/session") ||
    pathname.startsWith("/workout/plan") ||
    pathname.startsWith("/workout/custom") ||
    pathname.startsWith("/workout/exercises");

  if (hide) return null;

  const coachActive = pathname === "/coach" || pathname.startsWith("/coach/");

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto relative w-full max-w-[398px]">
        <nav
          className="grid h-[70px] grid-cols-5 items-end rounded-[36px] bg-tabbar px-1 pb-2 pt-1 shadow-(--shadow-tab)"
          aria-label="Primary"
        >
          <TabItem {...tabs[0]} pathname={pathname} />
          <TabItem {...tabs[1]} pathname={pathname} />
          <span aria-hidden className="block" />
          <TabItem {...tabs[2]} pathname={pathname} />
          <TabItem {...tabs[3]} pathname={pathname} />
        </nav>
        <Link
          href={routes.coach}
          aria-label="Ask GymBuddy"
          className="absolute left-1/2 top-0 z-10 flex w-[72px] -translate-x-1/2 -translate-y-[32px] flex-col items-center"
        >
          <span className="grid size-[56px] place-items-center rounded-full bg-brand text-white shadow-(--shadow-fab)">
            <ChatIcon className="size-6" />
          </span>
          <span
            className={cn(
              "mt-1 text-center text-[10px] font-medium leading-[1.15]",
              coachActive ? "text-brand" : "text-ink",
            )}
          >
            Ask
            <br />
            GymBuddy
          </span>
        </Link>
      </div>
    </div>
  );
}

function TabItem({
  href,
  label,
  icon: Icon,
  match,
  pathname,
}: {
  href: string;
  label: string;
  icon: typeof HomeIcon;
  match: readonly string[];
  pathname: string;
}) {
  const active = match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-0.5 pb-1 text-[11px]",
        active ? "text-brand" : "text-ink",
      )}
    >
      <Icon className="size-[22px]" />
      {label}
    </Link>
  );
}
