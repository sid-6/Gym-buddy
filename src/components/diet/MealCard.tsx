import { Card } from "@/components/ui/Card";
import type { MealType } from "@/types";
import Link from "next/link";

const labels: Record<string, string> = {
  BREAKFAST: "BREAKFAST",
  LUNCH: "LUNCH",
  DINNER: "DINNER",
  SNACK: "SNACK",
};

type Props = {
  type: MealType | string;
  totalKcal: number;
  items: Array<{ id?: string; name: string; kcal: number; href?: string }>;
};

export function MealCard({ type, totalKcal, items }: Props) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] font-bold tracking-wide text-ink">{labels[type] ?? type}</p>
        <p className="text-[16px] font-semibold text-brand">{totalKcal}kcal</p>
      </div>
      <ul className="space-y-2">
        {items.map((item) => {
          const row = (
            <span className="flex w-full items-start justify-between gap-3 text-[15px]">
              <span className="text-ink">{item.name}</span>
              <span className="shrink-0 text-muted">{item.kcal}kcal</span>
            </span>
          );
          return (
            <li key={item.id ?? item.name}>
              {item.href ? <Link href={item.href}>{row}</Link> : row}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
