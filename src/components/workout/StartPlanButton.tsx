import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

export function StartPlanButton({ planId }: { planId: string }) {
  return (
    <Button variant="compact" href={routes.workoutPlan(planId)}>
      Preview
    </Button>
  );
}
