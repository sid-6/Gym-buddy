"use client";

import { useRouter } from "next/navigation";

type Props = {
  action: string;
  children: React.ReactNode;
  className?: string;
};

export function NavigateForm({ action, children, className }: Props) {
  const router = useRouter();

  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        router.push(action);
      }}
    >
      {children}
    </form>
  );
}
