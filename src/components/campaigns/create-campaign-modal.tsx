import * as React from "react";
import { Check, FileText, Layers, Mail, Plus, RotateCcw, Table2, Zap } from "lucide-react";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FieldRow } from "@/components/settings/settings-header";
import { dataTableSeed, scriptSeed, segmentSeed, templateSeed } from "@/data/crm";
import {
  availableAutomations,
  availableTeams,
  campaignTypeHelp,
  campaignTypes,
  type CampaignType,
} from "@/data/campaigns";
import {
  aiAgentOptions,
  audienceSources,
  configGroupsByType,
  configSchemaByType,
  dayOrder,
  defaultConfig,
  defaultRetryRules,
  describeField,
  priorities,
  purposeGroups,
  retryMaxOptions,
  retryOutcomes,
  retryRulesSummary,
  retryWaitDisplay,
  retryWaitOptions,
  type ConfigField,
  type ConfigValue,
  type RetryRule,
} from "@/data/campaign-config";

export type NewCampaignDraft = {
  name: string;
  type: CampaignType;
  purpose: string;
  customPurpose: string;
  goal: string;
  priority: string;
  team: string;
  aiAgent: string;
  audienceSource: string;
  segments: string[];
  config: Record<string, ConfigValue>;
  retryRules: Record<string, RetryRule>;
  scripts: string[];
  templates: string[];
  automations: string[];
  dataTables: string[];
};

const initialDraft = (type: CampaignType): NewCampaignDraft => ({
  name: "",
  type,
  purpose: "Sales",
  customPurpose: "",
  goal: "",
  priority: "Normal",
  team: "",
  aiAgent: "Nova",
  audienceSource: "Saved segment",
  segments: [],
  config: defaultConfig(type),
  retryRules: defaultRetryRules(),
  scripts: [],
  templates: [],
  automations: [],
  dataTables: [],
});

const emptyDraft = initialDraft("Outbound");

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

const scheduledModes = ["Scheduled start", "Recurring schedule"];

function validateDraft(draft: NewCampaignDraft): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!draft.name.trim()) errors.push("Campaign name is required.");
  if (!draft.team) errors.push("Assign a team to continue.");
  if (draft.purpose === "Custom" && !draft.customPurpose.trim())
    errors.push("Describe the custom purpose.");
  const mode = String(draft.config.executionMode ?? "");
  if (scheduledModes.includes(mode) && !draft.config.startAt)
    errors.push("Scheduled and recurring campaigns need a valid start date and time.");
  if (draft.type !== "Inbound" && draft.segments.length === 0)
    warnings.push(
      "No audience selected — outbound and broadcast campaigns need eligible contacts to run.",
    );
  const attemptLimit = Number(
    draft.config.maxAttemptsPerContact === "Custom"
      ? draft.config.maxAttemptsPerContactCustom
      : draft.config.maxAttemptsPerContact,
  );
  const overLimit = Object.values(draft.retryRules).some(
    (rule) =>
      rule.enabled &&
      Number(rule.maxRetries === "Custom" ? rule.maxCustom : rule.maxRetries) > attemptLimit,
  );
  if (attemptLimit && overLimit)
    warnings.push("A retry limit is higher than the campaign's total attempts per contact.");
  return { errors, warnings };
}

