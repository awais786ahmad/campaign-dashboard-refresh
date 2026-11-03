import * as React from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { agentRows, humanVsAi, teamRows, type AgentRow } from "@/data/reports";
import {
  FilterBar,
  InsightCard,
  KindBadge,
  RankedBars,
  ScorePill,
  SectionCard,
  StatTile,
  chartTooltipStyle,
  useFilters,
} from "./shared";

type Tab = "teams" | "human" | "ai";

export function PerformancePage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/_dashboard/reports/performance" });
  const tab: Tab = search.tab ?? "teams";
  const { filters, set, reset } = useFilters({ team: search.team ?? "All" });

  const setTab = (v: string) => navigate({ to: "/reports/performance", search: { ...search, tab: v as Tab }, replace: true });
  const setAgent = (id?: string) => navigate({ to: "/reports/performance", search: { ...search, agent: id }, replace: true });

  const humans = agentRows.filter((a) => a.kind === "Human");
  const ais = agentRows.filter((a) => a.kind === "AI");
  const pool = tab === "ai" ? ais : humans;
  const selected = pool.find((a) => a.id === search.agent) ?? pool[0];

  const teams = filters.team === "All" ? teamRows : teamRows.filter((t) => t.team === filters.team);

  return (
    <div className="space-y-6">
      <FilterBar filters={filters} onChange={set} onReset={reset} exportLabel="Export performance" />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="human">Human agents</TabsTrigger>
          <TabsTrigger value="ai">AI agents</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="mt-6 space-y-6">
          <SectionCard title="Team comparison" description="Calls, connect rate, conversion and quality by team." contentClassName="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamRows}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="team" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="calls" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Teams" description="Click a team to see its agents." contentClassName="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">Agents</TableHead>
                  <TableHead className="text-right">Calls</TableHead>
                  <TableHead className="text-right">Connect</TableHead>
                  <TableHead className="text-right">Conversion</TableHead>
                  <TableHead className="text-right">Talk time</TableHead>
                  <TableHead className="text-right">Avg duration</TableHead>
                  <TableHead className="text-right">QA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((t) => (
                  <TableRow key={t.team} className="cursor-pointer" onClick={() => set({ team: t.team })}>
                    <TableCell className="font-medium">{t.team}</TableCell>
                    <TableCell className="text-right tabular-nums">{t.agents}</TableCell>
                    <TableCell className="text-right tabular-nums">{t.calls.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{t.connect}%</TableCell>
                    <TableCell className="text-right tabular-nums">{t.conversion === null ? "—" : `${t.conversion}%`}</TableCell>
                    <TableCell className="text-right tabular-nums">{t.talkTime}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{t.avgDuration}</TableCell>
                    <TableCell className="text-right"><ScorePill score={t.qa} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Best connect rate" description="Ranked across teams.">
              <RankedBars items={teamRows.map((t) => ({ label: t.team, value: t.connect }))} format={(n) => `${n}%`} />
            </SectionCard>
            <SectionCard title="Human vs AI" description="Aggregated for the selected period." contentClassName="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Human</TableHead>
                    <TableHead className="text-right">AI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {humanVsAi.map((r) => (
                    <TableRow key={r.metric}>
                      <TableCell className="text-muted-foreground">{r.metric}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.human}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{r.ai}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="human" className="mt-6">
          <AgentSection agents={humans} selected={selected} onSelect={setAgent} kind="Human" />
        </TabsContent>
        <TabsContent value="ai" className="mt-6">
          <AgentSection agents={ais} selected={selected} onSelect={setAgent} kind="AI" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AgentSection({
  agents,
  selected,
  onSelect,
  kind,
}: {
  agents: AgentRow[];
  selected?: AgentRow | undefined;
  onSelect: (id: string) => void;
  kind: "Human" | "AI";
}) {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <SectionCard title={`${kind} agents`} description="Click an agent for the full breakdown and coaching insights." contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Calls</TableHead>
              <TableHead className="text-right">Connect</TableHead>
              <TableHead className="text-right">Avg duration</TableHead>
              <TableHead className="text-right">Conversions</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">QA</TableHead>
              <TableHead className="text-right">{kind === "AI" ? "Escalations" : "Transfers"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((a) => (
              <TableRow
                key={a.id}
                className={`cursor-pointer ${selected?.id === a.id ? "bg-accent/40" : ""}`}
                onClick={() => onSelect(a.id)}
              >
                <TableCell className="font-medium">
                  <span className="mr-2">{a.name}</span>
                  <KindBadge kind={a.kind} />
                </TableCell>
                <TableCell className="text-muted-foreground">{a.team}</TableCell>
                <TableCell className="text-right tabular-nums">{a.calls.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{a.connect}%</TableCell>
                <TableCell className="text-right font-mono text-xs">{a.avgDuration}</TableCell>
                <TableCell className="text-right tabular-nums">{a.conversions.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{a.conversion}%</TableCell>
                <TableCell className="text-right"><ScorePill score={a.qa} /></TableCell>
                <TableCell className="text-right tabular-nums">{kind === "AI" ? a.escalations : a.transfers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {selected ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard
            title={selected.name}
            description={`${selected.team} · ${selected.kind} agent`}
            className="lg:col-span-2"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/reports/calls", search: { agent: selected.name } })}>
                View calls <ArrowRight className="ml-1 size-4" />
              </Button>
            }
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatTile label="Calls" value={selected.calls.toLocaleString()} />
              <StatTile label="Connected" value={selected.connected.toLocaleString()} sub={`${selected.connect}% connect`} />
              <StatTile label="Conversions" value={selected.conversions.toLocaleString()} sub={`${selected.conversion}% rate`} />
              <StatTile label="Avg QA" value={selected.qa} />
              <StatTile label="Positive sentiment" value={`${selected.positive}%`} />
              <StatTile label="Avg duration" value={selected.avgDuration} />
              <StatTile label={selected.kind === "AI" ? "Escalations" : "Transfers"} value={selected.kind === "AI" ? selected.escalations : selected.transfers} />
              <StatTile label={selected.kind === "AI" ? "Resolution" : "Escalations"} value={selected.kind === "AI" ? `${selected.resolution ?? 0}%` : selected.escalations} />
            </div>

            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="text-right">Calls</TableHead>
                  <TableHead className="text-right">Conversion</TableHead>
                  <TableHead className="text-right">QA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selected.byCampaign.map((c) => (
                  <TableRow
                    key={c.campaign}
                    className="cursor-pointer"
                    onClick={() => navigate({ to: "/reports/calls", search: { agent: selected.name, campaign: c.campaign } })}
                  >
                    <TableCell className="font-medium">{c.campaign}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.calls.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.conversion}%</TableCell>
                    <TableCell className="text-right"><ScorePill score={c.qa} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>

          <SectionCard title="AI insights & coaching" description="What to work on next.">
            <div className="space-y-3">
              {selected.insights.map((i) => (
                <InsightCard key={i.text} tone={i.tone} title={i.text} />
              ))}
              <div className="rounded-xl border border-border bg-muted/40 p-3">
                <p className="text-xs font-medium text-muted-foreground">Recommendation</p>
                <p className="mt-1 text-sm">{selected.recommendation}</p>
              </div>
            </div>
          </SectionCard>
        </div>
      ) : null}
    </div>
  );
}
