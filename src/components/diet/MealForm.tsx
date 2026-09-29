"use client";

import { useMemo, useState } from "react";
import { saveMealAction } from "@/app/actions/nutrition";
import { ActionForm } from "@/components/forms/ActionForm";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { foodCatalog } from "@/lib/food-catalog";

type Props = {
  date: string;
  meal?: {
    id: string;
    name: string;
    mealType: string;
    kcal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    date: string;
  };
};

export function MealForm({ meal, date }: Props) {
  const [name, setName] = useState(meal?.name ?? "");
  const [kcal, setKcal] = useState(meal ? String(meal.kcal) : "");
  const [protein, setProtein] = useState(meal ? String(meal.proteinG) : "");
  const [carbs, setCarbs] = useState(meal ? String(meal.carbsG) : "");
  const [fats, setFats] = useState(meal ? String(meal.fatG) : "");
  const [mealType, setMealType] = useState(meal?.mealType ?? "BREAKFAST");

  const matches = useMemo(() => {
    const q = name.trim().toLowerCase();
    if (q.length < 2) return [];
    return foodCatalog.filter((item) => item.name.toLowerCase().includes(q)).slice(0, 5);
  }, [name]);

  return (
    <ActionForm action={saveMealAction} className="mt-6 flex flex-col gap-4">
      {meal ? <input type="hidden" name="id" value={meal.id} /> : null}
      <input type="hidden" name="date" value={meal?.date ?? date} />
      <label className="flex flex-col gap-2">
        <span className="text-[15px] font-medium text-ink">Meal</span>
        <select
          name="mealType"
          value={mealType}
          onChange={(event) => setMealType(event.target.value)}
          className="h-[52px] rounded-[14px] border border-hairline bg-surface px-4 text-[15px]"
        >
          <option value="BREAKFAST">Breakfast</option>
          <option value="LUNCH">Lunch</option>
          <option value="DINNER">Dinner</option>
          <option value="SNACK">Snack</option>
        </select>
      </label>
      <TextField
        label="Meal name"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Oats with banana"
      />
      {matches.length > 0 ? (
        <div className="rounded-[14px] border border-hairline bg-surface">
          {matches.map((item) => (
            <button
              key={item.name}
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left text-[14px]"
              onClick={() => {
                setName(item.name);
                setKcal(String(item.kcal));
                setProtein(String(item.protein));
                setCarbs(String(item.carbs));
                setFats(String(item.fats));
              }}
            >
              <span>{item.name}</span>
              <span className="text-muted">{item.kcal}kcal</span>
            </button>
          ))}
        </div>
      ) : null}
      <TextField
        label="Calories"
        name="kcal"
        inputMode="numeric"
        value={kcal}
        onChange={(event) => setKcal(event.target.value)}
        placeholder="340"
      />
      <TextField
        label="Protein (g)"
        name="protein"
        inputMode="decimal"
        value={protein}
        onChange={(event) => setProtein(event.target.value)}
        placeholder="12"
      />
      <TextField
        label="Carbs (g)"
        name="carbs"
        inputMode="decimal"
        value={carbs}
        onChange={(event) => setCarbs(event.target.value)}
        placeholder="40"
      />
      <TextField
        label="Fats (g)"
        name="fats"
        inputMode="decimal"
        value={fats}
        onChange={(event) => setFats(event.target.value)}
        placeholder="8"
      />
      <Button type="submit" className="mb-4">
        {meal ? "Save changes" : "Save meal"}
      </Button>
    </ActionForm>
  );
}
