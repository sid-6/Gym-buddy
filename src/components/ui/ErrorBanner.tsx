type Props = {
  message?: string | null;
};

export function ErrorBanner({ message }: Props) {
  if (!message) return null;
  return (
    <p className="rounded-[14px] border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
      {message}
    </p>
  );
}
