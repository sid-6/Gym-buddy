import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "h-[52px] w-full rounded-[18px] text-[16px]",
  compact: "h-8 shrink-0 rounded-full px-3.5 text-[13px]",
};

type Base = {
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
};

type NativeButtonProps = Base &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type LinkButtonProps = Base & {
  href: string;
};

export function Button(props: NativeButtonProps | LinkButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 font-semibold text-white transition-colors",
    "bg-brand hover:bg-brand-hover disabled:opacity-50",
    variants[props.variant ?? "primary"],
    props.className,
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={styles}>
        {props.children}
      </Link>
    );
  }

  const native = props as NativeButtonProps;
  const { children, type, disabled, onClick } = native;

  return (
    <button type={type ?? "button"} className={styles} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
