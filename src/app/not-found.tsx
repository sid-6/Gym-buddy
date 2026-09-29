import { BrandLockup } from "@/components/brand/BrandLockup";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-[var(--space-page)] text-center">
      <BrandLockup compact />
      <p className="mt-8 text-[16px] font-semibold text-ink">Page not found</p>
      <p className="mt-2 text-[14px] text-muted">That screen isn’t in Gym buddy.</p>
      <Button href={routes.home} className="mt-6 max-w-xs">
        Go home
      </Button>
    </div>
  );
}
