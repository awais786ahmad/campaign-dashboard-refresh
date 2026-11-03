import * as React from "react";
import {
  Archive,
  ClipboardList,
  History,
  MessageSquare,
  MoreHorizontal,
  Phone,
  StickyNote,
  Tag,
  Ticket,
  User,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog, RecordFormModal } from "@/components/dashboard/crud";
import { crmAgents, tagSeed, taskPriorities } from "@/data/crm";
import { inboxAssignees } from "@/data/inbox";
import { cn } from "@/lib/utils";
import { LeadDrawer, type TimelineEntry } from "./lead-drawer";
import { ContactAvatar, TagList, type ConversationRef, type QuickActionKind } from "./shared";

/* ---------------------------------------------------------- Definitions */

type ActionDef = { kind: QuickActionKind; label: string; icon: React.ComponentType<{ className?: string }> };

const primaryActions: ActionDef[] = [
  { kind: "view-lead", label: "View Lead", icon: User },
  { kind: "timeline", label: "Open Timeline", icon: History },
  { kind: "call", label: "Call", icon: Phone },
  { kind: "task", label: "Create Task", icon: ClipboardList },
  { kind: "ticket", label: "Create Ticket", icon: Ticket },
];

const secondaryActions: ActionDef[] = [
  { kind: "sms", label: "Send SMS", icon: MessageSquare },
  { kind: "notes", label: "Add Notes", icon: StickyNote },
  { kind: "tags", label: "Add Tags", icon: Tag },
  { kind: "assign", label: "Assign to User", icon: UserPlus },
  { kind: "archive", label: "Archive Conversation", icon: Archive },
];

export const allQuickActions = [...primaryActions, ...secondaryActions];

/* ------------------------------------------------------------- Surfaces */

