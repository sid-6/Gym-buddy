import { notFound } from "next/navigation";
import { DeleteMealButton } from "@/components/diet/DeleteMealButton";
import { MealForm } from "@/components/diet/MealForm";
import { TopBar } from "@/components/layout/TopBar";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditMealPage({ params }: Props) {
  const user = await requireOnboardedUser();
  const { id } = await params;
  const meal = await prisma.mealLog.findFirst({ where: { id, userId: user.id } });
  if (!meal) notFound();

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="Edit meal" backHref={routes.diet} />
      <MealForm meal={meal} date={meal.date} />
      <DeleteMealButton id={meal.id} />
    </div>
  );
}
