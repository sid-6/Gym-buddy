import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { TextLink } from "@/components/ui/TextLink";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";
import Link from "next/link";

export default async function HistoryPage() {
  const user = await requireOnboardedUser();
  const sessions = await prisma.workoutSession.findMany({
    where: { userId: user.id, status: "COMPLETED" },
    include: { sets: true },
    orderBy: { startedAt: "desc" },
  });

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="History" backHref={routes.workout} />
      {sessions.length === 0 ? (
        <div className="mt-6">
            <EmptyState
              title="No history yet"
              body="Complete a workout to save it here. You can go Home anytime from the tab bar."
            />
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {sessions.map((item) => (
            <Link key={item.id} href={routes.workoutHistoryItem(item.id)}>
              <Card>
                <p className="text-[16px] font-bold">{item.name}</p>
                <p className="mt-1 text-[13px] text-muted">
                  {item.startedAt.toLocaleString()} · {Math.round(item.elapsedSec / 60)} min ·{" "}
                  {item.caloriesEst} kcal
                </p>
                <p className="mt-1 text-[12px] text-placeholder">
                  {item.sets.filter((set) => set.completedAt && set.reps && set.reps > 0).length} logged
                  {item.sets.some((set) => set.completedAt && (!set.reps || set.reps <= 0))
                    ? ` · ${item.sets.filter((set) => set.completedAt && (!set.reps || set.reps <= 0)).length} skipped`
                    : ""}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <p className="mt-6">
        <TextLink href={routes.home}>Home</TextLink>
      </p>
    </div>
  );
}
