import * as React from "react";
import {
  Bot,
  ExternalLink,
  FileText,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Table2,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FieldRow } from "@/components/settings/settings-header";
import { SegmentLeadsDrawer } from "@/components/campaigns/segment-leads-drawer";
import { dataTableSeed, scriptSeed, templateSeed } from "@/data/crm";
import type { Campaign, CampaignSegment } from "@/data/campaigns";

/* -------------------------------------------------------------- Segments */

export function SegmentsTab({
  campaign,
  onRemoveSegment,
  onAddSegment,
}: {
  campaign: Campaign;
  onRemoveSegment: (id: string) => void;
  onAddSegment: () => void;
}) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState<CampaignSegment | null>(null);

  const segments = campaign.segments.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );

  if (campaign.type === "Inbound") {
    return (
      <EmptyCard
        title="Inbound campaigns don't use segments"
        description="Customers start the conversation, so no lead segments are assigned to this campaign."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search segments"
            className="pl-9"
          />
        </div>
        <Button onClick={onAddSegment}>
          <Plus className="mr-2 size-4" />
          Add segment
        </Button>
      </div>

      {segments.length === 0 ? (
        <EmptyCard
          title="No segments assigned"
          description="Add a lead segment so the team knows who to contact."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {segments.map((segment) => (
            <Card
              key={segment.id}
              className="cursor-pointer transition-colors hover:border-primary/40"
              onClick={() => setActive(segment)}
            >
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="font-display text-base">{segment.name}</CardTitle>
                  <CardDescription>{segment.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${segment.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSegment(segment.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline" className="font-normal">
                    <Users className="mr-1 size-3" />
                    {segment.totalLeads.toLocaleString()} leads
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    {segment.contacted} contacted
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    {segment.converted} converted
                  </Badge>
                </div>
                <Progress value={Math.round((segment.contacted / segment.totalLeads) * 100)} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SegmentLeadsDrawer segment={active} onOpenChange={(open) => !open && setActive(null)} />
    </div>
  );
}

/* --------------------------------------------------------------- Details */

export function DetailsTab({ campaign }: { campaign: Campaign }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Campaign details</CardTitle>
          <CardDescription>
            Basic information captured when the campaign was created.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <FieldRow label="Campaign name" value={campaign.name} />
          <FieldRow label="Type" value={campaign.type} />
          <FieldRow label="Purpose" value={campaign.purpose} />
          <FieldRow label="Goal" value={campaign.goal} />
          <FieldRow label="Status" value={campaign.status} />
          <FieldRow label="Created" value={campaign.createdAt} />
          <FieldRow label="Schedule" value={campaign.schedule} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">{campaign.type} configuration</CardTitle>
          <CardDescription>Rules that control how this campaign runs.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {campaign.config.map((row) => (
            <FieldRow key={row.label} label={row.label} value={row.value} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ Team */

export function TeamTab({ campaign }: { campaign: Campaign }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Supervisor" value={campaign.supervisor} />
        <StatCard
          label="Human agents"
          value={String(campaign.members.filter((m) => m.kind === "Human").length)}
        />
        <StatCard
          label="AI agents"
          value={String(campaign.members.filter((m) => m.kind === "AI").length)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">{campaign.team}</CardTitle>
          <CardDescription>Only one team can be assigned to a campaign.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Calls</TableHead>
                <TableHead className="text-right">Conversion</TableHead>
                <TableHead className="text-right">QA score</TableHead>
                <TableHead className="w-40">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaign.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                      {member.kind === "AI" ? (
                        <Bot className="size-4 text-muted-foreground" />
                      ) : (
                        <Users className="size-4 text-muted-foreground" />
                      )}
                      {member.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{member.calls}</TableCell>
                  <TableCell className="text-right tabular-nums">{member.conversion}%</TableCell>
                  <TableCell className="text-right tabular-nums">{member.qaScore}</TableCell>
                  <TableCell>
                    <Progress value={member.progress} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* --------------------------------------------------------------- Scripts */

export function ScriptsTab({
  campaign,
  onAssign,
  onCreateNew,
  onRemove,
}: {
  campaign: Campaign;
  onAssign: () => void;
  onCreateNew: () => void;
  onRemove: (name: string) => void;
}) {
  const scripts = scriptSeed.filter((s) => campaign.scripts.includes(s.name));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={onAssign}>
          <Plus className="mr-2 size-4" />
          Assign script
        </Button>
        <Button onClick={onCreateNew}>
          <FileText className="mr-2 size-4" />
          New script
        </Button>
      </div>

      {scripts.length === 0 ? (
        <EmptyCard
          title="No scripts assigned"
          description="Assign a script so agents know what to say on every call."
        />
      ) : (
        <Card>
          <CardContent className="p-2">
            <Accordion type="single" collapsible className="w-full">
              {scripts.map((script) => (
                <AccordionItem key={script.id} value={script.id}>
                  <div className="flex items-center gap-2">
                    <AccordionTrigger className="flex-1 px-3">
                      <div className="flex flex-1 items-center justify-between gap-3 pr-3 text-left">
                        <div>
                          <div className="font-medium">{script.name}</div>
                          <div className="text-xs text-muted-foreground">{script.description}</div>
                        </div>
                        <Badge variant="outline" className="font-normal">
                          {script.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${script.name}`}
                      onClick={() => onRemove(script.name)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <AccordionContent className="px-3">
                    <pre className="whitespace-pre-wrap rounded-xl border border-border bg-muted/40 p-4 font-sans text-sm leading-relaxed">
                      {script.body}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Templates */

export function TemplatesTab({
  campaign,
  onAssign,
  onCreateNew,
  onRemove,
}: {
  campaign: Campaign;
  onAssign: () => void;
  onCreateNew: () => void;
  onRemove: (name: string) => void;
}) {
  const channels = ["SMS", "Email", "WhatsApp"] as const;
  const assigned = templateSeed.filter((t) => campaign.templates.includes(t.name));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={onAssign}>
          <Plus className="mr-2 size-4" />
          Assign template
        </Button>
        <Button onClick={onCreateNew}>
          <Mail className="mr-2 size-4" />
          New template
        </Button>
      </div>

      {assigned.length === 0 ? (
        <EmptyCard
          title="No templates assigned"
          description="Assign SMS, email or WhatsApp templates for this campaign's messaging."
        />
      ) : (
        channels.map((channel) => {
          const items = assigned.filter((t) => t.channel === channel);
          if (items.length === 0) return null;
          return (
            <Card key={channel}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-base">
                  {channel === "Email" ? (
                    <Mail className="size-4 text-muted-foreground" />
                  ) : (
                    <MessageSquare className="size-4 text-muted-foreground" />
                  )}
                  {channel}
                  <Badge variant="outline" className="font-normal">
                    {items.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Accordion type="single" collapsible className="w-full">
                  {items.map((template) => (
                    <AccordionItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <AccordionTrigger className="flex-1 px-3">
                          <div className="text-left">
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {template.subject || template.category}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${template.name}`}
                          onClick={() => onRemove(template.name)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      <AccordionContent className="px-3">
                        <pre className="whitespace-pre-wrap rounded-xl border border-border bg-muted/40 p-4 font-sans text-sm leading-relaxed">
                          {template.body}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

/* ------------------------------------------------------------ Data tables */

export function DataTablesTab({
  campaign,
  onAssign,
  onCreateNew,
}: {
  campaign: Campaign;
  onAssign: () => void;
  onCreateNew: () => void;
}) {
  const [query, setQuery] = React.useState("");
  const tables = dataTableSeed.filter(
    (t) =>
      campaign.dataTables.includes(t.name) && t.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search data tables"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onAssign}>
            <Plus className="mr-2 size-4" />
            Assign data table
          </Button>
          <Button onClick={onCreateNew}>
            <Table2 className="mr-2 size-4" />
            New data table
          </Button>
        </div>
      </div>

      {tables.length === 0 ? (
        <EmptyCard
          title="No data tables assigned"
          description="Assign a data table so agents and AI agents can store the data they collect."
        />
      ) : (
        tables.map((table) => <DataTableCard key={table.id} table={table} />)
      )}
    </div>
  );
}

function DataTableCard({ table }: { table: (typeof dataTableSeed)[number] }) {
  const pageSize = 5;
  const [page, setPage] = React.useState(0);
  const pages = Math.max(1, Math.ceil(table.rows.length / pageSize));
  const rows = table.rows.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="font-display text-base">{table.name}</CardTitle>
          <CardDescription>
            Data collected by human and AI agents during this campaign.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/crm/data-table">
            View in Data Tables
            <ExternalLink className="ml-2 size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {table.columns.map((col) => (
                <TableHead key={col.id}>{col.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                {table.columns.map((col) => (
                  <TableCell key={col.id}>{row[col.id] ?? "—"}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Page {page + 1} of {pages} · {table.rows.length} rows
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ----------------------------------------------------------- Automations */

export function AutomationsTab({
  campaign,
  onToggle,
  onRemove,
  onAssign,
  onCreateNew,
}: {
  campaign: Campaign;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAssign: () => void;
  onCreateNew: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={onAssign}>
          Add existing automation
        </Button>
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 size-4" />
          Create automation
        </Button>
      </div>

      {campaign.automations.length === 0 ? (
        <EmptyCard
          title="No automations assigned"
          description="Automate follow-ups, reminders and lead stage changes for this campaign."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaign.automations.map((automation) => (
            <Card key={automation.id}>
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2 font-display text-base">
                    <Zap className="size-4 text-muted-foreground" />
                    {automation.name}
                  </CardTitle>
                  <CardDescription>{automation.description}</CardDescription>
                </div>
                <Switch
                  checked={automation.enabled}
                  onCheckedChange={() => onToggle(automation.id)}
                  aria-label={`Toggle ${automation.name}`}
                />
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline" className="font-normal">
                    {automation.trigger}
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    {automation.scope}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.info("Edit configuration")}
                  >
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onRemove(automation.id)}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Analytics */

export function AnalyticsTab({ campaign }: { campaign: Campaign }) {
  const m = campaign.metrics;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Calls" value={m.calls.toLocaleString()} />
        <StatCard label="Connected calls" value={m.connected.toLocaleString()} />
        <StatCard label="Answer rate" value={`${m.answerRate}%`} />
        <StatCard label="Conversion rate" value={`${m.conversionRate}%`} />
        <StatCard label="Average duration" value={m.avgDuration} />
        <StatCard label="Revenue" value={m.revenue} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Calls this week</CardTitle>
            <CardDescription>Total versus connected calls.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaign.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="calls" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="connected" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Conversions</CardTitle>
            <CardDescription>Daily conversion volume.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={campaign.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Campaign progress</CardTitle>
          <CardDescription>How much of the campaign audience has been worked.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={campaign.progress} />
          <p className="text-sm text-muted-foreground">{campaign.progress}% complete</p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- Shared */

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

export function EmptyCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-base">
          <FileText className="size-4 text-muted-foreground" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
