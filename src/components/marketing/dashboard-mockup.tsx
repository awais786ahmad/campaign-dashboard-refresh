import { motion } from "motion/react";
import { Activity, Bot, PhoneCall, Users } from "lucide-react";

const bars = [42, 66, 38, 82, 54, 74, 61, 90, 48, 70];

export function DashboardMockup() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-10 hero-glow opacity-70 blur-2xl" />
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative surface-card overflow-hidden p-4 shadow-[var(--shadow-lift)]"
      >
        <div className="flex items-center justify-between rounded-xl bg-[image:var(--gradient-ink)] px-4 py-3">
          <div className="flex items-center gap-2 text-ink-foreground">
            <Activity className="size-4 text-accent" />
            <span className="font-display text-sm font-semibold">Live workspace</span>
          </div>
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-accent" />
            <span className="size-2 rounded-full bg-border/60" />
            <span className="size-2 rounded-full bg-border/60" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { icon: PhoneCall, label: "Live calls", value: "18" },
            { icon: Users, label: "Leads today", value: "1,204" },
            { icon: Bot, label: "AI agents", value: "6" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
              className="rounded-xl border border-border bg-surface p-3"
            >
              <s.icon className="size-4 text-primary" />
              <p className="mt-2 font-display text-xl font-semibold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Calls per hour</p>
            <span className="rounded-full bg-success/12 px-2 py-0.5 text-[10px] font-medium text-success">
              +24%
            </span>
          </div>
          <div className="mt-4 flex h-24 items-end gap-1.5">
            {bars.map((h, i) => (
              <motion.span
                key={i}
                initial={{ height: 4 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 rounded-t-md bg-[image:var(--gradient-accent)] opacity-90"
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-3 flex items-start gap-3 rounded-xl border border-border bg-primary-soft/60 p-3"
        >
          <Bot className="mt-0.5 size-4 text-primary" />
          <div>
            <p className="text-xs font-semibold text-foreground">AI assistant</p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Lead is interested in the Professional plan — suggest a demo for Thursday 10:00.
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="animate-float absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-lift)] sm:block"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Campaign</p>
        <p className="font-display text-sm font-semibold text-foreground">Q3 Renewals · 78%</p>
        <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-[image:var(--gradient-accent)]"
            initial={{ width: 0 }}
            animate={{ width: "78%" }}
            transition={{ delay: 1.2, duration: 1 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
