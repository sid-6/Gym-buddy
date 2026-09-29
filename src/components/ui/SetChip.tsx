import type { SetStatus } from "@/types";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  status: SetStatus;
  onClick?: () => void;
};

export function SetChip({ label, status, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-[58px] w-full flex-col items-center justify-center rounded-[18px] text-center text-[12px] leading-tight",
        status === "done" && "bg-success-soft font-semibold text-success",
        status === "current" && "bg-current-wash font-semibold text-ink",
        status === "empty" && "bg-empty-chip text-placeholder",
      )}
    >
      {status === "current" ? (
        <span className="text-[18px] font-bold">{label}</span>
      ) : (
        <>
          <span className="text-[15px] font-semibold">{label.split(" ")[0]}</span>
          {label.includes(" ") ? (
            <span className="text-[11px] font-medium">{label.split(" ").slice(1).join(" ")}</span>
          ) : null}
        </>
      )}
    </button>
  );
}
