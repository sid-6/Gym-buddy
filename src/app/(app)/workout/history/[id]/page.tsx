import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { TextLink } from "@/components/ui/TextLink";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function HistoryItemPage({ params }: Props) {
  const user = await requireOnboardedUser();
  const { id } = await params;
  const session = await prisma.workoutSession.findFirst({
    where: { id, userId: user.id },
    include: { sets: { orderBy: { setIndex: "asc" } } },
  });
  if (!session) notFound();

  const groups = [...new Set(session.sets.map((set) => set.exerciseName))];
  const logged = session.sets.filter((set) => set.completedAt && set.reps && set.reps > 0).length;
  const skipped = session.sets.filter((set) => set.completedAt && (!set.reps || set.reps <= 0)).length;

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="Workout summary" backHref={routes.workout} />
      <h1 className="mt-4 text-[22px] font-extrabold">{session.name}</h1>
      <p className="mt-1 text-[13px] text-muted">
        {session.startedAt.toLocaleString()} · {Math.round(session.elapsedSec / 60)} min ·{" "}
        {session.caloriesEst} kcal · {logged} sets logged
        {skipped ? ` · ${skipped} skipped` : ""}
      </p>
      <div className="mt-4 space-y-3">
        {groups.map((name) => {
          const sets = session.sets.filter((set) => set.exerciseName === name);
          return (
            <Card key={name}>
              <p className="text-[15px] font-bold">{name}</p>
              <ul className="mt-2 space-y-1 text-[13px] text-muted">
                {sets.map((set) => (
                  <li key={set.id}>
                    Set {set.setIndex + 1}:{" "}
                    {set.completedAt
                      ? set.reps && set.reps > 0
                        ? `${set.reps} reps${set.weightKg != null ? ` × ${set.weightKg} kg` : ""}`
                        : "skipped"
                      : "not logged"}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
      <p className="mt-6 flex gap-4">
        <TextLink href={routes.workoutHistory}>All history</TextLink>
        <TextLink href={routes.home}>Home</TextLink>
      </p>
    </div>
  );
}
