import { createFileRoute, Link } from "@tanstack/react-router";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PhoneCall } from "lucide-react";

export const Route = createFileRoute("/onboarding/phone")({
  head: () => ({
    meta: [
      { title: "Choose a phone number — Quality Dial onboarding" },
      { name: "description", content: "Pick a local or toll-free number, or port an existing one into Quality Dial." },
      { property: "og:title", content: "Choose a phone number — Quality Dial" },
      { property: "og:description", content: "Step 3 of the Quality Dial onboarding flow." },
    ],
  }),
  component: PhoneStep,
});

const numbers = [
  { number: "+1 (415) 555-0142", city: "San Francisco, CA", tag: "Local" },
  { number: "+1 (212) 555-0188", city: "New York, NY", tag: "Local" },
  { number: "+1 (833) 555-0104", city: "Nationwide", tag: "Toll-free" },
];

function PhoneStep() {
  return (
    <OnboardingLayout
      step={3}
      title="Claim your calling number"
      description="Every workspace gets one number included. Add more from Settings any time."
      actions={
        <>
          <Button variant="ghost" asChild>
            <Link to="/onboarding/leads">Back</Link>
          </Button>
          <Button asChild>
            <Link to="/onboarding/ready">Continue</Link>
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        <Label htmlFor="area">Search by area code or city</Label>
        <Input id="area" placeholder="415, Austin, toll-free…" />
      </div>

      <div className="mt-5 grid gap-3">
        {numbers.map((n) => (
          <label
            key={n.number}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-ring has-[:checked]:border-accent has-[:checked]:bg-accent-soft"
          >
            <input type="radio" name="number" className="sr-only" />
            <span className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
                <PhoneCall className="size-4.5 text-foreground" />
              </span>
              <span>
                <span className="block text-sm font-medium text-foreground">{n.number}</span>
                <span className="text-xs text-muted-foreground">{n.city}</span>
              </span>
            </span>
            <Badge variant="secondary">{n.tag}</Badge>
          </label>
        ))}
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        Already have a number? Porting takes 3–5 business days and keeps your caller ID reputation.
      </p>
    </OnboardingLayout>
  );
}
