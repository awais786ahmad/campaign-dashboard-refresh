import * as React from "react";
import { ArrowLeft, Download, FileText, MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Attachment, InboxChannel } from "@/data/inbox";
import { templateVariables } from "@/data/crm";

/* ---------------------------------------------------------------- Types */

export type QuickActionKind =
  | "view-lead"
  | "timeline"
  | "call"
  | "sms"
  | "task"
  | "ticket"
  | "notes"
  | "tags"
  | "assign"
  | "archive";

/** Channel-agnostic description of the open conversation used by quick actions. */
export type ConversationRef = {
  channel: InboxChannel;
  id: string;
  leadId: string;
  contact: string;
  phone: string;
  email?: string;
  company: string;
  assignee: string;
  tags: string[];
  notes: string;
};

/* -------------------------------------------------------------- Helpers */

export function initials(name: string) {
  const parts = name.replace(/[^a-zA-Z ]/g, "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function filesToAttachments(files: FileList | null): Attachment[] {
  if (!files) return [];
  return Array.from(files).map((f) => ({
    id: crypto.randomUUID(),
    name: f.name,
    size: formatBytes(f.size),
  }));
}

/** Replace {{Variables}} in a template with values for the current conversation. */
export function fillTemplate(
  body: string,
  values: { LeadName?: string; AgentName?: string; ProductName?: string; Date?: string; Amount?: string },
) {
  let out = body;
  for (const variable of templateVariables) {
    const key = variable.replace(/[{}]/g, "") as keyof typeof values;
    const value = values[key];
    if (value) out = out.split(variable).join(value);
  }
  return out;
}

export function downloadAttachment(name: string) {
  toast.success(`Downloading ${name}`, { description: "The file will open when the download finishes." });
}

/* ----------------------------------------------------------- Components */

export function ContactAvatar({
  name,
  className,
  tone = "default",
}: {
  name: string;
  className?: string;
  tone?: "default" | "accent";
}) {
  return (
    <Avatar className={cn("size-10", className)}>
      <AvatarFallback
        className={cn(
          "font-display text-sm font-semibold",
          tone === "accent" ? "bg-accent-soft text-accent-foreground" : "bg-primary-soft text-primary",
        )}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

export function AttachmentChip({
  attachment,
  onRemove,
  downloadable,
  className,
}: {
  attachment: Attachment;
  onRemove?: () => void;
  downloadable?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-card/80 py-1.5 pl-2 pr-1 text-xs",
        className,
      )}
    >
      <FileText className="size-3.5 shrink-0 text-primary" />
      <span className="truncate font-medium">{attachment.name}</span>
      <span className="shrink-0 text-muted-foreground">{attachment.size}</span>
      {downloadable ? (
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          aria-label={`Download ${attachment.name}`}
          onClick={() => downloadAttachment(attachment.name)}
        >
          <Download className="size-3.5" />
        </Button>
      ) : null}
      {onRemove ? (
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          aria-label={`Remove ${attachment.name}`}
          onClick={onRemove}
        >
          <X className="size-3.5" />
        </Button>
      ) : null}
    </div>
  );
}

export function TagList({ tags, className }: { tags: string[]; className?: string }) {
  if (tags.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {tags.map((t) => (
        <Badge key={t} variant="outline" className="rounded-md px-1.5 py-0 text-[11px] font-medium">
          {t}
        </Badge>
      ))}
    </div>
  );
}

/** Header shared by every conversation view: identity on the left, actions on the right. */
export function ThreadHeader({
  name,
  meta,
  tags,
  assignee,
  onBack,
  actionsMenu,
  children,
}: {
  name: string;
  meta: React.ReactNode;
  tags: string[];
  assignee: string;
  onBack: () => void;
  actionsMenu: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-start gap-3 border-b border-border px-4 py-3 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" aria-label="Back to list" onClick={onBack}>
        <ArrowLeft className="size-4" />
      </Button>
      <ContactAvatar name={name} className="size-11" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h2 className="truncate font-display text-base font-semibold leading-tight">{name}</h2>
          <TagList tags={tags} />
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          {meta}
          <span aria-hidden>·</span>
          <span>
            Assigned to <span className="font-medium text-foreground">{assignee}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {children}
        {actionsMenu}
      </div>
    </div>
  );
}

export function EmptyThread({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="size-6" />
      </div>
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export { MoreHorizontal };
