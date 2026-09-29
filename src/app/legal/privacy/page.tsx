import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { TextLink } from "@/components/ui/TextLink";
import { routes } from "@/lib/routes";

export default function PrivacyPage() {
  return (
    <PhoneFrame>
      <div className="px-[var(--space-page)] py-10">
        <h1 className="text-[28px] font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-[15px] leading-6 text-muted">
          Placeholder privacy policy for Gym buddy. Replace with the product legal copy before
          launch.
        </p>
        <p className="mt-6">
          <TextLink href={routes.login}>Back to Login</TextLink>
        </p>
      </div>
    </PhoneFrame>
  );
}
