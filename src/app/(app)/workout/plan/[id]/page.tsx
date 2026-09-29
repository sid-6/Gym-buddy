import { notFound } from "next/navigation";
import { WorkoutDraftEditor } from "@/components/workout/WorkoutDraftEditor";
import { TopBar } from "@/components/layout/TopBar";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";
import { planById } from "@/server/plans";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WorkoutPlanPreviewPage({ params }: Props) {
  const user = await requireOnboardedUser();
  const { id } = await params;
  const plan = await planById(user.id, id);
  if (!plan) notFound();
  const catalog = await prisma.exercise.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="Workout preview" backHref={routes.workout} />
      <p className="mt-1 text-center text-[12px] font-semibold uppercase tracking-wide text-muted">
        Plan · timer not started
      </p>
      <WorkoutDraftEditor
        title={plan.name}
        planId={plan.id}
        weekday={plan.weekday}
        level={plan.level}
        durationMin={plan.durationMin}
        catalog={catalog.map((item) => ({
          id: item.id,
          name: item.name,
          muscleGroup: item.muscleGroup,
          defaultSets: item.defaultSets,
          defaultReps: item.defaultReps,
        }))}
        initialItems={plan.exercises.map((item) => ({
          key: item.id,
          exerciseId: item.exerciseId,
          name: item.exercise.name,
          muscleGroup: item.exercise.muscleGroup,
          targetSets: item.targetSets,
          targetReps: item.targetReps,
        }))}
      />
    </div>
  );
}
