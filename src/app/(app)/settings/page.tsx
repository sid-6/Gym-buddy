import { addWaterAction, logoutAction } from "@/app/actions/auth";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextLink } from "@/components/ui/TextLink";
import { prisma } from "@/lib/db";
import { todayKey } from "@/lib/format";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";

export default async function SettingsPage() {
  const user = await requireOnboardedUser();
  const hydro = await prisma.hydrationLog.findUnique({
    where: { userId_date: { userId: user.id, date: todayKey() } },
  });

  return (
    <div className="px-[var(--space-page)] pt-4">
      <TopBar title="Settings" backHref={routes.profile} />
      <Card className="mt-6 space-y-3">
        <p className="text-[15px] font-semibold">Account</p>
        <p className="text-[14px] text-muted">{user.email}</p>
        <TextLink href={routes.profileEdit}>Edit profile & goals</TextLink>
        <TextLink href={routes.profile}>View profile</TextLink>
      </Card>
      <Card className="mt-4 space-y-3">
        <p className="text-[15px] font-semibold">Hydration today</p>
        <p className="text-[14px] text-muted">
          {hydro?.glasses ? `${hydro.glasses} glasses logged` : "Not logged yet"}
        </p>
        <form action={addWaterAction}>
          <Button type="submit" variant="compact">
            + Add a glass
          </Button>
        </form>
      </Card>
      <Card className="mt-4 space-y-3">
        <p className="text-[15px] font-semibold">Session</p>
        <form action={logoutAction}>
          <button type="submit" className="text-[15px] font-medium text-brand">
            Log out
          </button>
        </form>
      </Card>
    </div>
  );
}
