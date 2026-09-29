import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { goalLabel } from "@/lib/format";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";
import { userPlans } from "@/server/plans";

const WEEKDAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function BeginnerPlansPage() {
  const user = await requireOnboardedUser();
  const plans = await userPlans(user.id);
  const sorted = [...plans].sort(
    (a, b) => WEEKDAY_ORDER.indexOf(a.weekday ?? "") - WEEKDAY_ORDER.indexOf(b.weekday ?? ""),
  );

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="Beginner plans" backHref={routes.home} />
      <Card className="mt-5 space-y-2">
        <p className="text-[16px] font-bold">
          {user.level} {goalLabel(user.goal)} plan
        </p>
        <p className="text-[14px] text-muted">
          This is a weekly rotation from your goal — not a numbered 4-week calendar. Open a day to
          preview, then start when you are ready.
        </p>
      </Card>
      {sorted.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No plan assigned"
            body="Finish goal onboarding so GymBuddy can copy a beginner plan for you."
          />
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {sorted.map((plan) => (
            <Link key={plan.id} href={routes.workoutPlan(plan.id)}>
              <Card className="py-3">
                <p className="text-[12px] font-semibold text-brand">{plan.weekday ?? "Any day"}</p>
                <p className="text-[16px] font-bold">{plan.name}</p>
                <p className="text-[13px] text-muted">
                  {plan.exercises.length} exercises · {plan.durationMin} min · {plan.level}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
