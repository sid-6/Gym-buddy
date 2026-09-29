import { prisma } from "@/lib/db";

export async function assignPlansForGoal(userId: string, goal: string) {
  await prisma.workoutPlan.deleteMany({ where: { userId } });
  const templates = await prisma.workoutPlan.findMany({
    where: { userId: null, goal },
    include: { exercises: true },
  });
  for (const template of templates) {
    await prisma.workoutPlan.create({
      data: {
        userId,
        slug: template.slug,
        name: template.name,
        durationMin: template.durationMin,
        level: template.level,
        goal: template.goal,
        weekday: template.weekday,
        exercises: {
          create: template.exercises.map((item) => ({
            exerciseId: item.exerciseId,
            sortOrder: item.sortOrder,
            targetSets: item.targetSets,
            targetReps: item.targetReps,
          })),
        },
      },
    });
  }
}

export async function userPlans(userId: string) {
  return prisma.workoutPlan.findMany({
    where: { userId },
    include: {
      exercises: { include: { exercise: true }, orderBy: { sortOrder: "asc" } },
    },
    orderBy: { name: "asc" },
  });
}

export async function planById(userId: string, id: string) {
  return prisma.workoutPlan.findFirst({
    where: { id, userId },
    include: {
      exercises: { include: { exercise: true }, orderBy: { sortOrder: "asc" } },
    },
  });
}