export function CreateCampaignModal({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (draft: NewCampaignDraft, status: "Active" | "Draft" | "Scheduled") => void;
}) {
  const [step, setStep] = React.useState(1);
  const [draft, setDraft] = React.useState<NewCampaignDraft>(emptyDraft);
  const navigate = useNavigate();
  const [resourceTab, setResourceTab] =
    React.useState<(typeof resourceTabs)[number]["id"]>("scripts");

  React.useEffect(() => {
    if (open) {
      setStep(1);
      setDraft(initialDraft("Outbound"));
      setResourceTab("scripts");
    }
  }, [open]);

  const set = <K extends keyof NewCampaignDraft>(key: K, value: NewCampaignDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const setType = (type: CampaignType) =>
    setDraft((d) => ({
      ...d,
      type,
      config: defaultConfig(type),
      retryRules: defaultRetryRules(),
    }));

  const setConfig = (id: string, value: ConfigValue) =>
    setDraft((d) => ({ ...d, config: { ...d.config, [id]: value } }));

  const setRule = (id: string, patch: Partial<RetryRule>) =>
    setDraft((d) => ({
      ...d,
      retryRules: { ...d.retryRules, [id]: { ...d.retryRules[id]!, ...patch } },
    }));

  const resetConfig = () => {
    setDraft((d) => ({ ...d, config: defaultConfig(d.type), retryRules: defaultRetryRules() }));
    toast.info("Configuration reset to defaults");
  };

  const toggleIn = (
    key: "segments" | "scripts" | "templates" | "automations" | "dataTables",
    v: string,
  ) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(v) ? d[key].filter((x) => x !== v) : [...d[key], v],
    }));

  const needsSegments = draft.type !== "Inbound";
  const isScheduled = scheduledModes.includes(String(draft.config.executionMode ?? ""));
  const { errors, warnings } = validateDraft(draft);
  const eligibleContacts = draft.segments.reduce(
    (n, name) => n + (segmentSeed.find((s) => s.name === name)?.leadCount ?? 0),
    0,
  );

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

  const launch = () => {
    if (errors.length > 0) {
      toast.error(errors[0]!);
      return;
    }
    onCreate(draft, isScheduled ? "Scheduled" : "Active");
    onOpenChange(false);
    toast.success(isScheduled ? `${draft.name} scheduled` : `${draft.name} launched`);
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
                      onClick={() => setType(type)}
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

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Campaign purpose</Label>
                  <Select value={draft.purpose} onValueChange={(v) => set("purpose", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {purposeGroups.map((group) => (
                        <SelectGroup key={group.category}>
                          <SelectLabel>{group.category}</SelectLabel>
                          {group.purposes.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  {draft.purpose === "Custom" ? (
                    <Input
                      value={draft.customPurpose}
                      onChange={(e) => set("customPurpose", e.target.value)}
                      placeholder="Describe your purpose"
                    />
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={draft.priority} onValueChange={(v) => set("priority", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>AI agent</Label>
                  <Select value={draft.aiAgent} onValueChange={(v) => set("aiAgent", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aiAgentOptions.map((agent) => (
                        <SelectItem key={agent} value={agent}>
                          {agent}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Agent that works this campaign alongside the team.
                  </p>
                </div>

                {needsSegments ? (
                  <div className="space-y-2">
                    <Label>Audience source</Label>
                    <Select
                      value={draft.audienceSource}
                      onValueChange={(v) => set("audienceSource", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {audienceSources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Where this campaign finds the contacts to reach.
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>Lead segments</Label>
                {needsSegments ? (
                  <>
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
                    <div className="rounded-xl border border-border bg-muted/40 p-3">
                      <p className="text-sm font-medium">
                        {eligibleContacts.toLocaleString()} contacts eligible
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Blocked, opted-out and invalid contacts are excluded automatically before
                        every call.
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Inbound campaigns skip segment selection — customers start the conversation.
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  These rules apply to{" "}
                  <span className="font-medium text-foreground">{draft.type}</span> campaigns and
                  can be edited later.
                </p>
                <Button variant="outline" size="sm" onClick={resetConfig}>
                  <RotateCcw className="mr-2 size-3.5" />
                  Reset to defaults
                </Button>
              </div>

              {configGroupsByType[draft.type].map((group) => (
                <div key={group} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {group}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {configSchemaByType[draft.type]
                      .filter((field) => field.group === group)
                      .map((field) => (
                        <ConfigFieldControl
                          key={field.id}
                          field={field}
                          value={draft.config[field.id]}
                          customValue={
                            typeof draft.config[`${field.id}Custom`] === "string" ||
                            typeof draft.config[`${field.id}Custom`] === "number"
                              ? String(draft.config[`${field.id}Custom`])
                              : ""
                          }
                          onChange={(v) => setConfig(field.id, v)}
                          onCustomChange={(v) => setConfig(`${field.id}Custom`, v)}
                        />
                      ))}
                  </div>
                </div>
              ))}

              {draft.type === "Outbound" ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Retry Rules
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {retryRulesSummary(draft.retryRules)}
                      </p>
                    </div>
                  </div>
                  <Accordion type="multiple" className="rounded-xl border border-border px-4">
                    {retryOutcomes.map((outcome) => {
                      const rule = draft.retryRules[outcome.id]!;
                      return (
                        <AccordionItem key={outcome.id} value={outcome.id}>
                          <AccordionTrigger className="py-3">
                            <div className="text-left">
                              <div className="text-sm font-medium">{outcome.label}</div>
                              <div className="text-xs font-normal text-muted-foreground">
                                {rule.enabled
                                  ? `Retry after ${retryWaitDisplay(rule)} · up to ${rule.maxRetries === "Custom" ? rule.maxCustom || "0" : rule.maxRetries} retries`
                                  : "No retry"}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pb-4">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="text-sm font-medium">Enable retry</p>
                                <p className="text-xs text-muted-foreground">
                                  {outcome.description}
                                </p>
                              </div>
                              <Switch
                                checked={rule.enabled}
                                onCheckedChange={(v) => setRule(outcome.id, { enabled: v })}
                              />
                            </div>
                            {rule.enabled ? (
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                  <Label>Wait before retry</Label>
                                  <Select
                                    value={rule.wait}
                                    onValueChange={(v) => setRule(outcome.id, { wait: v })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {retryWaitOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {rule.wait === "Custom" ? (
                                    <Input
                                      type="number"
                                      min={0}
                                      value={rule.waitCustom}
                                      onChange={(e) =>
                                        setRule(outcome.id, { waitCustom: e.target.value })
                                      }
                                      placeholder="Minutes"
                                    />
                                  ) : null}
                                </div>
                                <div className="space-y-2">
                                  <Label>Maximum retries</Label>
                                  <Select
                                    value={rule.maxRetries}
                                    onValueChange={(v) => setRule(outcome.id, { maxRetries: v })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {retryMaxOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {rule.maxRetries === "Custom" ? (
                                    <Input
                                      type="number"
                                      min={0}
                                      value={rule.maxCustom}
                                      onChange={(e) =>
                                        setRule(outcome.id, { maxCustom: e.target.value })
                                      }
                                      placeholder="Retries"
                                    />
                                  ) : null}
                                </div>
                              </div>
                            ) : null}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                  <p className="text-xs text-muted-foreground">
                    Invalid numbers, opt-outs and permanent provider errors are never retried.
                  </p>
                </div>
              ) : null}
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
                  <FieldRow
                    label="Purpose"
                    value={draft.purpose === "Custom" ? draft.customPurpose || "—" : draft.purpose}
                  />
                  <FieldRow label="Goal" value={draft.goal || "—"} />
                  <FieldRow label="Priority" value={draft.priority} />
                  <FieldRow label="Team" value={draft.team || "—"} />
                  <FieldRow label="AI agent" value={draft.aiAgent} />
                  {needsSegments ? (
                    <>
                      <FieldRow label="Audience source" value={draft.audienceSource} />
                      <FieldRow
                        label="Eligible contacts"
                        value={`${eligibleContacts.toLocaleString()} (before exclusions)`}
                      />
                      <FieldRow
                        label="Segments"
                        value={draft.segments.length ? draft.segments.join(", ") : "—"}
                      />
                    </>
                  ) : null}
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
                <div className="mt-2 space-y-3">
                  {configGroupsByType[draft.type].map((group) => (
                    <div key={group}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {group}
                      </p>
                      <div className="mt-1">
                        {configSchemaByType[draft.type]
                          .filter((field) => field.group === group)
                          .map((field) => (
                            <FieldRow
                              key={field.id}
                              label={field.label}
                              value={describeField(field, draft.config)}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                  {draft.type === "Outbound" ? (
                    <FieldRow label="Retry rules" value={retryRulesSummary(draft.retryRules)} />
                  ) : null}
                </div>
              </div>

              {errors.length > 0 ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                  <p className="text-sm font-medium text-destructive">
                    Fix before launching
                  </p>
                  <ul className="mt-1 list-inside list-disc text-sm text-destructive">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {warnings.length > 0 ? (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                  <p className="text-sm font-medium text-amber-600">Warnings</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-amber-600">
                    {warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <p className="text-sm text-muted-foreground">
                {isScheduled
                  ? "The campaign starts automatically at the configured date, time and timezone."
                  : "Launching starts the campaign immediately — the assigned team begins working on it."}
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
              variant="outline"
              onClick={() => {
                toast.success("Test call scheduled with an approved test contact");
              }}
            >
              Test campaign
            </Button>
            <Button
              variant="ghost"
              onClick={() => (step === 1 ? onOpenChange(false) : setStep((s) => s - 1))}
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            {step < 5 ? (
              <Button onClick={next}>Continue</Button>
            ) : (
              <Button onClick={launch} disabled={errors.length > 0}>
                {isScheduled ? "Schedule campaign" : "Launch campaign"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConfigFieldControl({
  field,
  value,
  customValue,
  onChange,
  onCustomChange,
}: {
  field: ConfigField;
  value: ConfigValue | undefined;
  customValue: string;
  onChange: (value: ConfigValue) => void;
  onCustomChange: (value: string) => void;
}) {
  const control = field.control;
  const label = control.kind === "select" && control.suffix ? `${field.label} (${control.suffix})` : field.label;
  const unsupported =
    field.id === "dialingMode" ? ["Predictive"] : [];

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>{label}</Label>

      {control.kind === "select" ? (
        <>
          <Select value={String(value ?? "")} onValueChange={onChange}>
            <SelectTrigger id={field.id}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {control.options.map((option) => (
                <SelectItem key={option} value={option} disabled={unsupported.includes(option)}>
                  {option}
                  {unsupported.includes(option) ? " — not supported" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.id === "dialingMode" ? (
            <p className="text-xs text-muted-foreground">
              Predictive is unavailable on your current calling plan.
            </p>
          ) : null}
          {value === "Custom" ? (
            <Input
              type="number"
              min={0}
              value={customValue}
              onChange={(e) => onCustomChange(e.target.value)}
              placeholder={`Custom ${field.label.toLowerCase()}`}
            />
          ) : null}
        </>
      ) : null}

      {control.kind === "number" ? (
        <Input
          id={field.id}
          type="number"
          min={0}
          value={value === undefined || value === "" ? "" : String(value)}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder={control.suffix}
        />
      ) : null}

      {control.kind === "toggle" ? (
        <Switch id={field.id} checked={Boolean(value)} onCheckedChange={onChange} />
      ) : null}

      {control.kind === "time" ? (
        <Input
          id={field.id}
          type="time"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}

      {control.kind === "datetime" ? (
        <Input
          id={field.id}
          type="datetime-local"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}

      {control.kind === "date" ? (
        <Input
          id={field.id}
          type="date"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}

      {control.kind === "days" ? (
        <div className="flex flex-wrap gap-1">
          {dayOrder.map((day) => {
            const active = Array.isArray(value) && value.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() =>
                  onChange(
                    active
                      ? (value as string[]).filter((d) => d !== day)
                      : [...(Array.isArray(value) ? value : []), day],
                  )
                }
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  active
                    ? "border-primary bg-primary/10 font-medium text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      ) : null}

      {control.kind === "multi" ? (
        <div className="space-y-2">
          {control.options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary/40"
            >
              <Checkbox
                checked={Array.isArray(value) && value.includes(option)}
                onCheckedChange={() =>
                  onChange(
                    Array.isArray(value) && value.includes(option)
                      ? (value as string[]).filter((v) => v !== option)
                      : [...(Array.isArray(value) ? value : []), option],
                  )
                }
              />
              {option}
            </label>
          ))}
        </div>
      ) : null}

      {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
      {field.locked ? (
        <p className="text-xs text-muted-foreground">Enforced by workspace policy.</p>
      ) : null}
    </div>
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
