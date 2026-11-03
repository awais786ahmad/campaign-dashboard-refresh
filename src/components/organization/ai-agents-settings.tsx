import * as React from "react";
import { Bot, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog, DetailDrawer, RecordFormModal } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import {
  aiAgentList,
  knowledgeBases,
  teams,
  voices,
  type AiAgent,
} from "@/data/organization";

const statusStyles: Record<AiAgent["status"], string> = {
  "On call": "border-primary/30 bg-primary/10 text-primary",
  Idle: "border-border bg-muted text-muted-foreground",
  Training: "border-accent/30 bg-accent/10 text-accent-foreground",
  Disabled: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function AiAgentsSettings() {
  const [list, setList] = React.useState<AiAgent[]>(aiAgentList);
  const [formOpen, setFormOpen] = React.useState(false);
  const [active, setActive] = React.useState<AiAgent | null>(null);
  const [deleting, setDeleting] = React.useState<AiAgent | null>(null);
  const [confirmCreate, setConfirmCreate] = React.useState(false);

  const [name, setName] = React.useState("");
  const [persona, setPersona] = React.useState("");
  const [voice, setVoice] = React.useState<string>(voices[0]!);
  const [kb, setKb] = React.useState<string>(knowledgeBases[0]!);
  const [team, setTeam] = React.useState<string>("unassigned");
  const [prompt, setPrompt] = React.useState("");

  const takenTeams = new Set(list.filter((a) => a.team).map((a) => a.team as string));

  const reset = () => {
    setName("");
    setPersona("");
    setVoice(voices[0]!);
    setKb(knowledgeBases[0]!);
    setTeam("unassigned");
    setPrompt("");
  };

  const create = (asDraft: boolean) => {
    const assigned = team === "unassigned" ? null : team;
    setList((l) => [
      ...l,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        persona: persona.trim() || "New AI voice agent.",
        voice,
        knowledgeBase: kb,
        team: assigned,
        campaign: assigned ? teams.find((t) => t.name === assigned)?.campaign ?? null : null,
        enabled: !asDraft,
        status: asDraft ? "Training" : "Idle",
        progress: 0,
        prompt: prompt.trim() || "Follow the knowledge base and stay on script.",
        stats: { calls: 0, avgDuration: "0m 00s", successRate: 0, escalations: 0 },
        history: [],
      },
    ]);
    reset();
    setFormOpen(false);
  };

  const submit = () => {
    if (!name.trim()) {
      toast.error("Agent name is required");
      return;
    }
    setConfirmCreate(true);
  };

  const toggleEnabled = (agent: AiAgent, on: boolean) => {
    setList((l) =>
      l.map((a) => (a.id === agent.id ? { ...a, enabled: on, status: on ? "Idle" : "Disabled" } : a)),
    );
    toast.success(`${agent.name} ${on ? "enabled" : "disabled"}`);
  };

  const unassign = (agent: AiAgent) => {
    setList((l) => l.map((a) => (a.id === agent.id ? { ...a, team: null, campaign: null } : a)));
    setActive((a) => (a && a.id === agent.id ? { ...a, team: null, campaign: null } : a));
    toast.success(`${agent.name} removed from its team`);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="AI agents"
        description="Create voice agents, give them a knowledge base and assign each one to a single team."
        actions={
          <Button
            onClick={() => {
              reset();
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Create AI agent
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((agent) => (
          <Card key={agent.id} className="flex flex-col">
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div className="flex items-start gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bot className="size-5" />
                </span>
                <div>
                  <CardTitle className="text-base">{agent.name}</CardTitle>
                  <p className="mt-1 max-w-[22ch] text-xs text-muted-foreground">{agent.persona}</p>
                </div>
              </div>
              <Switch
                checked={agent.enabled}
                onCheckedChange={(v) => toggleEnabled(agent, v)}
                aria-label={`Enable ${agent.name}`}
              />
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={statusStyles[agent.status]}>
                  {agent.status}
                </Badge>
                <Badge variant="outline">{agent.voice}</Badge>
                <Badge variant="outline">{agent.knowledgeBase}</Badge>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Campaign progress</span>
                  <span>{agent.progress}%</span>
                </div>
                <Progress value={agent.progress} />
              </div>

              <div className="rounded-xl border border-border bg-card px-3">
                <FieldRow label="Team" value={agent.team ?? "Unassigned"} />
                <FieldRow label="Campaign" value={agent.campaign ?? "—"} />
                <FieldRow label="Calls handled" value={agent.stats.calls.toLocaleString()} />
              </div>

              <div className="mt-auto flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setActive(agent)}>
                  View details
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleting(agent)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RecordFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title="Create AI agent"
        description="An agent can only belong to one team at a time."
        mode="create"
        onSubmit={submit}
        onSaveDraft={() => {
          if (!name.trim()) {
            toast.error("Agent name is required");
            return;
          }
          create(true);
          toast.info("AI agent saved as draft");
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="agent-name">Agent name</Label>
          <Input
            id="agent-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Renewals AI"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agent-persona">Persona</Label>
          <Input
            id="agent-persona"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="One line describing what this agent does"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Voice</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voices.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Knowledge base</Label>
            <Select value={kb} onValueChange={setKb}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {knowledgeBases.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Assign to team</Label>
          <Select value={team} onValueChange={setTeam}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {teams.map((t) => (
                <SelectItem key={t.id} value={t.name} disabled={takenTeams.has(t.name) && false}>
                  {t.name}
                  {t.campaign ? ` — ${t.campaign}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            The agent automatically picks up that team&apos;s active campaign.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="agent-prompt">System prompt</Label>
          <Textarea
            id="agent-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="How should this agent behave on a call?"
            rows={4}
          />
        </div>
      </RecordFormModal>

      <ConfirmDialog
        open={confirmCreate}
        onOpenChange={setConfirmCreate}
        title="Create this AI agent?"
        description="The agent starts idle and can begin calling once its team campaign is live."
        confirmLabel="Create agent"
        onConfirm={() => {
          create(false);
          setConfirmCreate(false);
          toast.success("AI agent created");
        }}
      />

      <DetailDrawer
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        activity={active ? { entityType: "AI Agent", entityId: active.id, record: active.name } : null}
        title={active?.name ?? ""}
        description={active?.persona ?? ""}
      >
        {active ? (
          <div className="space-y-6 pt-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={statusStyles[active.status]}>
                {active.status}
              </Badge>
              <Badge variant="outline">
                <Sparkles className="mr-1 size-3" />
                {active.voice}
              </Badge>
            </div>

            <div className="rounded-xl border border-border bg-card px-4">
              <FieldRow label="Knowledge base" value={active.knowledgeBase} />
              <FieldRow label="Team" value={active.team ?? "Unassigned"} />
              <FieldRow label="Campaign" value={active.campaign ?? "—"} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Calls", value: active.stats.calls.toLocaleString() },
                { label: "Avg duration", value: active.stats.avgDuration },
                { label: "Success rate", value: `${active.stats.successRate}%` },
                { label: "Escalations", value: active.stats.escalations },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-lg font-semibold">{s.value}</p>
                </div>
              ))}
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-medium">Campaign progress</h3>
              <Progress value={active.progress} />
              <p className="text-xs text-muted-foreground">{active.progress}% of the assigned list dialled.</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-medium">System prompt</h3>
              <p className="rounded-xl border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                {active.prompt}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-medium">Recent calls</h3>
              {active.history.length ? (
                active.history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{h.contact}</p>
                      <p className="text-xs text-muted-foreground">
                        {h.outcome} · {h.duration}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{h.when}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No calls yet.</p>
              )}
            </section>

            {active.team ? (
              <Button variant="outline" className="w-full" onClick={() => unassign(active)}>
                Remove from {active.team}
              </Button>
            ) : null}
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={`Delete ${deleting?.name ?? "agent"}?`}
        description="The agent stops calling immediately and is removed from its team."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleting) {
            setList((l) => l.filter((a) => a.id !== deleting.id));
            toast.error(`${deleting.name} deleted`);
          }
          setDeleting(null);
        }}
      />
    </div>
  );
}
