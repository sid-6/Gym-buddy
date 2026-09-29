import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  {
    slug: "push-ups",
    name: "Push-ups",
    muscleGroup: "Chest",
    equipment: "Bodyweight",
    guidance: "Hands under shoulders. Brace your core, lower until elbows are about 90°, then press up. Keep a straight line from head to heels.",
    defaultSets: 4,
    defaultReps: 12,
  },
  {
    slug: "dumbbell-press",
    name: "Dumbbell press",
    muscleGroup: "Chest",
    equipment: "Dumbbells",
    guidance: "Lie on a bench, dumbbells above mid-chest. Lower with control to the sides of your chest, then press up without locking out harshly.",
    defaultSets: 4,
    defaultReps: 10,
  },
  {
    slug: "cable-flyes",
    name: "Cable flyes",
    muscleGroup: "Chest",
    equipment: "Cable",
    guidance: "Slight bend in the elbows. Bring handles together in a hugging motion at chest height. Squeeze, then return slowly.",
    defaultSets: 3,
    defaultReps: 12,
  },
  {
    slug: "incline-press",
    name: "Incline press",
    muscleGroup: "Chest",
    equipment: "Dumbbells",
    guidance: "Set the bench to about 30–45°. Press from upper chest; do not bounce the weights off your body.",
    defaultSets: 3,
    defaultReps: 10,
  },
  {
    slug: "tricep-dips",
    name: "Tricep dips",
    muscleGroup: "Triceps",
    equipment: "Bodyweight",
    guidance: "Shoulders down. Lower until elbows are near 90°, then press up. Keep the torso upright to bias triceps.",
    defaultSets: 3,
    defaultReps: 10,
  },
  {
    slug: "overhead-extension",
    name: "Overhead extension",
    muscleGroup: "Triceps",
    equipment: "Dumbbells",
    guidance: "Elbows stay close to your head. Lower the weight behind you, then extend without flaring the elbows wide.",
    defaultSets: 3,
    defaultReps: 12,
  },
  {
    slug: "barbell-row",
    name: "Barbell row",
    muscleGroup: "Back",
    equipment: "Barbell",
    guidance: "Hinge at the hips, back flat. Pull the bar to your lower ribs, squeeze the shoulder blades, then lower with control.",
    defaultSets: 4,
    defaultReps: 8,
  },
  {
    slug: "lat-pulldown",
    name: "Lat pulldown",
    muscleGroup: "Back",
    equipment: "Cable",
    guidance: "Pull the bar to your upper chest. Lead with the elbows. Avoid leaning too far back.",
    defaultSets: 4,
    defaultReps: 10,
  },
  {
    slug: "seated-row",
    name: "Seated row",
    muscleGroup: "Back",
    equipment: "Cable",
    guidance: "Sit tall. Pull handles to the ribs, pause, then extend the arms without rounding the back.",
    defaultSets: 3,
    defaultReps: 12,
  },
  {
    slug: "barbell-curl",
    name: "Barbell curl",
    muscleGroup: "Biceps",
    equipment: "Barbell",
    guidance: "Elbows pinned to your sides. Curl without swinging. Lower for a full stretch.",
    defaultSets: 3,
    defaultReps: 10,
  },
  {
    slug: "hammer-curl",
    name: "Hammer curl",
    muscleGroup: "Biceps",
    equipment: "Dumbbells",
    guidance: "Neutral grip. Curl up, keep wrists straight, lower slowly.",
    defaultSets: 3,
    defaultReps: 12,
  },
  {
    slug: "back-squat",
    name: "Back squat",
    muscleGroup: "Legs",
    equipment: "Barbell",
    guidance: "Brace, sit between the hips. Knees track over toes. Stand by driving the floor away.",
    defaultSets: 4,
    defaultReps: 8,
  },
  {
    slug: "romanian-deadlift",
    name: "Romanian deadlift",
    muscleGroup: "Legs",
    equipment: "Barbell",
    guidance: "Soft knees, hinge until you feel hamstrings load. Keep the bar close. Stand tall without hyperextending.",
    defaultSets: 3,
    defaultReps: 8,
  },
  {
    slug: "walking-lunge",
    name: "Walking lunge",
    muscleGroup: "Legs",
    equipment: "Dumbbells",
    guidance: "Long enough step to keep the front knee stacked. Drop the back knee, then step through.",
    defaultSets: 3,
    defaultReps: 10,
  },
  {
    slug: "leg-press",
    name: "Leg press",
    muscleGroup: "Legs",
    equipment: "Machine",
    guidance: "Feet mid-platform. Lower with control; do not let the lower back peel off the pad.",
    defaultSets: 3,
    defaultReps: 12,
  },
  {
    slug: "overhead-press",
    name: "Overhead press",
    muscleGroup: "Shoulders",
    equipment: "Barbell",
    guidance: "Ribs down. Press the bar over the mid-foot. Head through at the top.",
    defaultSets: 4,
    defaultReps: 8,
  },
  {
    slug: "lateral-raise",
    name: "Lateral raise",
    muscleGroup: "Shoulders",
    equipment: "Dumbbells",
    guidance: "Slight elbow bend. Raise to shoulder height, pinkies slightly up. No swinging.",
    defaultSets: 3,
    defaultReps: 12,
  },
  {
    slug: "plank",
    name: "Plank",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    guidance: "Elbows under shoulders. Squeeze glutes and brace. Do not let the hips sag or pike.",
    defaultSets: 3,
    defaultReps: 30,
  },
  {
    slug: "mountain-climbers",
    name: "Mountain climbers",
    muscleGroup: "Cardio",
    equipment: "Bodyweight",
    guidance: "High plank. Drive knees toward the chest without bouncing the hips.",
    defaultSets: 3,
    defaultReps: 20,
  },
  {
    slug: "jump-rope",
    name: "Jump rope",
    muscleGroup: "Cardio",
    equipment: "Rope",
    guidance: "Light bounce on the balls of the feet. Keep elbows close and wrists turning the rope.",
    defaultSets: 4,
    defaultReps: 40,
  },
  {
    slug: "cat-cow",
    name: "Cat-cow",
    muscleGroup: "Mobility",
    equipment: "Bodyweight",
    guidance: "On all fours, slowly round and arch the spine with the breath. Move segment by segment.",
    defaultSets: 2,
    defaultReps: 10,
  },
  {
    slug: "hip-flexor-stretch",
    name: "Hip flexor stretch",
    muscleGroup: "Mobility",
    equipment: "Bodyweight",
    guidance: "Half-kneeling. Tuck the pelvis, shift forward until you feel the front of the back hip. Breathe.",
    defaultSets: 2,
    defaultReps: 30,
  },
  {
    slug: "world-greatest-stretch",
    name: "World’s greatest stretch",
    muscleGroup: "Mobility",
    equipment: "Bodyweight",
    guidance: "Long lunge, hand inside the front foot, rotate the chest open. Switch sides slowly.",
    defaultSets: 2,
    defaultReps: 8,
  },
  {
    slug: "bench-press",
    name: "Bench press",
    muscleGroup: "Chest",
    equipment: "Barbell",
    guidance: "Eyes under the bar. Lower to mid-chest, elbows about 45–70° from the torso, then press.",
    defaultSets: 4,
    defaultReps: 6,
  },
  {
    slug: "deadlift",
    name: "Deadlift",
    muscleGroup: "Legs",
    equipment: "Barbell",
    guidance: "Bar over mid-foot. Brace, push the floor, keep the bar close. Stand tall, then hinge back down.",
    defaultSets: 4,
    defaultReps: 5,
  },
];

