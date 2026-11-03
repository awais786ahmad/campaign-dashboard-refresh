import * as React from "react";
import { Check, FileText, Layers, Mail, Plus, Table2, Zap } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FieldRow } from "@/components/settings/settings-header";
import { dataTableSeed, scriptSeed, segmentSeed, templateSeed } from "@/data/crm";
import {
  availableAutomations,
  availableTeams,
  campaignPurposes,
  campaignTypeHelp,
  campaignTypes,
  configFieldsByType,
  type CampaignType,
} from "@/data/campaigns";

export type NewCampaignDraft = {
  name: string;
  type: CampaignType;
  purpose: string;
  goal: string;
  team: string;
  segments: string[];
  config: Record<string, string>;
  scripts: string[];
  templates: string[];
  automations: string[];
  dataTables: string[];
};

const emptyDraft: NewCampaignDraft = {
  name: "",
  type: "Outbound",
  purpose: "Sales",
  goal: "",
  team: "",
  segments: [],
  config: {},
  scripts: [],
  templates: [],
  automations: [],
  dataTables: [],
};

const steps = [
  { id: 1, title: "Basic information", description: "Name, type, purpose and goal" },
  { id: 2, title: "Team & audience", description: "Assign a team and lead segments" },
  { id: 3, title: "Configuration", description: "Rules for this campaign type" },
  { id: 4, title: "Resources", description: "Scripts, templates, automations, data" },
  { id: 5, title: "Review & launch", description: "Confirm everything and go live" },
];

const resourceTabs = [
  { id: "scripts", label: "Scripts", icon: FileText },
  { id: "templates", label: "Templates", icon: Mail },
  { id: "automations", label: "Automations", icon: Zap },
  { id: "data", label: "Data Tables", icon: Table2 },
] as const;

