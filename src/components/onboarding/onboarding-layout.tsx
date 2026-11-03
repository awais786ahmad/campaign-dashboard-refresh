import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import { cn } from "@/lib/utils";

export const onboardingSteps = [
  { id: 1, label: "Workspace", to: "/onboarding/workspace" },
  { id: 2, label: "Import leads", to: "/onboarding/leads" },
  { id: 3, label: "Phone number", to: "/onboarding/phone" },
  { id: 4, label: "Ready", to: "/onboarding/ready" },
] as const;

export function OnboardingLayout({
  step,
  title,
  description,
  children,
  actions,
}: {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/" aria-label="Quality Dial home">
            <Logo />
          </Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Skip for now
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <ol className="flex flex-wrap items-center gap-3">
          {onboardingSteps.map((s) => {
            const done = s.id < step;
            const active = s.id === step;
            return (
              <li key={s.id} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border text-xs font-medium",
                    done && "border-transparent bg-primary text-primary-foreground",
                    active && "border-transparent bg-accent text-accent-foreground",
                    !done && !active && "border-border bg-background text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3.5" /> : s.id}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    active ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </span>
                {s.id < onboardingSteps.length ? (
                  <span className="mx-1 hidden h-px w-8 bg-border sm:block" />
                ) : null}
              </li>
            );
          })}
        </ol>

        <motion.section
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 surface-card p-7 sm:p-10"
        >
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
          <div className="mt-8">{children}</div>
          {actions ? (
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
              {actions}
            </div>
          ) : null}
        </motion.section>
      </main>
    </div>
  );
}
