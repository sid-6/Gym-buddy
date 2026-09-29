import { ChatIcon } from "@/components/icons";
import { NavRow } from "@/components/ui/NavRow";
import { routes } from "@/lib/routes";

export function AskGymBuddyLink({ subtitle }: { subtitle: string }) {
  return (
    <NavRow
      href={routes.coach}
      icon={<ChatIcon className="size-5" />}
      title="Ask GymBuddy"
      subtitle={subtitle}
    />
  );
}
