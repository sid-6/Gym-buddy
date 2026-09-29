import { CheckIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { SetChip } from "@/components/ui/SetChip";
import type { SetStatus } from "@/types";
import { cn } from "@/lib/cn";

type Props = {
  name: string;
  index?: number;
  complete?: boolean;
  sets: Array<{ label: string; status: SetStatus; onClick?: () => void }>;
  muted?: boolean;
};

export function ExerciseCard({ name, index, complete, sets, muted }: Props) {
  return (
    <Card className={cn(muted && "opacity-70")}>
      <div className="mb-3 flex items-center gap-3">
        {index ? (
          <span className="grid size-8 place-items-center rounded-full bg-navy text-[13px] font-bold text-white">
            {index}
          </span>
        ) : (
          <span className="size-8 rounded-full bg-[#f3e9e4]" />
        )}
        <p className="flex-1 text-[16px] font-medium text-ink">{name}</p>
        {complete ? (
          <span className="grid size-7 place-items-center rounded-full bg-success text-white">
            <CheckIcon className="size-3.5" />
          </span>
        ) : (
          <span className="size-7 rounded-full bg-empty-chip" />
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {sets.map((set, i) => (
          <SetChip
            key={`${name}-${i}`}
            label={set.label}
            status={set.status}
            onClick={set.onClick}
          />
        ))}
      </div>
    </Card>
  );
}
