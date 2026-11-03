import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Quality Dial" },
      { name: "description", content: "Request a secure password reset link for your Quality Dial account." },
      { property: "og:title", content: "Reset your password — Quality Dial" },
      { property: "og:description", content: "Request a secure password reset link." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter your work email and we'll send you a reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/auth/login" className="font-medium text-foreground underline underline-offset-4">
            Back to sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@company.com" />
        </div>
        <Button type="submit" className="w-full" size="lg" asChild>
          <Link to="/auth/reset-password">Send reset link</Link>
        </Button>
        <p className="rounded-xl bg-muted px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          Reset links expire after 30 minutes. If it doesn't arrive, check your spam folder or contact
          your workspace admin.
        </p>
      </form>
    </AuthShell>
  );
}
