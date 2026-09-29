import { TopBar } from "@/components/layout/TopBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { WorkoutDraftEditor } from "@/components/workout/WorkoutDraftEditor";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

type Props = {
  searchParams: Promise<{ ids?: string }>;
};

export default async function CustomReviewPage({ searchParams }: Props) {
  await requireOnboardedUser();
  const ids = ((await searchParams).ids ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const catalog = await prisma.exercise.findMany({ orderBy: { name: "asc" } });
  const selected = ids
    .map((id) => catalog.find((item) => item.id === id))
    .filter(Boolean) as typeof catalog;

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="Review custom workout" backHref={routes.exercises} />
      <p className="mt-1 text-center text-[12px] font-semibold uppercase tracking-wide text-muted">
        Plan · timer not started
      </p>
      {selected.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No exercises selected"
            body="Go back to the library and select at least one exercise."
          />
        </div>
      ) : (
        <WorkoutDraftEditor
          title="Custom workout"
          startInEdit
          catalog={catalog.map((item) => ({
            id: item.id,
            name: item.name,
            muscleGroup: item.muscleGroup,
            defaultSets: item.defaultSets,
            defaultReps: item.defaultReps,
          }))}
          initialItems={selected.map((item) => ({
            key: item.id,
            exerciseId: item.id,
            name: item.name,
            muscleGroup: item.muscleGroup,
            targetSets: item.defaultSets,
            targetReps: item.defaultReps,
          }))}
        />
      )}
    </div>
  );
}
