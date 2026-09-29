import type { FitnessGoal, OccupancyLevel, SetStatus } from "@/types";

export const demoUser = {
  name: "Sourav",
  email: "sourav@gymbuddy.com",
  avatarLetter: "S",
  goalLabel: "Muscle gain",
  level: "Beginner",
  streakDays: 7,
  greeting: "Good morning",
  todayLabel: "Monday · Chest Day",
};

export const calorieGoal = {
  consumed: 1840,
  goal: 2200,
  remaining: 360,
};

export const macros = [
  { id: "protein", label: "Protein", consumed: 142, goal: 160, tone: "ink" as const },
  { id: "carbs", label: "Carbs", consumed: 210, goal: 250, tone: "ink" as const },
  { id: "fats", label: "Fats", consumed: 56, goal: 65, tone: "ink" as const },
];

export const meals = [
  {
    type: "BREAKFAST" as const,
    totalKcal: 520,
    items: [
      { name: "Oats with banana", kcal: 340 },
      { name: "Boiled eggs *2", kcal: 180 },
    ],
  },
  {
    type: "LUNCH" as const,
    totalKcal: 680,
    items: [
      { name: "Chicken rice bowl", kcal: 480 },
      { name: "Mixed vegetables", kcal: 200 },
    ],
  },
];

export const todayWorkout = {
  id: "chest-triceps",
  title: "Chest & triceps",
  meta: "6 exercises · 45 min · Beginner",
  progressLabel: "2 of 6 exercises",
  progressPct: 33,
  elapsed: "12:34",
};

export const homeStats = [
  { id: "streak", value: "7", label: "Day streak", icon: "flame" as const },
  { id: "week", value: "4", label: "This week", icon: "dumbbell" as const },
  { id: "cal", value: "320", label: "Calories", icon: "bolt" as const },
];

export const features = [
  {
    href: "/workout",
    title: "Workout tracking",
    subtitle: "log sets,reps & weights",
    icon: "dumbbell" as const,
  },
  {
    href: "/workout",
    title: "Exercise guidance",
    subtitle: "Tips for every move",
    icon: "list" as const,
  },
  {
    href: "/workout",
    title: "Beginner plans",
    subtitle: "Structured 4-week plan",
    icon: "book" as const,
  },
  {
    href: "/coach",
    title: "Form & posture",
    subtitle: "Fix your technique",
    icon: "run" as const,
  },
];

export const crowd: { level: OccupancyLevel; best: string } = {
  level: "Moderate",
  best: "Best time: 7-9 AM or after 8 PM",
};

export const weekProgress = [
  { id: "workout", label: "Workout", value: "4/5", pct: 80, color: "brand" as const },
  { id: "nutrition", label: "Nutrition", value: "6/7", pct: 86, color: "success" as const },
  { id: "hydration", label: "Hydration", value: "5/7", pct: 71, color: "water" as const },
];

export const profileStats = [
  { id: "workouts", value: "24", label: "Workouts", icon: "dumbbell" as const },
  { id: "calories", value: "9.2k", label: "Calories", icon: "bolt" as const },
  { id: "time", value: "18h", label: "Total time", icon: "clock" as const },
];

export const progressStats = [
  { value: "24", label: "Workouts" },
  { value: "18h", label: "Total time" },
  { value: "410", label: "Avg cal" },
];

export const personalRecords = [
  { lift: "Bench press", weight: "60 kg", delta: "+10kg" },
  { lift: "Squat", weight: "85 kg", delta: "+15kg" },
  { lift: "Deadlift", weight: "100 kg", delta: "+20kg" },
];

export const weightSeries = [68.2, 69.1, 68.7, 70.4, 71.2, 71.8, 72];

export const goals: Array<{
  id: FitnessGoal;
  title: string;
  subtitle: string;
  illustration: "muscle" | "loss" | "endurance" | "flexibility";
}> = [
  {
    id: "MUSCLE_GAIN",
    title: "Muscle gain",
    subtitle: "Build strength and size",
    illustration: "muscle",
  },
  {
    id: "WEIGHT_LOSS",
    title: "Weight loss",
    subtitle: "Burn fat, get lean",
    illustration: "loss",
  },
  {
    id: "ENDURANCE",
    title: "Endurance",
    subtitle: "Improve stamina & cardio",
    illustration: "endurance",
  },
  {
    id: "FLEXIBILITY",
    title: "Flexibility",
    subtitle: "Stretch & stay mobile",
    illustration: "flexibility",
  },
];

export const sessionExercises: Array<{
  name: string;
  index?: number;
  complete?: boolean;
  sets: Array<{ label: string; status: SetStatus }>;
}> = [
  {
    name: "Push-ups",
    complete: true,
    sets: [
      { label: "12 reps", status: "done" },
      { label: "10 reps", status: "done" },
      { label: "10 reps", status: "done" },
      { label: "-- reps", status: "empty" },
    ],
  },
  {
    name: "Dumbell press",
    index: 2,
    sets: [
      { label: "10 reps", status: "done" },
      { label: "8", status: "current" },
      { label: "-- reps", status: "empty" },
      { label: "-- reps", status: "empty" },
    ],
  },
  {
    name: "Cable flyes",
    sets: [
      { label: "-- reps", status: "empty" },
      { label: "-- reps", status: "empty" },
      { label: "-- reps", status: "empty" },
      { label: "-- reps", status: "empty" },
    ],
  },
];

export const workoutPlans = [
  todayWorkout,
  {
    id: "back-biceps",
    title: "Back & biceps",
    meta: "6 exercises · 50 min · Beginner",
  },
  {
    id: "legs",
    title: "Legs",
    meta: "7 exercises · 55 min · Beginner",
  },
];
