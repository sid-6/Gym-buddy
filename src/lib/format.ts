export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfWeek(date = new Date()) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function formatElapsed(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function weekdayName(date = new Date()) {
  return date.toLocaleDateString("en-GB", { weekday: "long" });
}

export function longDate(date = new Date()) {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function occupancyForHour(hour = new Date().getHours()) {
  if ((hour >= 7 && hour < 9) || hour >= 20) {
    return { level: "Low" as const, best: "Best time: 7-9 AM or after 8 PM" };
  }
  if (hour >= 17 && hour < 20) {
    return { level: "High" as const, best: "Best time: 7-9 AM or after 8 PM" };
  }
  return { level: "Moderate" as const, best: "Best time: 7-9 AM or after 8 PM" };
}

export function calorieTargets(goal: string | null) {
  if (goal === "WEIGHT_LOSS") return { calorieGoal: 1800, proteinGoal: 140, carbsGoal: 150, fatGoal: 50 };
  if (goal === "ENDURANCE") return { calorieGoal: 2100, proteinGoal: 120, carbsGoal: 280, fatGoal: 55 };
  if (goal === "FLEXIBILITY") return { calorieGoal: 1900, proteinGoal: 110, carbsGoal: 220, fatGoal: 55 };
  return { calorieGoal: 2200, proteinGoal: 160, carbsGoal: 250, fatGoal: 65 };
}

export function goalLabel(goal: string | null) {
  if (goal === "MUSCLE_GAIN") return "Muscle gain";
  if (goal === "WEIGHT_LOSS") return "Weight loss";
  if (goal === "ENDURANCE") return "Endurance";
  if (goal === "FLEXIBILITY") return "Flexibility";
  return "Not set";
}

export function estimateCalories(elapsedSec: number) {
  return Math.max(0, Math.round((elapsedSec / 60) * 7));
}

export function initials(name: string) {
  const part = name.trim()[0];
  return (part ?? "G").toUpperCase();
}
