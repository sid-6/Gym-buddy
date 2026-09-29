import Link from "next/link";
import {
  BoltIcon,
  CalendarIcon,
  DumbbellIcon,
  FlameIcon,
  GearIcon,
} from "@/components/icons";
import { CrowdCard } from "@/components/home/CrowdCard";
import { DietPreviewCard } from "@/components/home/DietPreviewCard";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatRow } from "@/components/ui/StatRow";
import { StreakChip } from "@/components/ui/StreakChip";
import { StartPlanButton } from "@/components/workout/StartPlanButton";
import { prisma } from "@/lib/db";
import {
  goalLabel,
  greeting,
  initials,
  occupancyForHour,
  todayKey,
  weekdayName,
} from "@/lib/format";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";
import { dashboardStats } from "@/server/stats";
import { userPlans } from "@/server/plans";

export default async function HomePage() {
  const user = await requireOnboardedUser();
  const stats = await dashboardStats(user.id);
  const plans = await userPlans(user.id);
  const today = weekdayName();
  const scheduled = plans.find((plan) => plan.weekday === today) ?? null;
  const planToday = scheduled ?? plans[0] ?? null;
  const meals = await prisma.mealLog.findMany({
    where: { userId: user.id, date: todayKey() },
  });
  const consumed = meals.reduce((sum, item) => sum + item.kcal, 0);
  const protein = meals.reduce((sum, item) => sum + item.proteinG, 0);
  const carbs = meals.reduce((sum, item) => sum + item.carbsG, 0);
  const fats = meals.reduce((sum, item) => sum + item.fatG, 0);
  const crowd = occupancyForHour();
  const active = await prisma.workoutSession.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
  });
  const planWhy = planToday
    ? scheduled
      ? `Scheduled for ${today} in your ${user.level} ${goalLabel(user.goal)} plan`
      : `Next in your ${user.level} ${goalLabel(user.goal)} plan`
    : null;

  return (
    <div className="px-[var(--space-page)] pt-6">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-muted">{greeting()}</p>
          <h1 className="text-[32px] font-extrabold leading-none tracking-tight text-ink">
            {user.name.trim().split(/\s+/)[0] || user.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-brand">
            <CalendarIcon className="size-4" />
            {today}
            {active ? ` · ${active.name}` : planToday ? ` · ${planToday.name}` : ""}
          </p>
          {stats.streak > 0 ? (
            <div className="mt-3">
              <StreakChip days={stats.streak} suffix="keep working" />
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={routes.settings}
            aria-label="Settings"
            className="grid size-10 place-items-center rounded-full border border-hairline bg-surface"
          >
            <GearIcon className="size-5" />
          </Link>
          <Link href={routes.profile} aria-label="Profile">
            <Avatar letter={initials(user.name)} />
          </Link>
        </div>
      </header>

      <div className="mt-8">
        <SectionHeader
          title="Today’s workout"
          actionLabel="see plan"
          actionHref={routes.beginnerPlans}
        />
        {active ? (
          <Card className="mt-3 flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-[14px] bg-brand-wash text-brand">
              <DumbbellIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-bold text-ink">{active.name}</p>
              <p className="text-[12px] text-muted">Workout in progress · timer is running</p>
            </div>
            <Link
              href={routes.workoutSession(active.id)}
              className="inline-flex h-8 shrink-0 items-center rounded-full bg-brand px-3.5 text-[13px] font-semibold text-white"
            >
              Resume
            </Link>
          </Card>
        ) : planToday ? (
          <Card className="mt-3 flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-[14px] bg-brand-wash text-brand">
              <DumbbellIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-muted">
                {scheduled ? "Today’s workout" : "Next in your plan"}
              </p>
              <p className="text-[16px] font-bold text-ink">{planToday.name}</p>
              <p className="text-[12px] leading-4 text-muted">{planWhy}</p>
            </div>
            <StartPlanButton planId={planToday.id} />
          </Card>
        ) : (
          <div className="mt-3">
            <EmptyState
              title="No workout planned"
              body="Open Workout to preview a session, or start a custom workout from there."
            />
          </div>
        )}
      </div>

      <div className="mt-4">
        <StatRow
          items={[
            {
              value: String(stats.streak),
              label: "Day streak",
              icon: <FlameIcon className="size-5 text-brand" />,
            },
            {
              value: String(stats.weekWorkouts),
              label: "This week",
              icon: <DumbbellIcon className="size-5 text-brand" />,
            },
            {
              value: String(stats.weekCalories),
              label: "Calories",
              icon: <BoltIcon className="size-5 text-brand" />,
            },
          ]}
        />
      </div>

      <div className="mt-8">
        <SectionHeader title="Features" actionLabel="All" actionHref={routes.guidance} />
        <div className="mt-3">
          <FeatureGrid
            items={[
              {
                href: routes.workout,
                title: "Workout tracking",
                subtitle: "Plans, logging & history",
                icon: "dumbbell",
              },
              {
                href: routes.guidance,
                title: "Exercise guidance",
                subtitle: "How to perform each move",
                icon: "list",
              },
              {
                href: routes.beginnerPlans,
                title: "Beginner plans",
                subtitle: "Your weekly plan by day",
                icon: "book",
              },
              {
                href: routes.formPosture,
                title: "Form & posture",
                subtitle: "Exercise-specific cues",
                icon: "posture",
              },
            ]}
          />
        </div>
      </div>

      <div className="mt-4">
        <CrowdCard level={crowd.level} best={crowd.best} />
      </div>
      <div className="mt-3">
        <DietPreviewCard
          kcal={consumed}
          protein={Math.round(protein)}
          carbs={Math.round(carbs)}
          fats={Math.round(fats)}
          logged={meals.length > 0}
        />
      </div>
    </div>
  );
}
