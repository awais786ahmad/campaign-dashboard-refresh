import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — Quality Dial" },
      { name: "description", content: "Start a free Quality Dial trial and launch your AI call center in minutes." },
      { property: "og:title", content: "Create your account — Quality Dial" },
      { property: "og:description", content: "Start a free trial of the AI call center platform." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <AuthShell
      title="Create your workspace"
      description="14-day free trial. No credit card required."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/auth/login" className="font-medium text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first">First name</Label>
            <Input id="first" placeholder="Avery" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" placeholder="Chen" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@company.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="At least 8 characters" />
          <p className="text-xs text-muted-foreground">Use 8+ characters with a number and a symbol.</p>
        </div>
        <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <Checkbox id="terms" className="mt-0.5" />
          <span>
            I agree to the Terms of Service and Privacy Policy.
          </span>
        </label>
        <Button type="submit" className="w-full" size="lg" asChild>
          <Link to="/auth/verify-email">Create account</Link>
        </Button>

        <div className="flex items-center gap-3 py-1">
          <Separator className="flex-1" />
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <Button type="button" variant="outline">Google</Button>
          <Button type="button" variant="outline">Microsoft</Button>
        </div>
      </form>
    </AuthShell>
  );
}
