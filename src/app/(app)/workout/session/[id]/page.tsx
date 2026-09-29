import { notFound, redirect } from "next/navigation";
import { WorkoutSessionClient } from "@/components/workout/WorkoutSessionClient";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WorkoutSessionPage({ params }: Props) {
  const user = await requireOnboardedUser();
  const { id } = await params;
  const session = await prisma.workoutSession.findFirst({
    where: { id, userId: user.id },
    include: {
      plan: {
        include: { exercises: { include: { exercise: true } } },
      },
      sets: { orderBy: [{ setIndex: "asc" }], include: { exercise: true } },
    },
  });
  if (!session) notFound();
  if (session.status !== "ACTIVE") {
    redirect(routes.workoutHistoryItem(session.id));
  }

  const names: string[] = [];
  for (const set of session.sets) {
    if (!names.includes(set.exerciseId)) names.push(set.exerciseId);
  }
  const groups = names.map((exerciseId) => {
    const sets = session.sets.filter((set) => set.exerciseId === exerciseId);
    const planItem = session.plan?.exercises.find((item) => item.exerciseId === exerciseId);
    return {
      exerciseId,
      name: sets[0]?.exerciseName ?? "Exercise",
      slug: sets[0]?.exercise.slug,
      targetReps: sets[0]?.targetReps ?? planItem?.targetReps ?? sets[0]?.exercise.defaultReps ?? 10,
      sets: sets.map((set) => ({
        id: set.id,
        exerciseId: set.exerciseId,
        exerciseName: set.exerciseName,
        setIndex: set.setIndex,
        reps: set.reps,
        weightKg: set.weightKg,
        skipped: Boolean(set.completedAt && (!set.reps || set.reps <= 0)),
        completedAt: set.completedAt?.toISOString() ?? null,
      })),
    };
  });

  return (
    <WorkoutSessionClient
      sessionId={session.id}
      title={session.name}
      initialElapsed={session.elapsedSec}
      groups={groups}
    />
  );
}
