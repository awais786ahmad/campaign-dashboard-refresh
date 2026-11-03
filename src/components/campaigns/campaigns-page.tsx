import * as React from "react";
import { Archive, Copy, Megaphone, Pause, Pencil, Play, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog, RecordFormModal } from "@/components/dashboard/crud";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

import {
  AnalyticsTab,
  AutomationsTab,
  DataTablesTab,
  DetailsTab,
  ScriptsTab,
  SegmentsTab,
  TeamTab,
  TemplatesTab,
} from "@/components/campaigns/campaign-tabs";
import { AssignResourceDialog } from "@/components/campaigns/assign-resource-dialog";
import {
  CreateCampaignModal,
  type NewCampaignDraft,
} from "@/components/campaigns/create-campaign-modal";
import {
  availableAutomations,
  broadcastConfig,
  campaignSeed,
  campaignStatusClass,
  inboundConfig,
  outboundConfig,
  type Campaign,
  type CampaignStatus,
} from "@/data/campaigns";
import { RecordActivityPanel } from "@/components/activity/record-activity";
import { dataTableSeed, scriptSeed, segmentSeed, templateSeed } from "@/data/crm";

const tabs = [
  "Segments",
  "Details",
  "Team",
  "Scripts",
  "Templates",
  "Data Tables",
  "Automations",
  "Analytics",
  "Activity",
] as const;

