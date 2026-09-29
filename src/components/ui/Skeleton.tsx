export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-track ${className ?? "h-4 w-full"}`} />;
}
