import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

export default async function FormPosturePage() {
  await requireOnboardedUser();
  const exercises = await prisma.exercise.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="Form & posture" backHref={routes.home} />
      <p className="mt-3 text-[14px] text-muted">
        Exercise-specific form cues from the library. Open one before you lift.
      </p>
      <div className="mt-4 space-y-2">
        {exercises.map((item) => (
          <Link key={item.id} href={routes.exercise(item.slug)}>
            <Card className="py-3">
              <p className="text-[15px] font-semibold">{item.name}</p>
              <p className="mt-1 line-clamp-2 text-[13px] text-muted">{item.guidance}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
