import Link from "next/link";
import { CoachAsk } from "@/components/coach/CoachAsk";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

export default async function CoachPage() {
  await requireOnboardedUser();
  const exercises = await prisma.exercise.findMany({
    orderBy: { muscleGroup: "asc" },
    take: 8,
  });

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="Ask GymBuddy" />
      <CoachAsk />
      <Card className="mt-4">
        <p className="text-[15px] font-semibold">Form cues</p>
        <p className="mt-2 text-[14px] leading-6 text-muted">
          Written exercise guidance is always available, with or without the AI provider.
        </p>
      </Card>
      <div className="mt-4 space-y-3">
        {exercises.map((item) => (
          <Link key={item.id} href={routes.exercise(item.slug)}>
            <Card className="py-3">
              <p className="text-[15px] font-semibold">{item.name}</p>
              <p className="text-[12px] text-muted">{item.muscleGroup}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
