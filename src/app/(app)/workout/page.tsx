import Link from "next/link";
import { DumbbellIcon } from "@/components/icons";
import { AskGymBuddyLink } from "@/components/coach/AskGymBuddyLink";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StartPlanButton } from "@/components/workout/StartPlanButton";
import { longDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";
import { userPlans } from "@/server/plans";
import { prisma } from "@/lib/db";

export default async function WorkoutPage() {
  const user = await requireOnboardedUser();
  const plans = await userPlans(user.id);
  const history = await prisma.workoutSession.findMany({
    where: { userId: user.id, status: "COMPLETED" },
    orderBy: { startedAt: "desc" },
    take: 5,
  });
  const active = await prisma.workoutSession.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
  });

  return (
    <div className="px-[var(--space-page)] pt-6">
      <p className="text-[13px] text-muted">{longDate()}</p>
      <h1 className="text-[32px] font-extrabold tracking-tight">Workout</h1>
      {active ? (
        <Card className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold text-brand">Live now</p>
            <p className="text-[16px] font-bold">{active.name}</p>
          </div>
          <Link
            href={routes.workoutSession(active.id)}
            className="inline-flex h-8 shrink-0 items-center rounded-full bg-brand px-3.5 text-[13px] font-semibold text-white"
          >
            Resume
          </Link>
        </Card>
      ) : null}
      <div className="mt-6">
        <SectionHeader title="Your plan" actionLabel="Full plan" actionHref={routes.beginnerPlans} />
        {plans.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No plans yet"
              body="Finish goal onboarding, or start a custom workout from this screen."
            />
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-[14px] bg-brand-wash text-brand">
                  <DumbbellIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-bold text-ink">{plan.name}</p>
                  <p className="text-[13px] text-muted">
                    {plan.weekday ? `${plan.weekday} · ` : ""}
                    {plan.exercises.length} exercises · {plan.durationMin} min
                  </p>
                </div>
                <StartPlanButton planId={plan.id} />
              </Card>
            ))}
          </div>
        )}
      </div>
      <div className="mt-6">
        <AskGymBuddyLink subtitle="Ask what to do first or how to approach today’s session" />
      </div>
      <div className="mt-8">
        <SectionHeader title="Custom workout" actionLabel="Open" actionHref={routes.exercises} />
        <Card className="mt-3">
          <p className="text-[16px] font-bold">Build your own</p>
          <p className="mt-1 text-[13px] text-muted">
            Pick exercises, review sets and reps, then start. The timer does not start in the library.
          </p>
          <Link
            href={routes.exercises}
            className="mt-3 inline-flex h-[52px] w-full items-center justify-center rounded-[18px] bg-brand text-[16px] font-semibold text-white"
          >
            Custom workout
          </Link>
        </Card>
      </div>
      <div className="mt-8">
        <SectionHeader
          title="History"
          actionLabel="See all"
          actionHref={routes.workoutHistory}
        />
        {history.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No workouts yet"
              body="Preview a plan, start the workout, then complete it to save it here."
            />
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {history.map((item) => (
              <Link key={item.id} href={routes.workoutHistoryItem(item.id)}>
                <Card className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-[15px] font-semibold">{item.name}</p>
                    <p className="text-[12px] text-muted">
                      {item.startedAt.toLocaleDateString()} · {Math.round(item.elapsedSec / 60)} min
                    </p>
                  </div>
                  <span className="text-placeholder">›</span>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
