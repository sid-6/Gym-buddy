import { ActionForm } from "@/components/forms/ActionForm";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { updateProfileAction } from "@/app/actions/auth";
import { prisma } from "@/lib/db";
import { todayKey } from "@/lib/format";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

export default async function ProfileEditPage() {
  const user = await requireOnboardedUser();
  const todayWeight = await prisma.bodyMetric.findUnique({
    where: { userId_date: { userId: user.id, date: todayKey() } },
  });

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="Edit profile" backHref={routes.profile} />
      <ActionForm action={updateProfileAction} className="mt-6 flex flex-col gap-5">
        <TextField label="Name" name="name" defaultValue={user.name} />
        <TextField label="Email" name="email" defaultValue={user.email} />
        <TextField
          label="Calorie goal"
          name="calorieGoal"
          inputMode="numeric"
          defaultValue={String(user.calorieGoal)}
        />
        <TextField
          label="Protein goal (g)"
          name="proteinGoal"
          inputMode="numeric"
          defaultValue={String(user.proteinGoal)}
        />
        <TextField
          label="Carbs goal (g)"
          name="carbsGoal"
          inputMode="numeric"
          defaultValue={String(user.carbsGoal)}
        />
        <TextField
          label="Fat goal (g)"
          name="fatGoal"
          inputMode="numeric"
          defaultValue={String(user.fatGoal)}
        />
        <TextField
          label="Today's weight (kg)"
          name="weightKg"
          inputMode="decimal"
          defaultValue={todayWeight ? String(todayWeight.weightKg) : ""}
          placeholder="Optional"
        />
        <Button type="submit">Save</Button>
      </ActionForm>
    </div>
  );
}
