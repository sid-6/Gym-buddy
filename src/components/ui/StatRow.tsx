import { cn } from "@/lib/cn";

type Item = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type Props = {
  items: Item[];
};

export function StatRow({ items }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center rounded-[var(--radius-card)] border border-hairline bg-surface px-2 py-3.5 text-center"
        >
          {item.icon ? <div className="mb-1">{item.icon}</div> : null}
          <p className="text-[22px] font-bold leading-none text-ink">{item.value}</p>
          <p className={cn("mt-1 text-[12px] text-muted")}>{item.label}</p>
        </div>
      ))}
    </div>
  );
}
