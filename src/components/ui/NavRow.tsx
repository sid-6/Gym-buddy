import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  icon: React.ReactNode;
  iconWellClassName?: string;
  title: string;
  subtitle: string;
  badge?: string;
};

export function NavRow({ href, icon, iconWellClassName, title, subtitle, badge }: Props) {
  return (
    <Link href={href}>
      <Card className="flex items-center gap-3">
        <div
          className={cn(
            "grid size-11 place-items-center rounded-[14px] bg-brand-wash text-brand",
            iconWellClassName,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-semibold text-ink">{title}</p>
          <p className="text-[13px] text-muted">{subtitle}</p>
        </div>
        {badge ? <span className="text-[12px] font-medium text-brand">{badge}</span> : null}
        <ChevronRightIcon className="size-5 text-placeholder" />
      </Card>
    </Link>
  );
}
