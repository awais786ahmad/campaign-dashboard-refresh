import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { MailCheck } from "lucide-react";

export const Route = createFileRoute("/auth/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify your email — Quality Dial" },
      { name: "description", content: "Enter the 6-digit code we sent to confirm your Quality Dial email address." },
      { property: "og:title", content: "Verify your email — Quality Dial" },
      { property: "og:description", content: "Confirm your email with the 6-digit code." },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  return (
    <AuthShell
      title="Verify your email"
      description="We sent a 6-digit code to you@company.com. Enter it below to activate your workspace."
      footer={
        <>
          Wrong address?{" "}
          <Link to="/auth/signup" className="font-medium text-foreground underline underline-offset-4">
            Change email
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex size-11 items-center justify-center rounded-xl bg-accent-soft">
          <MailCheck className="size-5 text-accent-foreground" />
        </div>

        <InputOTP maxLength={6}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <Button className="w-full" size="lg" asChild>
          <Link to="/onboarding/workspace">Verify and continue</Link>
        </Button>

        <p className="text-sm text-muted-foreground">
          Didn't get the code?{" "}
          <button type="button" className="font-medium text-foreground underline underline-offset-4">
            Resend in 0:42
          </button>
        </p>
      </div>
    </AuthShell>
  );
}
