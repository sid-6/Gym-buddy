"use client";

import { useState } from "react";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

type Props = {
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  children: React.ReactNode;
  className?: string;
};

export function ActionForm({ action, children, className }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className={className}
      action={async (formData) => {
        setPending(true);
        setError(null);
        const result = await action(formData);
        if (result?.error) {
          setError(result.error);
          setPending(false);
        }
      }}
    >
      <ErrorBanner message={error} />
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
    </form>
  );
}
