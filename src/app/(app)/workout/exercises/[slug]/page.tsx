import { notFound } from "next/navigation";
import { ExerciseDetail } from "@/components/workout/ExerciseDetail";
import { TopBar } from "@/components/layout/TopBar";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ExerciseDetailPage({ params }: Props) {
  await requireOnboardedUser();
  const { slug } = await params;
  const exercise = await prisma.exercise.findUnique({ where: { slug } });
  if (!exercise) notFound();

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title={exercise.name} backHref={routes.guidance} />
      <div className="mt-5">
        <ExerciseDetail exercise={exercise} />
      </div>
    </div>
  );
}
