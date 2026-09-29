import { BrandLockup } from "@/components/brand/BrandLockup";
import { ActionForm } from "@/components/forms/ActionForm";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { TextLink } from "@/components/ui/TextLink";
import { signupAction } from "@/app/actions/auth";
import { routes } from "@/lib/routes";

export default function SignupPage() {
  return (
    <div className="flex min-h-dvh flex-col px-[var(--space-page)] pb-8 pt-14">
      <BrandLockup compact />
      <ActionForm action={signupAction} className="mt-10 flex flex-col gap-5">
        <TextField label="Name" name="name" placeholder="Your name" />
        <TextField label="Email" name="email" type="email" placeholder="you@email.com" />
        <TextField
          label="Password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
        />
        <Button type="submit">Create account</Button>
      </ActionForm>
      <p className="mt-6 text-center text-[15px] text-ink">
        Already have an account? <TextLink href={routes.login}>Login</TextLink>
      </p>
    </div>
  );
}
