import * as React from "react";
import { Forward, Reply, ReplyAll, Send } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Attachment, EmailThread as EmailThreadType } from "@/data/inbox";
import { AiDraftPopover, AttachButton, TemplatePicker } from "./composer-tools";
import { QuickActionsMenu } from "./quick-actions";
import { AttachmentChip, ContactAvatar, ThreadHeader, type QuickActionKind } from "./shared";

type Mode = "reply" | "reply-all" | "forward";

const modeMeta: Record<Mode, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  reply: { label: "Reply", icon: Reply },
  "reply-all": { label: "Reply All", icon: ReplyAll },
  forward: { label: "Forward", icon: Forward },
};

export function EmailThread({
  thread,
  agentName,
  onBack,
  onSend,
  onAction,
}: {
  thread: EmailThreadType;
  agentName: string;
  onBack: () => void;
  onSend: (p: { mode: Mode; to: string[]; body: string; attachments: Attachment[] }) => void;
  onAction: (kind: QuickActionKind) => void;
}) {
  const [mode, setMode] = React.useState<Mode>("reply");
  const [to, setTo] = React.useState("");
  const [body, setBody] = React.useState("");
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const last = thread.messages[thread.messages.length - 1];

  const recipientsFor = React.useCallback(
    (m: Mode) => {
      if (!last) return thread.email;
      if (m === "forward") return "";
      if (m === "reply-all") return Array.from(new Set([last.fromEmail, ...(last.cc ?? [])])).join(", ");
      return last.fromEmail;
    },
    [last, thread.email],
  );

  React.useEffect(() => {
    setMode("reply");
    setBody("");
    setAttachments([]);
    setExpanded(null);
  }, [thread.id]);

  React.useEffect(() => {
    setTo(recipientsFor(mode));
  }, [mode, recipientsFor]);

  React.useEffect(() => {
    if (mode !== "forward" || !last) return;
    setBody(`\n\n---------- Forwarded message ----------\nFrom: ${last.from} <${last.fromEmail}>\nDate: ${last.when}\nSubject: ${thread.subject}\n\n${last.body}`);
  }, [mode, last, thread.subject]);

  const send = () => {
    const list = to
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (list.length === 0) {
      toast.error("Add at least one recipient");
      return;
    }
    if (!body.trim()) {
      toast.error("The email body is empty");
      return;
    }
    onSend({ mode, to: list, body: body.trim(), attachments });
    setBody("");
    setAttachments([]);
    setMode("reply");
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <ThreadHeader
        name={thread.contact}
        meta={
          <>
            <span className="truncate">{thread.email}</span>
            <span aria-hidden>·</span>
            <span>{thread.company}</span>
          </>
        }
        tags={thread.tags}
        assignee={thread.assignee}
        onBack={onBack}
        actionsMenu={<QuickActionsMenu onAction={onAction} />}
      >
        <Badge variant="secondary" className="hidden font-normal sm:inline-flex">
          {thread.folder}
        </Badge>
      </ThreadHeader>

      <div className="min-h-0 flex-1 overflow-y-auto bg-surface/40 px-4 py-5 md:px-6">
        <h3 className="font-display text-lg font-semibold leading-snug">{thread.subject}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {thread.messages.length} message{thread.messages.length === 1 ? "" : "s"} · {thread.lastActivity}
        </p>

        <div className="mt-4 space-y-3">
          {thread.messages.map((m, i) => {
            const open = expanded === m.id || i === thread.messages.length - 1;
            return (
              <article key={m.id} className="rounded-xl border border-border bg-card shadow-sm">
                <button
                  type="button"
                  className="flex w-full items-start gap-3 px-4 py-3 text-left"
                  onClick={() => setExpanded(open && i !== thread.messages.length - 1 ? null : m.id)}
                >
                  <ContactAvatar name={m.from} className="size-9" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{m.from}</span>
                      <span className="truncate text-xs text-muted-foreground">&lt;{m.fromEmail}&gt;</span>
                      {m.draft ? (
                        <Badge variant="outline" className="text-[11px] text-accent-foreground">
                          Draft
                        </Badge>
                      ) : null}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      To {m.to.join(", ")}
                      {m.cc?.length ? ` · Cc ${m.cc.join(", ")}` : ""}
                    </p>
                    {!open ? <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{m.body}</p> : null}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{m.when}</span>
                </button>
                {open ? (
                  <div className="border-t border-border/70 px-4 py-3">
                    <p className="whitespace-pre-line text-sm leading-relaxed">{m.body}</p>
                    {m.attachments?.length ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {m.attachments.map((a) => (
                          <AttachmentChip key={a.id} attachment={a} downloadable />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-card px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center gap-1">
          {(Object.keys(modeMeta) as Mode[]).map((m) => {
            const Icon = modeMeta[m].icon;
            return (
              <Button
                key={m}
                variant={mode === m ? "secondary" : "ghost"}
                size="sm"
                className={cn("gap-1.5", mode !== m && "text-muted-foreground")}
                onClick={() => setMode(m)}
              >
                <Icon className="size-4" />
                {modeMeta[m].label}
              </Button>
            );
          })}
        </div>

        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="email-to" className="w-8 text-xs text-muted-foreground">
              To
            </Label>
            <Input
              id="email-to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="name@company.com"
              className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Textarea
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`Write your ${modeMeta[mode].label.toLowerCase()}…`}
            className="resize-none"
          />
          {attachments.length ? (
            <div className="flex flex-wrap gap-1.5">
              {attachments.map((a) => (
                <AttachmentChip
                  key={a.id}
                  attachment={a}
                  onRemove={() => setAttachments((l) => l.filter((x) => x.id !== a.id))}
                />
              ))}
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <AttachButton onFiles={(f) => setAttachments((l) => [...l, ...f])} compact />
            <TemplatePicker
              channel="Email"
              values={{ LeadName: thread.contact, AgentName: agentName }}
              onPick={(t) => setBody(t.body)}
              compact
            />
            <AiDraftPopover
              channel="Email"
              values={{ LeadName: thread.contact, AgentName: agentName }}
              onPick={(text) => setBody(text)}
              context={last?.body}
              compact
            />
            <Button size="sm" className="ml-auto gap-1.5" onClick={send}>
              <Send className="size-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
