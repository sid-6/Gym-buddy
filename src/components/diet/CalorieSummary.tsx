import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

type Props = {
  consumed: number;
  goal: number;
  remaining: number;
};

export function CalorieSummary({ consumed, goal, remaining }: Props) {
  const pct = (consumed / goal) * 100;

  return (
    <Card>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[32px] font-bold leading-none tracking-tight text-ink">
            {consumed === 0 ? "—" : consumed.toLocaleString()}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            {consumed === 0 ? "Not logged yet" : `of ${goal.toLocaleString()} kcal goal`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[22px] font-bold leading-none text-success">
            {consumed === 0 ? goal.toLocaleString() : remaining}
          </p>
          <p className="mt-1 text-[13px] text-muted">{consumed === 0 ? "kcal goal" : "remaining"}</p>
        </div>
      </div>
      <ProgressBar value={pct} className="mt-4 h-2" />
    </Card>
  );
}
