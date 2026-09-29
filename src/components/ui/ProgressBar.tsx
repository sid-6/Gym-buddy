import { cn } from "@/lib/cn";

type Props = {
  value: number;
  className?: string;
  color?: "brand" | "success" | "water";
};

const colors = {
  brand: "bg-brand",
  success: "bg-success",
  water: "bg-water",
};

export function ProgressBar({ value, className, color = "brand" }: Props) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-[6px] w-full overflow-hidden rounded-full bg-track", className)}>
      <div
        className={cn("h-full rounded-full", colors[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
