import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function TextField({ label, id, className, ...props }: Props) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="flex flex-col gap-2" htmlFor={inputId}>
      <span className="text-[15px] font-medium text-ink">{label}</span>
      <input
        id={inputId}
        className={cn(
          "h-[52px] w-full rounded-[14px] border border-hairline bg-surface px-4 text-[15px] text-ink outline-none",
          "placeholder:text-placeholder focus:border-brand",
          className,
        )}
        {...props}
      />
    </label>
  );
}
