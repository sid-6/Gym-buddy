import { BrandLockup } from "@/components/brand/BrandLockup";
import { ActionForm } from "@/components/forms/ActionForm";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { resetPasswordAction } from "@/app/actions/auth";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-dvh flex-col px-[var(--space-page)] pb-8 pt-14">
      <BrandLockup compact tagline={false} />
      <h1 className="mt-8 text-[28px] font-extrabold tracking-tight">Reset password</h1>
      <ActionForm action={resetPasswordAction} className="mt-8 flex flex-col gap-5">
        <input type="hidden" name="token" value={token ?? ""} />
        <TextField
          label="New password"
          name="password"
          type="password"
          placeholder="Enter password"
        />
        <TextField
          label="Confirm password"
          name="confirm"
          type="password"
          placeholder="Enter password"
        />
        <Button type="submit">Update password</Button>
      </ActionForm>
    </div>
  );
}
