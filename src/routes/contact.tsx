import { createFileRoute } from "@tanstack/react-router";
import { Building2, Mail, MessageSquare, Phone } from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/marketing-layout";
import { Reveal } from "@/components/marketing/motion-primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Quality Dial — Talk to Sales or Support" },
      {
        name: "description",
        content:
          "Book a demo, request pricing or reach support. The Quality Dial team replies within one business day.",
      },
      { property: "og:title", content: "Contact — Quality Dial" },
      { property: "og:description", content: "Book a demo or reach the Quality Dial team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const channels = [
  { icon: Mail, title: "Email", value: "hello@qualitydial.com" },
  { icon: Phone, title: "Sales", value: "+1 (415) 555-0148" },
  { icon: MessageSquare, title: "Support", value: "24/7 in-app chat" },
  { icon: Building2, title: "HQ", value: "548 Market St, San Francisco" },
];

function ContactPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Contact"
        title="Let's map your call workflow"
        description="Tell us about your team and we'll show you exactly how Quality Dial would run your floor."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <Card className="p-8">
              <form
                className="grid gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Thanks! Our team will reply within one business day.");
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="Jordan" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Reyes" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" type="email" placeholder="jordan@company.com" required />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Northwind" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="size">Team size</Label>
                    <Select>
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1–10 agents</SelectItem>
                        <SelectItem value="11-50">11–50 agents</SelectItem>
                        <SelectItem value="51-200">51–200 agents</SelectItem>
                        <SelectItem value="200+">200+ agents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">What would you like to solve?</Label>
                  <Textarea id="message" rows={5} placeholder="We run outbound campaigns across three regions…" />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full sm:w-fit">
                  Send message
                </Button>
              </form>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4">
              {channels.map((c) => (
                <Card key={c.title} className="flex items-start gap-4 p-6">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <c.icon className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{c.title}</p>
                    <p className="text-sm text-muted-foreground">{c.value}</p>
                  </div>
                </Card>
              ))}
              <Card className="ink-panel border-border/30 p-6">
                <p className="font-display text-lg font-semibold">Prefer a live walkthrough?</p>
                <p className="mt-2 text-sm opacity-80">
                  30 minutes, screen-shared, tailored to your call flows. No slide deck.
                </p>
                <Button variant="hero" className="mt-5 w-full">
                  Book a demo
                </Button>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingLayout>
  );
}
