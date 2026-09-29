"use client";

import { useMemo, useState, useTransition } from "react";
import { startDraftSession } from "@/app/actions/workouts";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";

export type DraftExercise = {
  key: string;
  exerciseId: string;
  name: string;
  muscleGroup: string;
  targetSets: number;
  targetReps: number;
};

export type CatalogExercise = {
  id: string;
  name: string;
  muscleGroup: string;
  defaultSets: number;
  defaultReps: number;
};

type Props = {
  title: string;
  planId?: string;
  weekday?: string | null;
  level?: string;
  durationMin?: number;
  initialItems: DraftExercise[];
  catalog: CatalogExercise[];
  startInEdit?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function WorkoutDraftEditor({
  title,
  planId,
  weekday,
  level,
  durationMin,
  initialItems,
  catalog,
  startInEdit = false,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState(startInEdit);
  const [picker, setPicker] = useState<{ mode: "add" | "replace"; key?: string } | null>(null);
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();

  const muscles = [...new Set(items.map((item) => item.muscleGroup))];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter(
      (item) =>
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.muscleGroup.toLowerCase().includes(q),
    );
  }, [catalog, query]);

  function update(key: string, patch: Partial<DraftExercise>) {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }

  function pick(exercise: CatalogExercise) {
    if (!picker) return;
    if (picker.mode === "add") {
      setItems((current) => [
        ...current,
        {
          key: `${exercise.id}-${Date.now()}`,
          exerciseId: exercise.id,
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          targetSets: exercise.defaultSets,
          targetReps: exercise.defaultReps,
        },
      ]);
    } else if (picker.key) {
      update(picker.key, {
        exerciseId: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
      });
    }
    setPicker(null);
    setQuery("");
  }

  function start() {
    startTransition(() => {
      void startDraftSession({
        name: title,
        planId,
        items: items.map((item) => ({
          exerciseId: item.exerciseId,
          targetSets: item.targetSets,
          targetReps: item.targetReps,
        })),
      });
    });
  }

  return (
    <>
      <Card className="mt-5 space-y-2">
        <h1 className="text-[22px] font-extrabold tracking-tight">{title}</h1>
        <p className="text-[14px] text-muted">
          {muscles.join(", ") || "No muscles yet"} · {items.length} exercises
          {durationMin ? ` · ${durationMin} min` : ""}
          {level ? ` · ${level}` : ""}
        </p>
        {weekday ? (
          <p className="text-[13px] text-muted">Scheduled for {weekday} in your {level} plan.</p>
        ) : null}
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[18px] font-bold">Exercises</h2>
        {!editing ? (
          <button
            type="button"
            className="text-[14px] font-semibold text-brand"
            onClick={() => setEditing(true)}
          >
            Customize
          </button>
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <Card key={item.key} className="overflow-hidden py-3">
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy text-[13px] font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold">{item.name}</p>
                <p className="text-[12px] text-muted">
                  {item.targetSets} sets · {item.targetReps} reps · {item.muscleGroup}
                </p>
                {editing ? (
                  <div className="mt-3 min-w-0 space-y-2">
                    <div className="grid min-w-0 grid-cols-2 gap-2">
                      <Stepper
                        label="Sets"
                        value={item.targetSets}
                        onChange={(value) => update(item.key, { targetSets: clamp(value, 1, 8) })}
                      />
                      <Stepper
                        label="Reps"
                        value={item.targetReps}
                        onChange={(value) => update(item.key, { targetReps: clamp(value, 1, 60) })}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="min-h-11 text-[14px] font-semibold text-brand"
                        onClick={() => setPicker({ mode: "replace", key: item.key })}
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        className="min-h-11 text-[14px] font-medium text-muted"
                        onClick={() => setItems((current) => current.filter((row) => row.key !== item.key))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {editing ? (
        <button
          type="button"
          className="mt-3 h-[52px] w-full rounded-[18px] border border-hairline bg-surface text-[16px] font-semibold text-ink"
          onClick={() => setPicker({ mode: "add" })}
        >
          Add exercise
        </button>
      ) : null}

      <Button className="mt-6" disabled={items.length === 0} onClick={start}>
        Start workout
      </Button>
      <p className="mb-8 mt-2 text-center text-[12px] text-muted">
        The timer and set logging begin only after you start.
      </p>

      {picker ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/30 p-4">
          <Card className="mb-8 max-h-[70vh] w-full max-w-phone overflow-y-auto">
            <p className="text-[16px] font-bold">
              {picker.mode === "add" ? "Add exercise" : "Replace exercise"}
            </p>
            <div className="mt-3">
              <TextField
                label="Search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name or muscle"
              />
            </div>
            <div className="mt-3 space-y-2">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex min-h-12 w-full items-center justify-between rounded-[14px] border border-hairline px-3 py-3 text-left"
                  onClick={() => pick(item)}
                >
                  <span className="text-[15px] font-semibold">{item.name}</span>
                  <span className="text-[12px] text-muted">{item.muscleGroup}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full py-3 text-[15px] text-muted"
              onClick={() => {
                setPicker(null);
                setQuery("");
              }}
            >
              Cancel
            </button>
          </Card>
        </div>
      ) : null}
    </>
  );
}

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1 rounded-[14px] border border-hairline py-1 pl-2 pr-1">
      <span className="shrink-0 text-[11px] text-muted">{label}</span>
      <div className="ml-auto flex min-w-0 items-center">
        <button
          type="button"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f7f4f1] text-[16px] font-semibold"
          onClick={() => onChange(value - 1)}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="w-5 shrink-0 text-center text-[14px] font-bold">{value}</span>
        <button
          type="button"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f7f4f1] text-[16px] font-semibold"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
