import { TextLink } from "@/components/ui/TextLink";

type Props = {
  title: string;
  actionLabel?: string;
  actionHref?: string;
};

export function SectionHeader({ title, actionLabel, actionHref }: Props) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="text-[22px] font-extrabold tracking-tight text-ink">{title}</h2>
      {actionLabel && actionHref ? (
        <TextLink href={actionHref} className="text-[15px] font-medium">
          {actionLabel}
        </TextLink>
      ) : null}
    </div>
  );
}
