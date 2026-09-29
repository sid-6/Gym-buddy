import Link from "next/link";
import { AppleIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { routes } from "@/lib/routes";

type Props = {
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
  logged: boolean;
};

export function DietPreviewCard({ kcal, protein, carbs, fats, logged }: Props) {
  return (
    <Link href={routes.diet}>
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand">
            <AppleIcon className="size-5" />
            <p className="text-[15px] font-semibold text-ink">Diet today</p>
          </div>
          <p className="text-[22px] font-bold text-ink">{logged ? kcal.toLocaleString() : "—"}</p>
        </div>
        {logged ? (
          <div className="grid grid-cols-3 text-center">
            <Macro value={`${protein}g`} label="protein" />
            <Macro value={`${carbs}g`} label="Carbs" />
            <Macro value={`${fats}g`} label="Fats" />
          </div>
        ) : (
          <p className="text-[13px] text-muted">Not logged yet. Tap to add a meal.</p>
        )}
      </Card>
    </Link>
  );
}

function Macro({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-[16px] font-semibold text-ink">{value}</p>
      <p className="text-[12px] text-muted">{label}</p>
    </div>
  );
}
