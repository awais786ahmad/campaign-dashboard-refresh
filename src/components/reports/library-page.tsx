import * as React from "react";
import { getRouteApi } from "@tanstack/react-router";
import { CalendarClock, Download, FileText, Mail, Pencil, Play, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  datePresets,
  filterCampaigns,
  filterTeams,
  reportMetricOptions,
  reportTypes,
  savedReports,
  type SavedReport,
} from "@/data/reports";
import { CheckboxRow, SectionCard, StatTile } from "@/components/reports/shared";

const routeApi = getRouteApi("/_dashboard/reports/library");

type Draft = {
  name: string;
  type: string;
  description: string;
  date: string;
  campaign: string;
  team: string;
  metrics: string[];
  format: SavedReport["format"];
  scheduled: boolean;
  schedule: string;
  recipients: string;
};

const emptyDraft: Draft = {
  name: "",
  type: reportTypes[0]!,
  description: "",
  date: "Last 30 days",
  campaign: "All",
  team: "All",
  metrics: ["Calls", "Connect rate", "Conversions"],
  format: "PDF",
  scheduled: false,
  schedule: "Every Monday 09:00",
  recipients: "",
};

export function ReportLibraryPage() {
  const search = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const [reports, setReports] = React.useState<SavedReport[]>(savedReports);
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState("All");
  const [creating, setCreating] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>(emptyDraft);

  const tab = search.tab ?? "library";
  const selected = reports.find((r) => r.id === search.report) ?? null;

  const filtered = reports.filter(
    (r) =>
      (type === "All" || r.type === type) &&
      (query.trim() === "" ||
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase())),
  );

  const scheduled = reports.filter((r) => r.schedule !== "Not scheduled");

  const setTab = (v: string) => navigate({ search: (prev) => ({ ...prev, tab: v as "library" | "scheduled" }) });
  const open = (id?: string) => navigate({ search: (prev) => ({ ...prev, report: id }) });

  const toggleStatus = (id: string) =>
    setReports((rs) =>
      rs.map((r) => (r.id === id ? { ...r, status: r.status === "Active" ? "Paused" : "Active" } : r)),
    );

  const remove = (id: string) => {
    setReports((rs) => rs.filter((r) => r.id !== id));
    open(undefined);
    toast.success("Report deleted");
  };

  const create = () => {
    if (!draft.name.trim()) {
      toast.error("Give the report a name");
      return;
    }
    const report: SavedReport = {
      id: `r${Date.now()}`,
      name: draft.name.trim(),
      type: draft.type,
      createdBy: "Awais Ahmad",
      lastGenerated: "Not generated yet",
      schedule: draft.scheduled ? draft.schedule : "Not scheduled",
      recipients: draft.recipients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      format: draft.format,
      status: draft.scheduled ? "Active" : "Paused",
      description: draft.description.trim() || `${draft.type} report for ${draft.date.toLowerCase()}.`,
      metrics: draft.metrics,
    };
    setReports((rs) => [report, ...rs]);
    setCreating(false);
    setDraft(emptyDraft);
    open(report.id);
    toast.success("Report created");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Saved reports" value={reports.length} sub="Across all report types" />
        <StatTile label="Scheduled" value={scheduled.length} sub="Delivered automatically" />
        <StatTile label="Active" value={reports.filter((r) => r.status === "Active").length} sub="Running on schedule" />
        <StatTile label="Recipients" value={new Set(reports.flatMap((r) => r.recipients)).size} sub="Distinct audiences" />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <TabsList>
            <TabsTrigger value="library">Report library</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled reports</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search reports"
                className="h-9 w-56 pl-8"
              />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-9 w-auto min-w-40">
                <SelectValue placeholder="Report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All types</SelectItem>
                {reportTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" className="h-9" onClick={() => setCreating(true)}>
              <Plus className="mr-2 size-4" />
              Create report
            </Button>
          </div>
        </div>

        <TabsContent value="library" className="m-0">
          <SectionCard
            title="Saved reports"
            description="Open a report to view results, export it or change its schedule."
            contentClassName="p-0"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Last generated</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => open(r.id)}>
                    <TableCell>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.description}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.lastGenerated}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.schedule}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {r.format}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          r.status === "Active" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" : "",
                        )}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label="Run report"
                          onClick={() => toast.success(`${r.name} is generating — we'll email it when ready`)}
                        >
                          <Play className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label="Export report"
                          onClick={() => toast.success(`${r.name} exported as ${r.format}`)}
                        >
                          <Download className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          aria-label="Delete report"
                          onClick={() => remove(r.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                      No reports match your search.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        <TabsContent value="scheduled" className="m-0 space-y-4">
          <SectionCard title="Scheduled deliveries" description="Reports emailed automatically to their recipients.">
            <ul className="space-y-3">
              {scheduled.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <CalendarClock className="size-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <button className="text-sm font-medium hover:text-primary hover:underline" onClick={() => open(r.id)}>
                      {r.name}
                    </button>
                    <p className="text-xs text-muted-foreground">
                      {r.schedule} · {r.format} ·{" "}
                      {r.recipients.length > 0 ? r.recipients.join(", ") : "No recipients"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{r.status}</span>
                    <Switch checked={r.status === "Active"} onCheckedChange={() => toggleStatus(r.id)} />
                  </div>
                </li>
              ))}
              {scheduled.length === 0 ? (
                <li className="py-8 text-center text-sm text-muted-foreground">Nothing scheduled yet.</li>
              ) : null}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* ----------------------------------------------------- Create report */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display">Create report</DialogTitle>
            <DialogDescription>Choose a type, metrics, scope and delivery schedule.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report name</Label>
              <Input
                id="report-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Weekly sales performance"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Report type</Label>
                <Select value={draft.type} onValueChange={(v) => setDraft({ ...draft, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date range</Label>
                <Select value={draft.date} onValueChange={(v) => setDraft({ ...draft, date: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {datePresets.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Campaign</Label>
                <Select value={draft.campaign} onValueChange={(v) => setDraft({ ...draft, campaign: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All campaigns</SelectItem>
                    {filterCampaigns.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Team</Label>
                <Select value={draft.team} onValueChange={(v) => setDraft({ ...draft, team: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All teams</SelectItem>
                    {filterTeams.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Metrics</Label>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-border p-3 sm:grid-cols-3">
                {reportMetricOptions.map((m) => (
                  <CheckboxRow
                    key={m}
                    id={`metric-${m}`}
                    label={m}
                    checked={draft.metrics.includes(m)}
                    onChange={(v) =>
                      setDraft({
                        ...draft,
                        metrics: v ? [...draft.metrics, m] : draft.metrics.filter((x) => x !== m),
                      })
                    }
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-desc">Description</Label>
              <Textarea
                id="report-desc"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder="What this report answers and who it's for"
                rows={2}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Schedule delivery</p>
                <p className="text-xs text-muted-foreground">Email this report automatically.</p>
              </div>
              <Switch checked={draft.scheduled} onCheckedChange={(v) => setDraft({ ...draft, scheduled: v })} />
            </div>

            {draft.scheduled ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={draft.schedule} onValueChange={(v) => setDraft({ ...draft, schedule: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Daily 07:30", "Every Monday 09:00", "Weekly Friday 17:00", "Monthly, 1st at 10:00"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-recipients">Recipients</Label>
                  <Input
                    id="report-recipients"
                    value={draft.recipients}
                    onChange={(e) => setDraft({ ...draft, recipients: e.target.value })}
                    placeholder="Manager, Team leads"
                  />
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label>Export format</Label>
              <Select
                value={draft.format}
                onValueChange={(v) => setDraft({ ...draft, format: v as SavedReport["format"] })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["PDF", "CSV", "Excel"] as const).map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button onClick={create}>Create report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------- Report viewer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && open(undefined)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {selected ? (
            <>
              <SheetHeader className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <Badge variant="outline" className="text-[10px]">
                    {selected.type}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {selected.format}
                  </Badge>
                </div>
                <SheetTitle className="font-display">{selected.name}</SheetTitle>
                <SheetDescription>{selected.description}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <StatTile label="Created by" value={selected.createdBy} />
                  <StatTile label="Last generated" value={selected.lastGenerated} />
                  <StatTile label="Schedule" value={selected.schedule} />
                  <StatTile label="Status" value={selected.status} />
                </div>

                <div>
                  <p className="text-sm font-medium">Metrics included</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selected.metrics.map((m) => (
                      <Badge key={m} variant="secondary" className="text-[10px]">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Recipients</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="size-3.5" />
                    {selected.recipients.length > 0 ? selected.recipients.join(", ") : "No recipients yet"}
                  </p>
                </div>

                <Separator />

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => toast.success(`${selected.name} is generating`)}>
                    <Play className="mr-2 size-4" />
                    Run now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success(`Exported as ${selected.format}`)}
                  >
                    <Download className="mr-2 size-4" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleStatus(selected.id)}>
                    <Pencil className="mr-2 size-4" />
                    {selected.status === "Active" ? "Pause schedule" : "Activate schedule"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => remove(selected.id)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
