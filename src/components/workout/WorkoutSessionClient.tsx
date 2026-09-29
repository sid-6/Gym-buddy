"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ClockIcon } from "@/components/icons";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TextField } from "@/components/ui/TextField";
import {
  abandonSessionAction,
  completeSessionAction,
  saveSetAction,
  skipSetAction,
  tickSessionAction,
} from "@/app/actions/workouts";
import { formatElapsed } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type SetRow = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setIndex: number;
  reps: number | null;
  weightKg: number | null;
  skipped?: boolean;
  completedAt: string | null;
};

type ExerciseGroup = {
  exerciseId: string;
  name: string;
  slug?: string;
  targetReps: number;
  sets: SetRow[];
};

type Props = {
  sessionId: string;
  title: string;
  initialElapsed: number;
  groups: ExerciseGroup[];
};

export function WorkoutSessionClient({
  sessionId,
  title,
  initialElapsed,
  groups,
}: Props) {
  const [rows, setRows] = useState(groups);
  const [elapsed, setElapsed] = useState(initialElapsed);
  const [paused, setPaused] = useState(false);
  const [restLeft, setRestLeft] = useState<number | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, { reps: string; weight: string }>>({});
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    if (paused) return;
    const sync = window.setInterval(() => {
      startTransition(() => {
        void tickSessionAction(sessionId, elapsed);
      });
    }, 10000);
    return () => window.clearInterval(sync);
  }, [elapsed, paused, sessionId, startTransition]);

  useEffect(() => {
    if (restLeft === null || paused) return;
    const timer = window.setTimeout(() => {
      setRestLeft((value) => (value === null || value <= 1 ? null : value - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [paused, restLeft]);

  const totals = useMemo(() => {
    const total = rows.reduce((sum, group) => sum + group.sets.length, 0);
    const loggedSets = rows.reduce(
      (sum, group) =>
        sum + group.sets.filter((set) => set.completedAt && set.reps && set.reps > 0).length,
      0,
    );
    const skippedSets = rows.reduce(
      (sum, group) => sum + group.sets.filter((set) => set.skipped || (set.completedAt && !set.reps)).length,
      0,
    );
    const resolved = rows.reduce(
      (sum, group) => sum + group.sets.filter((set) => set.completedAt).length,
      0,
    );
    const doneGroups = rows.filter((group) => group.sets.every((set) => set.completedAt)).length;
    return {
      total,
      loggedSets,
      skippedSets,
      doneGroups,
      pct: total === 0 ? 0 : Math.round((resolved / total) * 100),
    };
  }, [rows]);

  function draftFor(group: ExerciseGroup, set: SetRow) {
    return (
      drafts[set.id] ?? {
        reps: String(set.reps ?? group.targetReps),
        weight: set.weightKg != null ? String(set.weightKg) : "",
      }
    );
  }

  function completeSet(group: ExerciseGroup, set: SetRow) {
    const draft = draftFor(group, set);
    const reps = Number(draft.reps);
    const weight = draft.weight === "" ? null : Number(draft.weight);
    if (!Number.isFinite(reps) || reps <= 0) return;
    const weightKg = weight != null && Number.isFinite(weight) ? weight : null;
    startTransition(async () => {
      await saveSetAction({ setId: set.id, reps, weightKg });
      setRows((current) =>
        current.map((item) =>
          item.exerciseId !== group.exerciseId
            ? item
            : {
                ...item,
                sets: item.sets.map((row) =>
                  row.id === set.id
                    ? { ...row, reps, weightKg, completedAt: new Date().toISOString() }
                    : row,
                ),
              },
        ),
      );
      setRestLeft(90);
    });
  }

  function skipSet(group: ExerciseGroup, set: SetRow) {
    startTransition(async () => {
      await skipSetAction(set.id);
      setRows((current) =>
        current.map((item) =>
          item.exerciseId !== group.exerciseId
            ? item
            : {
                ...item,
                sets: item.sets.map((row) =>
                  row.id === set.id
                    ? { ...row, reps: 0, weightKg: null, skipped: true, completedAt: new Date().toISOString() }
                    : row,
                ),
              },
        ),
      );
      setRestLeft(90);
    });
  }

  function pauseToggle() {
    const next = !paused;
    setPaused(next);
    if (next) {
      startTransition(() => {
        void tickSessionAction(sessionId, elapsed);
      });
    }
  }

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title={title} backHref={routes.workout} />
      <p className="mt-1 text-center text-[12px] font-semibold uppercase tracking-wide text-brand">
        Live workout
      </p>
      <div className="mt-3 flex items-center justify-between text-[13px] text-muted">
        <span>
          {totals.doneGroups} of {rows.length} exercises · {totals.loggedSets} logged
          {totals.skippedSets ? ` · ${totals.skippedSets} skipped` : ""}
        </span>
        <span>{totals.pct}%</span>
      </div>
      <ProgressBar value={totals.pct} className="mt-2 h-[5px]" />
      <Card className="mt-4 py-3">
        <div className="flex items-end justify-between gap-3">
          <div className="flex items-end gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-[#f4f1ee] text-muted">
              <ClockIcon className="size-5" />
            </span>
            <div>
              <p className="text-[12px] text-muted">{paused ? "Paused" : "Workout time"}</p>
              <p className="text-[30px] font-bold leading-none tracking-tight">
                {formatElapsed(elapsed)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={pauseToggle}
            className="rounded-full border border-hairline bg-surface px-3 py-1.5 text-[13px] font-semibold text-ink"
          >
            {paused ? "Resume workout" : "Pause workout"}
          </button>
        </div>
        {restLeft != null ? (
          <div className="mt-3 rounded-[14px] bg-brand-wash px-3 py-3">
            <p className="text-[14px] font-semibold text-ink">Rest remaining: {restLeft}s</p>
            <p className="mt-0.5 text-[12px] text-muted">
              Recovery after your last set. Rest, then log or skip the next set.
            </p>
            <button
              type="button"
              className="mt-2 min-h-11 text-[14px] font-semibold text-brand"
              onClick={() => setRestLeft(null)}
            >
              End rest · next set
            </button>
          </div>
        ) : null}
      </Card>

      <h2 className="mt-6 text-[22px] font-extrabold">Log your sets</h2>
      <p className="mt-1 text-[13px] text-muted">Enter what you actually did, then tap Complete set.</p>
      <div className="mt-3 space-y-3">
        {rows.map((group, index) => {
          const complete = group.sets.every((set) => set.completedAt);
          return (
            <Card key={group.exerciseId} className={cn(complete && "border-success/30")}>
              <div className="mb-3 flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-navy text-[13px] font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-medium text-ink">{group.name}</p>
                  {group.slug ? (
                    <Link href={routes.exercise(group.slug)} className="text-[12px] font-medium text-brand">
                      Form cues
                    </Link>
                  ) : null}
                </div>
              </div>
              <div className="space-y-3">
                {group.sets.map((set) => {
                  const draft = draftFor(group, set);
                  const done = Boolean(set.completedAt);
                  return (
                    <div
                      key={set.id}
                      className={cn(
                        "rounded-[14px] px-3 py-3",
                        done && !(set.skipped || !set.reps) ? "bg-success-soft" : done ? "bg-[#eeeae6]" : "bg-[#f7f4f1]",
                      )}
                    >
                      <p className="text-[13px] font-bold text-ink">Set {set.setIndex + 1}</p>
                      <p className="mt-0.5 text-[12px] text-muted">Target: {group.targetReps} reps</p>
                      {done && (set.skipped || !set.reps) ? (
                        <p className="mt-1 text-[14px] font-semibold text-muted">Skipped</p>
                      ) : done ? (
                        <p className="mt-1 text-[14px] font-semibold text-success">
                          Logged: {set.reps} reps
                          {set.weightKg != null ? ` × ${set.weightKg} kg` : ""} · complete
                        </p>
                      ) : (
                        <div className="mt-2 space-y-2">
                          <TextField
                            label="Reps"
                            inputMode="numeric"
                            value={draft.reps}
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [set.id]: { ...draft, reps: event.target.value },
                              }))
                            }
                          />
                          <TextField
                            label="Weight (kg, optional)"
                            inputMode="decimal"
                            value={draft.weight}
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [set.id]: { ...draft, weight: event.target.value },
                              }))
                            }
                          />
                          <div className="flex gap-2">
                            <Button className="flex-1" onClick={() => completeSet(group, set)}>
                              Complete set
                            </Button>
                            <button
                              type="button"
                              className="h-[52px] min-w-[108px] rounded-[18px] border border-hairline bg-surface px-3 text-[15px] font-semibold text-ink"
                              onClick={() => skipSet(group, set)}
                            >
                              Skip set
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <Button className="mt-6" onClick={() => completeSessionAction(sessionId, elapsed)}>
        Complete workout
      </Button>
      <p className="mt-2 text-center text-[12px] text-muted">
        Saves this session, your logged sets, and time to History.
      </p>
      <button
        type="button"
        className="mt-3 mb-4 w-full text-center text-[14px] font-medium text-muted"
        onClick={() => setConfirmEnd(true)}
      >
        End without saving
      </button>

      {confirmEnd ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/30 p-4">
          <Card className="mb-8 w-full max-w-phone space-y-3">
            <p className="text-[16px] font-bold">End workout?</p>
            <p className="text-[14px] text-muted">This session will not be saved.</p>
            <Button onClick={() => setConfirmEnd(false)}>Continue workout</Button>
            <button
              type="button"
              className="w-full py-2 text-[15px] font-medium text-muted"
              onClick={() => abandonSessionAction(sessionId)}
            >
              End without saving
            </button>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
