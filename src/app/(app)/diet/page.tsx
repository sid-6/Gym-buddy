import { AskGymBuddyLink } from "@/components/coach/AskGymBuddyLink";
import { CalorieSummary } from "@/components/diet/CalorieSummary";
import { HydrationCard } from "@/components/diet/HydrationCard";
import { MacroCard } from "@/components/diet/MacroCard";
import { MealCard } from "@/components/diet/MealCard";
import { PlusIcon } from "@/components/icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { prisma } from "@/lib/db";
import { longDate, todayKey } from "@/lib/format";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

const ORDER = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

export default async function DietPage() {
  const user = await requireOnboardedUser();
  const meals = await prisma.mealLog.findMany({
    where: { userId: user.id, date: todayKey() },
    orderBy: { createdAt: "asc" },
  });
  const consumed = meals.reduce((sum, item) => sum + item.kcal, 0);
  const protein = meals.reduce((sum, item) => sum + item.proteinG, 0);
  const carbs = meals.reduce((sum, item) => sum + item.carbsG, 0);
  const fats = meals.reduce((sum, item) => sum + item.fatG, 0);
  const hydro = await prisma.hydrationLog.findUnique({
    where: { userId_date: { userId: user.id, date: todayKey() } },
  });
  const grouped = ORDER.map((type) => ({
    type,
    items: meals.filter((item) => item.mealType === type),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="px-[var(--space-page)] pt-6">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-muted">{longDate()}</p>
          <h1 className="text-[32px] font-extrabold tracking-tight">Nutrition</h1>
        </div>
        <IconButton href={routes.dietAdd} aria-label="Add" tone="brand">
          <PlusIcon className="size-5" />
        </IconButton>
      </header>
      <div className="mt-5">
        <CalorieSummary
          consumed={consumed}
          goal={user.calorieGoal}
          remaining={Math.max(0, user.calorieGoal - consumed)}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        <MacroCard consumed={Math.round(protein)} goal={user.proteinGoal} label="Protein" />
        <MacroCard
          consumed={Math.round(carbs)}
          goal={user.carbsGoal}
          label="Carbs"
          barClassName="bg-[#3f6212]"
        />
        <MacroCard
          consumed={Math.round(fats)}
          goal={user.fatGoal}
          label="Fats"
          barClassName="bg-brand-hover"
        />
      </div>
      <div className="mt-3">
        <HydrationCard glasses={hydro?.glasses ?? 0} />
      </div>
      <div className="mt-3">
        <AskGymBuddyLink subtitle="Ask about today’s meals, calories, or protein" />
      </div>
      <div className="mt-6">
        <SectionHeader
          title="Today’s meals"
          actionLabel="+ Add meals"
          actionHref={routes.dietAdd}
        />
        {grouped.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No meals yet" body="Add breakfast, lunch, or a snack to start tracking." />
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {grouped.map((group) => (
              <MealCard
                key={group.type}
                type={group.type}
                totalKcal={group.items.reduce((sum, item) => sum + item.kcal, 0)}
                items={group.items.map((item) => ({
                  id: item.id,
                  name: item.name,
                  kcal: item.kcal,
                  href: routes.dietEdit(item.id),
                }))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
