type Kind = "muscle" | "loss" | "endurance" | "flexibility";

export function GoalArt({ kind }: { kind: Kind }) {
  return (
    <span className="grid size-14 shrink-0 place-items-center">
      {kind === "muscle" ? <MuscleArt /> : null}
      {kind === "loss" ? <LossArt /> : null}
      {kind === "endurance" ? <EnduranceArt /> : null}
      {kind === "flexibility" ? <FlexibilityArt /> : null}
    </span>
  );
}

function MuscleArt() {
  return (
    <svg viewBox="0 0 48 48" className="size-12" aria-hidden>
      <path
        d="M10 34c2-10 8-16 16-18 3 8 1 14-6 18"
        fill="#f8c7a8"
        stroke="#3f2a1d"
        strokeWidth="1.6"
      />
      <path
        d="M20 16c8-2 16 2 18 10-8 2-14-1-18-10Z"
        fill="#f3b48e"
        stroke="#3f2a1d"
        strokeWidth="1.6"
      />
      <circle cx="36" cy="14" r="5" fill="#d4d4d4" stroke="#3f2a1d" strokeWidth="1.5" />
    </svg>
  );
}

function LossArt() {
  return (
    <svg viewBox="0 0 48 48" className="size-12" aria-hidden>
      <path d="M18 14h12l3 22H15Z" fill="#c4c4c4" stroke="#2f2f2f" strokeWidth="1.5" />
      <path d="M20 18h8M19 24h10M18 30h12" stroke="#8a8a8a" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="8" fill="#ff8a3d" />
      <path d="M32 26c2 3 1 5 0 6 2 0 4 2 4 5 0 3-2.4 5-4 5s-4-2-4-5c0-3 2-5 4-6Z" fill="#fff3b0" />
    </svg>
  );
}

function EnduranceArt() {
  return (
    <svg viewBox="0 0 48 48" className="size-12" aria-hidden>
      <path d="M8 18h8M7 23h9" stroke="#7dd3fc" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="30" cy="12" r="3.2" fill="#f8c7a8" />
      <path
        d="m18 38 4-8 7-2 3 7"
        fill="none"
        stroke="#111"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m22 30-4-7 7-3 6 3 5-4"
        fill="none"
        stroke="#111"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M28 20h7" stroke="#f97316" strokeWidth="2" />
    </svg>
  );
}

function FlexibilityArt() {
  return (
    <svg viewBox="0 0 48 48" className="size-12" aria-hidden>
      <path d="M8 36h28" stroke="#c4b5fd" strokeWidth="4" strokeLinecap="round" />
      <circle cx="16" cy="18" r="3" fill="#60a5fa" />
      <path
        d="M16 21c2 4 8 8 18 10M16 22c6 1 10-4 14-8"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
