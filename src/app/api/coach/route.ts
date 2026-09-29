import { NextResponse } from "next/server";
import { askCoach } from "@/lib/ai";
import { goalLabel, todayKey } from "@/lib/format";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { question?: string };
  const question = body.question?.trim() ?? "";
  if (question.length < 3) {
    return NextResponse.json({ error: "Ask a short, specific question." }, { status: 400 });
  }

  const [sessions, meals, weight] = await Promise.all([
    prisma.workoutSession.findMany({
      where: { userId: user.id, status: "COMPLETED" },
      include: { sets: true },
      orderBy: { startedAt: "desc" },
      take: 5,
    }),
    prisma.mealLog.findMany({ where: { userId: user.id, date: todayKey() } }),
    prisma.bodyMetric.findFirst({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    }),
  ]);

  const context = [
    `Goal: ${goalLabel(user.goal)}`,
    `Experience: ${user.level}`,
    `Height: not in app`,
    `Latest weight: ${weight ? `${weight.weightKg} kg on ${weight.date}` : "not logged"}`,
    `Calorie goal: ${user.calorieGoal}; today meals: ${
      meals.length === 0
        ? "not logged"
        : meals.map((item) => `${item.name} ${item.kcal}kcal`).join("; ")
    }`,
    `Recent workouts: ${
      sessions.length === 0
        ? "none completed"
        : sessions
            .map((session) => {
              const sets = session.sets
                .filter((set) => set.completedAt && set.reps && set.reps > 0)
                .map(
                  (set) =>
                    `${set.exerciseName} set ${set.setIndex + 1}: ${set.reps} reps${
                      set.weightKg != null ? ` @ ${set.weightKg}kg` : ""
                    }`,
                );
              return `${session.name} on ${session.startedAt.toISOString().slice(0, 10)} (${sets.join(", ") || "no sets logged"})`;
            })
            .join(" | ")
    }`,
  ].join("\n");

  const result = await askCoach(question, context);
  return NextResponse.json({
    text: result.text,
    notice: "notice" in result ? result.notice : undefined,
  });
}
