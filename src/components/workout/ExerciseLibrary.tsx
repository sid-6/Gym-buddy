"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { routes } from "@/lib/routes";

type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  slug: string;
};

export function ExerciseLibrary({ exercises }: { exercises: Exercise[] }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);

  const groups = ["All", ...[...new Set(exercises.map((item) => item.muscleGroup))]];
  const filtered = useMemo(() => {
    return exercises.filter((item) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.muscleGroup.toLowerCase().includes(q) ||
        item.equipment.toLowerCase().includes(q);
      const matchesGroup = group === "All" || item.muscleGroup === group;
      return matchesQuery && matchesGroup;
    });
  }, [exercises, group, query]);

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  const reviewHref =
    selected.length > 0
      ? `${routes.customReview}?ids=${encodeURIComponent(selected.join(","))}`
      : undefined;

  return (
    <div className="mt-4">
      <TextField
        label="Search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Push-ups, chest, cable..."
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {groups.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setGroup(item)}
            className={`rounded-full px-3 py-1 text-[12px] ${
              group === item ? "bg-brand text-white" : "bg-surface text-muted border border-hairline"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[13px] font-medium text-ink">
        {selected.length} selected · tap a box to select, open a name for form cues
      </p>
      <div className="mt-2 space-y-2">
        {filtered.map((item) => {
          const on = selected.includes(item.id);
          return (
            <Card key={item.id} className="flex items-center gap-3 py-3">
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className={`grid size-6 place-items-center rounded-md border ${
                  on ? "border-brand bg-brand text-white" : "border-hairline"
                }`}
                aria-label={`${on ? "Deselect" : "Select"} ${item.name}`}
                aria-pressed={on}
              >
                {on ? "✓" : ""}
              </button>
              <Link href={routes.exercise(item.slug)} className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold">{item.name}</p>
                <p className="text-[12px] text-muted">
                  {item.muscleGroup} · {item.equipment}
                </p>
              </Link>
            </Card>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <p className="mt-6 text-center text-[14px] text-muted">No exercises match that search.</p>
      ) : null}
      {reviewHref ? (
        <Button className="mt-6 mb-4" href={reviewHref}>
          Review selected ({selected.length})
        </Button>
      ) : (
        <Button className="mt-6 mb-4" disabled>
          Review selected (0)
        </Button>
      )}
    </div>
  );
}
