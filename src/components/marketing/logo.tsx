import { cn } from "@/lib/utils";

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-[image:var(--gradient-ink)] shadow-[var(--shadow-soft)]">
        <span className="size-3.5 rounded-full bg-[image:var(--gradient-accent)]" />
        <span className="absolute inset-1 rounded-lg border border-border/25" />
      </span>
      <span
        className={cn(
          "font-display text-[1.05rem] font-semibold tracking-tight",
          inverted ? "text-ink-foreground" : "text-foreground",
        )}
      >
        Quality Dial
      </span>
    </span>
  );
}