export function CreateCampaignModal({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (draft: NewCampaignDraft, status: "Active" | "Draft") => void;
}) {
  const [step, setStep] = React.useState(1);
  const [draft, setDraft] = React.useState<NewCampaignDraft>(emptyDraft);
  const navigate = useNavigate();
  const [resourceTab, setResourceTab] =
    React.useState<(typeof resourceTabs)[number]["id"]>("scripts");

  React.useEffect(() => {
    if (open) {
      setStep(1);
      setDraft(emptyDraft);
      setResourceTab("scripts");
    }
  }, [open]);

  const set = <K extends keyof NewCampaignDraft>(key: K, value: NewCampaignDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const toggleIn = (
    key: "segments" | "scripts" | "templates" | "automations" | "dataTables",
    v: string,
  ) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(v) ? d[key].filter((x) => x !== v) : [...d[key], v],
    }));

  const needsSegments = draft.type !== "Inbound";

  const next = () => {
    if (step === 1 && !draft.name.trim()) {
      toast.error("Campaign name is required");
      return;
    }
    if (step === 2 && !draft.team) {
      toast.error("Assign a team to continue");
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const saveDraft = () => {
    onCreate(draft, "Draft");
    onOpenChange(false);
    toast.info("Campaign saved as draft");
  };

  const moduleRoutes: Record<string, string> = {
    Scripts: "/crm/scripts",
    Templates: "/crm/templates",
    Automations: "/settings/automations",
    "Data Tables": "/crm/data-table",
  };

  const goToModule = (module: string) => {
    saveDraft();
    toast.info(`Opening ${module} — your campaign is saved as a draft`);
    const to = moduleRoutes[module];
    if (to) void navigate({ to });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="border-b border-border p-6 pb-4">
          <DialogTitle className="font-display">New campaign</DialogTitle>
          <DialogDescription>
            Step {step} of 5 — {steps[step - 1]!.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 border-b border-border px-6 py-3">
          {steps.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                s.id === step
                  ? "border-primary bg-primary/10 text-foreground"
                  : s.id < step
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                    : "border-border text-muted-foreground",
              )}
            >
              <span className="flex size-4 items-center justify-center rounded-full bg-background text-[10px] font-semibold">
                {s.id < step ? <Check className="size-3" /> : s.id}
              </span>
              {s.title}
            </button>
          ))}
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-6">
          {step === 1 ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign name</Label>
                <Input
                  id="campaign-name"
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Spring Outbound"
                />
              </div>

              <div className="space-y-2">
                <Label>Campaign type</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {campaignTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => set("type", type)}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-colors",
                        draft.type === type
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <div className="font-medium">{type}</div>
                      <p className="mt-1 text-xs text-muted-foreground">{campaignTypeHelp[type]}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Campaign purpose</Label>
                <Select value={draft.purpose} onValueChange={(v) => set("purpose", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignPurposes.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-goal">Campaign goal</Label>
                <Textarea
                  id="campaign-goal"
                  value={draft.goal}
                  onChange={(e) => set("goal", e.target.value)}
                  placeholder="Sell 250 solar panel installations this quarter"
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Assign team</Label>
                <RadioGroup
                  value={draft.team}
                  onValueChange={(v) => set("team", v)}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {availableTeams.map((team) => (
                    <label
                      key={team.id}
                      htmlFor={team.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                        draft.team === team.name
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <RadioGroupItem id={team.id} value={team.name} className="mt-1" />
                      <div>
                        <div className="font-medium">{team.name}</div>
                        <p className="text-xs text-muted-foreground">
                          Supervisor {team.supervisor} · {team.humans} human · {team.ai} AI
                        </p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Lead segments</Label>
                {needsSegments ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {segmentSeed.map((segment) => (
                      <label
                        key={segment.id}
                        className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 hover:border-primary/40"
                      >
                        <Checkbox
                          checked={draft.segments.includes(segment.name)}
                          onCheckedChange={() => toggleIn("segments", segment.name)}
                        />
                        <div>
                          <div className="font-medium">{segment.name}</div>
                          <p className="text-xs text-muted-foreground">
                            {segment.leadCount.toLocaleString()} leads · {segment.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Inbound campaigns skip segment selection — customers start the conversation.
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                These rules apply to{" "}
                <span className="font-medium text-foreground">{draft.type}</span> campaigns and can
                be edited later.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {configFieldsByType[draft.type].map((field) => (
                  <div key={field.label} className="space-y-2">
                    <Label htmlFor={field.label}>{field.label}</Label>
                    <Input
                      id={field.label}
                      placeholder={field.hint}
                      value={draft.config[field.label] ?? ""}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          config: { ...d.config, [field.label]: e.target.value },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-4 md:grid-cols-[180px_1fr]">
              <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
                {resourceTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setResourceTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      resourceTab === tab.id
                        ? "bg-primary/10 font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <tab.icon className="size-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {resourceTab === "scripts" ? (
                  <ResourceSection
                    actionLabel="Add new script"
                    onAction={() => goToModule("Scripts")}
                  >
                    <Accordion type="single" collapsible>
                      {scriptSeed.map((script) => (
                        <AccordionItem key={script.id} value={script.id}>
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={draft.scripts.includes(script.name)}
                              onCheckedChange={() => toggleIn("scripts", script.name)}
                              aria-label={`Select ${script.name}`}
                            />
                            <AccordionTrigger className="flex-1">
                              <div className="text-left">
                                <div className="font-medium">{script.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {script.category}
                                </div>
                              </div>
                            </AccordionTrigger>
                          </div>
                          <AccordionContent>
                            <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 font-sans text-sm">
                              {script.body}
                            </pre>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </ResourceSection>
                ) : null}

                {resourceTab === "templates" ? (
                  <ResourceSection
                    actionLabel="Add new template"
                    onAction={() => goToModule("Templates")}
                  >
                    {(["SMS", "Email"] as const).map((channel) => (
                      <div key={channel} className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {channel}
                        </p>
                        <Accordion type="single" collapsible>
                          {templateSeed
                            .filter((t) => t.channel === channel)
                            .map((template) => (
                              <AccordionItem key={template.id} value={template.id}>
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={draft.templates.includes(template.name)}
                                    onCheckedChange={() => toggleIn("templates", template.name)}
                                    aria-label={`Select ${template.name}`}
                                  />
                                  <AccordionTrigger className="flex-1">
                                    <div className="text-left font-medium">{template.name}</div>
                                  </AccordionTrigger>
                                </div>
                                <AccordionContent>
                                  <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 font-sans text-sm">
                                    {template.body}
                                  </pre>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                        </Accordion>
                      </div>
                    ))}
                  </ResourceSection>
                ) : null}

                {resourceTab === "automations" ? (
                  <ResourceSection
                    actionLabel="Create new automation"
                    onAction={() => goToModule("Automations")}
                  >
                    <div className="space-y-2">
                      {availableAutomations.map((automation) => (
                        <label
                          key={automation.id}
                          className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 hover:border-primary/40"
                        >
                          <Checkbox
                            checked={draft.automations.includes(automation.name)}
                            onCheckedChange={() => toggleIn("automations", automation.name)}
                          />
                          <div>
                            <div className="font-medium">{automation.name}</div>
                            <p className="text-xs text-muted-foreground">
                              {automation.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </ResourceSection>
                ) : null}

                {resourceTab === "data" ? (
                  <ResourceSection
                    actionLabel="New data table"
                    onAction={() => goToModule("Data Tables")}
                  >
                    <div className="space-y-2">
                      {dataTableSeed.map((table) => (
                        <label
                          key={table.id}
                          className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 hover:border-primary/40"
                        >
                          <Checkbox
                            checked={draft.dataTables.includes(table.name)}
                            onCheckedChange={() => toggleIn("dataTables", table.name)}
                          />
                          <div>
                            <div className="font-medium">{table.name}</div>
                            <p className="text-xs text-muted-foreground">
                              {table.columns.length} columns · {table.rows.length} rows
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </ResourceSection>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-border p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Layers className="size-4 text-muted-foreground" />
                  Campaign overview
                </p>
                <div className="mt-2">
                  <FieldRow label="Name" value={draft.name || "—"} />
                  <FieldRow label="Type" value={draft.type} />
                  <FieldRow label="Purpose" value={draft.purpose} />
                  <FieldRow label="Goal" value={draft.goal || "—"} />
                  <FieldRow label="Team" value={draft.team || "—"} />
                  <FieldRow
                    label="Segments"
                    value={draft.segments.length ? draft.segments.join(", ") : "—"}
                  />
                  <FieldRow
                    label="Scripts"
                    value={draft.scripts.length ? draft.scripts.join(", ") : "—"}
                  />
                  <FieldRow
                    label="Templates"
                    value={draft.templates.length ? draft.templates.join(", ") : "—"}
                  />
                  <FieldRow
                    label="Automations"
                    value={draft.automations.length ? draft.automations.join(", ") : "—"}
                  />
                  <FieldRow
                    label="Data tables"
                    value={draft.dataTables.length ? draft.dataTables.join(", ") : "—"}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border p-4">
                <p className="text-sm font-medium">Configuration</p>
                <div className="mt-2">
                  {configFieldsByType[draft.type].map((field) => (
                    <FieldRow
                      key={field.label}
                      label={field.label}
                      value={draft.config[field.label] || field.hint}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Launching starts the campaign immediately — the assigned team begins working on it.
              </p>
            </div>
          ) : null}
        </div>

        <DialogFooter className="gap-2 border-t border-border p-4 sm:justify-between">
          <Button variant="outline" onClick={saveDraft}>
            Save as draft
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => (step === 1 ? onOpenChange(false) : setStep((s) => s - 1))}
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            {step < 5 ? (
              <Button onClick={next}>Continue</Button>
            ) : (
              <Button
                onClick={() => {
                  if (!draft.name.trim()) {
                    toast.error("Campaign name is required");
                    setStep(1);
                    return;
                  }
                  onCreate(draft, "Active");
                  onOpenChange(false);
                  toast.success(`${draft.name} launched`);
                }}
              >
                Launch campaign
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResourceSection({
  actionLabel,
  onAction,
  children,
}: {
  actionLabel: string;
  onAction: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline" className="font-normal">
          Select one or more
        </Badge>
        <Button variant="outline" size="sm" onClick={onAction}>
          <Plus className="mr-2 size-3.5" />
          {actionLabel}
        </Button>
      </div>
      {children}
    </div>
  );
}
