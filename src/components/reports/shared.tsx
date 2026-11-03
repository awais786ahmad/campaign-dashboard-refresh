import * as React from "react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Download, SlidersHorizontal, Sparkles, TriangleAlert, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  datePresets,
  filterAgents,
  filterCampaigns,
  filterDirections,
  filterKinds,
  filterOutcomes,
  filterSegments,
  filterTeams,
  qaBands,
} from "@/data/reports";

/* ------------------------------------------------------------- Section nav */

const sections = [
  { label: "Overview", to: "/reports" },
  { label: "Calls", to: "/reports/calls" },
  { label: "Performance", to: "/reports/performance" },
  { label: "Campaigns", to: "/reports/campaigns" },
  { label: "Quality & AI", to: "/reports/quality" },
  { label: "Reports", to: "/reports/library" },
] as const;

export function ReportsNav() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The intelligence layer above calling, campaigns, leads, teams and AI agents.
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            activeOptions={{ exact: s.to === "/reports" }}
            className="whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "bg-card text-foreground shadow-sm" }}
          >
            {s.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

/* --------------------------------------------------------------- Filter bar */

export type Filters = {
  date: string;
  campaign: string;
  team: string;
  agent: string;
  kind: string;
  direction: string;
  outcome: string;
  segment: string;
  qa: string;
};

export const defaultFilters: Filters = {
  date: "Last 30 days",
  campaign: "All",
  team: "All",
  agent: "All",
  kind: "All",
  direction: "All",
  outcome: "All",
  segment: "All",
  qa: "All",
};

export function useFilters(initial: Partial<Filters> = {}) {
  const [filters, setFilters] = React.useState<Filters>({ ...defaultFilters, ...initial });
  const set = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));
  const reset = () => setFilters(defaultFilters);
  return { filters, set, reset };
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  allLabel,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
  allLabel?: string;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("h-9 w-auto min-w-36 gap-2", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allLabel ? <SelectItem value="All">{allLabel}</SelectItem> : null}
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function FilterBar({
  filters,
  onChange,
  onReset,
  exportLabel = "Export",
  compact,
  children,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  exportLabel?: string;
  compact?: boolean;
  children?: ReactNode;
}) {
  const activeAdvanced = [filters.direction, filters.outcome, filters.segment, filters.qa].filter((v) => v !== "All").length;
  const activeAll =
    activeAdvanced +
    [filters.campaign, filters.team, filters.agent, filters.kind].filter((v) => v !== "All").length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect value={filters.date} onChange={(v) => onChange({ date: v })} options={datePresets} placeholder="Date" />
      <FilterSelect value={filters.campaign} onChange={(v) => onChange({ campaign: v })} options={filterCampaigns} placeholder="Campaign" allLabel="All campaigns" />
      {!compact ? (
        <FilterSelect value={filters.team} onChange={(v) => onChange({ team: v })} options={filterTeams} placeholder="Team" allLabel="All teams" />
      ) : null}
      <FilterSelect value={filters.agent} onChange={(v) => onChange({ agent: v })} options={filterAgents} placeholder="Agent" allLabel="All agents" />
      <FilterSelect value={filters.kind} onChange={(v) => onChange({ kind: v })} options={filterKinds} placeholder="Human / AI" allLabel="Human & AI" className="min-w-32" />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <SlidersHorizontal className="mr-2 size-4" />
            More filters
            {activeAdvanced > 0 ? (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {activeAdvanced}
              </Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 space-y-3">
          <p className="text-sm font-medium">Advanced filters</p>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Call type</Label>
            <FilterSelect value={filters.direction} onChange={(v) => onChange({ direction: v })} options={filterDirections} placeholder="Call type" allLabel="Any type" className="w-full" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Outcome</Label>
            <FilterSelect value={filters.outcome} onChange={(v) => onChange({ outcome: v })} options={filterOutcomes} placeholder="Outcome" allLabel="Any outcome" className="w-full" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Lead segment</Label>
            <FilterSelect value={filters.segment} onChange={(v) => onChange({ segment: v })} options={filterSegments} placeholder="Segment" allLabel="Any segment" className="w-full" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">QA score</Label>
            <FilterSelect value={filters.qa} onChange={(v) => onChange({ qa: v })} options={qaBands} placeholder="QA score" allLabel="Any score" className="w-full" />
          </div>
          {children}
          <Button variant="ghost" size="sm" className="w-full" onClick={onReset}>
            Clear all filters
          </Button>
        </PopoverContent>
      </Popover>

      {activeAll > 0 ? (
        <Button variant="ghost" size="sm" className="h-9 text-muted-foreground" onClick={onReset}>
          Clear ({activeAll})
        </Button>
      ) : null}

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9" onClick={() => toast.success(`${exportLabel} queued — you'll get an email when it's ready`)}>
          <Download className="mr-2 size-4" />
          {exportLabel}
        </Button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Building blocks */

export function Delta({ value, className, suffix = "" }: { value: number; className?: string; suffix?: string }) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        up ? "text-emerald-600" : "text-rose-600",
        className,
      )}
    >
      {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      {Math.abs(value).toFixed(1)}%{suffix}
    </span>
  );
}

