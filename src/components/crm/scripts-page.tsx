import * as React from "react";
import { FileText, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog, DetailDrawer, RecordFormModal } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import { crmCampaigns, scriptCategories, scriptSeed, type Script } from "@/data/crm";

const emptyForm = {
  name: "",
  category: scriptCategories[0]!,
  description: "",
  body: "",
  campaigns: [] as string[],
};

export function ScriptsPage() {
  const [list, setList] = React.useState<Script[]>(scriptSeed);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("All");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Script | null>(null);
  const [active, setActive] = React.useState<Script | null>(null);
  const [deleting, setDeleting] = React.useState<Script | null>(null);
  const [form, setForm] = React.useState(emptyForm);

  const filtered = list.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) && (category === "All" || s.category === category),
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (script: Script) => {
    setEditing(script);
    setForm({
      name: script.name,
      category: script.category,
      description: script.description,
      body: script.body,
      campaigns: script.campaigns,
    });
    setFormOpen(true);
  };

  const toggleCampaign = (c: string) =>
    setForm((f) => ({
      ...f,
      campaigns: f.campaigns.includes(c) ? f.campaigns.filter((x) => x !== c) : [...f.campaigns, c],
    }));

  const save = () => {
    if (!form.name.trim() || !form.body.trim()) {
      toast.error("A script needs a name and some content");
      return;
    }
    if (editing) {
      const next = { ...editing, ...form, name: form.name.trim(), updatedAt: "just now" };
      setList((l) => l.map((s) => (s.id === editing.id ? next : s)));
      setActive((a) => (a && a.id === editing.id ? next : a));
      toast.success("Script updated");
      return;
    }
    setList((l) => [
      { id: crypto.randomUUID(), ...form, name: form.name.trim(), updatedAt: "just now" },
      ...l,
    ]);
    toast.success("Script created");
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Call scripts"
        description="Reusable talk tracks your agents and AI follow on calls. Assign a script to any campaign."
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            New script
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search scripts" className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All categories</SelectItem>
            {scriptCategories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((script) => (
          <Card
            key={script.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => setActive(script)}
          >
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base">{script.name}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{script.description}</p>
              </div>
              <FileText className="size-5 shrink-0 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="line-clamp-3 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">{script.body}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary">{script.category}</Badge>
                {script.campaigns.map((c) => (
                  <Badge key={c} variant="outline" className="font-normal">
                    {c}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">Updated {script.updatedAt}</span>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(script)} aria-label="Edit script">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleting(script)} aria-label="Delete script">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!filtered.length ? (
          <Card className="md:col-span-2 xl:col-span-3">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No scripts match your filters.
            </CardContent>
          </Card>
        ) : null}
      </div>

      <RecordFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editing ? "Edit script" : "New script"}
        description="Use variables like {{LeadName}} and {{AgentName}} to personalise the talk track."
        mode={editing ? "edit" : "create"}
        onSubmit={save}
        {...(editing ? {} : { onSaveDraft: () => toast.info("Script saved as draft") })}
      >
        <div className="space-y-2">
          <Label htmlFor="script-name">Script name</Label>
          <Input id="script-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scriptCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="script-desc">Description</Label>
          <Input
            id="script-desc"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="When should agents use this?"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="script-body">Script</Label>
          <Textarea
            id="script-body"
            rows={6}
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder={"Hi {{LeadName}}, this is {{AgentName}} from Quality Dial…"}
          />
        </div>
        <div className="space-y-2">
          <Label>Assign to campaigns</Label>
          <div className="flex flex-wrap gap-2">
            {crmCampaigns.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCampaign(c)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  form.campaigns.includes(c)
                    ? "border-accent bg-accent-soft text-foreground"
                    : "border-border text-muted-foreground hover:border-ring"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </RecordFormModal>

      <DetailDrawer
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        title={active?.name ?? ""}
        description={active?.description ?? ""}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => active && setDeleting(active)}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => active && openEdit(active)}>
              Edit script
            </Button>
          </div>
        }
      >
        {active ? (
          <div className="space-y-6 pt-4">
            <div className="rounded-xl border border-border p-4">
              <FieldRow label="Category" value={<Badge variant="secondary">{active.category}</Badge>} />
              <FieldRow label="Campaigns" value={active.campaigns.join(", ") || "Not assigned"} />
              <FieldRow label="Last updated" value={active.updatedAt} />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Script content</h3>
              <pre className="whitespace-pre-wrap rounded-xl border border-border bg-muted/40 p-4 font-sans text-sm text-muted-foreground">
                {active.body}
              </pre>
            </div>
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={`Delete "${deleting?.name}"?`}
        description="Campaigns using this script will fall back to their default talk track."
        confirmLabel="Delete script"
        destructive
        onConfirm={() => {
          setList((l) => l.filter((s) => s.id !== deleting?.id));
          setActive(null);
          setDeleting(null);
          toast.success("Script deleted");
        }}
      />
    </div>
  );
}
