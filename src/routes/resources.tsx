import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, FileText, GraduationCap, Newspaper } from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/marketing-layout";
import { SectionHeading, StaggerGroup, StaggerItem } from "@/components/marketing/motion-primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Guides, Docs & Playbooks | Quality Dial" },
      {
        name: "description",
        content:
          "Documentation, implementation guides, QA playbooks and product changelog for teams running Quality Dial.",
      },
      { property: "og:title", content: "Resources — Quality Dial" },
      {
        property: "og:description",
        content: "Docs, guides, playbooks and changelog for call center teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResourcesPage,
});

const collections = [
  { icon: BookOpen, title: "Documentation", body: "Setup, numbers, integrations and API references." },
  { icon: GraduationCap, title: "Academy", body: "Short courses for agents, supervisors and admins." },
  { icon: FileText, title: "Playbooks", body: "Scripts, QA rubrics and campaign templates that convert." },
  { icon: Newspaper, title: "Changelog", body: "Everything we shipped, every two weeks." },
];

const articles = [
  {
    tag: "Guide",
    title: "Designing an AI voice agent that customers trust",
    body: "Structure, tone, escalation paths and the five guardrails every production agent needs.",
    read: "9 min read",
  },
  {
    tag: "Playbook",
    title: "The outbound campaign cadence that books 3x more meetings",
    body: "A tested 12-touch sequence blending calls, SMS and email across two weeks.",
    read: "7 min read",
  },
  {
    tag: "Benchmark",
    title: "2026 call center benchmarks by industry",
    body: "Connect rates, handle time and CSAT baselines from 4M+ conversations.",
    read: "12 min read",
  },
  {
    tag: "Guide",
    title: "Migrating from a legacy dialer without downtime",
    body: "A phased plan for porting numbers, moving lists and training your floor.",
    read: "10 min read",
  },
  {
    tag: "QA",
    title: "Building a scorecard your agents don't dread",
    body: "How to weight criteria and calibrate reviewers with AI-assisted scoring.",
    read: "6 min read",
  },
  {
    tag: "Changelog",
    title: "New: live coaching prompts and inbox SLAs",
    body: "Supervisors can now whisper suggestions generated mid-call from transcripts.",
    read: "3 min read",
  },
];

function ResourcesPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Resources"
        title="Learn the craft of modern calling"
        description="Guides, benchmarks and playbooks from teams running millions of conversations on Quality Dial."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <StaggerItem key={c.title}>
              <Card className="lift-hover h-full p-6">
                <c.icon className="size-5 text-accent" />
                <h3 className="mt-4 font-semibold text-foreground">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading eyebrow="Latest" title="Fresh from the library" align="left" />
          <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <StaggerItem key={a.title}>
                <Card className="lift-hover flex h-full flex-col p-6">
                  <Badge variant="secondary" className="w-fit">
                    {a.tag}
                  </Badge>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">
                    {a.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {a.body}
                  </p>
                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{a.read}</span>
                    <ArrowRight className="size-4 text-accent" />
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <SectionHeading
          title="Need help with your rollout?"
          description="Our onboarding specialists have migrated hundreds of floors. They'll map your workflow for free."
        />
        <div className="mt-8">
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Book a working session</Link>
          </Button>
        </div>
      </section>
    </MarketingLayout>
  );
}
