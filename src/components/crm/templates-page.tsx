import * as React from "react";
import { Mail, MessageSquare, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog, DetailDrawer, RecordFormModal } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import {
  crmCampaigns,
  templateCategories,
  templateSeed,
  templateVariables,
  type Template,
} from "@/data/crm";

const emptyForm = {
  name: "",
  channel: "SMS" as Template["channel"],
  category: templateCategories[0]!,
  subject: "",
  body: "",
  campaigns: [] as string[],
};

export function TemplatesPage() {
  const [list, setList] = React.useState<Template[]>(templateSeed);
  const [query, setQuery] = React.useState("");
  const [channel, setChannel] = React.useState("All");
  const [category, setCategory] = React.useState("All");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Template | null>(null);
  const [active, setActive] = React.useState<Template | null>(null);
  const [deleting, setDeleting] = React.useState<Template | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  const filtered = list.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) &&
      (channel === "All" || t.channel === channel) &&
      (category === "All" || t.category === category),
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (t: Template) => {
    setEditing(t);
    setForm({
      name: t.name,
      channel: t.channel,
      category: t.category,
      subject: t.subject,
      body: t.body,
      campaigns: t.campaigns,
    });
    setFormOpen(true);
  };

  const toggleCampaign = (c: string) =>
    setForm((f) => ({
      ...f,
      campaigns: f.campaigns.includes(c) ? f.campaigns.filter((x) => x !== c) : [...f.campaigns, c],
    }));

  const insertVariable = (v: string) => {
    setForm((f) => ({ ...f, body: `${f.body}${f.body && !f.body.endsWith(" ") ? " " : ""}${v}` }));
    bodyRef.current?.focus();
  };

  const save = () => {
    if (!form.name.trim() || !form.body.trim()) {
      toast.error("A template needs a name and a message body");
      return;
    }
    if (form.channel === "Email" && !form.subject.trim()) {
      toast.error("Email templates need a subject line");
      return;
    }
    if (editing) {
      const next = { ...editing, ...form, name: form.name.trim(), updatedAt: "just now" };
      setList((l) => l.map((t) => (t.id === editing.id ? next : t)));
      setActive((a) => (a && a.id === editing.id ? next : a));
      toast.success("Template updated");
      return;
    }
    setList((l) => [
      { id: crypto.randomUUID(), ...form, name: form.name.trim(), updatedAt: "just now" },
      ...l,
    ]);
    toast.success("Template created");
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Templates"
        description="Reusable SMS and email messages with variables, ready to attach to any campaign."
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            New template
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates"
            className="pl-9"
          />
        </div>
        <Tabs value={channel} onValueChange={setChannel}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="SMS">SMS</TabsTrigger>
            <TabsTrigger value="Email">Email</TabsTrigger>
            <TabsTrigger value="WhatsApp">WhatsApp</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All categories</SelectItem>
            {templateCategories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <Card
            key={t.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => setActive(t)}
          >
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base">{t.name}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.channel === "Email" ? t.subject : "SMS message"}
                </p>
              </div>
              {t.channel === "Email" ? (
                <Mail className="size-5 shrink-0 text-muted-foreground" />
              ) : (
                <MessageSquare className="size-5 shrink-0 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="line-clamp-3 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                {t.body}
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary">{t.channel}</Badge>
                <Badge variant="secondary">{t.category}</Badge>
                {t.campaigns.map((c) => (
                  <Badge key={c} variant="outline" className="font-normal">
                    {c}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">Updated {t.updatedAt}</span>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(t)}
                    aria-label="Edit template"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleting(t)}
                    aria-label="Delete template"
                  >
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
              No templates match your filters.
            </CardContent>
          </Card>
        ) : null}
      </div>

      <RecordFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editing ? "Edit template" : "New template"}
        description="Insert variables to personalise each message before it is sent."
        mode={editing ? "edit" : "create"}
        onSubmit={save}
        {...(editing ? {} : { onSaveDraft: () => toast.info("Template saved as draft") })}
      >
        <div className="space-y-2">
          <Label htmlFor="tpl-name">Template name</Label>
          <Input
            id="tpl-name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Channel</Label>
            <Select
              value={form.channel}
              onValueChange={(v) => setForm((f) => ({ ...f, channel: v as Template["channel"] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templateCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {form.channel === "Email" ? (
          <div className="space-y-2">
            <Label htmlFor="tpl-subject">Subject</Label>
            <Input
              id="tpl-subject"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="Welcome to {{ProductName}}"
            />
          </div>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="tpl-body">Message</Label>
          <Textarea
            id="tpl-body"
            ref={bodyRef}
            rows={6}
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder={"Hello {{LeadName}}, …"}
          />
          <div className="flex flex-wrap gap-2 pt-1">
            {templateVariables.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => insertVariable(v)}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-ring"
              >
                {v}
              </button>
            ))}
          </div>
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
        description={active ? `${active.channel} template · ${active.category}` : ""}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => active && setDeleting(active)}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => active && openEdit(active)}>
              Edit template
            </Button>
          </div>
        }
      >
        {active ? (
          <div className="space-y-6 pt-4">
            <div className="rounded-xl border border-border p-4">
              <FieldRow
                label="Channel"
                value={<Badge variant="secondary">{active.channel}</Badge>}
              />
              {active.channel === "Email" ? (
                <FieldRow label="Subject" value={active.subject} />
              ) : null}
              <FieldRow label="Campaigns" value={active.campaigns.join(", ") || "Not assigned"} />
              <FieldRow label="Last updated" value={active.updatedAt} />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Message preview</h3>
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
        description="Campaigns using this template will stop sending it immediately."
        confirmLabel="Delete template"
        destructive
        onConfirm={() => {
          setList((l) => l.filter((t) => t.id !== deleting?.id));
          setActive(null);
          setDeleting(null);
          toast.success("Template deleted");
        }}
      />
    </div>
  );
}
