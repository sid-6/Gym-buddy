import { TopBar } from "@/components/layout/TopBar";
import { ExerciseLibrary } from "@/components/workout/ExerciseLibrary";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

export default async function ExercisesPage() {
  await requireOnboardedUser();
  const exercises = await prisma.exercise.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="Custom workout" backHref={routes.workout} />
      <p className="mt-2 text-[13px] text-muted">
        Select exercises, then review them. The timer starts only after you confirm Start workout.
      </p>
      <ExerciseLibrary
        exercises={exercises.map((item) => ({
          id: item.id,
          name: item.name,
          muscleGroup: item.muscleGroup,
          equipment: item.equipment,
          slug: item.slug,
        }))}
      />
    </div>
  );
}
