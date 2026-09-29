import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  tone?: "brand" | "success" | "wash";
};

export function Chip({ children, className, tone = "brand" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-medium",
        tone === "brand" && "border border-brand/40 bg-surface text-brand",
        tone === "success" && "bg-success-wash text-success",
        tone === "wash" && "bg-brand-wash text-brand",
        className,
      )}
    >
      {children}
    </span>
  );
}