export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  return (
    <div className={cn("flex h-8 items-end gap-0.5", className)}>
      {data.map((v, i) => (
        <span
          key={i}
          className={cn("flex-1 rounded-sm bg-primary/25", i === data.length - 1 && "bg-primary")}
          style={{ height: `${25 + ((v - min) / range) * 75}%` }}
        />
      ))}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  hint,
  trend,
  onClick,
  className,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  trend?: number[];
  onClick?: () => void;
  className?: string;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-border bg-card p-4 text-left transition-colors",
        onClick && "hover:border-primary/40 hover:bg-accent/40",
        className,
      )}
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-3">
        <p className="font-display text-2xl font-semibold tracking-tight">{value}</p>
        {trend ? <Sparkline data={trend} className="w-20" /> : null}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        {typeof delta === "number" ? <Delta value={delta} /> : null}
        {hint ? <span className="truncate">{hint}</span> : null}
      </div>
    </Comp>
  );
}

export function StatTile({ label, value, sub }: { label: string; value: string | number; sub?: string | undefined }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold">{value}</p>
      {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="font-display text-base">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

export function RankedBars({
  items,
  onSelect,
  tone = "bg-primary",
  format = (n) => n.toLocaleString(),
}: {
  items: { label: string; value: number; tone?: string }[];
  onSelect?: (label: string) => void;
  tone?: string;
  format?: (n: number) => string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-2.5">
      {items.map((it) => {
        const Comp = onSelect ? "button" : "div";
        return (
          <li key={it.label}>
            <Comp
              onClick={onSelect ? () => onSelect(it.label) : undefined}
              className={cn("block w-full text-left", onSelect && "group cursor-pointer")}
            >
              <div className="flex items-center justify-between text-sm">
                <span className={cn(onSelect && "group-hover:text-primary group-hover:underline")}>{it.label}</span>
                <span className="font-medium tabular-nums">{format(it.value)}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-muted">
                <div className={cn("h-2 rounded-full", it.tone ?? tone)} style={{ width: `${(it.value / max) * 100}%` }} />
              </div>
            </Comp>
          </li>
        );
      })}
    </ul>
  );
}

export function Funnel({
  stages,
  onSelect,
}: {
  stages: { stage: string; value: number }[];
  onSelect?: (stage: string) => void;
}) {
  const top = stages[0]?.value ?? 1;
  return (
    <ol className="space-y-1">
      {stages.map((s, i) => {
        const prev = stages[i - 1]?.value;
        const pct = prev ? Math.round((s.value / prev) * 100) : null;
        const Comp = onSelect ? "button" : "div";
        return (
          <li key={s.stage}>
            {pct !== null ? (
              <p className="py-1 pl-3 text-xs text-muted-foreground">↓ {pct}% continue · {100 - pct}% drop-off</p>
            ) : null}
            <Comp
              onClick={onSelect ? () => onSelect(s.stage) : undefined}
              className={cn(
                "relative block w-full overflow-hidden rounded-lg border border-border bg-card text-left",
                onSelect && "hover:border-primary/40",
              )}
            >
              <div className="absolute inset-y-0 left-0 bg-primary/15" style={{ width: `${(s.value / top) * 100}%` }} />
              <div className="relative flex items-center justify-between px-3 py-2 text-sm">
                <span className="font-medium">{s.stage}</span>
                <span className="tabular-nums">
                  {s.value.toLocaleString()}
                  <span className="ml-2 text-xs text-muted-foreground">{Math.round((s.value / top) * 100)}%</span>
                </span>
              </div>
            </Comp>
          </li>
        );
      })}
    </ol>
  );
}

export function InsightCard({ tone, title, body, action }: { tone: "good" | "warn"; title: string; body?: string; action?: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        tone === "good" ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5",
      )}
    >
      <div className="flex items-start gap-3">
        {tone === "good" ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
        ) : (
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{title}</p>
          {body ? <p className="mt-1 text-sm text-muted-foreground">{body}</p> : null}
          {action ? <div className="mt-2">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function AiLabel({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <Sparkles className="size-3.5" /> {children}
    </p>
  );
}

export function ScorePill({ score }: { score: number }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-9 items-center justify-center rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
        score >= 90
          ? "bg-emerald-500/15 text-emerald-700"
          : score >= 80
            ? "bg-sky-500/15 text-sky-700"
            : score >= 70
              ? "bg-amber-500/15 text-amber-700"
              : "bg-rose-500/15 text-rose-700",
      )}
    >
      {score}
    </span>
  );
}

export function KindBadge({ kind }: { kind: "Human" | "AI" }) {
  return (
    <Badge variant="outline" className={cn("text-[10px]", kind === "AI" ? "border-primary/30 bg-primary/10 text-primary" : "")}>
      {kind}
    </Badge>
  );
}

export const chartTooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
} as const;

export function CheckboxRow({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} />
      <Label htmlFor={id} className="text-sm font-normal">
        {label}
      </Label>
    </div>
  );
}
