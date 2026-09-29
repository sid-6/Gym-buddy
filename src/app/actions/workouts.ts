"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { estimateCalories } from "@/lib/format";
import { routes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";

export async function startDraftSession(input: {
  name: string;
  planId?: string;
  items: Array<{ exerciseId: string; targetSets: number; targetReps: number }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  if (input.items.length === 0) return { error: "Add at least one exercise." };

  const ids = input.items.map((item) => item.exerciseId);
  const exercises = await prisma.exercise.findMany({ where: { id: { in: ids } } });
  const items = input.items
    .map((item) => {
      const exercise = exercises.find((row) => row.id === item.exerciseId);
      if (!exercise) return null;
      const targetSets = Math.min(8, Math.max(1, Math.round(item.targetSets) || 1));
      const targetReps = Math.min(60, Math.max(1, Math.round(item.targetReps) || 1));
      return { exercise, targetSets, targetReps };
    })
    .filter(Boolean) as Array<{
    exercise: (typeof exercises)[number];
    targetSets: number;
    targetReps: number;
  }>;
  if (items.length === 0) return { error: "Add at least one exercise." };

  await prisma.workoutSession.updateMany({
    where: { userId: user.id, status: "ACTIVE" },
    data: { status: "ABANDONED", endedAt: new Date() },
  });

  const session = await prisma.workoutSession.create({
    data: {
      userId: user.id,
      planId: input.planId,
      name: input.name,
      status: "ACTIVE",
      sets: {
        create: items.flatMap(({ exercise, targetSets, targetReps }) =>
          Array.from({ length: targetSets }, (_, index) => ({
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            setIndex: index,
            targetReps,
          })),
        ),
      },
    },
  });
  redirect(routes.workoutSession(session.id));
}

export async function startPlanSession(planId: string) {
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  const plan = await prisma.workoutPlan.findFirst({
    where: { id: planId, userId: user.id },
    include: { exercises: { include: { exercise: true }, orderBy: { sortOrder: "asc" } } },
  });
  if (!plan) return { error: "Plan not found." };
  return startDraftSession({
    name: plan.name,
    planId: plan.id,
    items: plan.exercises.map((item) => ({
      exerciseId: item.exerciseId,
      targetSets: item.targetSets,
      targetReps: item.targetReps,
    })),
  });
}

export async function startCustomSession(exerciseIds: string[]) {
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  if (exerciseIds.length === 0) return { error: "Select at least one exercise." };
  const exercises = await prisma.exercise.findMany({ where: { id: { in: exerciseIds } } });
  const ordered = exerciseIds
    .map((id) => exercises.find((item) => item.id === id))
    .filter(Boolean) as typeof exercises;
  return startDraftSession({
    name: "Custom workout",
    items: ordered.map((exercise) => ({
      exerciseId: exercise.id,
      targetSets: exercise.defaultSets,
      targetReps: exercise.defaultReps,
    })),
  });
}

export async function saveSetAction(input: {
  setId: string;
  reps: number;
  weightKg: number | null;
}) {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };
  const set = await prisma.loggedSet.findFirst({
    where: { id: input.setId, session: { userId: user.id } },
  });
  if (!set) return { error: "Set not found." };
  await prisma.loggedSet.update({
    where: { id: set.id },
    data: {
      reps: input.reps,
      weightKg: input.weightKg,
      completedAt: new Date(),
    },
  });
  revalidatePath(routes.workoutSession(set.sessionId));
  return { ok: true };
}

export async function skipSetAction(setId: string) {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };
  const set = await prisma.loggedSet.findFirst({
    where: { id: setId, session: { userId: user.id } },
  });
  if (!set) return { error: "Set not found." };
  await prisma.loggedSet.update({
    where: { id: set.id },
    data: {
      reps: 0,
      weightKg: null,
      completedAt: new Date(),
    },
  });
  revalidatePath(routes.workoutSession(set.sessionId));
  return { ok: true };
}

export async function tickSessionAction(sessionId: string, elapsedSec: number) {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };
  await prisma.workoutSession.updateMany({
    where: { id: sessionId, userId: user.id, status: "ACTIVE" },
    data: { elapsedSec, caloriesEst: estimateCalories(elapsedSec) },
  });
  return { ok: true };
}

export async function completeSessionAction(sessionId: string, elapsedSec: number) {
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  await prisma.workoutSession.updateMany({
    where: { id: sessionId, userId: user.id },
    data: {
      status: "COMPLETED",
      endedAt: new Date(),
      elapsedSec,
      caloriesEst: estimateCalories(elapsedSec),
    },
  });
  revalidatePath(routes.home);
  revalidatePath(routes.workout);
  revalidatePath(routes.workoutHistory);
  revalidatePath(routes.progress);
  revalidatePath(routes.profile);
  redirect(routes.workoutHistoryItem(sessionId));
}

export async function abandonSessionAction(sessionId: string) {
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  await prisma.workoutSession.updateMany({
    where: { id: sessionId, userId: user.id, status: "ACTIVE" },
    data: { status: "ABANDONED", endedAt: new Date() },
  });
  revalidatePath(routes.home);
  revalidatePath(routes.workout);
  redirect(routes.workout);
}
