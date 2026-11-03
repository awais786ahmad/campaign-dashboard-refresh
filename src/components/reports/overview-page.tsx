import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Bot, User } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  activityDaily,
  activityHourly,
  activityWeekly,
  aiInsights,
  automationRows,
  automationStats,
  campaignRows,
  funnelStages,
  humanVsAi,
  leadFunnel,
  leadMetrics,
  outcomeBreakdown,
  overviewKpis,
  segmentPerformance,
  teamRows,
} from "@/data/reports";
import {
  FilterBar,
  Funnel,
  InsightCard,
  KpiCard,
  RankedBars,
  ScorePill,
  SectionCard,
  StatTile,
  chartTooltipStyle,
  useFilters,
} from "./shared";

const metricOptions = [
  { id: "attempts", label: "Calls" },
  { id: "connected", label: "Connections" },
  { id: "minutes", label: "Minutes" },
  { id: "conversions", label: "Conversions" },
] as const;

type MetricId = (typeof metricOptions)[number]["id"];

export function OverviewPage() {
  const navigate = useNavigate();
  const { filters, set, reset } = useFilters();
  const [metric, setMetric] = React.useState<MetricId>("attempts");
  const [grain, setGrain] = React.useState<"hourly" | "daily" | "weekly">("daily");

  const series = grain === "hourly" ? activityHourly : grain === "weekly" ? activityWeekly : activityDaily;
  const kindParam = filters.kind === "All" ? undefined : (filters.kind as "Human" | "AI");
  const baseSearch = {
    campaign: filters.campaign === "All" ? undefined : filters.campaign,
    team: filters.team === "All" ? undefined : filters.team,
    agent: filters.agent === "All" ? undefined : filters.agent,
    kind: kindParam,
  };

  const goCalls = (extra: Record<string, unknown> = {}) =>
    navigate({ to: "/reports/calls", search: { ...baseSearch, ...extra } });

  return (
    <div className="space-y-6">
      <FilterBar filters={filters} onChange={set} onReset={reset} exportLabel="Export overview" />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {overviewKpis.map((k) => (
          <KpiCard
            key={k.id}
            label={k.label}
            value={k.value}
            delta={k.delta}
            hint={k.hint}
            trend={k.trend}
            onClick={() =>
              k.id === "conversions" || k.id === "conversion-rate"
                ? goCalls({ outcome: "Converted" })
                : k.id === "connected" || k.id === "connect-rate"
                  ? goCalls({})
                  : goCalls({})
            }
          />
        ))}
      </div>

      {/* Call activity */}
      <SectionCard
        title="Call activity"
        description="Click a point to open the calls from that time slot."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Tabs value={metric} onValueChange={(v) => setMetric(v as MetricId)}>
              <TabsList className="h-8">
                {metricOptions.map((m) => (
                  <TabsTrigger key={m.id} value={m.id} className="h-6 px-2.5 text-xs">
                    {m.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <ToggleGroup type="single" value={grain} onValueChange={(v) => v && setGrain(v as typeof grain)} size="sm" variant="outline">
              <ToggleGroupItem value="hourly" className="h-8 px-2.5 text-xs">Hourly</ToggleGroupItem>
              <ToggleGroupItem value="daily" className="h-8 px-2.5 text-xs">Daily</ToggleGroupItem>
              <ToggleGroupItem value="weekly" className="h-8 px-2.5 text-xs">Weekly</ToggleGroupItem>
            </ToggleGroup>
          </div>
        }
        contentClassName="h-72"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={series}
            onClick={(state) => {
              const label = state?.activeLabel;
              if (label) goCalls({ slot: String(label) });
            }}
            className="cursor-pointer"
          >
            <defs>
              <linearGradient id="ovFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Area type="monotone" dataKey={metric} stroke="var(--chart-1)" strokeWidth={2} fill="url(#ovFill)" />
            {metric === "attempts" ? (
              <Area type="monotone" dataKey="connected" stroke="var(--chart-2)" strokeWidth={2} fill="transparent" />
            ) : null}
            {metric === "attempts" ? (
              <Area type="monotone" dataKey="missed" stroke="var(--chart-5)" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" />
            ) : null}
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Funnel + outcomes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Call funnel" description="Where calls fall out between attempt and conversion.">
          <Funnel stages={funnelStages} onSelect={(stage) => goCalls(stage === "Converted" ? { outcome: "Converted" } : stage === "Qualified" ? { outcome: "Qualified" } : stage === "Interested" ? { outcome: "Interested" } : {})} />
        </SectionCard>
        <SectionCard title="Call outcomes" description="Click an outcome to see those calls.">
          <RankedBars
            items={outcomeBreakdown.map((o) => ({ label: o.outcome, value: o.value, tone: o.tone }))}
            onSelect={(label) => goCalls({ outcome: label === "Other" ? undefined : label })}
          />
        </SectionCard>
      </div>

      {/* Human vs AI + Team performance */}
      <div className="grid gap-6 lg:grid-cols-5">
        <SectionCard title="Human vs AI" description="Side-by-side across the selected period." className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">
                  <span className="inline-flex items-center gap-1"><User className="size-3.5" /> Human</span>
                </TableHead>
                <TableHead className="text-right">
                  <span className="inline-flex items-center gap-1"><Bot className="size-3.5" /> AI</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {humanVsAi.map((r) => (
                <TableRow key={r.metric} className="cursor-pointer" onClick={() => navigate({ to: "/reports/performance", search: { tab: "ai" } })}>
                  <TableCell className="text-muted-foreground">{r.metric}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.human}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{r.ai}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard
          title="Team performance"
          description="Top teams for the period."
          className="lg:col-span-3"
          contentClassName="p-0"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/reports/performance", search: { tab: "teams" } })}>
              View performance <ArrowRight className="ml-1 size-4" />
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead className="text-right">Calls</TableHead>
                <TableHead className="text-right">Connect</TableHead>
                <TableHead className="text-right">Conversion</TableHead>
                <TableHead className="text-right">QA</TableHead>
                <TableHead className="text-right">Avg duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamRows.slice(0, 4).map((t) => (
                <TableRow key={t.team} className="cursor-pointer" onClick={() => navigate({ to: "/reports/performance", search: { tab: "teams", team: t.team } })}>
                  <TableCell className="font-medium">{t.team}</TableCell>
                  <TableCell className="text-right tabular-nums">{t.calls.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{t.connect}%</TableCell>
                  <TableCell className="text-right tabular-nums">{t.conversion === null ? "—" : `${t.conversion}%`}</TableCell>
                  <TableCell className="text-right"><ScorePill score={t.qa} /></TableCell>
                  <TableCell className="text-right font-mono text-xs">{t.avgDuration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      {/* Campaign performance */}
      <SectionCard
        title="Campaign performance"
        description="Click a campaign for the full breakdown."
        contentClassName="p-0"
        action={
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/reports/campaigns", search: {} })}>
            View campaigns <ArrowRight className="ml-1 size-4" />
          </Button>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead className="text-right">Calls</TableHead>
              <TableHead className="text-right">Connected</TableHead>
              <TableHead className="text-right">Conversions</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">QA</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaignRows.slice(0, 4).map((c) => (
              <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate({ to: "/reports/campaigns", search: { campaign: c.id } })}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-right tabular-nums">{c.calls.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{c.connected.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{c.conversions.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{c.conversion}%</TableCell>
                <TableCell className="text-right"><ScorePill score={c.qa} /></TableCell>
                <TableCell>
                  <Badge variant={c.status === "Active" ? "default" : "secondary"}>{c.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* Lead performance + Automation */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Lead performance" description="Aggregated from the CRM — individual leads live in CRM & Leads.">
          <div className="grid grid-cols-3 gap-2">
            {leadMetrics.map((m) => (
              <StatTile key={m.label} label={m.label} value={m.value} />
            ))}
          </div>
          <div className="mt-4">
            <Funnel stages={leadFunnel} />
          </div>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Contact</TableHead>
                <TableHead className="text-right">Conversion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segmentPerformance.map((s) => (
                <TableRow key={s.segment}>
                  <TableCell className="font-medium">{s.segment}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.leads.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.contact}%</TableCell>
                  <TableCell className="text-right tabular-nums">{s.conversion}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Automation activity"
            description="Execution health for your automations."
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/settings/automations" })}>
                Automations <ArrowRight className="ml-1 size-4" />
              </Button>
            }
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {automationStats.map((s) => (
                <StatTile key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Automation</TableHead>
                  <TableHead className="text-right">Runs</TableHead>
                  <TableHead className="text-right">Success</TableHead>
                  <TableHead className="text-right">Failed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {automationRows.map((a) => (
                  <TableRow key={a.name} className="cursor-pointer" onClick={() => navigate({ to: "/settings/automations" })}>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{a.runs.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums text-emerald-600">{a.success}%</TableCell>
                    <TableCell className="text-right tabular-nums text-rose-600">{a.failed}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>

          <SectionCard title="AI insights" description="What changed and why — explained, not just charted.">
            <div className="space-y-3">
              {aiInsights.map((i) => (
                <InsightCard
                  key={i.title}
                  tone={i.tone}
                  title={i.title}
                  body={i.body}
                  action={
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() =>
                        i.title.includes("sentiment")
                          ? goCalls({ sentiment: "Negative" })
                          : i.title.includes("QA")
                            ? navigate({ to: "/reports/quality", search: { tab: "reviews" } })
                            : i.title.includes("Sales AI")
                              ? navigate({ to: "/reports/performance", search: { tab: "ai", agent: "a5" } })
                              : i.title.includes("Renewal")
                                ? navigate({ to: "/reports/campaigns", search: { campaign: "c2" } })
                                : navigate({ to: "/reports/campaigns", search: { campaign: "c1" } })
                      }
                    >
                      Investigate <ArrowRight className="ml-1 size-3" />
                    </Button>
                  }
                />
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
