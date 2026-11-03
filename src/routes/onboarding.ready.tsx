import { createFileRoute, Link } from "@tanstack/react-router";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check, Bot, Users, Megaphone } from "lucide-react";

export const Route = createFileRoute("/onboarding/ready")({
  head: () => ({
    meta: [
      { title: "You're ready to dial — Quality Dial onboarding" },
      { name: "description", content: "Your Quality Dial workspace is configured. Launch your first campaign now." },
      { property: "og:title", content: "You're ready to dial — Quality Dial" },
      { property: "og:description", content: "Final step of the Quality Dial onboarding flow." },
    ],
  }),
  component: ReadyStep,
});

const nextSteps = [
  { icon: Bot, title: "Tune your AI agent", desc: "Pick a voice, script and escalation rules." },
  { icon: Users, title: "Invite teammates", desc: "Add agents and set role-based permissions." },
  { icon: Megaphone, title: "Launch a campaign", desc: "Build a dialing list and set pacing." },
];

function ReadyStep() {
  return (
    <OnboardingLayout
      step={4}
      title="Your workspace is ready"
      description="Everything is configured. Here's what most teams do in their first hour."
      actions={
        <>
          <Button variant="ghost" asChild>
            <Link to="/onboarding/phone">Back</Link>
          </Button>
          <Button size="lg" asChild>
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-3 rounded-2xl bg-success/10 px-5 py-4">
        <span className="flex size-8 items-center justify-center rounded-full bg-success text-success-foreground">
          <Check className="size-4" />
        </span>
        <p className="text-sm text-foreground">Workspace, leads and calling number configured.</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {nextSteps.map((s) => (
          <div key={s.title} className="rounded-2xl border border-border bg-background p-5 lift-hover">
            <s.icon className="size-5 text-accent" />
            <p className="mt-3 text-sm font-medium text-foreground">{s.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </OnboardingLayout>
  );
}
