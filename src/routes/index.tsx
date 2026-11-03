import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Inbox,
  Megaphone,
  PhoneCall,
  Sparkles,
  Users,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { DashboardMockup } from "@/components/marketing/dashboard-mockup";
import {
  Reveal,
  SectionHeading,
  StaggerGroup,
  StaggerItem,
} from "@/components/marketing/motion-primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { plans } from "@/config/site";
import { motion } from "motion/react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quality Dial — AI Call Center Platform for Modern Teams" },
      {
        name: "description",
        content:
          "Run calls, AI voice agents, CRM, campaigns and a unified inbox from one elegant workspace. Start your free trial.",
      },
      { property: "og:title", content: "Quality Dial — AI Call Center Platform" },
      {
        property: "og:description",
        content: "Calls, AI agents, CRM, campaigns and automation in one workspace.",
      },
    ],
  }),
  component: Home,
});

const capabilities = [
  { icon: Users, title: "CRM & Leads", desc: "Segments, pipelines, tasks and custom data tables." },
  { icon: Bot, title: "AI Voice Agents", desc: "Agents that qualify, book and follow up 24/7." },
  { icon: PhoneCall, title: "Smart Dialer", desc: "Power dialing with live transcript and coaching." },
  { icon: Megaphone, title: "Campaigns", desc: "Inbound, outbound and broadcast in one console." },
  { icon: Inbox, title: "Unified Inbox", desc: "SMS, email and voicemail in one conversation." },
  { icon: BarChart3, title: "Analytics", desc: "Dashboards, reports and AI-written insights." },
];

const steps = [
  { n: "01", title: "Create workspace", desc: "Company, timezone and business hours." },
  { n: "02", title: "Import leads", desc: "CSV, CRM sync or manual entry." },
  { n: "03", title: "Create campaign", desc: "Pick a goal, script and audience." },
  { n: "04", title: "Start calling", desc: "Human or AI agents dial instantly." },
  { n: "05", title: "Track results", desc: "Live analytics and AI summaries." },
];

const aiFeatures = [
  "Live transcription",
  "AI call summary",
  "Real-time suggestions",
  "Automated follow-ups",
  "AI voice agents",
];

const stats = [
  { value: "50%", label: "More calls per agent" },
  { value: "3x", label: "Faster follow-ups" },
  { value: "90%", label: "Less manual work" },
];

const testimonials = [
  {
    name: "Amara Osei",
    role: "VP Sales, Northwind",
    quote:
      "We replaced four tools with Quality Dial. The AI summaries alone save our team an hour a day.",
  },
  {
    name: "Daniel Reyes",
    role: "Head of Support, Klarvo",
    quote:
      "Live transcripts and coaching turned our new hires productive in a week instead of a month.",
  },
  {
    name: "Sofia Lindqvist",
    role: "COO, Bright Loop",
    quote: "Campaign setup is the fastest I've seen. We launched a broadcast in under ten minutes.",
  },
];

