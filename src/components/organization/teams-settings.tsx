import * as React from "react";
import { Bot, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog, DetailDrawer, RecordFormModal } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import {
  campaignPool,
  memberPool,
  supervisorPool,
  teams as teamSeed,
  type Team,
} from "@/data/organization";

const emptyForm = {
  name: "",
  description: "",
  supervisor: supervisorPool[0]!,
  campaign: "none",
  members: [] as string[],
};

export function TeamsSettings() {
  const [list, setList] = React.useState<Team[]>(teamSeed);
  const [query, setQuery] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [active, setActive] = React.useState<Team | null>(null);
  const [deleting, setDeleting] = React.useState<Team | null>(null);
  const [form, setForm] = React.useState(emptyForm);

  const filtered = list.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));

  const addTeam = (active: boolean) => {
    if (!form.name.trim()) {
      toast.error("Team name is required");
      return;
    }
    const team: Team = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description.trim() || "No description yet.",
      supervisor: form.supervisor,
      members: form.members,
      aiAgents: [],
      campaign: form.campaign === "none" ? null : form.campaign,
      createdAt: "just now",
      active,
      performance: { calls: 0, connectRate: 0, conversion: 0, avgHandle: "—" },
      activity: [{ id: "a1", text: "Team created", when: "just now" }],
    };
    setList((l) => [team, ...l]);
    setForm(emptyForm);
  };

  const toggleMember = (name: string) =>
    setForm((f) => ({
      ...f,
      members: f.members.includes(name) ? f.members.filter((m) => m !== name) : [...f.members, name],
    }));

  const setActiveState = (team: Team, on: boolean) => {
    const next = { ...team, active: on };
    setList((l) => l.map((t) => (t.id === team.id ? next : t)));
    setActive((a) => (a && a.id === team.id ? next : a));
    toast.success(`${team.name} ${on ? "activated" : "paused"}`);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Teams"
        description="Group agents and AI agents into teams, each running one active campaign."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            Create team
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search teams"
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((team) => (
          <Card key={team.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="font-display">{team.name}</CardTitle>
                  <CardDescription className="mt-1">{team.description}</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={
                    team.active
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground"
                  }
                >
                  {team.active ? "Active" : "Paused"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="space-y-1 text-sm">
                <FieldRow label="Supervisor" value={team.supervisor} />
                <FieldRow label="Campaign" value={team.campaign ?? "Unassigned"} />
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3.5" /> {team.members.length} members
                </span>
                <span className="inline-flex items-center gap-1">
                  <Bot className="size-3.5" /> {team.aiAgents.length} AI agents
                </span>
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => setActive(team)}>
                  View details
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeleting(team)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RecordFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create team"
        description="Name the team, pick a supervisor and assign members."
        mode="create"
        onSubmit={() => addTeam(true)}
        onSaveDraft={() => {
          addTeam(false);
          toast.info("Team saved as draft");
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="team-name">Team name</Label>
          <Input
            id="team-name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Enterprise Sales"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="team-desc">Description</Label>
          <Textarea
            id="team-desc"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="What this team is responsible for"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Supervisor</Label>
            <Select value={form.supervisor} onValueChange={(v) => setForm((f) => ({ ...f, supervisor: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supervisorPool.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
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
                <SelectItem value="none">No campaign</SelectItem>
                {campaignPool.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Members</Label>
          <div className="flex flex-wrap gap-2">
            {memberPool.map((m) => (
              <Button
                key={m}
                type="button"
                size="sm"
                variant={form.members.includes(m) ? "default" : "outline"}
                onClick={() => toggleMember(m)}
              >
                {m}
              </Button>
            ))}
          </div>
        </div>
      </RecordFormModal>

      <DetailDrawer
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        activity={active ? { entityType: "Team", entityId: active.id, record: active.name } : null}
        title={active?.name ?? ""}
        description={active?.description ?? ""}
      >
        {active ? (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <p className="text-sm font-medium">Team active</p>
                <p className="text-xs text-muted-foreground">Paused teams stop receiving campaign calls.</p>
              </div>
              <Switch checked={active.active} onCheckedChange={(v) => setActiveState(active, v)} />
            </div>

            <section>
              <h3 className="mb-2 text-sm font-medium">Overview</h3>
              <div className="rounded-xl border border-border bg-card px-4">
                <FieldRow label="Supervisor" value={active.supervisor} />
                <FieldRow label="Campaign" value={active.campaign ?? "Unassigned"} />
                <FieldRow label="Created" value={active.createdAt} />
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-medium">Performance</h3>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Calls" value={active.performance.calls.toLocaleString()} />
                <Stat label="Connect rate" value={`${active.performance.connectRate}%`} />
                <Stat label="Conversion" value={`${active.performance.conversion}%`} />
                <Stat label="Avg handle" value={active.performance.avgHandle} />
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-medium">Members ({active.members.length})</h3>
              <div className="flex flex-wrap gap-2">
                {active.members.length ? (
                  active.members.map((m) => (
                    <Badge key={m} variant="outline">
                      {m}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No members assigned yet.</p>
                )}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-medium">AI agents ({active.aiAgents.length})</h3>
              <div className="flex flex-wrap gap-2">
                {active.aiAgents.length ? (
                  active.aiAgents.map((a) => (
                    <Badge key={a} variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                      {a}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No AI agents assigned yet.</p>
                )}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-medium">Recent activity</h3>
              <div className="space-y-2">
                {active.activity.map((a) => (
                  <div key={a.id} className="rounded-lg border border-border bg-card p-3 text-sm">
                    <p>{a.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{a.when}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={`Delete ${deleting?.name ?? "team"}?`}
        description="Members and AI agents will be unassigned from this team. This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleting) {
            setList((l) => l.filter((t) => t.id !== deleting.id));
            toast.error(`${deleting.name} deleted`);
          }
          setDeleting(null);
        }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold">{value}</p>
    </div>
  );
}
