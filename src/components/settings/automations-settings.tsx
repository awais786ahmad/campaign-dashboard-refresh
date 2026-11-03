import * as React from "react";
import { ArrowRight, Copy, Plus, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog, DetailDrawer } from "@/components/dashboard/crud";
import { SettingsHeader } from "@/components/settings/settings-header";
import {
  actionGroups,
  automationCategories,
  automationLibrary,
  automationSeed,
  conditionOptions,
  triggerOptions,
  type Automation,
} from "@/data/settings";

const steps = ["Details", "Trigger", "Conditions", "Actions", "Review"];

type Draft = {
  name: string;
  description: string;
  category: string;
  trigger: string;
  conditions: string[];
  actions: string[];
};

const emptyDraft: Draft = {
  name: "",
  description: "",
  category: automationCategories[0]!,
  trigger: triggerOptions[0]!,
  conditions: [],
  actions: [],
};

export function AutomationsSettings() {
  const [items, setItems] = React.useState<Automation[]>(automationSeed);
  const [active, setActive] = React.useState<Automation | null>(null);
  const [deleting, setDeleting] = React.useState<Automation | null>(null);
  const [builderOpen, setBuilderOpen] = React.useState(false);
  const [confirmCreate, setConfirmCreate] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [draft, setDraft] = React.useState<Draft>(emptyDraft);
  const [category, setCategory] = React.useState("all");

  const filtered = items.filter((a) => category === "all" || a.category === category);

  const openBuilder = () => {
    setDraft(emptyDraft);
    setStep(0);
    setBuilderOpen(true);
  };

  const commit = (enabled: boolean) => {
    setItems((list) => [
      {
        id: crypto.randomUUID(),
        name: draft.name.trim() || "Untitled automation",
        description: draft.description.trim() || "No description provided.",
        category: draft.category,
        trigger: draft.trigger,
        conditions: draft.conditions,
        actions: draft.actions,
        enabled,
        lastRun: "Never",
        executions: 0,
        logs: [],
      },
      ...list,
    ]);
    setBuilderOpen(false);
  };

  const toggleIn = (key: "conditions" | "actions", value: string) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value],
    }));

  const canContinue =
    (step === 0 && draft.name.trim().length > 2) ||
    step === 1 ||
    step === 2 ||
    (step === 3 && draft.actions.length > 0) ||
    step === 4;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Automations"
        description="Trigger-based workflows that run across leads, calls and campaigns."
        actions={
          <Button onClick={openBuilder}>
            <Plus className="mr-2 size-4" />
            New automation
          </Button>
        }
      />

      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">My automations</TabsTrigger>
          <TabsTrigger value="library">Automation library</TabsTrigger>
        </TabsList>

        <TabsContent value="mine" className="space-y-4 pt-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {automationCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((a) => (
              <Card key={a.id} className="flex flex-col transition-colors hover:border-primary/40">
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted">
                      <Zap className="size-5 text-primary" />
                    </span>
                    <Switch
                      checked={a.enabled}
                      aria-label={`Enable ${a.name}`}
                      onCheckedChange={(v) => {
                        setItems((list) => list.map((x) => (x.id === a.id ? { ...x, enabled: v } : x)));
                        toast.success(`${a.name} ${v ? "enabled" : "paused"}`);
                      }}
                    />
                  </div>
                  <div>
                    <CardTitle className="font-display text-base">{a.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{a.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="secondary">{a.category}</Badge>
                    <Badge variant="outline">{a.trigger}</Badge>
                    <span className="text-muted-foreground">{a.actions.length} actions</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last run {a.lastRun} · {a.executions.toLocaleString()} executions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setActive(a)}>
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setItems((list) => [
                          { ...a, id: crypto.randomUUID(), name: `${a.name} (copy)`, enabled: false, executions: 0, lastRun: "Never", logs: [] },
                          ...list,
                        ]);
                        toast.success("Automation duplicated");
                      }}
                    >
                      <Copy className="mr-1.5 size-3.5" />
                      Duplicate
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleting(a)}>
                      <Trash2 className="mr-1.5 size-3.5" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-6 pt-4">
          {automationLibrary.map((group) => (
            <section key={group.category} className="space-y-3">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {group.category}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {group.recipes.map((r) => (
                  <Card key={r.name}>
                    <CardHeader>
                      <CardTitle className="font-display text-base">{r.name}</CardTitle>
                      <CardDescription className="mt-1">{r.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setDraft({
                            name: r.name,
                            description: r.description,
                            category: group.category,
                            trigger: triggerOptions[0]!,
                            conditions: [],
                            actions: [],
                          });
                          setStep(0);
                          setBuilderOpen(true);
                        }}
                      >
                        Use template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </TabsContent>
      </Tabs>

      {/* Builder */}
      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>New automation</DialogTitle>
            <DialogDescription>
              Step {step + 1} of {steps.length} — {steps[step]}
            </DialogDescription>
          </DialogHeader>

          <ol className="flex flex-wrap items-center gap-2 text-xs">
            {steps.map((s, i) => (
              <li
                key={s}
                className={`rounded-full border px-3 py-1 ${
                  i === step
                    ? "border-primary bg-primary/10 text-primary"
                    : i < step
                      ? "border-border bg-muted text-foreground"
                      : "border-border text-muted-foreground"
                }`}
              >
                {i + 1}. {s}
              </li>
            ))}
          </ol>

          <div className="max-h-[45vh] space-y-4 overflow-y-auto py-2">
            {step === 0 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="auto-name">Name</Label>
                  <Input
                    id="auto-name"
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    placeholder="e.g. Create follow-up task after call"
                  />
                  {draft.name.length > 0 && draft.name.trim().length <= 2 ? (
                    <p className="text-xs text-destructive">Name must be at least 3 characters.</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auto-desc">Description</Label>
                  <Textarea
                    id="auto-desc"
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="What should this automation achieve?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auto-cat">Category</Label>
                  <Select value={draft.category} onValueChange={(v) => setDraft((d) => ({ ...d, category: v }))}>
                    <SelectTrigger id="auto-cat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {automationCategories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {triggerOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, trigger: t }))}
                    className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                      draft.trigger === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Conditions are optional — leave empty to run on every trigger.
                </p>
                {conditionOptions.map((c) => (
                  <label key={c} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                    <Checkbox
                      checked={draft.conditions.includes(c)}
                      onCheckedChange={() => toggleIn("conditions", c)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                {draft.actions.length === 0 ? (
                  <p className="text-xs text-destructive">Pick at least one action.</p>
                ) : null}
                {actionGroups.map((g) => (
                  <div key={g.group} className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {g.group}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {g.actions.map((a) => (
                        <label key={a} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                          <Checkbox
                            checked={draft.actions.includes(a)}
                            onCheckedChange={() => toggleIn("actions", a)}
                          />
                          {a}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-3 rounded-xl border border-border bg-card p-4 text-sm">
                <p className="font-display text-base font-semibold">{draft.name || "Untitled automation"}</p>
                <p className="text-muted-foreground">{draft.description || "No description."}</p>
                <Flow trigger={draft.trigger} conditions={draft.conditions} actions={draft.actions} />
              </div>
            ) : null}
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="outline" onClick={() => commit(false)}>
              Save as draft
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => (step === 0 ? setBuilderOpen(false) : setStep((s) => s - 1))}
              >
                {step === 0 ? "Cancel" : "Back"}
              </Button>
              {step < steps.length - 1 ? (
                <Button disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
                  Continue
                </Button>
              ) : (
                <Button onClick={() => setConfirmCreate(true)}>Create automation</Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmCreate}
        onOpenChange={setConfirmCreate}
        title="Create this automation?"
        description="It will start running as soon as its trigger fires."
        confirmLabel="Create"
        onConfirm={() => {
          setConfirmCreate(false);
          commit(true);
          toast.success("Automation created");
        }}
      />

      <DetailDrawer
        open={active !== null}
        onOpenChange={(v) => !v && setActive(null)}
        title={active?.name ?? ""}
        description={active?.description ?? ""}
        footer={
          <div className="flex justify-between gap-2">
            <Button variant="outline" className="text-destructive" onClick={() => active && setDeleting(active)}>
              Delete
            </Button>
            <Button onClick={() => toast.success("Test run queued")}>Run test</Button>
          </div>
        }
      >
        {active ? (
          <div className="space-y-5 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{active.category}</Badge>
              <Badge variant="outline">{active.enabled ? "Active" : "Paused"}</Badge>
              <span className="text-xs text-muted-foreground">
                {active.executions.toLocaleString()} executions · last run {active.lastRun}
              </span>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <Flow trigger={active.trigger} conditions={active.conditions} actions={active.actions} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Execution logs</p>
              {active.logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">This automation has not run yet.</p>
              ) : (
                active.logs.map((log) => (
                  <div key={log.id} className="rounded-xl border border-border bg-card p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{log.time}</span>
                      <Badge
                        variant="outline"
                        className={
                          log.status === "Success"
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-destructive/30 bg-destructive/10 text-destructive"
                        }
                      >
                        {log.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {log.trigger} → {log.actions} · {log.duration}
                    </p>
                    {log.error ? <p className="mt-1 text-xs text-destructive">{log.error}</p> : null}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete this automation?"
        description="Any workflow currently relying on it will stop running. This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          setItems((list) => list.filter((x) => x.id !== deleting?.id));
          toast.error(`${deleting?.name ?? "Automation"} deleted`);
          setDeleting(null);
          setActive(null);
        }}
      />
    </div>
  );
}

function Flow({
  trigger,
  conditions,
  actions,
}: {
  trigger: string;
  conditions: string[];
  actions: string[];
}) {
  return (
    <div className="space-y-3 text-sm">
      <FlowRow label="When" items={[trigger]} />
      <FlowRow label="If" items={conditions.length ? conditions : ["Always"]} />
      <FlowRow label="Then" items={actions.length ? actions : ["No actions selected"]} />
    </div>
  );
}

function FlowRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex gap-3">
      <span className="w-12 shrink-0 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <React.Fragment key={`${item}-${i}`}>
            {i > 0 ? <ArrowRight className="size-3 text-muted-foreground" /> : null}
            <span className="rounded-lg border border-border bg-muted px-2.5 py-1 text-xs">{item}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
