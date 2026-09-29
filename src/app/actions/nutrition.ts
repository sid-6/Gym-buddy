"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { todayKey } from "@/lib/format";
import { routes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";

const MEALS = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

export async function saveMealAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const mealType = String(formData.get("mealType") ?? "SNACK");
  const kcal = Number(formData.get("kcal") ?? 0);
  const proteinG = Number(formData.get("protein") ?? 0);
  const carbsG = Number(formData.get("carbs") ?? 0);
  const fatG = Number(formData.get("fats") ?? 0);
  const date = String(formData.get("date") ?? todayKey());
  if (!name) return { error: "Enter a meal name." };
  if (!Number.isFinite(kcal) || kcal < 0) return { error: "Enter calories." };
  if (!MEALS.includes(mealType)) return { error: "Choose a meal type." };

  const data = {
    name,
    mealType,
    date,
    kcal: Math.round(kcal),
    proteinG: Number.isFinite(proteinG) ? proteinG : 0,
    carbsG: Number.isFinite(carbsG) ? carbsG : 0,
    fatG: Number.isFinite(fatG) ? fatG : 0,
  };

  if (id) {
    await prisma.mealLog.updateMany({ where: { id, userId: user.id }, data });
  } else {
    await prisma.mealLog.create({ data: { ...data, userId: user.id } });
  }
  revalidatePath(routes.diet);
  revalidatePath(routes.home);
  redirect(routes.diet);
}

export async function deleteMealAction(id: string) {
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  await prisma.mealLog.deleteMany({ where: { id, userId: user.id } });
  revalidatePath(routes.diet);
  revalidatePath(routes.home);
  revalidatePath(routes.profile);
  redirect(routes.diet);
}
