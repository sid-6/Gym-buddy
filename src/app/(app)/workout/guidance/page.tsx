import Link from "next/link";
import { AskGymBuddyLink } from "@/components/coach/AskGymBuddyLink";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

export default async function GuidancePage() {
  await requireOnboardedUser();
  const exercises = await prisma.exercise.findMany({ orderBy: { muscleGroup: "asc" } });

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="Exercise guidance" backHref={routes.home} />
      <p className="mt-3 text-[14px] text-muted">
        Open an exercise for how to perform it and key form cues. This does not start a workout.
      </p>
      <div className="mt-4">
        <AskGymBuddyLink subtitle="Ask about form, what to do first, or a specific move" />
      </div>
      <div className="mt-4 space-y-2">
        {exercises.map((item) => (
          <Link key={item.id} href={routes.exercise(item.slug)}>
            <Card className="py-3">
              <p className="text-[15px] font-semibold">{item.name}</p>
              <p className="text-[12px] text-muted">
                {item.muscleGroup} · {item.equipment}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
