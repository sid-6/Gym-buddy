import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  accent?: boolean;
};

export function Card({ children, className, padding = true, accent = false }: Props) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border bg-surface",
        accent ? "border-brand" : "border-hairline",
        padding && "p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
