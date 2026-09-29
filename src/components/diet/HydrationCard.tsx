import { addWaterAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function HydrationCard({ glasses }: { glasses: number }) {
  return (
    <Card className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[15px] font-semibold">Hydration</p>
        <p className="text-[13px] text-muted">
          {glasses === 0 ? "Not logged yet" : `${glasses} glasses today`}
        </p>
      </div>
      <form action={addWaterAction}>
        <Button type="submit" variant="compact">
          + Glass
        </Button>
      </form>
    </Card>
  );
}
