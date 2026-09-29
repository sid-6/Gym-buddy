"use client";

import { useState } from "react";
import { saveGoalAction } from "@/app/actions/auth";
import { GoalArt } from "@/components/onboarding/GoalArt";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { TopBar } from "@/components/layout/TopBar";
import { ArrowRightIcon } from "@/components/icons";
import { goals } from "@/lib/placeholder-data";
import { routes } from "@/lib/routes";
import type { FitnessGoal } from "@/types";

export function GoalPicker() {
  const [selected, setSelected] = useState<FitnessGoal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col px-[var(--space-page)] pb-6 pt-4">
      <TopBar backHref={routes.login} />
      <div className="mt-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-extrabold leading-[1.08] tracking-tight text-ink">
            What&apos;s your
            <br />
            goal?
          </h1>
          <p className="mt-2 text-[15px] text-muted">We&apos;ll build a plan just for you</p>
        </div>
        <TargetBadge />
      </div>
      <div className="mt-8 flex flex-1 flex-col gap-3">
        {goals.map((goal) => (
          <button
            key={goal.id}
            type="button"
            onClick={() => setSelected(goal.id)}
            className="text-left"
          >
            <Card
              accent={selected === goal.id}
              className="flex items-center gap-3 py-[18px]"
            >
              <GoalArt kind={goal.illustration} />
              <div>
                <p className="text-[16px] font-bold text-ink">{goal.title}</p>
                <p className="text-[13px] text-muted">{goal.subtitle}</p>
              </div>
            </Card>
          </button>
        ))}
      </div>
      <ErrorBanner message={error} />
      <Button
        className="mt-6"
        disabled={!selected || pending}
        onClick={async () => {
          if (!selected) return;
          setPending(true);
          const result = await saveGoalAction(selected);
          if (result?.error) {
            setError(result.error);
            setPending(false);
          }
        }}
      >
        Continue <ArrowRightIcon className="size-5" />
      </Button>
    </div>
  );
}

function TargetBadge() {
  return (
    <svg viewBox="0 0 56 56" className="mt-1 size-12 shrink-0" aria-hidden>
      <circle cx="26" cy="30" r="18" fill="#ff2d87" />
      <circle cx="26" cy="30" r="11" fill="#fff" />
      <circle cx="26" cy="30" r="5.5" fill="#ff2d87" />
      <path
        d="M42 10l2.1 4.4 4.9.6-3.6 3.3.9 4.8L42 21l-4.3 2.1.9-4.8-3.6-3.3 4.9-.6Z"
        fill="#fbbf24"
      />
    </svg>
  );
}
