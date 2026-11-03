import * as React from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { campaignRows } from "@/data/reports";
import {
  FilterBar,
  Funnel,
  KpiCard,
  RankedBars,
  ScorePill,
  SectionCard,
  StatTile,
  chartTooltipStyle,
  useFilters,
} from "./shared";

export function CampaignsAnalyticsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/_dashboard/reports/campaigns" });
  const { filters, set, reset } = useFilters();

  const selected = campaignRows.find((c) => c.id === search.campaign) ?? null;
  const compare = search.compare ?? [];

  const toggleCompare = (id: string) => {
    const next = compare.includes(id) ? compare.filter((c) => c !== id) : [...compare, id].slice(-3);
    navigate({ to: "/reports/campaigns", search: { ...search, compare: next.length ? next : undefined }, replace: true });
  };

  const compared = campaignRows.filter((c) => compare.includes(c.id));

  return (
    <div className="space-y-6">
      <FilterBar filters={filters} onChange={set} onReset={reset} exportLabel="Export campaigns" compact />

      <SectionCard
        title="All campaigns"
        description="Click a campaign for its full breakdown, or add up to three to compare."
        contentClassName="p-0"
        action={
          selected ? (
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/reports/campaigns", search: { ...search, campaign: undefined } })}>
              Clear selection
            </Button>
          ) : null
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Leads</TableHead>
              <TableHead className="text-right">Calls</TableHead>
              <TableHead className="text-right">Connect</TableHead>
              <TableHead className="text-right">Conversions</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">QA</TableHead>
              <TableHead className="text-right">Compare</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaignRows.map((c) => (
              <TableRow
                key={c.id}
                className={`cursor-pointer ${selected?.id === c.id ? "bg-accent/40" : ""}`}
                onClick={() => navigate({ to: "/reports/campaigns", search: { ...search, campaign: c.id }, replace: true })}
              >
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.type}</TableCell>
                <TableCell>
                  <Badge variant={c.status === "Active" ? "default" : "secondary"}>{c.status}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{c.leads.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{c.calls.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{c.connect}%</TableCell>
                <TableCell className="text-right tabular-nums">{c.conversions.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{c.conversion}%</TableCell>
                <TableCell className="text-right"><ScorePill score={c.qa} /></TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={compare.includes(c.id) ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompare(c.id);
                    }}
                  >
                    {compare.includes(c.id) ? "Added" : "Add"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {compared.length > 1 ? (
        <SectionCard title="Comparison" description="Side-by-side across the selected campaigns." contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                {compared.map((c) => (
                  <TableHead key={c.id} className="text-right">{c.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(
                [
                  ["Calls", (c: typeof compared[number]) => c.calls.toLocaleString()],
                  ["Connect rate", (c: typeof compared[number]) => `${c.connect}%`],
                  ["Conversions", (c: typeof compared[number]) => c.conversions.toLocaleString()],
                  ["Conversion rate", (c: typeof compared[number]) => `${c.conversion}%`],
                  ["Avg duration", (c: typeof compared[number]) => c.avgDuration],
                  ["QA score", (c: typeof compared[number]) => String(c.qa)],
                  ["Positive sentiment", (c: typeof compared[number]) => `${c.positive}%`],
                  ["Critical issues", (c: typeof compared[number]) => String(c.critical)],
                ] as const
              ).map(([label, fn]) => (
                <TableRow key={label}>
                  <TableCell className="text-muted-foreground">{label}</TableCell>
                  {compared.map((c) => (
                    <TableCell key={c.id} className="text-right tabular-nums">{fn(c)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      ) : null}

      {selected ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <KpiCard label="Calls" value={selected.calls.toLocaleString()} onClick={() => navigate({ to: "/reports/calls", search: { campaign: selected.name } })} />
            <KpiCard label="Connected" value={selected.connected.toLocaleString()} hint={`${selected.connect}% connect`} />
            <KpiCard label="Conversions" value={selected.conversions.toLocaleString()} hint={`${selected.conversion}% rate`} onClick={() => navigate({ to: "/reports/calls", search: { campaign: selected.name, outcome: "Converted" } })} />
            <KpiCard label="Avg duration" value={selected.avgDuration} />
            <KpiCard label="QA score" value={String(selected.qa)} />
            <KpiCard label="Critical issues" value={String(selected.critical)} onClick={() => navigate({ to: "/reports/calls", search: { campaign: selected.name, critical: true } })} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title={`${selected.name} — trend`} description="Calls and conversions over the period." contentClassName="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selected.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Line type="monotone" dataKey="calls" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="conversions" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </SectionCard>

            <SectionCard title="Lead progression" description="How this campaign's leads moved.">
              <Funnel
                stages={selected.leadStages}
                onSelect={() => navigate({ to: "/reports/calls", search: { campaign: selected.name } })}
              />
            </SectionCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <SectionCard title="Channel mix" description="Human vs AI and inbound vs outbound.">
              <div className="grid grid-cols-2 gap-2">
                <StatTile label="Human calls" value={selected.humanCalls.toLocaleString()} />
                <StatTile label="AI calls" value={selected.aiCalls.toLocaleString()} />
                <StatTile label="Inbound" value={selected.inbound.toLocaleString()} />
                <StatTile label="Outbound" value={selected.outbound.toLocaleString()} />
              </div>
            </SectionCard>
            <SectionCard title="Top topics" description="What leads talked about.">
              <RankedBars items={selected.topics} />
            </SectionCard>
            <SectionCard title="Top objections" description="Why deals stalled.">
              <RankedBars items={selected.objections} tone="bg-amber-500" />
            </SectionCard>
          </div>

          <SectionCard
            title="Campaign benchmark"
            description="This campaign versus every other campaign."
            contentClassName="h-72"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/reports/calls", search: { campaign: selected.name } })}>
                View calls <ArrowRight className="ml-1 size-4" />
              </Button>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignRows.map((c) => ({ name: c.name, conversion: c.conversion, qa: c.qa }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="conversion" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="qa" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
      ) : (
        <SectionCard title="Pick a campaign" description="Select a campaign above to see its full analytics breakdown.">
          <RankedBars
            items={campaignRows.map((c) => ({ label: c.name, value: c.conversion }))}
            format={(n) => `${n}%`}
            onSelect={(label) => {
              const hit = campaignRows.find((c) => c.name === label);
              if (hit) navigate({ to: "/reports/campaigns", search: { ...search, campaign: hit.id } });
            }}
          />
        </SectionCard>
      )}
    </div>
  );
}
