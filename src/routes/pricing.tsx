import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/marketing-layout";
import { SectionHeading, StaggerGroup, StaggerItem } from "@/components/marketing/motion-primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { plans } from "@/config/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Quality Dial Plans for Every Team Size" },
      {
        name: "description",
        content:
          "Simple per-seat pricing for Quality Dial. Starter, Professional and Enterprise plans with AI agents, dialing minutes and analytics included.",
      },
      { property: "og:title", content: "Pricing — Quality Dial" },
      {
        property: "og:description",
        content: "Starter, Professional and Enterprise plans with AI agents and dialing included.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const comparison = [
  { feature: "Included dialing minutes", values: ["500", "5,000", "Custom"] },
  { feature: "AI voice agents", values: ["1", "10", "Unlimited"] },
  { feature: "Campaign automation", values: [false, true, true] },
  { feature: "Unified inbox", values: [false, true, true] },
  { feature: "QA call scoring", values: [false, true, true] },
  { feature: "SSO & audit logs", values: [false, false, true] },
  { feature: "Dedicated success manager", values: [false, false, true] },
];

const faqs = [
  {
    q: "Do unused minutes roll over?",
    a: "Minutes reset monthly. Overage is billed at a transparent per-minute rate shown in your billing dashboard before it applies.",
  },
  {
    q: "Can I bring my own carrier?",
    a: "Yes. Professional and Enterprise plans support SIP trunking and number porting from any major carrier.",
  },
  {
    q: "Is there a free trial?",
    a: "Every plan starts with a 14-day trial that includes AI agents and 100 test minutes. No card required.",
  },
  {
    q: "How does per-seat billing work?",
    a: "You are billed for active agent seats each month. Supervisors and admins with view-only access are free.",
  },
];

function PricingPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Pricing"
        title="Pricing that scales with your conversations"
        description="Start free, upgrade when your volume grows. Every plan includes CRM, dialing and reporting."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <StaggerGroup className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <Card
                className={cn(
                  "relative h-full p-8",
                  plan.featured
                    ? "border-transparent shadow-[var(--shadow-lift)] ring-2 ring-accent"
                    : "lift-hover",
                )}
              >
                {plan.featured ? (
                  <span className="absolute -top-3 left-8 rounded-full bg-[image:var(--gradient-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
                    Most popular
                  </span>
                ) : null}
                <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.blurb}</p>
                <p className="mt-6 font-display text-4xl font-semibold text-foreground">
                  {plan.price}
                </p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {plan.cadence}
                </p>
                <Button
                  className="mt-6 w-full"
                  variant={plan.featured ? "hero" : "outline"}
                  size="lg"
                  asChild
                >
                  <Link to={plan.name === "Enterprise" ? "/contact" : "/auth/signup"}>{plan.cta}</Link>
                </Button>
                <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <SectionHeading eyebrow="Compare" title="Plan comparison" />
          <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/60 text-left">
                  <th className="px-5 py-4 font-medium text-muted-foreground">Feature</th>
                  {plans.map((p) => (
                    <th key={p.name} className="px-5 py-4 font-semibold text-foreground">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-0">
                    <td className="px-5 py-4 text-muted-foreground">{row.feature}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-5 py-4 text-foreground">
                        {typeof v === "boolean" ? (
                          v ? (
                            <Check className="size-4 text-success" />
                          ) : (
                            <Minus className="size-4 text-muted-foreground/60" />
                          )
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </MarketingLayout>
  );
}
