import Link from "next/link";
import {
  AppleIcon,
  BoltIcon,
  ChatIcon,
  ChartIcon,
  ClockIcon,
  DropletIcon,
  DumbbellIcon,
  GearIcon,
} from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { NavRow } from "@/components/ui/NavRow";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatRow } from "@/components/ui/StatRow";
import { StreakChip } from "@/components/ui/StreakChip";
import { prisma } from "@/lib/db";
import { goalLabel, initials, startOfWeek, todayKey } from "@/lib/format";
import { routes } from "@/lib/routes";
import { requireOnboardedUser } from "@/lib/session";
import { dashboardStats } from "@/server/stats";

export default async function ProfilePage() {
  const user = await requireOnboardedUser();
  const stats = await dashboardStats(user.id);
  const weekStart = startOfWeek();
  const days: string[] = [];
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(todayKey(day));
  }
  const meals = await prisma.mealLog.findMany({
    where: { userId: user.id, date: { in: days } },
    select: { date: true },
  });
  const hydration = await prisma.hydrationLog.findMany({
    where: { userId: user.id, date: { in: days } },
  });
  const workoutDays = new Set(
    stats.sessions
      .filter((item) => item.startedAt >= weekStart)
      .map((item) => todayKey(item.startedAt)),
  );
  const mealDays = new Set(meals.map((item) => item.date));
  const hydroDays = hydration.filter((item) => item.glasses >= 6).length;
  const formatHours = (sec: number) => {
    const hours = sec / 3600;
    if (hours < 1) return `${Math.round(sec / 60)}m`;
    return `${hours.toFixed(hours >= 10 ? 0 : 1)}h`;
  };
  const calLabel =
    stats.totalCalories >= 1000
      ? `${(stats.totalCalories / 1000).toFixed(1)}k`
      : String(stats.totalCalories);

  return (
    <div className="px-[var(--space-page)] pt-6">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-muted">Your account</p>
          <h1 className="text-[32px] font-extrabold tracking-tight">Profile</h1>
        </div>
        <Link
          href={routes.settings}
          aria-label="Settings"
          className="grid size-10 place-items-center rounded-full border border-hairline bg-surface text-ink"
        >
          <GearIcon className="size-5" />
        </Link>
      </header>

      <Card className="mt-5" accent>
        <div className="flex items-start gap-3">
          <Avatar letter={initials(user.name)} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-[20px] font-bold leading-tight">{user.name}</p>
            <p className="text-[13px] text-muted">
              {goalLabel(user.goal)} · {user.level}
            </p>
            {stats.streak > 0 ? (
              <div className="mt-2">
                <StreakChip days={stats.streak} />
              </div>
            ) : null}
          </div>
          <Link
            href={routes.profileEdit}
            className="rounded-md bg-brand-wash px-3 py-1 text-[13px] font-medium text-brand"
          >
            Edit
          </Link>
        </div>
      </Card>

      <div className="mt-4">
        <StatRow
          items={[
            {
              value: String(stats.totalWorkouts),
              label: "Workouts",
              icon: <DumbbellIcon className="size-5 text-brand" />,
            },
            {
              value: calLabel,
              label: "Calories",
              icon: <BoltIcon className="size-5 text-success" />,
            },
            {
              value: formatHours(stats.totalSeconds),
              label: "Total time",
              icon: <ClockIcon className="size-5 text-muted" />,
            },
          ]}
        />
      </div>

      <h2 className="mt-7 text-[18px] font-bold text-ink">This week&apos;s progress</h2>
      <Card className="mt-3 space-y-4">
        <WeekRow
          icon={<DumbbellIcon className="size-3.5 text-brand" />}
          label="Workout"
          value={`${workoutDays.size}/5`}
          pct={(workoutDays.size / 5) * 100}
          color="brand"
        />
        <WeekRow
          icon={<AppleIcon className="size-3.5 text-success" />}
          label="Nutrition"
          value={`${mealDays.size}/7`}
          pct={(mealDays.size / 7) * 100}
          color="success"
        />
        <WeekRow
          icon={<DropletIcon className="size-3.5 text-water" />}
          label="Hydration"
          value={`${hydroDays}/7`}
          pct={(hydroDays / 7) * 100}
          color="water"
        />
      </Card>

      <h2 className="mt-7 text-[18px] font-bold">GymBuddy</h2>
      <div className="mt-3 space-y-3">
        <NavRow
          href={routes.coach}
          icon={<ChatIcon className="size-5" />}
          title="Ask GymBuddy"
          subtitle="Uses your goal, logs, and form cues"
        />
        <NavRow
          href={routes.progress}
          icon={<ChartIcon className="size-5 text-water" />}
          iconWellClassName="bg-[#eef4ff] text-water"
          title="Progress history"
          subtitle="PRs, charts & body stats"
        />
      </div>
    </div>
  );
}

function WeekRow({
  icon,
  label,
  value,
  pct,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  pct: number;
  color: "brand" | "success" | "water";
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[13px]">
        <span className="flex items-center gap-1.5 text-ink">
          {icon}
          {label}
        </span>
        <span className="text-muted">{value}</span>
      </div>
      <ProgressBar value={pct} color={color} className="h-[7px]" />
    </div>
  );
}
