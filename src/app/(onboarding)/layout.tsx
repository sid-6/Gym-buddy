import { PhoneFrame } from "@/components/layout/PhoneFrame";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PhoneFrame>{children}</PhoneFrame>;
}
