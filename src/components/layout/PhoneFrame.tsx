type Props = {
  children: React.ReactNode;
};

export function PhoneFrame({ children }: Props) {
  return (
    <div className="flex min-h-dvh justify-center bg-bg">
      <div className="relative w-full max-w-phone min-h-dvh bg-bg tablet:border-x tablet:border-hairline">
        {children}
      </div>
    </div>
  );
}
