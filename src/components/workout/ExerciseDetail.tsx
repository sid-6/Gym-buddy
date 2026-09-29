import { Card } from "@/components/ui/Card";

type Exercise = {
  name: string;
  muscleGroup: string;
  equipment: string;
  guidance: string;
  defaultSets: number;
  defaultReps: number;
};

export function ExerciseDetail({ exercise }: { exercise: Exercise }) {
  const sentences = exercise.guidance
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const howTo = sentences.slice(0, 2).join(" ") || exercise.guidance;
  const cues = sentences.slice(2);
  const timed = exercise.muscleGroup === "Core" || exercise.muscleGroup === "Mobility";

  return (
    <div className="space-y-3">
      <div
        className="grid h-40 place-items-center rounded-[var(--radius-card)] border border-dashed border-hairline bg-surface px-6 text-center"
        role="img"
        aria-label={`${exercise.name} demonstration placeholder`}
      >
        <div>
          <p className="text-[14px] font-semibold text-ink">Exercise demo</p>
          <p className="mt-1 text-[12px] text-muted">
            Media will appear here. Use the written cues below for now.
          </p>
        </div>
      </div>
      <Card className="space-y-3">
        <p className="text-[13px] text-muted">
          {exercise.muscleGroup} · {exercise.equipment}
        </p>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">How to perform</p>
          <p className="mt-1 text-[15px] leading-6 text-ink">{howTo}</p>
        </div>
        {cues.length > 0 ? (
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">Key form cues</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-[15px] leading-6 text-ink">
              {cues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="text-[13px] text-muted">
          Suggested: {exercise.defaultSets} sets × {exercise.defaultReps} {timed ? "seconds / reps" : "reps"}
        </p>
      </Card>
    </div>
  );
}
