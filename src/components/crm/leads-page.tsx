import * as React from "react";
import {
  Building2,
  Check,
  Columns3,
  Settings2,
  Mail,
  Phone,
  Plus,
  Rows3,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog, DetailDrawer, RecordFormModal } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import {
  crmAgents,
  crmCampaigns,
  leadSeed,
  leadStatusColumnsSeed,
  pipelineStagesSeed,
  segmentSeed,
  tagClass,
  tagSeed,
  type Lead,
  type StatusColumn,
} from "@/data/crm";
import { StatusBoard } from "@/components/crm/status-board";

const statusTone: Record<string, string> = {
  New: "bg-sky-500/15 text-sky-600 border-sky-500/30",
  Contacted: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  Qualified: "bg-violet-500/15 text-violet-600 border-violet-500/30",
  Won: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  Lost: "bg-rose-500/15 text-rose-600 border-rose-500/30",
  Archived: "bg-muted text-muted-foreground border-border",
};
const customTone = "bg-accent-soft text-foreground border-accent/30";
const toneFor = (id: string) => statusTone[id] ?? customTone;

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  company: "",
  owner: crmAgents[0]!,
  campaign: crmCampaigns[0]!,
  segment: segmentSeed[0]!.name,
  notes: "",
};

export function LeadsPage() {
  const [list, setList] = React.useState<Lead[]>(leadSeed);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("All Leads");
  const [view, setView] = React.useState("table");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Lead | null>(null);
  const [active, setActive] = React.useState<Lead | null>(null);
  const [deleting, setDeleting] = React.useState<Lead | null>(null);
  const [columns, setColumns] = React.useState<StatusColumn[]>(leadStatusColumnsSeed);
  const [editingColumns, setEditingColumns] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);

  const filtered = list.filter((l) => {
    const q = query.toLowerCase();
    const matchQ =
      l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.company.toLowerCase().includes(q);
    return matchQ && (status === "All Leads" || l.status === status);
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditing(lead);
    setForm({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      company: lead.company,
      owner: lead.owner,
      campaign: lead.campaign,
      segment: lead.segments[0] ?? segmentSeed[0]!.name,
      notes: lead.notes,
    });
    setFormOpen(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone number are required");
      return;
    }
    if (editing) {
      const next: Lead = {
        ...editing,
        ...form,
        name: form.name.trim(),
        segments: [form.segment],
      };
      setList((l) => l.map((x) => (x.id === editing.id ? next : x)));
      setActive((a) => (a && a.id === editing.id ? next : a));
      toast.success("Lead updated");
      return;
    }
    setList((l) => [
      {
        id: crypto.randomUUID(),
        ...form,
        name: form.name.trim(),
        lastContacted: "Never",
        stage: "new",
        status: "New",
        tags: [],
        segments: [form.segment],
        aiSummary: "Not contacted yet. Queue on the next outbound batch.",
        calls: [],
        messages: [],
        timeline: [{ id: "e1", when: "just now", text: "Lead created manually" }],
      },
      ...l,
    ]);
    toast.success("Lead created");
  };

  const changeStatus = (leadId: string, statusId: string) => {
    const col = columns.find((c) => c.id === statusId);
    if (!col) return;
    const current = list.find((l) => l.id === leadId);
    if (!current || current.status === statusId) return;
    const update = (lead: Lead): Lead => ({
      ...lead,
      status: statusId,
      timeline: [{ id: crypto.randomUUID(), when: "just now", text: `Status changed to ${col.name}` }, ...lead.timeline],
    });
    setList((l) => l.map((lead) => (lead.id === leadId ? update(lead) : lead)));
    setActive((a) => (a && a.id === leadId ? update(a) : a));
    toast.success(`${current.name} moved to ${col.name}`);
  };

  const updateColumns = (next: StatusColumn[], removed?: StatusColumn) => {
    if (removed) {
      const fallback = next[0]!;
      setList((l) => l.map((lead) => (lead.status === removed.id ? { ...lead, status: fallback.id } : lead)));
      if (status === removed.id) setStatus("All Leads");
      toast.success(`"${removed.name}" deleted`);
    } else if (next.length > columns.length) {
      toast.success(`"${next[next.length - 1]!.name}" status added`);
    }
    setColumns(next);
  };

  const statusSelect = (lead: Lead, className = "h-8 w-36") => (
    <Select value={lead.status} onValueChange={(v) => changeStatus(lead.id, v)}>
      <SelectTrigger className={`${className} rounded-full border px-2.5 text-xs font-medium ${toneFor(lead.status)}`} aria-label="Change status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {columns.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Leads"
        description="Every person in your CRM with their calls, messages, tags and pipeline stage in one place."
        actions={
          <div className="flex gap-2">
            {view === "pipeline" ? (
              <Button
                variant={editingColumns ? "default" : "outline"}
                onClick={() => setEditingColumns((v) => !v)}
              >
                {editingColumns ? <Check className="mr-2 size-4" /> : <Settings2 className="mr-2 size-4" />}
                {editingColumns ? "Done editing" : "Edit columns"}
              </Button>
            ) : null}
            <Button onClick={openCreate}>
              <Plus className="mr-2 size-4" />
              New lead
            </Button>
          </div>
        }
      />

      <Tabs
        value={view}
        onValueChange={(v) => {
          setView(v);
          setEditingColumns(false);
        }}
        className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="table">
              <Rows3 className="mr-2 size-4" />
              Table
            </TabsTrigger>
            <TabsTrigger value="pipeline">
              <Columns3 className="mr-2 size-4" />
              Pipeline
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, phone or company"
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Leads">All Leads</SelectItem>
                {columns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="table" className="m-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Last contacted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((lead) => (
                    <TableRow key={lead.id} className="cursor-pointer" onClick={() => setActive(lead)}>
                      <TableCell>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.company}</div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div>{lead.phone}</div>
                        <div className="text-xs">{lead.email}</div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>{statusSelect(lead)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.map((t) => (
                            <span
                              key={t}
                              className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${tagClass(
                                tagSeed.find((x) => x.name === t)?.color ?? "amber",
                              )}`}
                            >
                              {t}
                            </span>
                          ))}
                          {!lead.tags.length ? <span className="text-sm text-muted-foreground">—</span> : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{lead.owner}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{lead.lastContacted}</TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" aria-label="Call lead" onClick={() => toast.info(`Dialling ${lead.name}`)}>
                            <Phone className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" aria-label="Delete lead" onClick={() => setDeleting(lead)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!filtered.length ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                        No leads match your filters.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="m-0">
          {editingColumns ? (
            <p className="mb-3 rounded-xl border border-dashed border-accent/40 bg-accent-soft px-4 py-2.5 text-sm text-muted-foreground">
              Drag columns to reorder them, or use the pencil and bin icons to rename or delete a status.
            </p>
          ) : null}
          <StatusBoard
            columns={columns}
            onColumnsChange={updateColumns}
            items={filtered}
            getStatus={(l) => l.status}
            onMoveItem={changeStatus}
            editing={editingColumns}
            entityLabel="lead"
            emptyText="Drop a lead here"
            renderCard={(lead) => (
              <button
                type="button"
                onClick={() => setActive(lead)}
                className="w-full rounded-xl border border-border bg-background p-3 text-left transition-shadow hover:shadow-sm"
              >
                <div className="text-sm font-medium">{lead.name}</div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="size-3" />
                  {lead.company}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {lead.tags.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${tagClass(
                        tagSeed.find((x) => x.name === t)?.color ?? "amber",
                      )}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            )}
          />
        </TabsContent>
      </Tabs>

      <RecordFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editing ? "Edit lead" : "New lead"}
        description="Name and phone number are the only required fields."
        mode={editing ? "edit" : "create"}
        onSubmit={save}
        {...(editing ? {} : { onSaveDraft: () => toast.info("Lead saved as draft") })}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Full name</Label>
            <Input id="lead-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-phone">Phone</Label>
            <Input id="lead-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+92 300 0000000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-email">Email</Label>
            <Input id="lead-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-company">Company</Label>
            <Input id="lead-company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Owner</Label>
            <Select value={form.owner} onValueChange={(v) => setForm((f) => ({ ...f, owner: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {crmAgents.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Campaign</Label>
            <Select value={form.campaign} onValueChange={(v) => setForm((f) => ({ ...f, campaign: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {crmCampaigns.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Segment</Label>
          <Select value={form.segment} onValueChange={(v) => setForm((f) => ({ ...f, segment: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {segmentSeed.map((s) => (
                <SelectItem key={s.id} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-notes">Notes</Label>
          <Textarea id="lead-notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
      </RecordFormModal>

      <DetailDrawer
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        activity={active ? { entityType: "Lead", entityId: active.id, record: active.name } : null}
        title={active?.name ?? ""}
        description={active ? `${active.company} · ${active.phone}` : ""}
        footer={
          <div className="flex justify-between gap-2">
            <Button variant="ghost" onClick={() => active && setDeleting(active)}>
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => active && openEdit(active)}>
                Edit lead
              </Button>
              <Button onClick={() => active && toast.info(`Dialling ${active.name}`)}>
                <Phone className="mr-2 size-4" />
                Call
              </Button>
            </div>
          </div>
        }
      >
        {active ? (
          <div className="space-y-6 pt-4">
            <div className="rounded-xl border border-accent/30 bg-accent-soft p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-4 text-accent" />
                AI summary
              </div>
              <p className="text-sm text-muted-foreground">{active.aiSummary}</p>
            </div>

            <div className="rounded-xl border border-border p-4">
              <FieldRow label="Status" value={statusSelect(active, "h-8 w-40")} />
              <FieldRow label="Stage" value={pipelineStagesSeed.find((s) => s.id === active.stage)?.name ?? active.stage} />
              <FieldRow label="Email" value={active.email} />
              <FieldRow label="Owner" value={active.owner} />
              <FieldRow label="Campaign" value={<Badge variant="outline">{active.campaign}</Badge>} />
              <FieldRow label="Segments" value={active.segments.join(", ") || "—"} />
              <FieldRow label="Last contacted" value={active.lastContacted} />
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {active.tags.map((t) => (
                  <span
                    key={t}
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tagClass(
                      tagSeed.find((x) => x.name === t)?.color ?? "amber",
                    )}`}
                  >
                    {t}
                  </span>
                ))}
                {!active.tags.length ? <span className="text-sm text-muted-foreground">No tags yet.</span> : null}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Call history</h3>
              <div className="space-y-2">
                {active.calls.map((c) => (
                  <div key={c.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{c.outcome}</span>
                      <span className="text-xs text-muted-foreground">{c.when} · {c.duration}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">Agent: {c.agent}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{c.transcript}</p>
                  </div>
                ))}
                {!active.calls.length ? <p className="text-sm text-muted-foreground">No calls logged yet.</p> : null}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Messages</h3>
              <div className="space-y-2">
                {active.messages.map((m) => (
                  <div key={m.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="size-3" />
                      {m.channel} · {m.direction === "in" ? "Received" : "Sent"} · {m.when}
                    </div>
                    <p className="mt-1 text-sm">{m.body}</p>
                  </div>
                ))}
                {!active.messages.length ? <p className="text-sm text-muted-foreground">No messages yet.</p> : null}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Notes</h3>
              <p className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                {active.notes || "No notes yet."}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Timeline</h3>
              <ol className="space-y-3 border-l border-border pl-4">
                {active.timeline.map((e) => (
                  <li key={e.id} className="relative text-sm">
                    <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-accent" />
                    <div>{e.text}</div>
                    <div className="text-xs text-muted-foreground">{e.when}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={`Delete ${deleting?.name}?`}
        description="The lead, its call history and messages are removed from the CRM. This cannot be undone."
        confirmLabel="Delete lead"
        destructive
        onConfirm={() => {
          setList((l) => l.filter((x) => x.id !== deleting?.id));
          setActive(null);
          setDeleting(null);
          toast.success("Lead deleted");
        }}
      />
    </div>
  );
}
