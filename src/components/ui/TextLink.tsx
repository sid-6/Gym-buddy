import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function TextLink({ href, children, className }: Props) {
  return (
    <Link
      href={href}
      className={cn("text-[15px] font-medium text-brand", className)}
    >
      {children}
    </Link>
  );
}
