import * as React from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Phone, PhoneIncoming, PhoneOutgoing, Search, Play, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { reportCalls, type ReportCall } from "@/data/reports";
import { CallDrawer } from "./call-drawer";
import { CheckboxRow, FilterBar, KindBadge, ScorePill, SectionCard, StatTile, useFilters } from "./shared";

const bandMatch = (score: number, band: string) => {
  switch (band) {
    case "90–100":
      return score >= 90;
    case "80–89":
      return score >= 80 && score < 90;
    case "70–79":
      return score >= 70 && score < 80;
    case "60–69":
      return score >= 60 && score < 70;
    case "Below 60":
      return score < 60;
    default:
      return true;
  }
};

const sentimentTone: Record<string, string> = {
  Positive: "bg-emerald-500/15 text-emerald-700",
  Neutral: "bg-sky-500/15 text-sky-700",
  Negative: "bg-amber-500/15 text-amber-700",
  Critical: "bg-rose-500/15 text-rose-700",
};

export function CallsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/_dashboard/reports/calls" });

  const [calls, setCalls] = React.useState<ReportCall[]>(reportCalls);
  const [query, setQuery] = React.useState(search.q ?? "");
  const [critical, setCritical] = React.useState(search.critical ?? false);
  const [escalated, setEscalated] = React.useState(search.escalated ?? false);
  const [needsReview, setNeedsReview] = React.useState(search.needsReview ?? false);

  const { filters, set, reset } = useFilters({
    campaign: search.campaign ?? "All",
    team: search.team ?? "All",
    agent: search.agent ?? "All",
    kind: search.kind ?? "All",
    outcome: search.outcome ?? "All",
    direction: search.direction ?? "All",
    qa: search.qa ?? "All",
  });

  const selected = calls.find((c) => c.id === search.call) ?? null;

  const rows = calls.filter((c) => {
    if (query) {
      const q = query.toLowerCase();
      const hay = `${c.lead} ${c.number} ${c.code} ${c.agent} ${c.campaign} ${c.summary}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.campaign !== "All" && c.campaign !== filters.campaign) return false;
    if (filters.team !== "All" && c.team !== filters.team) return false;
    if (filters.agent !== "All" && c.agent !== filters.agent) return false;
    if (filters.kind !== "All" && c.agentKind !== filters.kind) return false;
    if (filters.outcome !== "All" && c.outcome !== filters.outcome) return false;
    if (filters.direction !== "All" && c.direction !== filters.direction) return false;
    if (filters.qa !== "All" && !bandMatch(c.qaScore, filters.qa)) return false;
    if (filters.segment !== "All" && c.segment !== filters.segment) return false;
    if (search.sentiment && c.sentiment !== search.sentiment) return false;
    if (critical && !c.critical) return false;
    if (escalated && !c.escalated) return false;
    if (needsReview && c.qaStatus !== "Needs review") return false;
    return true;
  });

  const total = rows.length;
  const connected = rows.filter((c) => c.outcome !== "No answer" && c.outcome !== "Voicemail").length;
  const avgQa = total ? Math.round(rows.reduce((a, c) => a + c.qaScore, 0) / total) : 0;
  const avgSeconds = total ? Math.round(rows.reduce((a, c) => a + c.seconds, 0) / total) : 0;
  const avgDuration = `${String(Math.floor(avgSeconds / 60)).padStart(2, "0")}:${String(avgSeconds % 60).padStart(2, "0")}`;

  const openCall = (id: string, tab?: string) =>
    navigate({ to: "/reports/calls", search: { ...search, call: id, tab }, replace: true });

  return (
    <div className="space-y-6">
      <FilterBar filters={filters} onChange={set} onReset={reset} exportLabel="Export calls">
        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground">Flags</p>
          <CheckboxRow id="f-critical" label="Critical issues only" checked={critical} onChange={setCritical} />
          <CheckboxRow id="f-escalated" label="Escalated calls" checked={escalated} onChange={setEscalated} />
          <CheckboxRow id="f-review" label="Needs QA review" checked={needsReview} onChange={setNeedsReview} />
        </div>
      </FilterBar>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Calls in view" value={total} sub={search.slot ? `Time slot ${search.slot}` : undefined} />
        <StatTile label="Connected" value={connected} />
        <StatTile label="Avg duration" value={avgDuration} />
        <StatTile label="Avg QA" value={avgQa || "—"} />
      </div>

      <SectionCard
        title="Calls"
        description="Click any call to open the full detail: recording, transcript, AI summary, QA and notes."
        contentClassName="p-0"
        action={
          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lead, number, agent, keyword"
              className="h-9 pl-8"
            />
          </div>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & time</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead className="text-right">QA</TableHead>
              <TableHead className="text-right">Open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((c) => (
              <TableRow key={c.id} className="cursor-pointer" onClick={() => openCall(c.id)}>
                <TableCell className="whitespace-nowrap text-muted-foreground">{c.when}</TableCell>
                <TableCell>
                  <div className="font-medium">{c.lead}</div>
                  <div className="text-xs text-muted-foreground">{c.number}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap">{c.agent}</span>
                    <KindBadge kind={c.agentKind} />
                  </div>
                  <div className="text-xs text-muted-foreground">{c.team}</div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{c.campaign}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    {c.direction === "Inbound" ? <PhoneIncoming className="size-3.5" /> : <PhoneOutgoing className="size-3.5" />}
                    {c.direction}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-xs">{c.duration}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{c.outcome}</Badge>
                  {c.critical ? (
                    <Badge variant="outline" className="ml-1 border-rose-500/40 text-[10px] text-rose-600">
                      Critical
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell>
                  <span className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${sentimentTone[c.sentiment] ?? ""}`}>
                    {c.sentiment}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {c.qaScore ? <ScorePill score={c.qaScore} /> : <span className="text-xs text-muted-foreground">—</span>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {c.recording ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCall(c.id, "recording");
                        }}
                      >
                        <Play className="size-3.5" />
                      </Button>
                    ) : null}
                    {c.transcriptReady ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCall(c.id, "transcript");
                        }}
                      >
                        <FileText className="size-3.5" />
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                  <Phone className="mx-auto mb-2 size-5" />
                  No calls match these filters.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </SectionCard>

      <CallDrawer
        call={selected}
        initialTab={search.tab}
        onClose={() => navigate({ to: "/reports/calls", search: { ...search, call: undefined, tab: undefined }, replace: true })}
        onChange={(next) => setCalls((prev) => prev.map((c) => (c.id === next.id ? next : c)))}
      />
    </div>
  );
}
