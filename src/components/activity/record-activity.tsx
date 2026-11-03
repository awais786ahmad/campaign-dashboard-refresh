import * as React from "react";
import { ArrowRight, Bot, Cog, History, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { activityForRecord, type AuditAction, type AuditActorType, type AuditEvent } from "@/data/activity-log";

export function ActorAvatar({ initials, type, className }: { initials: string; type: AuditActorType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
        type === "human" && "bg-primary/10 text-primary",
        type === "ai" && "bg-accent/15 text-accent",
        type === "system" && "bg-muted text-muted-foreground",
        className,
      )}
    >
      {type === "ai" ? <Bot className="size-4" /> : type === "system" ? <Cog className="size-4" /> : initials}
    </span>
  );
}

const actionTone: Partial<Record<AuditAction, string>> = {
  Created: "border-primary/30 bg-primary/10 text-primary",
  Launched: "border-primary/30 bg-primary/10 text-primary",
  Completed: "border-primary/30 bg-primary/10 text-primary",
  Deleted: "border-destructive/30 bg-destructive/10 text-destructive",
  "Role changed": "border-destructive/30 bg-destructive/10 text-destructive",
  Automated: "border-accent/30 bg-accent/10 text-accent",
};

export function ActionBadge({ action }: { action: AuditAction }) {
  return (
    <Badge variant="outline" className={cn("font-normal", actionTone[action])}>
      {action}
    </Badge>
  );
}

export function ChangeList({ changes }: { changes: AuditEvent["changes"] }) {
  if (!changes?.length) return null;
  return (
    <div className="space-y-1.5 rounded-lg border border-border bg-muted/40 p-3">
      {changes.map((c) => (
        <div key={c.field} className="grid grid-cols-[minmax(0,7rem)_1fr] items-start gap-2 text-xs">
          <span className="text-muted-foreground">{c.field}</span>
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground line-through">{c.before}</span>
            <ArrowRight className="size-3 text-muted-foreground" />
            <span className="font-medium">{c.after}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function ActivityEmptyState({ title = "No activity yet", description = "Changes to this record will appear here." }: { title?: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-muted">
        <History className="size-5 text-muted-foreground" />
      </span>
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function RecordActivityTimeline({ events }: { events: AuditEvent[] }) {
  if (!events.length) return <ActivityEmptyState />;
  const days = [...new Set(events.map((e) => e.day))];
  return (
    <div className="space-y-6">
      {days.map((day) => (
        <div key={day}>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{day}</p>
          <ol className="space-y-4">
            {events.filter((e) => e.day === day).map((e) => (
              <li key={e.id} className="flex gap-3">
                <ActorAvatar initials={e.actorInitials} type={e.actorType} />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium">{e.actor}</span>
                    <ActionBadge action={e.action} />
                    {e.sensitive ? <Lock className="size-3.5 text-muted-foreground" aria-label="Sensitive" /> : null}
                    <span className="ml-auto text-xs text-muted-foreground">{e.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{e.summary}</p>
                  <ChangeList changes={e.changes} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export type ActivityTarget = { entityType: string; entityId: string; record: string };

export function RecordActivityPanel({ target }: { target: ActivityTarget }) {
  const events = React.useMemo(
    () => activityForRecord(target.entityType, target.entityId, target.record),
    [target.entityType, target.entityId, target.record],
  );
  return <RecordActivityTimeline events={events} />;
}
