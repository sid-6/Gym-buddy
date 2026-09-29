type Props = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: Props) {
  return (
    <div className="rounded-[var(--radius-card)] border border-hairline bg-surface px-4 py-8 text-center">
      <p className="text-[16px] font-semibold text-ink">{title}</p>
      <p className="mt-1 text-[14px] text-muted">{body}</p>
    </div>
  );
}
