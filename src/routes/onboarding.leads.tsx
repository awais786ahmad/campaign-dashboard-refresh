import { createFileRoute, Link } from "@tanstack/react-router";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { Button } from "@/components/ui/button";
import { UploadCloud, Table2, Plug } from "lucide-react";

export const Route = createFileRoute("/onboarding/leads")({
  head: () => ({
    meta: [
      { title: "Import your leads — Quality Dial onboarding" },
      { name: "description", content: "Upload a CSV, sync your CRM, or start from scratch with Quality Dial leads." },
      { property: "og:title", content: "Import your leads — Quality Dial" },
      { property: "og:description", content: "Step 2 of the Quality Dial onboarding flow." },
    ],
  }),
  component: LeadsStep,
});

const sources = [
  { icon: UploadCloud, title: "Upload a CSV", desc: "Map columns to contacts, phones and tags." },
  { icon: Plug, title: "Sync a CRM", desc: "Salesforce, HubSpot or Pipedrive two-way sync." },
  { icon: Table2, title: "Start empty", desc: "Add contacts manually as you go." },
];

function LeadsStep() {
  return (
    <OnboardingLayout
      step={2}
      title="Bring in your leads"
      description="Choose how contacts should flow into your CRM. You can add more sources later."
      actions={
        <>
          <Button variant="ghost" asChild>
            <Link to="/onboarding/workspace">Back</Link>
          </Button>
          <Button asChild>
            <Link to="/onboarding/phone">Continue</Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-3">
        {sources.map((s) => (
          <label
            key={s.title}
            className="flex cursor-pointer items-start gap-4 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-ring has-[:checked]:border-accent has-[:checked]:bg-accent-soft"
          >
            <input type="radio" name="source" className="sr-only" />
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <s.icon className="size-5 text-foreground" />
            </span>
            <span>
              <span className="block text-sm font-medium text-foreground">{s.title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{s.desc}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
        <UploadCloud className="mx-auto size-6 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">Drop your CSV here</p>
        <p className="mt-1 text-xs text-muted-foreground">Up to 50,000 rows · .csv or .xlsx</p>
        <Button variant="outline" size="sm" className="mt-4">
          Browse files
        </Button>
      </div>
    </OnboardingLayout>
  );
}
