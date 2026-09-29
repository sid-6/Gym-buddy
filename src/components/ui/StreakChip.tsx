import { FlameIcon } from "@/components/icons";
import { Chip } from "@/components/ui/Chip";

type Props = {
  days: number;
  suffix?: string;
};

export function StreakChip({ days, suffix }: Props) {
  return (
    <Chip>
      <FlameIcon className="size-3.5" />
      {days}-day streak{suffix ? ` ${suffix}` : ""}
    </Chip>
  );
}
