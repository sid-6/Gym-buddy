import { BrandLockup } from "@/components/brand/BrandLockup";
import { ActionForm } from "@/components/forms/ActionForm";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { TextLink } from "@/components/ui/TextLink";
import { loginAction } from "@/app/actions/auth";
import { routes } from "@/lib/routes";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col px-[var(--space-page)] pb-8 pt-16">
      <BrandLockup compact />
      <ActionForm action={loginAction} className="mt-12 flex flex-col gap-5">
        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="sourav@gymbuddy.com"
          autoComplete="email"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <TextLink href={routes.forgotPassword}>Forgot password</TextLink>
        </div>
        <Button type="submit">Login</Button>
      </ActionForm>
      <p className="mt-6 text-center text-[15px] text-ink">
        Don&apos;t have an account? <TextLink href={routes.signup}>Signup</TextLink>
      </p>
      <p className="mt-auto pt-10 text-center text-[12px] text-placeholder">
        By continuing you agree to our{" "}
        <Link href={routes.terms} className="text-placeholder">
          Terms
        </Link>{" "}
        &{" "}
        <Link href={routes.privacy} className="text-placeholder">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