function Home() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <Sparkles className="size-3.5 text-accent" />
              AI agents now generally available
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-4xl font-semibold leading-[1.06] text-foreground sm:text-5xl lg:text-6xl"
            >
              AI-powered call center platform built for{" "}
              <span className="text-gradient-accent">modern teams</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.15 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              Manage calls, AI agents, CRM, campaigns, messaging and automation from one calm,
              focused workspace.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.25 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Button size="lg" variant="hero" asChild>
                <Link to="/auth/login">
                  Start free trial <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Book a demo</Link>
              </Button>
            </motion.div>
            <p className="mt-5 text-xs text-muted-foreground">
              14-day trial · No credit card · Cancel anytime
            </p>
          </div>

          <DashboardMockup />
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Trusted by revenue teams worldwide
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-14 gap-y-6 opacity-70">
            {["Northwind", "Klarvo", "Bright Loop", "Meridian", "Ovacore"].map((n) => (
              <span key={n} className="font-display text-lg font-semibold text-muted-foreground">
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Everything in one platform */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          eyebrow="Platform"
          title="Everything in one platform"
          description="Stop stitching tools together. Quality Dial covers the entire call lifecycle from lead to outcome."
        />
        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <StaggerItem key={c.title}>
              <Card className="lift-hover h-full border-border p-7">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft">
                  <c.icon className="size-5 text-primary" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading
            eyebrow="How it works"
            title="Live in five simple steps"
            description="Most teams place their first call within ten minutes of signing up."
          />
          <StaggerGroup className="mt-14 grid gap-4 md:grid-cols-5">
            {steps.map((s) => (
              <StaggerItem key={s.n}>
                <div className="relative h-full rounded-2xl border border-border bg-card p-6">
                  <span className="font-display text-xs font-semibold tracking-widest text-accent">
                    {s.n}
                  </span>
                  <h3 className="mt-3 font-display text-base font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* AI features split */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="ink-panel relative overflow-hidden rounded-3xl p-9">
              <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-accent/25 blur-3xl" />
              <span className="inline-flex items-center gap-2 rounded-full border border-border/30 px-3 py-1 text-xs text-ink-foreground/80">
                <Bot className="size-3.5 text-accent" /> AI Copilot
              </span>
              <p className="mt-7 font-display text-2xl leading-snug text-ink-foreground">
                “The customer asked about pricing tiers. Recommend Professional and offer a
                Thursday demo.”
              </p>
              <div className="mt-8 space-y-3">
                {["Listening to call · 04:12", "Sentiment: positive", "Next best action ready"].map(
                  (line, i) => (
                    <motion.div
                      key={line}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.5 }}
                      className="flex items-center gap-3 rounded-xl border border-border/25 bg-card/8 px-4 py-3 text-sm text-ink-foreground/85"
                    >
                      <span className="size-1.5 rounded-full bg-accent" />
                      {line}
                    </motion.div>
                  ),
                )}
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              align="left"
              eyebrow="AI"
              title="An assistant on every call"
              description="Quality Dial listens, drafts and follows up so your team can focus on the conversation."
            />
            <StaggerGroup className="mt-8 grid gap-3">
              {aiFeatures.map((f) => (
                <StaggerItem key={f}>
                  <div className="lift-hover flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
                    <span className="flex size-7 items-center justify-center rounded-full bg-success/12">
                      <Check className="size-3.5 text-success" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{f}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-20 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <p className="font-display text-4xl font-semibold text-gradient-accent">{s.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading eyebrow="Customers" title="Teams that switched, stayed" />
        <StaggerGroup className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <Card className="lift-hover h-full border-border p-7">
                <p className="text-sm leading-relaxed text-foreground">“{t.quote}”</p>
                <div className="mt-7 flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary-soft text-primary">
                      {t.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Pricing preview */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple plans that scale with you"
            description="Start small, expand when your call volume grows."
          />
          <StaggerGroup className="mt-14 grid gap-5 lg:grid-cols-3">
            {plans.map((p) => (
              <StaggerItem key={p.name}>
                <Card
                  className={`lift-hover h-full p-8 ${
                    p.featured ? "border-accent/50 shadow-[var(--shadow-glow)]" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-foreground">{p.name}</h3>
                    {p.featured ? (
                      <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                        Popular
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-5 font-display text-4xl font-semibold text-foreground">
                    {p.price}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.cadence}</p>
                  <ul className="mt-7 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Check className="size-4 text-success" /> {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/pricing">
                View full pricing <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="ink-panel relative overflow-hidden rounded-3xl px-8 py-20 text-center">
            <div className="pointer-events-none absolute -left-24 top-0 size-80 rounded-full bg-accent/20 blur-3xl" />
            <h2 className="relative font-display text-3xl font-semibold text-ink-foreground sm:text-4xl">
              Ready to modernize your call center?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-ink-foreground/75">
              Launch your workspace today and place your first AI-assisted call in minutes.
            </p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="hero" asChild>
                <Link to="/auth/login">Get started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Book demo</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </MarketingLayout>
  );
}
