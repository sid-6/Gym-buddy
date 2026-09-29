import { MealForm } from "@/components/diet/MealForm";
import { TopBar } from "@/components/layout/TopBar";
import { todayKey } from "@/lib/format";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

export default async function AddMealPage() {
  await requireOnboardedUser();
  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="Add meal" backHref={routes.diet} />
      <MealForm date={todayKey()} />
    </div>
  );
}
