import * as React from "react";
import { Link } from "@tanstack/react-router";
import { icons, PhoneCall, SkipForward } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Delta, Funnel, InsightCard, RankedBars, Sparkline, chartTooltipStyle } from "@/components/reports/shared";
import type { WidgetData, WidgetDefinition, WidgetInstance } from "@/data/dashboard-widgets";
import { cn } from "@/lib/utils";

const toneDot: Record<string, string> = {
  good: "bg-emerald-500",
  warn: "bg-amber-500",
  bad: "bg-rose-500",
  info: "bg-sky-500",
  muted: "bg-muted-foreground/40",
};

const toneBadge: Record<string, string> = {
  good: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  warn: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  bad: "border-rose-500/30 bg-rose-500/10 text-rose-700",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-700",
};

export function WidgetBody({
  data,
  def,
  instance,
  compact,
}: {
  data: WidgetData;
  def: WidgetDefinition;
  instance: WidgetInstance;
  /** Preview mode inside the widget library. */
  compact?: boolean;
}) {
  switch (data.kind) {
    case "kpi":
      return <KpiBody data={data} tall={instance.size.h > 2 && !compact} />;
    case "series":
      return <SeriesBody data={data} chart={instance.config?.chart ?? data.defaultChart ?? "area"} />;
    case "donut":
      return <DonutBody data={data} />;
    case "ranked":
      return (
        <RankedBars
          items={data.items}
          {...(data.format === "percent"
            ? { format: (n: number) => `${n}%` }
            : data.format === "score"
              ? { format: (n: number) => `${n}` }
              : {})}
        />
      );
    case "funnel":
      return <Funnel stages={data.stages} />;
    case "table":
      return <TableBody data={data} />;
    case "list":
      return <ListBody data={data} />;
    case "actions":
      return <ActionsBody data={data} />;
    case "status":
      return <StatusBody data={data} />;
    case "progress":
      return <ProgressBody data={data} />;
    case "insights":
      return (
        <div className={cn("grid gap-3", instance.size.w >= 8 && !compact ? "sm:grid-cols-2" : "")}>
          {data.items.map((i) => (
            <InsightCard key={i.title} tone={i.tone} title={i.title} body={i.body} />
          ))}
        </div>
      );
    case "compare":
      return <CompareBody data={data} />;
    case "heatmap":
      return <HeatmapBody data={data} />;
    case "next-call":
      return <NextCallBody data={data} title={def.title} />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ KPI */

function KpiBody({ data, tall }: { data: Extract<WidgetData, { kind: "kpi" }>; tall: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-end justify-between gap-3">
        <p className="font-display text-3xl font-semibold tracking-tight">{data.value}</p>
        {data.trend ? <Sparkline data={data.trend} className="w-24" /> : null}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        {typeof data.delta === "number" ? <Delta value={data.delta} /> : null}
        {data.hint ? <span className="truncate">{data.hint}</span> : null}
      </div>
      {typeof data.progress === "number" ? (
        <div className="mt-3 h-1.5 rounded-full bg-muted">
          <div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.min(100, data.progress)}%` }} />
        </div>
      ) : null}
      {data.breakdown && (tall || !data.trend) ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {data.breakdown.map((b) => (
            <div key={b.label} className="rounded-lg bg-muted/50 px-2.5 py-1.5">
              <p className="text-[11px] text-muted-foreground">{b.label}</p>
              <p className="text-sm font-medium tabular-nums">{b.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- Series */

function SeriesBody({ data, chart }: { data: Extract<WidgetData, { kind: "series" }>; chart: "area" | "bar" | "line" }) {
  const common = {
    data: data.data,
    margin: { top: 6, right: 6, left: -18, bottom: 0 },
  };
  const axes = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
      <XAxis dataKey={data.xKey} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
      <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
      <Tooltip contentStyle={chartTooltipStyle} />
    </>
  );
  return (
    <div className="flex h-full min-h-[120px] flex-col">
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {chart === "bar" ? (
            <BarChart {...common}>
              {axes}
              {data.keys.map((k) => (
                <Bar key={k.key} dataKey={k.key} name={k.label} fill={k.color} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          ) : chart === "line" ? (
            <LineChart {...common}>
              {axes}
              {data.keys.map((k) => (
                <Line key={k.key} type="monotone" dataKey={k.key} name={k.label} stroke={k.color} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          ) : (
            <AreaChart {...common}>
              {axes}
              {data.keys.map((k) => (
                <Area key={k.key} type="monotone" dataKey={k.key} name={k.label} stroke={k.color} fill={k.color} fillOpacity={0.15} strokeWidth={2} />
              ))}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-3">
        {data.keys.map((k) => (
          <span key={k.key} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="size-2 rounded-full" style={{ background: k.color }} />
            {k.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Donut */

function DonutBody({ data }: { data: Extract<WidgetData, { kind: "donut" }> }) {
  const total = data.items.reduce((s, i) => s + i.value, 0) || 1;
  return (
    <div className="flex h-full min-h-[120px] items-center gap-4">
      <div className="relative h-full min-h-[120px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data.items} dataKey="value" nameKey="label" innerRadius="62%" outerRadius="90%" paddingAngle={2} stroke="none">
              {data.items.map((it) => (
                <Cell key={it.label} fill={it.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={chartTooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-display text-lg font-semibold">{data.center ?? total.toLocaleString()}</span>
        </div>
      </div>
      <ul className="w-[46%] space-y-1.5">
        {data.items.map((it) => (
          <li key={it.label} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="size-2 shrink-0 rounded-full" style={{ background: it.color }} />
              <span className="truncate text-muted-foreground">{it.label}</span>
            </span>
            <span className="font-medium tabular-nums">{Math.round((it.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- Table */

function TableBody({ data }: { data: Extract<WidgetData, { kind: "table" }> }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
          {data.columns.map((c) => (
            <th key={c.key} className={cn("pb-2 font-medium", c.align === "right" && "text-right")}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((r, i) => (
          <tr key={i} className="border-t border-border/70">
            {data.columns.map((c) => (
              <td key={c.key} className={cn("py-2 pr-3", c.align === "right" && "pr-0 text-right tabular-nums")}>
                {r[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ----------------------------------------------------------------- List */

function ListBody({ data }: { data: Extract<WidgetData, { kind: "list" }> }) {
  return (
    <ul className="divide-y divide-border/70">
      {data.items.map((it, i) => (
        <li key={`${it.title}-${i}`} className="flex items-center justify-between gap-3 py-2 first:pt-0">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{it.title}</p>
            <p className="truncate text-xs text-muted-foreground">{it.meta}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {it.badge ? (
              <Badge variant="outline" className={cn("text-[10px]", it.tone ? toneBadge[it.tone] : "")}>
                {it.badge}
              </Badge>
            ) : null}
            {it.action ? (
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => toast.success(`${it.action}: ${it.title}`)}>
                {it.action}
              </Button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------- Actions */

function ActionsBody({ data }: { data: Extract<WidgetData, { kind: "actions" }> }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {data.items.map((it) => {
        const Icon = icons[it.icon as keyof typeof icons];
        if (!it.to) return null;
        return (
          <Button key={it.label} asChild variant="outline" className="h-auto justify-start gap-2 px-3 py-2 text-xs">
            <Link to={it.to}>
              {Icon ? <Icon className="size-4 text-primary" /> : null}
              <span className="truncate">{it.label}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- Status */

function StatusBody({ data }: { data: Extract<WidgetData, { kind: "status" }> }) {
  return (
    <ul className="space-y-2">
      {data.items.map((it) => (
        <li key={it.label} className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2 text-sm">
          <span className="flex min-w-0 items-center gap-2">
            <span className="relative flex size-2">
              {data.pulse && it.tone === "good" ? (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              ) : null}
              <span className={cn("relative inline-flex size-2 rounded-full", toneDot[it.tone ?? "muted"])} />
            </span>
            <span className="truncate">{it.label}</span>
          </span>
          <span className="font-medium tabular-nums">{it.value}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------- Progress */

function ProgressBody({ data }: { data: Extract<WidgetData, { kind: "progress" }> }) {
  return (
    <ul className="space-y-3">
      {data.items.map((it) => {
        const pct = Math.min(100, Math.round((it.value / Math.max(1, it.target)) * 100));
        return (
          <li key={it.label}>
            <div className="flex items-center justify-between text-sm">
              <span>{it.label}</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                <span className="font-medium text-foreground">{it.value.toLocaleString()}{it.unit ?? ""}</span> / {it.target.toLocaleString()}{it.unit ?? ""}
              </span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-muted">
              <div className={cn("h-2 rounded-full", pct >= 100 ? "bg-emerald-500" : pct >= 60 ? "bg-primary" : "bg-amber-500")} style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* -------------------------------------------------------------- Compare */

function CompareBody({ data }: { data: Extract<WidgetData, { kind: "compare" }> }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-[11px] uppercase tracking-wide text-muted-foreground">
          <th className="pb-2 text-left font-medium">Metric</th>
          <th className="pb-2 text-right font-medium">{data.aLabel}</th>
          <th className="pb-2 text-right font-medium text-primary">{data.bLabel}</th>
        </tr>
      </thead>
      <tbody>
        {data.rows.map((r) => (
          <tr key={r.metric} className="border-t border-border/70">
            <td className="py-2">{r.metric}</td>
            <td className="py-2 text-right tabular-nums">{r.a}</td>
            <td className="py-2 text-right font-medium tabular-nums">{r.b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* -------------------------------------------------------------- Heatmap */

function HeatmapBody({ data }: { data: Extract<WidgetData, { kind: "heatmap" }> }) {
  const max = Math.max(1, ...data.values.flat());
  return (
    <div className="space-y-1 text-[10px] text-muted-foreground">
      <div className="grid gap-1" style={{ gridTemplateColumns: `2.5rem repeat(${data.hours.length}, minmax(0,1fr))` }}>
        <span />
        {data.hours.map((h) => (
          <span key={h} className="truncate text-center">{h}</span>
        ))}
        {data.days.map((d, di) => (
          <React.Fragment key={d}>
            <span className="self-center">{d}</span>
            {(data.values[di] ?? []).map((v, hi) => (
              <span
                key={hi}
                title={`${d} ${data.hours[hi]}: ${v}`}
                className="aspect-square rounded-sm bg-primary"
                style={{ opacity: 0.08 + (v / max) * 0.92 }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Next call */

function NextCallBody({ data }: { data: Extract<WidgetData, { kind: "next-call" }>; title: string }) {
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div>
        <p className="font-display text-lg font-semibold">{data.name}</p>
        <p className="text-sm text-muted-foreground">{data.company} · {data.phone}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[10px]">{data.campaign}</Badge>
          <Badge variant="outline" className="text-[10px]">{data.queue} in queue</Badge>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{data.reason}</p>
      </div>
      <div className="flex gap-2">
        <Button asChild className="flex-1">
          <Link to="/calling/dialer">
            <PhoneCall className="mr-2 size-4" /> Start call
          </Link>
        </Button>
        <Button variant="outline" size="icon" aria-label="Skip lead" onClick={() => toast.info("Lead skipped — next lead loaded")}>
          <SkipForward className="size-4" />
        </Button>
      </div>
    </div>
  );
}
