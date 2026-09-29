import { AppShell } from "@/components/layout/AppShell";
import { requireOnboardedUser } from "@/lib/session";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireOnboardedUser();
  return <AppShell>{children}</AppShell>;
}