const templates: Array<{
  slug: string;
  name: string;
  durationMin: number;
  level: string;
  goal: string;
  weekday: string;
  exerciseSlugs: string[];
}> = [
  {
    slug: "chest-triceps",
    name: "Chest & triceps",
    durationMin: 45,
    level: "Beginner",
    goal: "MUSCLE_GAIN",
    weekday: "Monday",
    exerciseSlugs: ["push-ups", "dumbbell-press", "cable-flyes", "incline-press", "tricep-dips", "overhead-extension"],
  },
  {
    slug: "back-biceps",
    name: "Back & biceps",
    durationMin: 50,
    level: "Beginner",
    goal: "MUSCLE_GAIN",
    weekday: "Wednesday",
    exerciseSlugs: ["barbell-row", "lat-pulldown", "seated-row", "barbell-curl", "hammer-curl", "plank"],
  },
  {
    slug: "legs",
    name: "Legs",
    durationMin: 55,
    level: "Beginner",
    goal: "MUSCLE_GAIN",
    weekday: "Friday",
    exerciseSlugs: ["back-squat", "romanian-deadlift", "walking-lunge", "leg-press", "plank"],
  },
  {
    slug: "shoulders",
    name: "Shoulders",
    durationMin: 40,
    level: "Beginner",
    goal: "MUSCLE_GAIN",
    weekday: "Saturday",
    exerciseSlugs: ["overhead-press", "lateral-raise", "push-ups", "plank"],
  },
  {
    slug: "full-body",
    name: "Full body",
    durationMin: 40,
    level: "Beginner",
    goal: "WEIGHT_LOSS",
    weekday: "Monday",
    exerciseSlugs: ["push-ups", "back-squat", "seated-row", "walking-lunge", "plank"],
  },
  {
    slug: "hiit",
    name: "HIIT",
    durationMin: 30,
    level: "Beginner",
    goal: "WEIGHT_LOSS",
    weekday: "Wednesday",
    exerciseSlugs: ["jump-rope", "mountain-climbers", "push-ups", "walking-lunge"],
  },
  {
    slug: "cardio-engine",
    name: "Cardio engine",
    durationMin: 35,
    level: "Beginner",
    goal: "ENDURANCE",
    weekday: "Tuesday",
    exerciseSlugs: ["jump-rope", "mountain-climbers", "walking-lunge", "plank"],
  },
  {
    slug: "circuits",
    name: "Circuits",
    durationMin: 40,
    level: "Beginner",
    goal: "ENDURANCE",
    weekday: "Thursday",
    exerciseSlugs: ["push-ups", "lat-pulldown", "leg-press", "jump-rope"],
  },
  {
    slug: "mobility-flow",
    name: "Mobility flow",
    durationMin: 25,
    level: "Beginner",
    goal: "FLEXIBILITY",
    weekday: "Monday",
    exerciseSlugs: ["cat-cow", "hip-flexor-stretch", "world-greatest-stretch", "plank"],
  },
  {
    slug: "stretch-recover",
    name: "Stretch & recover",
    durationMin: 20,
    level: "Beginner",
    goal: "FLEXIBILITY",
    weekday: "Friday",
    exerciseSlugs: ["cat-cow", "hip-flexor-stretch", "world-greatest-stretch"],
  },
];

async function main() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { slug: exercise.slug },
      update: exercise,
      create: exercise,
    });
  }

  const catalog = await prisma.exercise.findMany();
  const bySlug = Object.fromEntries(catalog.map((item) => [item.slug, item]));

  for (const plan of templates) {
    const existing = await prisma.workoutPlan.findFirst({
      where: { userId: null, slug: plan.slug },
    });
    const record =
      existing ??
      (await prisma.workoutPlan.create({
        data: {
          userId: null,
          slug: plan.slug,
          name: plan.name,
          durationMin: plan.durationMin,
          level: plan.level,
          goal: plan.goal,
          weekday: plan.weekday,
        },
      }));

    await prisma.planExercise.deleteMany({ where: { planId: record.id } });
    await prisma.planExercise.createMany({
      data: plan.exerciseSlugs.map((slug, index) => ({
        planId: record.id,
        exerciseId: bySlug[slug].id,
        sortOrder: index,
        targetSets: bySlug[slug].defaultSets,
        targetReps: bySlug[slug].defaultReps,
      })),
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
