import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bot,
  Inbox,
  Megaphone,
  PhoneCall,
  Users,
  Workflow,
  ShieldCheck,
} from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/marketing-layout";
import { Reveal, SectionHeading, StaggerGroup, StaggerItem } from "@/components/marketing/motion-primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Quality Dial Call Center Platform" },
      {
        name: "description",
        content:
          "AI voice agents, power dialing, CRM, campaigns, unified inbox and analytics — every call center capability in one workspace.",
      },
      { property: "og:title", content: "Features — Quality Dial" },
      {
        property: "og:description",
        content: "AI agents, dialer, CRM, campaigns, inbox and analytics in one platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeaturesPage,
});

const pillars = [
  {
    icon: Bot,
    title: "AI voice agents",
    body: "Design agents with a visual prompt builder, guardrails, and live barge-in for human takeover.",
    points: ["Natural turn-taking", "Live transcript", "Human handoff"],
  },
  {
    icon: PhoneCall,
    title: "Power dialing",
    body: "Preview, progressive and predictive modes with local presence and answering-machine detection.",
    points: ["3 dial modes", "Local presence", "Call disposition"],
  },
  {
    icon: Users,
    title: "CRM & leads",
    body: "Lead records, segments, custom fields and task queues that stay in sync with every conversation.",
    points: ["Smart segments", "Task queues", "Timeline history"],
  },
  {
    icon: Megaphone,
    title: "Campaigns",
    body: "Multi-step outreach across voice, SMS and email with pacing rules and quiet-hours compliance.",
    points: ["Sequences", "Pacing rules", "A/B variants"],
  },
  {
    icon: Inbox,
    title: "Unified inbox",
    body: "SMS, WhatsApp, email and voicemail in one thread per contact with assignment and SLAs.",
    points: ["Shared threads", "Assignment", "Canned replies"],
  },
  {
    icon: BarChart3,
    title: "Analytics",
    body: "Team, campaign and agent scorecards with call quality scoring generated from transcripts.",
    points: ["Live wallboard", "QA scoring", "Exports"],
  },
];

function FeaturesPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Platform"
        title="Everything your call center runs on, in one place"
        description="Quality Dial replaces the stack of dialers, CRMs and messaging tools with a single workspace your team actually enjoys using."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="hero" size="lg" asChild>
            <Link to="/auth/login">Start free trial</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact">Talk to sales</Link>
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <StaggerGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <StaggerItem key={p.title}>
              <Card className="lift-hover h-full border-border p-7">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <p.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-accent" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading
            eyebrow="Automation"
            title="Workflows that remove the busywork"
            description="Trigger follow-ups, route conversations and update records without writing code."
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {[
              {
                icon: Workflow,
                title: "Visual automation builder",
                body: "Chain triggers, conditions and actions across calls, messages and CRM records.",
              },
              {
                icon: ShieldCheck,
                title: "Compliance guardrails",
                body: "Consent capture, DNC suppression, recording notices and retention policies built in.",
              },
              {
                icon: BarChart3,
                title: "Live coaching",
                body: "Whisper, barge and AI next-best-action prompts surfaced during the call.",
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="surface-card h-full p-7">
                  <f.icon className="size-5 text-accent" />
                  <h3 className="mt-5 text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <SectionHeading
          title="See it running on your own data"
          description="Spin up a workspace in minutes — no phone system migration required to start."
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="hero" size="lg" asChild>
            <Link to="/auth/login">Create workspace</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/pricing">Compare plans</Link>
          </Button>
        </div>
      </section>
    </MarketingLayout>
  );
}
