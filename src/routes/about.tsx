import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe2, HeartHandshake, Rocket, ShieldCheck } from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/marketing-layout";
import { SectionHeading, StaggerGroup, StaggerItem, Reveal } from "@/components/marketing/motion-primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Quality Dial — The Team Behind the Platform" },
      {
        name: "description",
        content:
          "Quality Dial is built by operators and engineers who ran call floors. Learn our story, values and security posture.",
      },
      { property: "og:title", content: "About — Quality Dial" },
      { property: "og:description", content: "The people and principles behind Quality Dial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Rocket, title: "Ship for the floor", body: "Every release is tested by agents taking real calls, not just product managers." },
  { icon: HeartHandshake, title: "Human in the loop", body: "AI handles volume; people handle nuance. We design for the handoff." },
  { icon: ShieldCheck, title: "Security by default", body: "Encryption, least privilege and auditability are table stakes, not upsells." },
  { icon: Globe2, title: "Built for everywhere", body: "Numbers, languages and compliance rules across 40+ countries." },
];

const stats = [
  { value: "4M+", label: "Conversations monthly" },
  { value: "38%", label: "Average handle time saved" },
  { value: "40+", label: "Countries supported" },
  { value: "99.99%", label: "Platform uptime" },
];

const team = [
  { name: "Aria Chen", role: "Co-founder & CEO", initials: "AC" },
  { name: "Daniel Okafor", role: "Co-founder & CTO", initials: "DO" },
  { name: "Priya Raman", role: "VP Product", initials: "PR" },
  { name: "Marco Silva", role: "Head of Customer Success", initials: "MS" },
];

function AboutPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="About"
        title="We build the tools we wished we had on the floor"
        description="Quality Dial started in a 60-seat support center where four disconnected systems made every call harder than it needed to be."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="surface-card p-7 text-center">
                <p className="font-display text-3xl font-semibold text-foreground">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading eyebrow="Values" title="What we optimize for" />
          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <Card className="lift-hover h-full p-6">
                  <v.icon className="size-5 text-accent" />
                  <h3 className="mt-4 font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading eyebrow="Team" title="Operators, engineers and researchers" />
        <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <StaggerItem key={m.name}>
              <Card className="lift-hover h-full p-6 text-center">
                <Avatar className="mx-auto size-14">
                  <AvatarFallback className="bg-primary-soft text-primary">{m.initials}</AvatarFallback>
                </Avatar>
                <p className="mt-4 font-semibold text-foreground">{m.name}</p>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <SectionHeading
            eyebrow="Security"
            title="Enterprise-grade from day one"
            description="SOC 2 Type II, GDPR and HIPAA-ready infrastructure with regional data residency, SSO, SCIM and full audit trails."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Request security review</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/features">Explore the platform</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
