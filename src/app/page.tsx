import { redirect } from "next/navigation";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { getSessionUser } from "@/lib/session";
import { routes } from "@/lib/routes";
import { SplashScreen } from "@/components/brand/SplashScreen";

export default async function SplashPage() {
  const user = await getSessionUser();
  if (user?.onboardingCompletedAt) redirect(routes.home);
  if (user) redirect(routes.goal);

  return (
    <PhoneFrame>
      <noscript>
        <meta httpEquiv="refresh" content={`0;url=${routes.login}`} />
        <p className="p-6 text-center text-[15px]">
          <a className="text-brand" href={routes.login}>
            Continue to login
          </a>
        </p>
      </noscript>
      <SplashScreen />
    </PhoneFrame>
  );
}
