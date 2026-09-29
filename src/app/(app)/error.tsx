"use client";

export default function ErrorView({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="text-[16px] font-semibold">Something went wrong</p>
      <p className="mt-2 text-[14px] text-muted">{error.message || "Please try again."}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 text-[15px] font-medium text-brand"
      >
        Retry
      </button>
    </div>
  );
}
