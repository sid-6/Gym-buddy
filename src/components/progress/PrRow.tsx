import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

type Props = {
  lift: string;
  weight: string;
  delta: string;
};

export function PrRow({ lift, weight, delta }: Props) {
  return (
    <Card className="flex items-center gap-3 py-3">
      <p className="flex-1 text-[15px] font-semibold text-ink">{lift}</p>
      <p className="text-[15px] text-muted">{weight}</p>
      <Chip tone="success">{delta}</Chip>
    </Card>
  );
}
