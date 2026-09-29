import { ChevronLeftIcon, OverflowIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

type Props = {
  title?: string;
  subtitle?: string;
  backHref?: string;
  overflow?: boolean;
  onOverflow?: () => void;
  className?: string;
};

export function TopBar({
  title,
  subtitle,
  backHref,
  overflow,
  onOverflow,
  className,
}: Props) {
  return (
    <header className={cn("grid grid-cols-[40px_1fr_40px] items-center gap-2", className)}>
      {backHref ? (
        <IconButton href={backHref} aria-label="Back">
          <ChevronLeftIcon className="size-5" />
        </IconButton>
      ) : (
        <span />
      )}
      <div className="text-center">
        {title ? (
          <h1 className="text-[20px] font-bold tracking-tight text-ink">{title}</h1>
        ) : null}
        {subtitle ? <p className="text-[12px] text-muted">{subtitle}</p> : null}
      </div>
      {overflow ? (
        <IconButton aria-label="More" onClick={onOverflow}>
          <OverflowIcon className="size-5" />
        </IconButton>
      ) : (
        <span />
      )}
    </header>
  );
}
