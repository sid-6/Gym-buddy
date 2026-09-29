import { ClockIcon, PeopleIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { OccupancyLevel } from "@/types";

const levels: Record<OccupancyLevel, number> = {
  Low: 28,
  Moderate: 64,
  High: 86,
};

export function CrowdCard({
  level,
  best,
}: {
  level: OccupancyLevel;
  best: string;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand">
          <PeopleIcon className="size-5" />
          <p className="text-[15px] font-semibold text-ink">Typical gym crowd</p>
        </div>
        <span className="text-[12px] text-muted">Estimate · {level}</span>
      </div>
      <ProgressBar value={levels[level]} className="mt-3 h-[7px]" />
      <p className="mt-2 text-[12px] text-muted">
        Based on time of day, not live gym sensors. {best}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-[12px] text-muted">
        <ClockIcon className="size-3.5 text-brand" />
        Heuristic only
      </p>
    </Card>
  );
}
