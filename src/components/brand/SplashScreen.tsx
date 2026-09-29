"use client";

import { useEffect, useState } from "react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

function loginHref() {
  return new URL(routes.login, window.location.href).pathname;
}

export function SplashScreen() {
  const [progress, setProgress] = useState(12);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = window.setInterval(() => {
      setProgress((value) => (value >= 92 ? value : value + 6));
    }, 140);

    const controller = new AbortController();
    const failSafe = window.setTimeout(() => controller.abort(), 8000);

    async function finish() {
      try {
        const path = loginHref();
        const response = await fetch(path, {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
          headers: { Accept: "text/html" },
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Could not open login (${response.status}).`);
        }
        if (cancelled) return;
        setProgress(100);
        window.location.replace(path);
      } catch {
        if (cancelled) return;
        setError("Could not finish loading. Check your connection and try again.");
      }
    }

    const start = window.setTimeout(() => {
      void finish();
    }, 700);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(tick);
      window.clearTimeout(failSafe);
      window.clearTimeout(start);
    };
  }, []);

  return (
    <div className="flex min-h-dvh flex-col px-[var(--space-page)]">
      <div className="flex flex-1 flex-col items-center justify-center">
        <BrandLockup />
        <p className="mt-3 text-[14px] text-placeholder">Your fitness journey starts here</p>
      </div>
      <div className="mb-16 flex flex-col items-center gap-3">
        {error ? (
          <>
            <p className="max-w-[260px] text-center text-[13px] text-muted">{error}</p>
            <Button
              type="button"
              className="w-auto min-w-[148px] px-6"
              onClick={() => window.location.replace(loginHref())}
            >
              Retry
            </Button>
          </>
        ) : (
          <>
            <div className="relative h-[4px] w-[148px] overflow-hidden rounded-full bg-track">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
              <div className="absolute inset-y-0 w-1/3 animate-[splash-shimmer_1.1s_ease-in-out_infinite] rounded-full bg-white/40" />
            </div>
            <p className="text-[13px] text-muted">loading...</p>
          </>
        )}
      </div>
    </div>
  );
}
