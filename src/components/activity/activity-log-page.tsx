import * as React from "react";
import { Download, Lock, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DetailDrawer } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import { ActionBadge, ActivityEmptyState, ActorAvatar, ChangeList } from "./record-activity";
import {
  auditActions,
  auditActors,
  auditEntityTypes,
  auditEvents,
  auditModules,
  auditTeams,
  type AuditEvent,
} from "@/data/activity-log";

const dateOptions = ["Any time", "Today", "Yesterday", "Last 7 days", "Last 30 days"] as const;

type Filters = { date: string; actor: string; action: string; module: string; team: string; entity: string };
const initial: Filters = {
  date: "Any time",
  actor: auditActors[0],
  action: auditActions[0],
  module: auditModules[0],
  team: auditTeams[0],
  entity: auditEntityTypes[0],
};

const filterDefs: { key: keyof Filters; options: readonly string[]; label: string }[] = [
  { key: "date", options: dateOptions, label: "Date" },
  { key: "actor", options: auditActors, label: "User" },
  { key: "action", options: auditActions, label: "Action" },
  { key: "module", options: auditModules, label: "Module" },
  { key: "team", options: auditTeams, label: "Team" },
  { key: "entity", options: auditEntityTypes, label: "Record type" },
];

function matchesDate(e: AuditEvent, date: string) {
  if (date === "Any time" || date === "Last 30 days") return true;
  if (date === "Today") return e.day === "Today";
  if (date === "Yesterday") return e.day === "Yesterday";
  return e.day !== "18 September 2026";
}

export function ActivityLogPage() {
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Filters>(initial);
  const [active, setActive] = React.useState<AuditEvent | null>(null);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return auditEvents.filter(
      (e) =>
        matchesDate(e, filters.date) &&
        (filters.actor === initial.actor || e.actor === filters.actor) &&
        (filters.action === initial.action || e.action === filters.action) &&
        (filters.module === initial.module || e.module === filters.module) &&
        (filters.team === initial.team || e.team === filters.team) &&
        (filters.entity === initial.entity || e.entityType === filters.entity) &&
        (!q || [e.actor, e.record, e.summary, e.entityType, ...(e.changes ?? []).flatMap((c) => [c.field, c.before, c.after])].join(" ").toLowerCase().includes(q)),
    );
  }, [query, filters]);

  const activeFilters = filterDefs.filter((f) => filters[f.key] !== initial[f.key]);
  const days = [...new Set(results.map((e) => e.day))];

  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Activity & Audit Log"
        description="A single timeline of every important change across your workspace — who did what, when, and what changed."
        actions={
          <Button
            variant="outline"
            onClick={() => toast.success(`Export started — ${results.length} events will be sent as CSV to your email.`)}
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people, records, or change details…"
              className="pl-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
            {filterDefs.map((f) => (
              <Select key={f.key} value={filters[f.key]} onValueChange={(v) => setFilters((p) => ({ ...p, [f.key]: v }))}>
                <SelectTrigger aria-label={f.label}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {f.options.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
          {activeFilters.length || query ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">{results.length} results</span>
              {activeFilters.map((f) => (
                <Badge key={f.key} variant="secondary" className="gap-1 font-normal">
                  {f.label}: {filters[f.key]}
                  <button aria-label={`Remove ${f.label} filter`} onClick={() => setFilters((p) => ({ ...p, [f.key]: initial[f.key] }))}>
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={() => { setFilters(initial); setQuery(""); }}>
                Clear all
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {results.length === 0 ? (
        <ActivityEmptyState title="No matching activity" description="Try a different search or clear some filters." />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Record</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {days.map((day) => (
                  <React.Fragment key={day}>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableCell colSpan={6} className="py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {day}
                      </TableCell>
                    </TableRow>
                    {results.filter((e) => e.day === day).map((e) => (
                      <TableRow key={e.id} className="cursor-pointer" onClick={() => setActive(e)}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ActorAvatar initials={e.actorInitials} type={e.actorType} />
                            <div>
                              <p className="text-sm font-medium">{e.actor}</p>
                              <p className="text-xs text-muted-foreground">{e.team}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><ActionBadge action={e.action} /></TableCell>
                        <TableCell>
                          <p className="text-sm">{e.module}</p>
                          <p className="text-xs text-muted-foreground">{e.submodule}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">{e.record}</p>
                          <p className="text-xs text-muted-foreground">{e.entityType}</p>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            {e.sensitive ? <Lock className="size-3.5 shrink-0" /> : null}
                            <span className="truncate">{e.summary}</span>
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right text-sm text-muted-foreground">{e.time}</TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <DetailDrawer
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        title={active ? `${active.action} · ${active.record}` : ""}
        description={active?.summary ?? ""}
      >
        {active ? (
          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-3 rounded-xl border border-border p-3">
              <ActorAvatar initials={active.actorInitials} type={active.actorType} className="size-10" />
              <div>
                <p className="text-sm font-medium">{active.actor}</p>
                <p className="text-xs text-muted-foreground">
                  {active.actorType === "human" ? "Team member" : active.actorType === "ai" ? "AI agent" : "System automation"} · {active.team}
                </p>
              </div>
            </div>
            <div>
              <FieldRow label="Action" value={<ActionBadge action={active.action} />} />
              <FieldRow label="Module" value={`${active.module} › ${active.submodule}`} />
              <FieldRow label="Record" value={`${active.record} (${active.entityType})`} />
              <FieldRow label="When" value={active.isoDate} />
              <FieldRow label="Event ID" value={<code className="text-xs">{active.id}</code>} />
            </div>
            {active.changes?.length ? (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Changes</p>
                <ChangeList changes={active.changes} />
              </div>
            ) : null}
            {active.metadata?.length ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Context</p>
                {active.metadata.map((m) => <FieldRow key={m.label} label={m.label} value={m.value} />)}
              </div>
            ) : null}
            {active.sensitive ? (
              <p className="flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                <Lock className="size-3.5" /> Sensitive event — personal details are partially masked.
              </p>
            ) : null}
          </div>
        ) : null}
      </DetailDrawer>
    </div>
  );
}
