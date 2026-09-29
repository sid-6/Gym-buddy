import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  href?: string;
  "aria-label": string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tone?: "default" | "brand";
};

export function IconButton({
  href,
  children,
  className,
  onClick,
  tone = "default",
  ...rest
}: Props) {
  const styles = cn(
    "grid size-10 place-items-center",
    tone === "default" &&
      "rounded-full border border-hairline bg-surface text-ink shadow-(--shadow-card)",
    tone === "brand" && "rounded-[14px] bg-brand text-white shadow-(--shadow-fab)",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles} aria-label={rest["aria-label"]}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={styles} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
