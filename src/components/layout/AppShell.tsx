import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { TabBar } from "@/components/layout/TabBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame>
      <div className="min-h-dvh pb-[calc(var(--tabbar-clearance)+env(safe-area-inset-bottom))]">
        {children}
      </div>
      <TabBar />
    </PhoneFrame>
  );
}
