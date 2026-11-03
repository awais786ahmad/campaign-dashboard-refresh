import * as React from "react";
import { FileText, Search, Upload } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog, DetailDrawer, RecordFormModal } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import { aiAgents, knowledgeCategories, knowledgeDocs, type KnowledgeDoc } from "@/data/settings";

const indexTone: Record<KnowledgeDoc["index"], string> = {
  Indexed: "border-primary/30 bg-primary/10 text-primary",
  Processing: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Failed: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function KnowledgeSettings() {
  const [docs, setDocs] = React.useState<KnowledgeDoc[]>(knowledgeDocs);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [active, setActive] = React.useState<KnowledgeDoc | null>(null);
  const [deleting, setDeleting] = React.useState<KnowledgeDoc | null>(null);
  const [form, setForm] = React.useState({ title: "", category: knowledgeCategories[0]!, notes: "" });

  const filtered = docs.filter(
    (d) =>
      (category === "all" || d.category === category) &&
      (d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.excerpt.toLowerCase().includes(query.toLowerCase())),
  );

  const addDoc = (index: KnowledgeDoc["index"]) => {
    if (!form.title.trim()) {
      toast.error("Give the document a title first");
      return;
    }
    setDocs((list) => [
      {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        type: "PDF",
        category: form.category,
        size: "—",
        updated: "just now",
        index,
        agents: [],
        excerpt: form.notes.trim() || "No description provided yet.",
      },
      ...list,
    ]);
    setForm({ title: "", category: knowledgeCategories[0]!, notes: "" });
  };

  const toggleAgent = (doc: KnowledgeDoc, agent: string, on: boolean) => {
    const next = {
      ...doc,
      agents: on ? [...doc.agents, agent] : doc.agents.filter((a) => a !== agent),
    };
    setDocs((list) => list.map((d) => (d.id === doc.id ? next : d)));
    setActive(next);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Knowledge base"
        description="Documents and FAQs your AI agents ground their answers in."
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 size-4" />
            Upload document
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents"
            className="pl-9"
            aria-label="Search knowledge base"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {knowledgeCategories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((doc) => (
          <Card
            key={doc.id}
            role="button"
            tabIndex={0}
            onClick={() => setActive(doc)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActive(doc);
              }
            }}
            className="cursor-pointer transition-colors hover:border-primary/40"
          >
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted">
                  <FileText className="size-5 text-primary" />
                </span>
                <Badge variant="outline" className={indexTone[doc.index]}>
                  {doc.index}
                </Badge>
              </div>
              <div>
                <CardTitle className="font-display text-base">{doc.title}</CardTitle>
                <CardDescription className="mt-1 line-clamp-2">{doc.excerpt}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{doc.category}</Badge>
              <span>{doc.type}</span>
              <span>·</span>
              <span>{doc.size}</span>
              <span>·</span>
              <span>Updated {doc.updated}</span>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 ? (
          <Card className="border-dashed sm:col-span-2 xl:col-span-3">
            <CardHeader>
              <CardTitle className="font-display text-base">No documents found</CardTitle>
              <CardDescription>Try a different search term or category.</CardDescription>
            </CardHeader>
          </Card>
        ) : null}
      </div>

      <RecordFormModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        title="Upload document"
        description="Add a document for your AI agents to reference."
        mode="create"
        submitLabel="Upload"
        onSubmit={() => addDoc("Processing")}
        onSaveDraft={() => {
          addDoc("Processing");
          toast.info("Document saved as draft");
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="doc-title">Title</Label>
          <Input
            id="doc-title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Pricing & Discount Policy"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="doc-category">Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
            <SelectTrigger id="doc-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {knowledgeCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="doc-file">File</Label>
          <Input id="doc-file" type="file" />
          <p className="text-xs text-muted-foreground">PDF, DOCX or TXT up to 20 MB.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="doc-notes">Description</Label>
          <Textarea
            id="doc-notes"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="What should agents use this document for?"
          />
        </div>
      </RecordFormModal>

      <DetailDrawer
        open={active !== null}
        onOpenChange={(v) => !v && setActive(null)}
        title={active?.title ?? ""}
        description={active?.excerpt ?? ""}
        footer={
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              className="text-destructive"
              onClick={() => active && setDeleting(active)}
            >
              Delete
            </Button>
            <Button onClick={() => toast.success("Re-index queued")}>Re-index document</Button>
          </div>
        }
      >
        {active ? (
          <div className="space-y-5 pt-2">
            <Badge variant="outline" className={indexTone[active.index]}>
              {active.index}
            </Badge>
            <div className="rounded-xl border border-border bg-card px-4">
              <FieldRow label="Category" value={active.category} />
              <FieldRow label="File type" value={active.type} />
              <FieldRow label="Size" value={active.size} />
              <FieldRow label="Last updated" value={active.updated} />
            </div>
            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium">Assigned AI agents</p>
              {aiAgents.map((agent) => (
                <div key={agent} className="flex items-center justify-between gap-4">
                  <Label htmlFor={`${active.id}-${agent}`} className="text-sm text-muted-foreground">
                    {agent}
                  </Label>
                  <Switch
                    id={`${active.id}-${agent}`}
                    checked={active.agents.includes(agent)}
                    onCheckedChange={(v) => toggleAgent(active, agent, v)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete this document?"
        description="Agents will immediately stop using it to answer questions. This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          setDocs((list) => list.filter((d) => d.id !== deleting?.id));
          toast.error(`${deleting?.title ?? "Document"} deleted`);
          setDeleting(null);
          setActive(null);
        }}
      />
    </div>
  );
}
