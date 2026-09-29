import { prisma } from "@/lib/db";
import { estimateCalories, startOfWeek, todayKey } from "@/lib/format";

export async function completedSessions(userId: string) {
  return prisma.workoutSession.findMany({
    where: { userId, status: "COMPLETED" },
    include: { sets: true },
    orderBy: { startedAt: "desc" },
  });
}

export function computeStreak(dates: string[]) {
  const unique = [...new Set(dates)].sort().reverse();
  if (unique.length === 0) return 0;
  const today = todayKey();
  const yesterday = todayKey(new Date(Date.now() - 86400000));
  if (unique[0] !== today && unique[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < unique.length; i += 1) {
    const prev = new Date(`${unique[i - 1]}T00:00:00`);
    const cur = new Date(`${unique[i]}T00:00:00`);
    const diff = (prev.getTime() - cur.getTime()) / 86400000;
    if (diff === 1) streak += 1;
    else break;
  }
  return streak;
}

export async function dashboardStats(userId: string) {
  const sessions = await prisma.workoutSession.findMany({
    where: { userId, status: "COMPLETED" },
    include: { sets: true },
    orderBy: { startedAt: "desc" },
  });
  const weekStart = startOfWeek();
  const thisWeek = sessions.filter((item) => item.startedAt >= weekStart);
  const weekCalories = thisWeek.reduce((sum, item) => sum + item.caloriesEst, 0);
  const dates = sessions.map((item) => todayKey(item.startedAt));
  return {
    totalWorkouts: sessions.length,
    weekWorkouts: thisWeek.length,
    weekCalories,
    streak: computeStreak(dates),
    totalSeconds: sessions.reduce((sum, item) => sum + item.elapsedSec, 0),
    totalCalories: sessions.reduce((sum, item) => sum + item.caloriesEst, 0),
    sessions,
  };
}

export function prsFromSessions(
  sessions: Array<{
    sets: Array<{ exerciseName: string; weightKg: number | null; completedAt: Date | null }>;
  }>,
) {
  const tracked = ["Bench press", "Back squat", "Deadlift", "Dumbbell press"];
  return tracked
    .map((lift) => {
      const weights = sessions
        .flatMap((session) => session.sets)
        .filter((set) => set.exerciseName === lift && set.weightKg && set.completedAt && set.weightKg > 0)
        .map((set) => set.weightKg as number)
        .sort((a, b) => a - b);
      if (weights.length === 0) return null;
      const current = weights[weights.length - 1];
      const first = weights[0];
      const delta = current - first;
      return {
        lift,
        weight: `${current} kg`,
        delta: delta > 0 ? `+${delta}kg` : delta < 0 ? `${delta}kg` : "—",
      };
    })
    .filter(Boolean) as Array<{ lift: string; weight: string; delta: string }>;
}

export { estimateCalories };
