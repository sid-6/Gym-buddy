import { cn } from "@/lib/cn";

type Props = {
  letter: string;
  className?: string;
  size?: "sm" | "md";
};

export function Avatar({ letter, className, size = "sm" }: Props) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-[12px] bg-brand font-semibold text-white",
        size === "sm" && "size-10 text-[14px]",
        size === "md" && "size-11 text-[16px]",
        className,
      )}
    >
      {letter}
    </div>
  );
}
