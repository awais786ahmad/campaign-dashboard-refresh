import * as React from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog, DetailDrawer, RecordFormModal } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import { leadSeed, tagClass, tagColors, tagSeed, type Tag } from "@/data/crm";

export function TagsPage() {
  const [list, setList] = React.useState<Tag[]>(tagSeed);
  const [query, setQuery] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Tag | null>(null);
  const [active, setActive] = React.useState<Tag | null>(null);
  const [deleting, setDeleting] = React.useState<Tag | null>(null);
  const [form, setForm] = React.useState({ name: "", description: "", color: "amber" });

  const filtered = list.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", color: "amber" });
    setFormOpen(true);
  };

  const openEdit = (tag: Tag) => {
    setEditing(tag);
    setForm({ name: tag.name, description: tag.description, color: tag.color });
    setFormOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Tag name is required");
      return;
    }
    if (editing) {
      const next = { ...editing, ...form, name: form.name.trim() };
      setList((l) => l.map((t) => (t.id === editing.id ? next : t)));
      setActive((a) => (a && a.id === editing.id ? next : a));
      toast.success("Tag updated");
      return;
    }
    setList((l) => [
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        description: form.description.trim() || "No description yet.",
        color: form.color,
        leads: 0,
        system: false,
        createdAt: "just now",
      },
      ...l,
    ]);
    toast.success("Tag created");
  };

  const taggedLeads = (tag: Tag | null) => (tag ? leadSeed.filter((l) => l.tags.includes(tag.name)) : []);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Tags"
        description="Reusable labels that describe a lead's intent, value or next step. Agents and AI can apply them during calls."
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            New tag
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tags" className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tag) => (
                <TableRow key={tag.id} className="cursor-pointer" onClick={() => setActive(tag)}>
                  <TableCell>
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${tagClass(tag.color)}`}>
                      {tag.name}
                    </span>
                    {tag.system ? (
                      <Badge variant="outline" className="ml-2 font-normal">
                        System
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell className="max-w-sm text-sm text-muted-foreground">{tag.description}</TableCell>
                  <TableCell className="text-sm">{tag.leads}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{tag.createdAt}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setActive(tag)} aria-label="View tag">
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(tag)} aria-label="Edit tag">
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={tag.system}
                        onClick={() => setDeleting(tag)}
                        aria-label="Delete tag"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!filtered.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    No tags match your search.
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
        title={editing ? "Edit tag" : "New tag"}
        description="Tags are shared across the whole workspace."
        mode={editing ? "edit" : "create"}
        onSubmit={save}
        {...(editing ? {} : { onSaveDraft: () => toast.info("Tag saved as draft") })}
      >
        <div className="space-y-2">
          <Label htmlFor="tag-name">Tag name</Label>
          <Input
            id="tag-name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. High Budget"
          />
        </div>
        <div className="space-y-2">
          <Label>Colour</Label>
          <div className="flex flex-wrap gap-2">
            {tagColors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, color: c.id }))}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-opacity ${c.className} ${
                  form.color === c.id ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : "opacity-70"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tag-desc">Description</Label>
          <Textarea
            id="tag-desc"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="When should this tag be applied?"
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
              Edit tag
            </Button>
            <Button variant="ghost" disabled={active?.system} onClick={() => active && setDeleting(active)}>
              Delete
            </Button>
          </div>
        }
      >
        {active ? (
          <div className="space-y-6 pt-4">
            <div className="rounded-xl border border-border p-4">
              <FieldRow
                label="Colour"
                value={
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${tagClass(active.color)}`}>
                    {active.name}
                  </span>
                }
              />
              <FieldRow label="Type" value={active.system ? "System tag" : "Custom tag"} />
              <FieldRow label="Leads tagged" value={active.leads} />
              <FieldRow label="Created" value={active.createdAt} />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Leads with this tag</h3>
              <div className="space-y-2">
                {taggedLeads(active).map((l) => (
                  <div key={l.id} className="rounded-lg border border-border px-3 py-2">
                    <div className="text-sm font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {l.company} · {l.phone}
                    </div>
                  </div>
                ))}
                {!taggedLeads(active).length ? (
                  <p className="text-sm text-muted-foreground">No leads carry this tag yet.</p>
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
        description="The tag is removed from every lead that carries it. This cannot be undone."
        confirmLabel="Delete tag"
        destructive
        onConfirm={() => {
          setList((l) => l.filter((t) => t.id !== deleting?.id));
          setActive(null);
          setDeleting(null);
          toast.success("Tag deleted");
        }}
      />
    </div>
  );
}
