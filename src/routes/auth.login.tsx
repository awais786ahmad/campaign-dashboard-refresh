import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Quality Dial" },
      { name: "description", content: "Sign in to your Quality Dial workspace to manage calls, AI agents and campaigns." },
      { property: "og:title", content: "Sign in — Quality Dial" },
      { property: "og:description", content: "Access your AI call center workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to pick up where your team left off."
      footer={
        <>
          New to Quality Dial?{" "}
          <Link to="/auth/signup" className="font-medium text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@company.com" autoComplete="email" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
        </div>
        <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <Checkbox id="remember" />
          Keep me signed in for 30 days
        </label>
        <Button type="submit" className="w-full" size="lg" asChild>
          <Link to="/dashboard">Sign in</Link>
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
