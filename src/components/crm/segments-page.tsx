import * as React from "react";
import { Eye, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog, DetailDrawer, RecordFormModal } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import { leadSeed, segmentSeed, type Segment } from "@/data/crm";

export function SegmentsPage() {
  const [list, setList] = React.useState<Segment[]>(segmentSeed);
  const [query, setQuery] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Segment | null>(null);
  const [active, setActive] = React.useState<Segment | null>(null);
  const [deleting, setDeleting] = React.useState<Segment | null>(null);
  const [form, setForm] = React.useState({ name: "", description: "" });

  const filtered = list.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setFormOpen(true);
  };

  const openEdit = (segment: Segment) => {
    setEditing(segment);
    setForm({ name: segment.name, description: segment.description });
    setFormOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Segment name is required");
      return;
    }
    if (editing) {
      const next = { ...editing, name: form.name.trim(), description: form.description.trim() };
      setList((l) => l.map((s) => (s.id === editing.id ? next : s)));
      setActive((a) => (a && a.id === editing.id ? next : a));
      toast.success("Segment updated");
      return;
    }
    setList((l) => [
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        description: form.description.trim() || "No description yet.",
        leadCount: 0,
        campaigns: [],
        createdAt: "just now",
        source: "Manual",
      },
      ...l,
    ]);
    toast.success("Segment created");
  };

  const segmentLeads = (segment: Segment | null) =>
    segment ? leadSeed.filter((l) => l.segments.includes(segment.name)) : [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Segments"
        description="Group leads for campaigns and filtering. A default segment is created automatically from your onboarding import."
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            New segment
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search segments"
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Campaigns</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((segment) => (
                <TableRow key={segment.id} className="cursor-pointer" onClick={() => setActive(segment)}>
                  <TableCell>
                    <div className="font-medium">{segment.name}</div>
                    <div className="text-xs text-muted-foreground">{segment.description}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <Users className="size-3.5 text-muted-foreground" />
                      {segment.leadCount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {segment.campaigns.length ? (
                        segment.campaigns.map((c) => (
                          <Badge key={c} variant="outline" className="font-normal">
                            {c}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{segment.createdAt}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setActive(segment)} aria-label="View segment">
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(segment)} aria-label="Edit segment">
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleting(segment)} aria-label="Delete segment">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!filtered.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    No segments match your search.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RecordFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editing ? "Edit segment" : "New segment"}
        description={editing ? "Rename this segment or update its description." : "Segments only need a name to get started."}
        mode={editing ? "edit" : "create"}
        onSubmit={save}
        {...(editing ? {} : { onSaveDraft: () => toast.info("Segment saved as draft") })}
      >
        <div className="space-y-2">
          <Label htmlFor="segment-name">Segment name</Label>
          <Input
            id="segment-name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Expiring Policies"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="segment-desc">Description</Label>
          <Textarea
            id="segment-desc"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Optional — what makes a lead belong here?"
          />
        </div>
      </RecordFormModal>

      <DetailDrawer
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        title={active?.name ?? ""}
        description={active?.description ?? ""}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => active && openEdit(active)}>
              Edit segment
            </Button>
            <Button variant="ghost" onClick={() => active && setDeleting(active)}>
              Delete
            </Button>
          </div>
        }
      >
        {active ? (
          <div className="space-y-6 pt-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <FieldRow label="Leads" value={active.leadCount.toLocaleString()} />
              <FieldRow label="Created" value={active.createdAt} />
              <FieldRow label="Source" value={active.source} />
              <FieldRow
                label="Campaigns"
                value={
                  active.campaigns.length ? (
                    <span className="flex flex-wrap justify-end gap-1">
                      {active.campaigns.map((c) => (
                        <Badge key={c} variant="outline" className="font-normal">
                          {c}
                        </Badge>
                      ))}
                    </span>
                  ) : (
                    "Not assigned"
                  )
                }
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold">Leads in this segment</h3>
              <div className="mt-3 space-y-2">
                {segmentLeads(active).map((lead) => (
                  <div key={lead.id} className="rounded-xl border border-border bg-card p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium">{lead.name}</span>
                      <Badge variant="outline" className="font-normal">
                        {lead.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {lead.phone} · {lead.email}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Campaign: {lead.campaign} · Last contacted {lead.lastContacted}
                    </p>
                  </div>
                ))}
                {!segmentLeads(active).length ? (
                  <p className="text-sm text-muted-foreground">No leads assigned to this segment yet.</p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={`Delete ${deleting?.name}?`}
        description="Leads stay in your CRM, but they will no longer belong to this segment."
        confirmLabel="Delete segment"
        destructive
        onConfirm={() => {
          if (!deleting) return;
          setList((l) => l.filter((s) => s.id !== deleting.id));
          setActive((a) => (a && a.id === deleting.id ? null : a));
          toast.success("Segment deleted");
          setDeleting(null);
        }}
      />
    </div>
  );
}
