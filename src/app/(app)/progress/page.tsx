import { AskGymBuddyLink } from "@/components/coach/AskGymBuddyLink";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LineChart } from "@/components/ui/LineChart";
import { StatRow } from "@/components/ui/StatRow";
import { PrRow } from "@/components/progress/PrRow";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";
import { dashboardStats, prsFromSessions } from "@/server/stats";

export default async function ProgressPage() {
  const user = await requireOnboardedUser();
  const stats = await dashboardStats(user.id);
  const metrics = await prisma.bodyMetric.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
  });
  const prs = prsFromSessions(stats.sessions);
  const latest = metrics[metrics.length - 1];
  const first = metrics[0];
  const delta =
    latest && first && metrics.length > 1
      ? latest.weightKg - first.weightKg
      : null;
  const avgCal =
    stats.totalWorkouts === 0 ? 0 : Math.round(stats.totalCalories / stats.totalWorkouts);
  const hours = stats.totalSeconds / 3600;
  const timeLabel =
    stats.totalSeconds === 0 ? "0h" : hours < 1 ? `${Math.round(stats.totalSeconds / 60)}m` : `${hours.toFixed(1)}h`;

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar
        title="Progress"
        subtitle="Track your journey over time"
        backHref={routes.profile}
      />
      <Card className="mt-5">
        <p className="text-[13px] text-muted">Body weight</p>
        {latest ? (
          <>
            <p className="mt-1 text-[32px] font-bold leading-none tracking-tight">
              {latest.weightKg} kg
            </p>
            {delta != null ? (
              <p className="mt-1 text-[13px] font-medium text-success">
                {delta > 0 ? "+" : ""}
                {delta.toFixed(1)} kg since first log
              </p>
            ) : (
              <p className="mt-1 text-[13px] text-muted">Log another weigh-in to see change.</p>
            )}
            {metrics.length > 1 ? (
              <LineChart values={metrics.map((item) => item.weightKg)} className="mt-4 h-24 w-full" />
            ) : null}
          </>
        ) : (
          <p className="mt-2 text-[14px] text-muted">
            No weigh-ins yet. Add today&apos;s weight in Edit profile.
          </p>
        )}
      </Card>
      <div className="mt-3">
        <StatRow
          items={[
            { value: String(stats.totalWorkouts), label: "Workouts" },
            { value: timeLabel, label: "Total time" },
            { value: String(avgCal), label: "Avg cal" },
          ]}
        />
      </div>
      <div className="mt-3">
        <AskGymBuddyLink subtitle="Ask about PRs, weigh-ins, or how to improve next session" />
      </div>
      <h2 className="mt-7 text-[22px] font-extrabold">Strength PR’s</h2>
      {prs.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            title="No PRs yet"
            body="Log weighted sets on bench, squat, deadlift, or dumbbell press."
          />
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {prs.map((row) => (
            <PrRow key={row.lift} {...row} />
          ))}
        </div>
      )}
    </div>
  );
}
