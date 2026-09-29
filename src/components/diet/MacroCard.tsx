import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type Props = {
  consumed: number;
  goal: number;
  label: string;
  barClassName?: string;
};

export function MacroCard({ consumed, goal, label, barClassName }: Props) {
  const pct = (consumed / goal) * 100;

  return (
    <Card className="px-2 py-3">
      <p className="text-center text-[15px] font-bold text-ink">
        {consumed === 0 ? "Not logged" : `${consumed}g`}
        <span className="font-medium text-placeholder"> / {goal}g</span>
      </p>
      <p className="mt-1 text-center text-[12px] text-muted">{label}</p>
      <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-track">
        <div
          className={cn("h-full rounded-full", barClassName ?? "bg-brand")}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </Card>
  );
}
