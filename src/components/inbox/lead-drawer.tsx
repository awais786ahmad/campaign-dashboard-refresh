import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bot } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailDrawer } from "@/components/dashboard/crud";
import { FieldRow } from "@/components/settings/settings-header";
import { leadSeed, pipelineStagesSeed } from "@/data/crm";
import { TagList } from "./shared";

export type TimelineEntry = { id: string; when: string; text: string };

export function LeadDrawer({
  open,
  onOpenChange,
  leadId,
  fallbackName,
  initialTab,
  extraTimeline,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  leadId: string;
  fallbackName: string;
  initialTab: "overview" | "timeline";
  /** Entries logged from the Inbox during this session, newest first. */
  extraTimeline: TimelineEntry[];
}) {
  const lead = leadSeed.find((l) => l.id === leadId);
  const [tab, setTab] = React.useState(initialTab);

  React.useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  const timeline = [...extraTimeline, ...(lead?.timeline ?? [])];
  const stage = pipelineStagesSeed.find((s) => s.id === lead?.stage)?.name ?? lead?.stage;

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={lead?.name ?? fallbackName}
      description={lead ? `${lead.company} · ${lead.phone}` : "This contact is not linked to a lead yet."}
      footer={
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {lead ? `Owner: ${lead.owner} · Campaign: ${lead.campaign}` : "Create a lead to track this contact."}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/crm/leads">
              Open in CRM
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      }
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          {lead ? (
            <>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Bot className="size-3.5 text-accent" />
                  AI summary
                </div>
                <p className="mt-2 text-sm leading-relaxed">{lead.aiSummary}</p>
              </div>
              <div>
                <FieldRow label="Status" value={<Badge variant="secondary">{lead.status}</Badge>} />
                <FieldRow label="Stage" value={stage} />
                <FieldRow label="Email" value={lead.email} />
                <FieldRow label="Phone" value={lead.phone} />
                <FieldRow label="Last contacted" value={lead.lastContacted} />
                <FieldRow label="Tags" value={<TagList tags={lead.tags} className="justify-end" />} />
                <FieldRow label="Segments" value={lead.segments.join(", ") || "—"} />
              </div>
              {lead.notes ? (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Notes</p>
                  <p className="mt-1 text-sm">{lead.notes}</p>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No lead record was found for this contact. You can create one from the Leads page.
            </p>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
          ) : (
            <ol className="relative space-y-4 border-l border-border pl-5">
              {timeline.map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full border-2 border-background bg-primary" />
                  <p className="text-sm">{e.text}</p>
                  <p className="text-xs text-muted-foreground">{e.when}</p>
                </li>
              ))}
            </ol>
          )}
        </TabsContent>
      </Tabs>
    </DetailDrawer>
  );
}
