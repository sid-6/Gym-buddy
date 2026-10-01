"use client";

import { useState } from "react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { TextField } from "@/components/ui/TextField";
import { TextLink } from "@/components/ui/TextLink";
import { forgotPasswordAction } from "@/app/actions/auth";
import { routes } from "@/lib/routes";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex min-h-dvh flex-col px-[var(--space-page)] pb-8 pt-14">
      <BrandLockup compact tagline={false} />
      <h1 className="mt-8 text-[28px] font-extrabold tracking-tight">Forgot password</h1>
      <p className="mt-2 text-[15px] text-muted">
        Enter your email and we&apos;ll create a reset link.
      </p>
      <form
        className="mt-8 flex flex-col gap-5"
        action={async (formData) => {
          setError(null);
          const result = await forgotPasswordAction(formData);
          if (result.error) setError(result.error);
        }}
      >
        <ErrorBanner message={error} />
        <TextField label="Email" name="email" type="email" placeholder="you@email.com" />
        <Button type="submit">Send reset link</Button>
      </form>
      <p className="mt-6 text-center">
        <TextLink href={routes.login}>Back to Login</TextLink>
      </p>
    </div>
  );
}
