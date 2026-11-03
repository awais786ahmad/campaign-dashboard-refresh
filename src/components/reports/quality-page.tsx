import * as React from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  agentRows,
  aiPerformanceKpis,
  conversationObjections,
  conversationQuestions,
  conversationTopics,
  conversionReasons,
  criticalIssues,
  manualVsAi,
  negativeReasons,
  qaAgreement,
  qaDistribution,
  qualityKpis,
  reportCalls,
  sentimentByAgent,
  sentimentByCampaign,
  sentimentOverview,
  teamRows,
} from "@/data/reports";
import {
  AiLabel,
  FilterBar,
  KindBadge,
  KpiCard,
  RankedBars,
  ScorePill,
  SectionCard,
  StatTile,
  chartTooltipStyle,
  useFilters,
} from "./shared";

type Tab = "overview" | "reviews" | "ai" | "intelligence" | "sentiment";

export function QualityPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/_dashboard/reports/quality" });
  const tab: Tab = search.tab ?? "overview";
  const { filters, set, reset } = useFilters();

  const setTab = (v: string) => navigate({ to: "/reports/quality", search: { ...search, tab: v as Tab }, replace: true });
  const goCalls = (extra: Record<string, unknown> = {}) => navigate({ to: "/reports/calls", search: extra });

  const ais = agentRows.filter((a) => a.kind === "AI");
  const reviewCalls = reportCalls.filter((c) => c.qaType !== "None");

  return (
    <div className="space-y-6">
      <FilterBar filters={filters} onChange={set} onReset={reset} exportLabel="Export quality report" />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">QA overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="ai">AI performance</TabsTrigger>
          <TabsTrigger value="intelligence">Conversation intelligence</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
        </TabsList>

        {/* ---------------------------------------------------------- Overview */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {qualityKpis.map((k) => (
              <KpiCard key={k.label} label={k.label} value={k.value} delta={k.delta} onClick={() => goCalls({})} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Score distribution" description="Click a band to open those calls.">
              <RankedBars
                items={qaDistribution.map((d) => ({ label: d.band, value: d.value }))}
                onSelect={(band) => goCalls({ qa: band })}
              />
            </SectionCard>
            <SectionCard title="Critical issues" description="Compliance and verification failures.">
              <RankedBars
                items={criticalIssues.map((c) => ({ label: c.issue, value: c.calls, tone: "bg-rose-500" }))}
                onSelect={() => goCalls({ critical: true })}
              />
            </SectionCard>
          </div>

          <SectionCard title="QA by team" description="Average score and calls reviewed per team." contentClassName="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">Calls</TableHead>
                  <TableHead className="text-right">Avg duration</TableHead>
                  <TableHead className="text-right">QA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamRows.map((t) => (
                  <TableRow key={t.team} className="cursor-pointer" onClick={() => goCalls({ team: t.team })}>
                    <TableCell className="font-medium">{t.team}</TableCell>
                    <TableCell className="text-right tabular-nums">{t.calls.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{t.avgDuration}</TableCell>
                    <TableCell className="text-right"><ScorePill score={t.qa} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        {/* ---------------------------------------------------------- Reviews */}
        <TabsContent value="reviews" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-5">
            <SectionCard title="Manual vs AI scoring" description="Where reviewers and AI disagree." className="lg:col-span-3" contentClassName="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={manualVsAi}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis domain={[60, 100]} tickLine={false} axisLine={false} fontSize={12} width={40} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="ai" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="manual" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
            <SectionCard title="AI agreement" description="How often AI matches the human reviewer." className="lg:col-span-2">
              <AiLabel>Agreement across reviewed calls</AiLabel>
              <p className="mt-3 font-display text-4xl font-semibold">{qaAgreement}%</p>
              <Progress value={qaAgreement} className="mt-3" />
              <p className="mt-3 text-sm text-muted-foreground">
                Disagreements are concentrated in Closing and Objection handling, where reviewers score stricter than AI.
              </p>
            </SectionCard>
          </div>

          <SectionCard title="Reviewed calls" description="Open a call to score it, flag issues and leave feedback." contentClassName="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Call</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Review type</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewCalls.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => navigate({ to: "/reports/calls", search: { call: c.id, tab: "qa" } })}
                  >
                    <TableCell>
                      <div className="font-medium">{c.lead}</div>
                      <div className="text-xs text-muted-foreground">{c.code} · {c.when}</div>
                    </TableCell>
                    <TableCell>
                      <span className="mr-2">{c.agent}</span>
                      <KindBadge kind={c.agentKind} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.campaign}</TableCell>
                    <TableCell>{c.qaType}</TableCell>
                    <TableCell className="text-muted-foreground">{c.reviewer || "—"}</TableCell>
                    <TableCell>
                      <span className={c.qaStatus === "Reviewed" ? "text-emerald-600" : "text-amber-600"}>{c.qaStatus}</span>
                    </TableCell>
                    <TableCell className="text-right"><ScorePill score={c.qaScore} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        {/* ---------------------------------------------------- AI performance */}
        <TabsContent value="ai" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {aiPerformanceKpis.map((k) => (
              <StatTile key={k.label} label={k.label} value={k.value} />
            ))}
          </div>

          <SectionCard title="AI agents" description="Compare each AI agent against its human baseline." contentClassName="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">Calls</TableHead>
                  <TableHead className="text-right">Connect</TableHead>
                  <TableHead className="text-right">Resolution</TableHead>
                  <TableHead className="text-right">Escalations</TableHead>
                  <TableHead className="text-right">Positive</TableHead>
                  <TableHead className="text-right">QA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ais.map((a) => (
                  <TableRow
                    key={a.id}
                    className="cursor-pointer"
                    onClick={() => navigate({ to: "/reports/performance", search: { tab: "ai", agent: a.id } })}
                  >
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell className="text-muted-foreground">{a.team}</TableCell>
                    <TableCell className="text-right tabular-nums">{a.calls.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{a.connect}%</TableCell>
                    <TableCell className="text-right tabular-nums">{a.resolution ?? 0}%</TableCell>
                    <TableCell className="text-right tabular-nums">{a.escalations}</TableCell>
                    <TableCell className="text-right tabular-nums">{a.positive}%</TableCell>
                    <TableCell className="text-right"><ScorePill score={a.qa} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        {/* ------------------------------------------- Conversation intelligence */}
        <TabsContent value="intelligence" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Most discussed topics" description="Click a topic to open matching calls.">
              <RankedBars items={conversationTopics} onSelect={(label) => goCalls({ q: label })} />
            </SectionCard>
            <SectionCard title="Common objections" description="What leads push back on.">
              <RankedBars items={conversationObjections} tone="bg-amber-500" onSelect={(label) => goCalls({ q: label })} />
            </SectionCard>
            <SectionCard title="Frequent questions" description="What customers ask about most.">
              <RankedBars items={conversationQuestions} tone="bg-sky-500" onSelect={(label) => goCalls({ q: label })} />
            </SectionCard>
            <SectionCard title="Why deals convert" description="Reasons detected on converted calls.">
              <RankedBars
                items={conversionReasons}
                tone="bg-emerald-500"
                onSelect={() => goCalls({ outcome: "Converted" })}
              />
            </SectionCard>
          </div>
        </TabsContent>

        {/* --------------------------------------------------------- Sentiment */}
        <TabsContent value="sentiment" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Overall sentiment" description="Share of calls by sentiment.">
              <RankedBars
                items={sentimentOverview.map((s) => ({ label: s.label, value: s.value, tone: s.tone }))}
                format={(n) => `${n}%`}
                onSelect={(label) => goCalls({ sentiment: label })}
              />
            </SectionCard>
            <SectionCard title="Negative sentiment reasons" description="Top drivers of negative calls.">
              <RankedBars
                items={negativeReasons.map((r) => ({ label: r.reason, value: r.calls, tone: "bg-rose-500" }))}
                onSelect={() => goCalls({ sentiment: "Negative" })}
              />
            </SectionCard>
          </div>

          <SectionCard title="Sentiment by campaign" description="Positive, neutral and negative split." contentClassName="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentByCampaign}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="positive" stackId="s" fill="var(--chart-2)" />
                <Bar dataKey="neutral" stackId="s" fill="var(--chart-4)" />
                <Bar dataKey="negative" stackId="s" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Sentiment by agent" description="Positive versus negative share per agent." contentClassName="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Positive</TableHead>
                  <TableHead className="text-right">Negative</TableHead>
                  <TableHead className="text-right">Calls</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentimentByAgent.map((a) => (
                  <TableRow key={a.name} className="cursor-pointer" onClick={() => goCalls({ agent: a.name })}>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell><KindBadge kind={a.kind} /></TableCell>
                    <TableCell className="text-right tabular-nums text-emerald-600">{a.positive}%</TableCell>
                    <TableCell className="text-right tabular-nums text-rose-600">{a.negative}%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        View <ArrowRight className="ml-1 size-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