/** Compact dropdown with every conversation action (used in the thread header). */
export function QuickActionsMenu({ onAction }: { onAction: (kind: QuickActionKind) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Conversation actions">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Conversation actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {primaryActions.map((a) => (
          <DropdownMenuItem key={a.kind} onSelect={() => onAction(a.kind)}>
            <a.icon className="mr-2 size-4" />
            {a.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {secondaryActions.map((a) => (
          <DropdownMenuItem
            key={a.kind}
            onSelect={() => onAction(a.kind)}
            className={cn(a.kind === "archive" && "text-destructive focus:text-destructive")}
          >
            <a.icon className="mr-2 size-4" />
            {a.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Right-hand rail with the quick action buttons and a contact summary (xl and up). */
export function QuickActionsRail({
  conversation,
  onAction,
}: {
  conversation: ConversationRef;
  onAction: (kind: QuickActionKind) => void;
}) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-l border-border bg-surface/50">
      <div className="flex flex-col items-center gap-2 px-4 pb-4 pt-6 text-center">
        <ContactAvatar name={conversation.contact} className="size-14" tone="accent" />
        <div>
          <p className="font-display text-sm font-semibold">{conversation.contact}</p>
          <p className="text-xs text-muted-foreground">{conversation.company}</p>
        </div>
        <p className="text-xs text-muted-foreground">{conversation.phone}</p>
        {conversation.email ? <p className="truncate text-xs text-muted-foreground">{conversation.email}</p> : null}
      </div>

      <div className="px-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Quick actions</p>
        <div className="grid gap-1.5">
          {primaryActions.map((a) => (
            <Button
              key={a.kind}
              variant="outline"
              size="sm"
              className="justify-start gap-2 bg-card"
              onClick={() => onAction(a.kind)}
            >
              <a.icon className="size-4 text-primary" />
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="px-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">More</p>
        <div className="grid gap-0.5">
          {secondaryActions.map((a) => (
            <Button
              key={a.kind}
              variant="ghost"
              size="sm"
              className={cn(
                "justify-start gap-2 text-muted-foreground hover:text-foreground",
                a.kind === "archive" && "hover:text-destructive",
              )}
              onClick={() => onAction(a.kind)}
            >
              <a.icon className="size-4" />
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4 px-4 pb-6">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Assigned to</p>
          <Badge variant="secondary" className="font-normal">
            {conversation.assignee}
          </Badge>
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tags</p>
          {conversation.tags.length ? (
            <TagList tags={conversation.tags} />
          ) : (
            <p className="text-xs text-muted-foreground">No tags yet</p>
          )}
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {conversation.notes || "No notes on this conversation."}
          </p>
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------- Dialogs */

export type ActiveAction = { kind: QuickActionKind; ref: ConversationRef } | null;

export type ConversationPatch = Partial<Pick<ConversationRef, "assignee" | "tags" | "notes">> & {
  archived?: boolean;
};

/**
 * Renders the modal / drawer for the active quick action. Actions that do not
 * need UI (call, sms) are handled by the parent before reaching here.
 */
export function ActionDialogs({
  action,
  onClose,
  onPatch,
  onLog,
  timeline,
}: {
  action: ActiveAction;
  onClose: () => void;
  onPatch: (ref: ConversationRef, patch: ConversationPatch) => void;
  onLog: (leadId: string, text: string) => void;
  timeline: Record<string, TimelineEntry[]>;
}) {
  const ref = action?.ref;
  const kind = action?.kind;
  const open = (k: QuickActionKind) => Boolean(action && kind === k);
  const close = (v: boolean) => {
    if (!v) onClose();
  };

  // Local form state — reset whenever a new action opens.
  const [task, setTask] = React.useState({ title: "", due: "", priority: "Medium", assignee: crmAgents[0]!, notes: "" });
  const [ticket, setTicket] = React.useState({ subject: "", priority: "Medium", category: "Support", description: "" });
  const [notes, setNotes] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [customTag, setCustomTag] = React.useState("");
  const [assignee, setAssignee] = React.useState(inboxAssignees[0]!);

  React.useEffect(() => {
    if (!action) return;
    const r = action.ref;
    setTask({ title: `Follow up with ${r.contact}`, due: "", priority: "Medium", assignee: r.assignee in crmAgents ? r.assignee : crmAgents[0]!, notes: "" });
    setTicket({ subject: `${r.channel} conversation with ${r.contact}`, priority: "Medium", category: "Support", description: "" });
    setNotes(r.notes);
    setTags(r.tags);
    setCustomTag("");
    setAssignee(inboxAssignees.includes(r.assignee) ? r.assignee : inboxAssignees[0]!);
  }, [action]);

  if (!ref || !kind) return null;

  const leadTimeline = timeline[ref.leadId] ?? [];

  return (
    <>
      <LeadDrawer
        open={open("view-lead") || open("timeline")}
        onOpenChange={close}
        leadId={ref.leadId}
        fallbackName={ref.contact}
        initialTab={kind === "timeline" ? "timeline" : "overview"}
        extraTimeline={leadTimeline}
      />

      <RecordFormModal
        open={open("task")}
        onOpenChange={close}
        title="Create task"
        description={`A follow-up linked to ${ref.contact} and this ${ref.channel.toLowerCase()} conversation.`}
        onSubmit={() => {
          if (!task.title.trim()) {
            toast.error("Task title is required");
            return;
          }
          toast.success("Task created", { description: task.title });
          onLog(ref.leadId, `Task created from ${ref.channel} inbox: ${task.title}`);
        }}
        onSaveDraft={() => toast.info("Task saved as draft")}
      >
        <div className="space-y-2">
          <Label htmlFor="qa-task-title">Title</Label>
          <Input id="qa-task-title" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="qa-task-due">Due date</Label>
            <Input id="qa-task-due" type="date" value={task.due} onChange={(e) => setTask({ ...task, due: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={task.priority} onValueChange={(v) => setTask({ ...task, priority: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {taskPriorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Assignee</Label>
          <Select value={task.assignee} onValueChange={(v) => setTask({ ...task, assignee: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {crmAgents.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="qa-task-notes">Notes</Label>
          <Textarea id="qa-task-notes" rows={3} value={task.notes} onChange={(e) => setTask({ ...task, notes: e.target.value })} placeholder="What needs to happen?" />
        </div>
      </RecordFormModal>

      <RecordFormModal
        open={open("ticket")}
        onOpenChange={close}
        title="Create ticket"
        description={`Raise a support or billing ticket for ${ref.contact}.`}
        onSubmit={() => {
          if (!ticket.subject.trim()) {
            toast.error("Ticket subject is required");
            return;
          }
          toast.success("Ticket created", { description: ticket.subject });
          onLog(ref.leadId, `Ticket raised from ${ref.channel} inbox: ${ticket.subject}`);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="qa-ticket-subject">Subject</Label>
          <Input id="qa-ticket-subject" value={ticket.subject} onChange={(e) => setTicket({ ...ticket, subject: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={ticket.category} onValueChange={(v) => setTicket({ ...ticket, category: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Support", "Billing", "Sales", "Technical"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={ticket.priority} onValueChange={(v) => setTicket({ ...ticket, priority: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Low", "Medium", "High", "Urgent"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="qa-ticket-desc">Description</Label>
          <Textarea id="qa-ticket-desc" rows={4} value={ticket.description} onChange={(e) => setTicket({ ...ticket, description: e.target.value })} placeholder="Describe the issue and what the customer expects." />
        </div>
      </RecordFormModal>

      <Dialog open={open("notes")} onOpenChange={close}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conversation notes</DialogTitle>
            <DialogDescription>Internal notes are only visible to your team.</DialogDescription>
          </DialogHeader>
          <Textarea rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add context for whoever picks this up next…" />
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onPatch(ref, { notes: notes.trim() });
                onLog(ref.leadId, `Note added on ${ref.channel} conversation`);
                toast.success("Notes saved");
                onClose();
              }}
            >
              Save notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open("tags")} onOpenChange={close}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tags</DialogTitle>
            <DialogDescription>Tags apply to the conversation and the linked lead.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set([...tagSeed.map((t) => t.name), ...tags])).map((t) => {
              const on = tags.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTags((l) => (on ? l.filter((x) => x !== t) : [...l, t]))}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Input
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="New tag"
              onKeyDown={(e) => {
                if (e.key === "Enter" && customTag.trim()) {
                  e.preventDefault();
                  setTags((l) => Array.from(new Set([...l, customTag.trim()])));
                  setCustomTag("");
                }
              }}
            />
            <Button
              variant="outline"
              disabled={!customTag.trim()}
              onClick={() => {
                setTags((l) => Array.from(new Set([...l, customTag.trim()])));
                setCustomTag("");
              }}
            >
              Add
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onPatch(ref, { tags });
                onLog(ref.leadId, `Tags updated: ${tags.join(", ") || "none"}`);
                toast.success("Tags updated");
                onClose();
              }}
            >
              Save tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open("assign")} onOpenChange={close}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign conversation</DialogTitle>
            <DialogDescription>The assignee gets notified and owns the next reply.</DialogDescription>
          </DialogHeader>
          <Select value={assignee} onValueChange={setAssignee}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {inboxAssignees.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onPatch(ref, { assignee });
                onLog(ref.leadId, `Conversation assigned to ${assignee}`);
                toast.success(`Assigned to ${assignee}`);
                onClose();
              }}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={open("archive")}
        onOpenChange={close}
        title="Archive this conversation?"
        description="It will be hidden from the inbox list. You can still find it with the archived filter."
        confirmLabel="Archive"
        destructive
        onConfirm={() => {
          onPatch(ref, { archived: true });
          onLog(ref.leadId, `${ref.channel} conversation archived`);
          toast.success("Conversation archived");
          onClose();
        }}
      />
    </>
  );
}
