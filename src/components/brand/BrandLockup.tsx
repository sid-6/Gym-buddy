import { LogoMark } from "@/components/icons";

type Props = {
  tagline?: boolean;
  compact?: boolean;
};

export function BrandLockup({ tagline = true, compact = false }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <LogoMark className={compact ? "h-[80px] w-[80px]" : "h-[96px] w-[96px]"} />
      <h1
        className={
          compact
            ? "mt-4 text-[32px] font-extrabold tracking-tight"
            : "mt-5 text-[36px] font-extrabold tracking-tight"
        }
      >
        <span className="text-navy">Gym </span>
        <span className="text-brand">buddy</span>
      </h1>
      {tagline ? (
        <p className="mt-1 text-[15px] text-muted">Your smart gym companion</p>
      ) : null}
    </div>
  );
}
