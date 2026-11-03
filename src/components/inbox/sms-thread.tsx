import * as React from "react";
import { CheckCheck, Phone, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Attachment, SmsConversation } from "@/data/inbox";
import { AiDraftPopover, AttachButton, TemplatePicker } from "./composer-tools";
import { QuickActionsMenu } from "./quick-actions";
import { AttachmentChip, ContactAvatar, ThreadHeader, type QuickActionKind } from "./shared";

export function SmsThread({
  conversation,
  agentName,
  onBack,
  onSend,
  onAction,
}: {
  conversation: SmsConversation;
  agentName: string;
  onBack: () => void;
  onSend: (body: string, attachments: Attachment[]) => void;
  onAction: (kind: QuickActionKind) => void;
}) {
  const [body, setBody] = React.useState("");
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setBody("");
    setAttachments([]);
  }, [conversation.id]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [conversation.id, conversation.messages.length]);

  const lastInbound = [...conversation.messages].reverse().find((m) => m.direction === "in")?.body;

  const send = () => {
    if (!body.trim() && attachments.length === 0) return;
    onSend(body.trim(), attachments);
    setBody("");
    setAttachments([]);
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <ThreadHeader
        name={conversation.contact}
        meta={
          <>
            <span>{conversation.phone}</span>
            <span aria-hidden>·</span>
            <span>{conversation.company}</span>
          </>
        }
        tags={conversation.tags}
        assignee={conversation.assignee}
        onBack={onBack}
        actionsMenu={<QuickActionsMenu onAction={onAction} />}
      >
        <Button variant="ghost" size="icon" aria-label="Call contact" onClick={() => onAction("call")}>
          <Phone className="size-4" />
        </Button>
      </ThreadHeader>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-surface/40 px-4 py-5 md:px-6">
        {conversation.messages.map((m) => {
          const out = m.direction === "out";
          return (
            <div key={m.id} className={cn("flex items-end gap-2", out ? "justify-end" : "justify-start")}>
              {!out ? <ContactAvatar name={m.author} className="size-8" /> : null}
              <div className={cn("max-w-[min(32rem,80%)] space-y-1.5", out && "items-end text-right")}>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                    out
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md border border-border bg-card text-foreground",
                  )}
                >
                  <p className="whitespace-pre-line text-left">{m.body}</p>
                </div>
                {m.attachments?.length ? (
                  <div className={cn("flex flex-wrap gap-1.5", out && "justify-end")}>
                    {m.attachments.map((a) => (
                      <AttachmentChip key={a.id} attachment={a} downloadable />
                    ))}
                  </div>
                ) : null}
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  {out ? null : <span>{m.author}</span>}
                  <span className={cn(out && "ml-auto")}>{m.when}</span>
                  {out ? <CheckCheck className="size-3 text-primary" /> : null}
                </p>
              </div>
              {out ? <ContactAvatar name={m.author} className="size-8" tone="accent" /> : null}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="shrink-0 border-t border-border bg-card px-4 py-3 md:px-6">
        {attachments.length ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {attachments.map((a) => (
              <AttachmentChip
                key={a.id}
                attachment={a}
                onRemove={() => setAttachments((l) => l.filter((x) => x.id !== a.id))}
              />
            ))}
          </div>
        ) : null}
        <Textarea
          rows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Message ${conversation.contact}…`}
          className="resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <div className="mt-2 flex items-center gap-1">
          <AttachButton onFiles={(f) => setAttachments((l) => [...l, ...f])} compact />
          <TemplatePicker
            channel="SMS"
            values={{ LeadName: conversation.contact, AgentName: agentName }}
            onPick={(t) => setBody(t.body)}
            compact
          />
          <AiDraftPopover
            channel="SMS"
            values={{ LeadName: conversation.contact, AgentName: agentName }}
            onPick={(text) => setBody(text)}
            context={lastInbound}
            compact
          />
          <span className="ml-auto text-xs text-muted-foreground">{body.length}/320</span>
          <Button size="sm" className="gap-1.5" onClick={send} disabled={!body.trim() && attachments.length === 0}>
            <Send className="size-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
