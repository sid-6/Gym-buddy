import Link from "next/link";
import {
  BookIcon,
  ChevronRightIcon,
  DumbbellIcon,
  ListIcon,
  PostureIcon,
} from "@/components/icons";
import { Card } from "@/components/ui/Card";

const icons = {
  dumbbell: DumbbellIcon,
  list: ListIcon,
  book: BookIcon,
  run: PostureIcon,
  posture: PostureIcon,
};

type Props = {
  items: Array<{
    href: string;
    title: string;
    subtitle: string;
    icon: keyof typeof icons;
  }>;
};

export function FeatureGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => {
        const Icon = icons[item.icon];
        return (
          <Link key={item.title} href={item.href}>
            <Card className="flex min-h-[140px] flex-col p-[14px]">
              <Icon className="size-[22px] text-brand" />
              <p className="mt-3 text-[17px] font-extrabold leading-[1.15] text-ink">{item.title}</p>
              <p className="mt-1 flex-1 text-[12px] leading-4 text-muted">{item.subtitle}</p>
              <ChevronRightIcon className="mt-1 ml-auto size-4 text-placeholder" />
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
