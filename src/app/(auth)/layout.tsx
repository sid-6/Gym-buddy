import { PhoneFrame } from "@/components/layout/PhoneFrame";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PhoneFrame>{children}</PhoneFrame>;
}