export function CampaignsPage() {
  const [list, setList] = React.useState<Campaign[]>(campaignSeed);
  const [activeId, setActiveId] = React.useState<string | null>(campaignSeed[0]?.id ?? null);
  const [query, setQuery] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState({ name: "", goal: "" });
  const [deleting, setDeleting] = React.useState(false);
  const [archiving, setArchiving] = React.useState(false);
  const [assigning, setAssigning] = React.useState<
    "segments" | "scripts" | "templates" | "dataTables" | "automations" | null
  >(null);
  const navigate = useNavigate();

  const openModule = (to: string, module: string) => {
    setAssigning(null);
    toast.info(`Campaign saved as a draft — opening ${module}`);
    void navigate({ to });
  };

  const active = list.find((c) => c.id === activeId) ?? null;
  const filtered = list.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  const update = (id: string, patch: Partial<Campaign>) =>
    setList((l) => l.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const createCampaign = (draft: NewCampaignDraft, status: "Active" | "Draft") => {
    const config =
      draft.type === "Inbound"
        ? inboundConfig
        : draft.type === "Broadcast"
          ? broadcastConfig
          : outboundConfig;

    const campaign: Campaign = {
      id: crypto.randomUUID(),
      name: draft.name.trim() || "Untitled campaign",
      type: draft.type,
      purpose: draft.purpose,
      goal: draft.goal || "No goal set yet.",
      status: status as CampaignStatus,
      team: draft.team || "Unassigned",
      supervisor: "—",
      createdAt: "just now",
      schedule: status === "Active" ? "Running now" : "Not scheduled",
      progress: 0,
      members: [],
      segments: draft.segments.map((name, i) => {
        const source = segmentSeed.find((s) => s.name === name);
        const total = source?.leadCount ?? 100;
        return {
          id: `new-${i}-${name}`,
          name,
          description: source?.description ?? "Assigned segment.",
          totalLeads: total,
          contacted: 0,
          interested: 0,
          followUp: 0,
          qualified: 0,
          converted: 0,
          rejected: 0,
        };
      }),
      scripts: draft.scripts,
      templates: draft.templates,
      dataTables: draft.dataTables,
      automations: draft.automations.map((name, i) => ({
        id: `new-au-${i}`,
        name,
        description: "Assigned during campaign setup.",
        trigger: "Campaign event",
        enabled: true,
        scope: "Library" as const,
      })),
      config: config.map((row) => ({
        label: row.label,
        value: draft.config[row.label] || row.value,
      })),
      metrics: {
        calls: 0,
        connected: 0,
        answerRate: 0,
        conversionRate: 0,
        avgDuration: "—",
        revenue: "—",
      },
      trend: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
        day,
        calls: 0,
        connected: 0,
        conversions: 0,
      })),
    };

    setList((l) => [campaign, ...l]);
    setActiveId(campaign.id);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Secondary sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="overflow-hidden">
            <div className="space-y-3 border-b border-border p-4">
              <Button className="w-full" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 size-4" />
                New Campaign
              </Button>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search campaigns"
                  className="pl-9"
                />
              </div>
            </div>
            <ScrollArea className="max-h-[65vh]">
              <ul className="p-2">
                {filtered.map((campaign) => (
                  <li key={campaign.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(campaign.id)}
                      className={cn(
                        "w-full rounded-xl px-3 py-2.5 text-left transition-colors",
                        campaign.id === activeId ? "bg-primary/10" : "hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{campaign.name}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0 text-[10px] font-normal",
                            campaignStatusClass[campaign.status],
                          )}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{campaign.type}</p>
                    </button>
                  </li>
                ))}
                {filtered.length === 0 ? (
                  <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No campaigns found.
                  </li>
                ) : null}
              </ul>
            </ScrollArea>
          </Card>
        </aside>

        {/* Main content */}
        <section className="min-w-0 space-y-6">
          {!active ? (
            <Card className="border-dashed">
              <CardHeader className="items-center py-16 text-center">
                <Megaphone className="size-8 text-muted-foreground" />
                <CardTitle className="font-display">Select a campaign</CardTitle>
                <CardDescription>
                  Pick a campaign from the list or create a new one to get started.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-semibold tracking-tight">
                      {active.name}
                    </h1>
                    <Badge variant="outline" className="font-normal">
                      {active.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn("font-normal", campaignStatusClass[active.status])}
                    >
                      {active.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {active.purpose} · {active.goal}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditForm({ name: active.name, goal: active.goal });
                      setEditOpen(true);
                    }}
                  >
                    <Pencil className="mr-2 size-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const copy: Campaign = {
                        ...active,
                        id: crypto.randomUUID(),
                        name: `${active.name} (copy)`,
                        status: "Draft",
                      };
                      setList((l) => [copy, ...l]);
                      setActiveId(copy.id);
                      toast.success("Campaign duplicated");
                    }}
                  >
                    <Copy className="mr-2 size-3.5" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const paused = active.status === "Paused";
                      update(active.id, { status: paused ? "Active" : "Paused" });
                      toast.success(paused ? "Campaign resumed" : "Campaign paused");
                    }}
                  >
                    {active.status === "Paused" ? (
                      <Play className="mr-2 size-3.5" />
                    ) : (
                      <Pause className="mr-2 size-3.5" />
                    )}
                    {active.status === "Paused" ? "Resume" : "Pause"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setArchiving(true)}>
                    <Archive className="mr-2 size-3.5" />
                    Archive
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleting(true)}>
                    <Trash2 className="mr-2 size-3.5" />
                    Delete
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="Segments" className="space-y-4">
                <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab} value={tab}>
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="Segments">
                  <SegmentsTab
                    campaign={active}
                    onAddSegment={() => setAssigning("segments")}
                    onRemoveSegment={(id) =>
                      update(active.id, {
                        segments: active.segments.filter((s) => s.id !== id),
                      })
                    }
                  />
                </TabsContent>
                <TabsContent value="Details">
                  <DetailsTab campaign={active} />
                </TabsContent>
                <TabsContent value="Team">
                  <TeamTab campaign={active} />
                </TabsContent>
                <TabsContent value="Scripts">
                  <ScriptsTab
                    campaign={active}
                    onAssign={() => setAssigning("scripts")}
                    onCreateNew={() => openModule("/crm/scripts", "Scripts")}
                    onRemove={(name) => {
                      update(active.id, {
                        scripts: active.scripts.filter((s) => s !== name),
                      });
                      toast.success("Script removed");
                    }}
                  />
                </TabsContent>
                <TabsContent value="Templates">
                  <TemplatesTab
                    campaign={active}
                    onAssign={() => setAssigning("templates")}
                    onCreateNew={() => openModule("/crm/templates", "Templates")}
                    onRemove={(name) => {
                      update(active.id, {
                        templates: active.templates.filter((t) => t !== name),
                      });
                      toast.success("Template removed");
                    }}
                  />
                </TabsContent>
                <TabsContent value="Data Tables">
                  <DataTablesTab
                    campaign={active}
                    onAssign={() => setAssigning("dataTables")}
                    onCreateNew={() => openModule("/crm/data-table", "Data Tables")}
                  />
                </TabsContent>
                <TabsContent value="Automations">
                  <AutomationsTab
                    campaign={active}
                    onToggle={(id) =>
                      update(active.id, {
                        automations: active.automations.map((a) =>
                          a.id === id ? { ...a, enabled: !a.enabled } : a,
                        ),
                      })
                    }
                    onRemove={(id) => {
                      update(active.id, {
                        automations: active.automations.filter((a) => a.id !== id),
                      });
                      toast.success("Automation removed");
                    }}
                    onAssign={() => setAssigning("automations")}
                    onCreateNew={() => openModule("/settings/automations", "Automations")}
                  />
                </TabsContent>
                <TabsContent value="Analytics">
                  <AnalyticsTab campaign={active} />
                </TabsContent>
                <TabsContent value="Activity">
                  <RecordActivityPanel target={{ entityType: "Campaign", entityId: active.id, record: active.name }} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </section>
      </div>

      {active ? (
        <>
          <AssignResourceDialog
            open={assigning === "segments"}
            onOpenChange={(v) => !v && setAssigning(null)}
            title="Assign lead segments"
            description="Pick the segments this campaign should contact."
            options={segmentSeed.map((s) => ({
              id: s.id,
              name: s.name,
              description: `${s.leadCount.toLocaleString()} leads · ${s.description}`,
            }))}
            assigned={active.segments.map((s) => s.name)}
            createLabel="New segment"
            onCreate={() => openModule("/crm/segments", "Segments")}
            onSave={(names) => {
              const segments = names.map((name, i) => {
                const existing = active.segments.find((s) => s.name === name);
                if (existing) return existing;
                const source = segmentSeed.find((s) => s.name === name);
                const total = source?.leadCount ?? 100;
                return {
                  id: `seg-${i}-${name}`,
                  name,
                  description: source?.description ?? "Assigned segment.",
                  totalLeads: total,
                  contacted: 0,
                  interested: 0,
                  followUp: 0,
                  qualified: 0,
                  converted: 0,
                  rejected: 0,
                };
              });
              update(active.id, { segments });
              toast.success("Segments updated");
            }}
          />

          <AssignResourceDialog
            open={assigning === "scripts"}
            onOpenChange={(v) => !v && setAssigning(null)}
            title="Assign scripts"
            description="Scripts guide what agents say during this campaign."
            options={scriptSeed.map((s) => ({
              id: s.id,
              name: s.name,
              description: s.description,
              meta: s.category,
            }))}
            assigned={active.scripts}
            createLabel="New script"
            onCreate={() => openModule("/crm/scripts", "Scripts")}
            onSave={(scripts) => {
              update(active.id, { scripts });
              toast.success("Scripts updated");
            }}
          />

          <AssignResourceDialog
            open={assigning === "templates"}
            onOpenChange={(v) => !v && setAssigning(null)}
            title="Assign templates"
            description="SMS, email and WhatsApp templates used by this campaign."
            options={templateSeed.map((t) => ({
              id: t.id,
              name: t.name,
              description: t.subject || t.category,
              meta: t.channel,
            }))}
            assigned={active.templates}
            createLabel="New template"
            onCreate={() => openModule("/crm/templates", "Templates")}
            onSave={(templates) => {
              update(active.id, { templates });
              toast.success("Templates updated");
            }}
          />

          <AssignResourceDialog
            open={assigning === "dataTables"}
            onOpenChange={(v) => !v && setAssigning(null)}
            title="Assign data tables"
            description="Where human and AI agents store the data they collect."
            options={dataTableSeed.map((t) => ({
              id: t.id,
              name: t.name,
              description: `${t.columns.length} columns · ${t.rows.length} rows`,
            }))}
            assigned={active.dataTables}
            createLabel="New data table"
            onCreate={() => openModule("/crm/data-table", "Data Tables")}
            onSave={(dataTables) => {
              update(active.id, { dataTables });
              toast.success("Data tables updated");
            }}
          />

          <AssignResourceDialog
            open={assigning === "automations"}
            onOpenChange={(v) => !v && setAssigning(null)}
            title="Automation library"
            description="Add an automation from the library to this campaign."
            options={availableAutomations.map((a) => ({
              id: a.id,
              name: a.name,
              description: a.description,
            }))}
            assigned={active.automations.map((a) => a.name)}
            createLabel="New automation"
            onCreate={() => openModule("/settings/automations", "Automations")}
            onSave={(names) => {
              const automations = names.map((name, i) => {
                const existing = active.automations.find((a) => a.name === name);
                if (existing) return existing;
                const source = availableAutomations.find((a) => a.name === name);
                return {
                  id: `au-${i}-${name}`,
                  name,
                  description: source?.description ?? "Assigned automation.",
                  trigger: "Campaign event",
                  enabled: true,
                  scope: "Library" as const,
                };
              });
              update(active.id, { automations });
              toast.success("Automations updated");
            }}
          />
        </>
      ) : null}

      <CreateCampaignModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={createCampaign}
      />

      <RecordFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit campaign"
        description="Update the campaign name and goal."
        mode="edit"
        onSubmit={() => {
          if (!active) return;
          update(active.id, { name: editForm.name.trim() || active.name, goal: editForm.goal });
          toast.success("Campaign updated");
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="edit-name">Campaign name</Label>
          <Input
            id="edit-name"
            value={editForm.name}
            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-goal">Campaign goal</Label>
          <Textarea
            id="edit-goal"
            value={editForm.goal}
            onChange={(e) => setEditForm((f) => ({ ...f, goal: e.target.value }))}
          />
        </div>
      </RecordFormModal>

      <ConfirmDialog
        open={archiving}
        onOpenChange={setArchiving}
        title="Archive this campaign?"
        description="Archived campaigns stop running and move out of the active list."
        confirmLabel="Archive"
        onConfirm={() => {
          if (!active) return;
          update(active.id, { status: "Archived" });
          toast.success("Campaign archived");
        }}
      />

      <ConfirmDialog
        open={deleting}
        onOpenChange={setDeleting}
        title="Delete this campaign?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!active) return;
          setList((l) => l.filter((c) => c.id !== active.id));
          setActiveId((id) =>
            id === active.id ? (list.find((c) => c.id !== active.id)?.id ?? null) : id,
          );
          toast.error("Campaign deleted");
        }}
      />
    </div>
  );
}
