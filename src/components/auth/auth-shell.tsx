import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Quote, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/marketing/logo";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="flex flex-col px-6 py-10 sm:px-12">
        <Link to="/" aria-label="Quality Dial home">
          <Logo />
        </Link>

        <div className="flex flex-1 items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm"
          >
            <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
            {description ? (
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
            ) : null}
            <div className="mt-8">{children}</div>
            {footer ? <div className="mt-7 text-sm text-muted-foreground">{footer}</div> : null}
          </motion.div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Quality Dial. All rights reserved.
        </p>
      </div>

      <aside className="relative hidden overflow-hidden ink-panel lg:flex">
        <div className="hero-glow pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative flex flex-col justify-between p-14">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/30 px-3.5 py-1.5 text-xs uppercase tracking-[0.18em]">
            <Sparkles className="size-3.5 text-accent" />
            AI call center
          </div>

          <div>
            <Quote className="size-8 text-accent" />
            <p className="mt-6 max-w-md font-display text-2xl leading-snug">
              We replaced four tools with Quality Dial and cut our average handle time by 38% in the
              first quarter.
            </p>
            <div className="mt-6 text-sm opacity-80">
              <p className="font-medium">Marisol Vega</p>
              <p>VP Revenue Operations, Northwind</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs opacity-70">
            <ShieldCheck className="size-4 text-accent" />
            SOC 2 Type II · GDPR · HIPAA ready
          </div>
        </div>
      </aside>
    </div>
  );
}
