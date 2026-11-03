import * as React from "react";
import { Archive, Inbox as InboxIcon, Mail, MessageSquare, Plus, Search, Voicemail as VoicemailIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DialerDrawer } from "@/components/dashboard/dialer-drawer";
import { cn } from "@/lib/utils";
import {
  emailFolders,
  emailSeed,
  inboxChannels,
  smsSeed,
  voicemailSeed,
  type EmailFolder,
  type EmailThread as EmailThreadType,
  type InboxChannel,
  type SmsConversation,
  type Voicemail,
} from "@/data/inbox";
import { EmailThread } from "./email-thread";
import type { TimelineEntry } from "./lead-drawer";
import {
  NewEmailDialog,
  NewSmsDialog,
  NewVoicemailDialog,
  type NewEmailPayload,
  type NewSmsPayload,
  type NewVoicemailPayload,
} from "./new-message-dialogs";
import {
  ActionDialogs,
  QuickActionsRail,
  type ActiveAction,
  type ConversationPatch,
} from "./quick-actions";
import { SmsThread } from "./sms-thread";
import {
  ContactAvatar,
  EmptyThread,
  TagList,
  type ConversationRef,
  type QuickActionKind,
} from "./shared";
import { VoicemailView } from "./voicemail-view";

const AGENT_NAME = "Sara Ahmed";

const channelMeta: Record<InboxChannel, { icon: React.ComponentType<{ className?: string }>; newLabel: string; empty: string }> = {
  SMS: { icon: MessageSquare, newLabel: "New SMS", empty: "Pick a conversation to see the full chat history and reply." },
  Email: { icon: Mail, newLabel: "New Email", empty: "Pick a thread to read the conversation and reply, reply all or forward." },
  Voicemail: { icon: VoicemailIcon, newLabel: "New Voicemail", empty: "Pick a voicemail to listen, read the AI transcript and act on it." },
};

function timeLabel() {
  return `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`;
}

function matches(query: string, ...fields: (string | undefined)[]) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((f) => (f ?? "").toLowerCase().includes(q));
}

/* ------------------------------------------------------------ List rows */

function ListRow({
  active,
  unread,
  name,
  meta,
  preview,
  when,
  tags,
  badge,
  onSelect,
}: {
  active: boolean;
  unread: boolean;
  name: string;
  meta: string;
  preview: string;
  when: string;
  tags: string[];
  badge?: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 border-b border-border/60 px-3 py-3 text-left transition-colors",
        active ? "bg-primary-soft/60" : "hover:bg-muted/60",
      )}
    >
      <div className="relative">
        <ContactAvatar name={name} className="size-9" tone={active ? "accent" : "default"} />
        {unread ? <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-card bg-primary" /> : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className={cn("truncate text-sm", unread ? "font-semibold" : "font-medium")}>{name}</span>
          <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{when}</span>
        </div>
        <p className="truncate text-xs text-muted-foreground">{meta}</p>
        <p className={cn("mt-0.5 line-clamp-2 text-xs", unread ? "text-foreground" : "text-muted-foreground")}>{preview}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1">
          {badge}
          <TagList tags={tags} />
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------ Main page */

export function InboxPage() {
  const [channel, setChannel] = React.useState<InboxChannel>("SMS");
  const [query, setQuery] = React.useState("");
  const [folder, setFolder] = React.useState<EmailFolder>("Inbox");
  const [showArchived, setShowArchived] = React.useState(false);

  const [sms, setSms] = React.useState<SmsConversation[]>(smsSeed);
  const [emails, setEmails] = React.useState<EmailThreadType[]>(emailSeed);
  const [voicemails, setVoicemails] = React.useState<Voicemail[]>(voicemailSeed);

  const [smsId, setSmsId] = React.useState<string | null>(smsSeed[0]?.id ?? null);
  const [emailId, setEmailId] = React.useState<string | null>(emailSeed[0]?.id ?? null);
  const [vmId, setVmId] = React.useState<string | null>(voicemailSeed[0]?.id ?? null);

  const [action, setAction] = React.useState<ActiveAction>(null);
  const [timeline, setTimeline] = React.useState<Record<string, TimelineEntry[]>>({});
  const [dialer, setDialer] = React.useState<{ open: boolean; number?: string }>({ open: false });
  const [composeOpen, setComposeOpen] = React.useState<InboxChannel | null>(null);
  const [mobileThread, setMobileThread] = React.useState(false);

  /* --------------------------------------------------------- Selections */

  const smsThread = sms.find((c) => c.id === smsId) ?? null;
  const emailThread = emails.find((t) => t.id === emailId) ?? null;
  const voicemail = voicemails.find((v) => v.id === vmId) ?? null;

  const log = React.useCallback((leadId: string, text: string) => {
    setTimeline((t) => ({
      ...t,
      [leadId]: [{ id: crypto.randomUUID(), when: timeLabel(), text }, ...(t[leadId] ?? [])],
    }));
  }, []);

  const conversationRef: ConversationRef | null = React.useMemo(() => {
    if (channel === "SMS" && smsThread) {
      return {
        channel: "SMS",
        id: smsThread.id,
        leadId: smsThread.leadId,
        contact: smsThread.contact,
        phone: smsThread.phone,
        company: smsThread.company,
        assignee: smsThread.assignee,
        tags: smsThread.tags,
        notes: smsThread.notes,
      };
    }
    if (channel === "Email" && emailThread) {
      return {
        channel: "Email",
        id: emailThread.id,
        leadId: emailThread.leadId,
        contact: emailThread.contact,
        phone: "—",
        email: emailThread.email,
        company: emailThread.company,
        assignee: emailThread.assignee,
        tags: emailThread.tags,
        notes: emailThread.notes,
      };
    }
    if (channel === "Voicemail" && voicemail) {
      return {
        channel: "Voicemail",
        id: voicemail.id,
        leadId: voicemail.leadId,
        contact: voicemail.caller,
        phone: voicemail.phone,
        company: voicemail.company,
        assignee: voicemail.assignee,
        tags: voicemail.tags,
        notes: voicemail.notes,
      };
    }
    return null;
  }, [channel, smsThread, emailThread, voicemail]);

  /* ------------------------------------------------------------ Filters */

  const smsList = sms.filter(
    (c) =>
      c.archived === showArchived &&
      matches(query, c.contact, c.phone, c.company, c.messages.at(-1)?.body, ...c.tags),
  );
  const emailList = emails.filter(
    (t) =>
      t.archived === showArchived &&
      t.folder === folder &&
      matches(query, t.contact, t.email, t.subject, t.company, t.messages.at(-1)?.body, ...t.tags),
  );
  const vmList = voicemails.filter(
    (v) => v.archived === showArchived && matches(query, v.caller, v.phone, v.company, v.transcript, v.summary, ...v.tags),
  );

  const unreadCounts = {
    SMS: sms.filter((c) => c.unread && !c.archived).length,
    Email: emails.filter((t) => t.unread && !t.archived).length,
    Voicemail: voicemails.filter((v) => v.unread && !v.archived).length,
  } satisfies Record<InboxChannel, number>;

  /* ------------------------------------------------------------ Actions */

  const openConversation = (kind: InboxChannel, id: string) => {
    setChannel(kind);
    setMobileThread(true);
    if (kind === "SMS") {
      setSmsId(id);
      setSms((l) => l.map((c) => (c.id === id ? { ...c, unread: false } : c)));
    }
    if (kind === "Email") {
      setEmailId(id);
      setEmails((l) => l.map((t) => (t.id === id ? { ...t, unread: false } : t)));
    }
    if (kind === "Voicemail") {
      setVmId(id);
      setVoicemails((l) => l.map((v) => (v.id === id ? { ...v, unread: false } : v)));
    }
  };

  const patch = (ref: ConversationRef, p: ConversationPatch) => {
    if (ref.channel === "SMS") setSms((l) => l.map((c) => (c.id === ref.id ? { ...c, ...p } : c)));
    if (ref.channel === "Email") setEmails((l) => l.map((t) => (t.id === ref.id ? { ...t, ...p } : t)));
    if (ref.channel === "Voicemail") setVoicemails((l) => l.map((v) => (v.id === ref.id ? { ...v, ...p } : v)));
  };

  const startSms = (ref: ConversationRef) => {
    const existing = sms.find((c) => c.leadId === ref.leadId || c.phone === ref.phone);
    if (existing) {
      openConversation("SMS", existing.id);
      return;
    }
    const created: SmsConversation = {
      id: crypto.randomUUID(),
      leadId: ref.leadId,
      contact: ref.contact,
      phone: ref.phone,
      company: ref.company,
      assignee: ref.assignee,
      unread: false,
      archived: false,
      tags: ref.tags,
      notes: "",
      lastActivity: "just now",
      messages: [],
    };
    setSms((l) => [created, ...l]);
    openConversation("SMS", created.id);
    toast.success(`SMS thread started with ${ref.contact}`);
  };

  const handleAction = (kind: QuickActionKind) => {
    if (!conversationRef) return;
    if (kind === "call") {
      setDialer({ open: true, number: conversationRef.phone });
      log(conversationRef.leadId, `Call started from ${conversationRef.channel} inbox`);
      return;
    }
    if (kind === "sms") {
      startSms(conversationRef);
      return;
    }
    setAction({ kind, ref: conversationRef });
  };

  const sendSms: React.ComponentProps<typeof SmsThread>["onSend"] = (bodyText, attachments) => {
    if (!smsThread) return;
    setSms((l) =>
      l.map((c) =>
        c.id === smsThread.id
          ? {
              ...c,
              lastActivity: "just now",
              messages: [
                ...c.messages,
                {
                  id: crypto.randomUUID(),
                  direction: "out" as const,
                  body: bodyText || "(attachment)",
                  when: timeLabel(),
                  author: AGENT_NAME,
                  ...(attachments.length ? { attachments } : {}),
                },
              ],
            }
          : c,
      ),
    );
    log(smsThread.leadId, `SMS sent to ${smsThread.contact}`);
    toast.success("Message sent");
  };

  const sendEmail: React.ComponentProps<typeof EmailThread>["onSend"] = ({ mode, to, body, attachments }) => {
    if (!emailThread) return;
    setEmails((l) =>
      l.map((t) =>
        t.id === emailThread.id
          ? {
              ...t,
              lastActivity: "just now",
              folder: t.folder === "Drafts" ? "Sent" : t.folder,
              messages: [
                ...t.messages.filter((m) => !m.draft),
                {
                  id: crypto.randomUUID(),
                  from: AGENT_NAME,
                  fromEmail: "sara@qualitydial.com",
                  to,
                  when: timeLabel(),
                  body,
                  ...(attachments.length ? { attachments } : {}),
                },
              ],
            }
          : t,
      ),
    );
    log(emailThread.leadId, `Email ${mode === "forward" ? "forwarded" : "reply sent"} — ${emailThread.subject}`);
    toast.success(mode === "forward" ? "Email forwarded" : "Reply sent");
  };

  /* ------------------------------------------------------------ Compose */

  const createSms = (p: NewSmsPayload) => {
    const created: SmsConversation = {
      id: crypto.randomUUID(),
      leadId: p.leadId ?? "",
      contact: p.contact || p.phone,
      phone: p.phone,
      company: "—",
      assignee: AGENT_NAME,
      unread: false,
      archived: false,
      tags: [],
      notes: "",
      lastActivity: "just now",
      messages: [
        {
          id: crypto.randomUUID(),
          direction: "out",
          body: p.body,
          when: timeLabel(),
          author: AGENT_NAME,
          ...(p.attachments.length ? { attachments: p.attachments } : {}),
        },
      ],
    };
    setSms((l) => [created, ...l]);
    openConversation("SMS", created.id);
    if (p.leadId) log(p.leadId, `SMS sent to ${created.contact}`);
    toast.success("SMS sent");
  };

  const createEmail = (p: NewEmailPayload) => {
    const created: EmailThreadType = {
      id: crypto.randomUUID(),
      leadId: "",
      folder: "Sent",
      subject: p.subject,
      contact: p.to,
      email: p.to,
      company: "—",
      assignee: AGENT_NAME,
      unread: false,
      archived: false,
      tags: [],
      notes: "",
      lastActivity: "just now",
      messages: [
        {
          id: crypto.randomUUID(),
          from: AGENT_NAME,
          fromEmail: "sara@qualitydial.com",
          to: [p.to],
          when: timeLabel(),
          body: p.body,
          ...(p.attachments.length ? { attachments: p.attachments } : {}),
        },
      ],
    };
    setEmails((l) => [created, ...l]);
    setFolder("Sent");
    openConversation("Email", created.id);
    toast.success("Email sent");
  };

  const createVoicemail = (p: NewVoicemailPayload) => {
    const created: Voicemail = {
      id: crypto.randomUUID(),
      leadId: p.leadId ?? "",
      caller: p.title,
      phone: "—",
      company: "—",
      when: timeLabel(),
      duration: p.duration,
      assignee: AGENT_NAME,
      unread: false,
      archived: false,
      completed: false,
      tags: [],
      notes: p.notes,
      transcript: "Transcription in progress — the AI transcript appears here once processing finishes.",
      summary: "Summary will be generated after transcription.",
      file: p.file,
    };
    setVoicemails((l) => [created, ...l]);
    openConversation("Voicemail", created.id);
    if (p.leadId) log(p.leadId, `Voicemail saved: ${p.title}`);
    toast.success("Voicemail saved");
  };

  /* --------------------------------------------------------------- View */

  const ChannelIcon = channelMeta[channel].icon;

  const list =
    channel === "SMS" ? (
      smsList.map((c) => (
        <ListRow
          key={c.id}
          active={c.id === smsId}
          unread={c.unread}
          name={c.contact}
          meta={c.phone}
          preview={c.messages.at(-1)?.body ?? "No messages yet"}
          when={c.lastActivity}
          tags={c.tags}
          onSelect={() => openConversation("SMS", c.id)}
        />
      ))
    ) : channel === "Email" ? (
      emailList.map((t) => (
        <ListRow
          key={t.id}
          active={t.id === emailId}
          unread={t.unread}
          name={t.contact}
          meta={t.subject}
          preview={t.messages.at(-1)?.body ?? ""}
          when={t.lastActivity}
          tags={t.tags}
          badge={
            t.messages.some((m) => m.attachments?.length) ? (
              <Badge variant="outline" className="rounded-md px-1.5 py-0 text-[11px]">
                Attachment
              </Badge>
            ) : undefined
          }
          onSelect={() => openConversation("Email", t.id)}
        />
      ))
    ) : (
      vmList.map((v) => (
        <ListRow
          key={v.id}
          active={v.id === vmId}
          unread={v.unread}
          name={v.caller}
          meta={`${v.phone} · ${v.duration}`}
          preview={v.summary}
          when={v.when}
          tags={v.tags}
          badge={
            v.completed ? (
              <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[11px]">
                Completed
              </Badge>
            ) : undefined
          }
          onSelect={() => openConversation("Voicemail", v.id)}
        />
      ))
    );

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] w-full max-w-[110rem] overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:h-[calc(100vh-8rem)]">
      {/* Secondary sidebar */}
      <aside
        className={cn(
          "flex w-full shrink-0 flex-col border-r border-border bg-card md:w-80",
          mobileThread && "hidden md:flex",
        )}
      >
        <div className="space-y-3 border-b border-border px-3 py-3">
          <Tabs value={channel} onValueChange={(v) => setChannel(v as InboxChannel)}>
            <TabsList className="grid w-full grid-cols-3">
              {inboxChannels.map((c) => (
                <TabsTrigger key={c} value={c} className="gap-1.5">
                  {c}
                  {unreadCounts[c] ? (
                    <span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                      {unreadCounts[c]}
                    </span>
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, number, email, subject…"
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button className="flex-1 gap-1.5" onClick={() => setComposeOpen(channel)}>
              <Plus className="size-4" />
              {channelMeta[channel].newLabel}
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showArchived ? "secondary" : "ghost"}
                  size="icon"
                  aria-label="Toggle archived conversations"
                  onClick={() => setShowArchived((v) => !v)}
                >
                  <Archive className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{showArchived ? "Showing archived" : "Show archived"}</TooltipContent>
            </Tooltip>
          </div>

          {channel === "Email" ? (
            <Tabs value={folder} onValueChange={(v) => setFolder(v as EmailFolder)}>
              <TabsList className="grid w-full grid-cols-3">
                {emailFolders.map((f) => (
                  <TabsTrigger key={f} value={f}>
                    {f}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {list.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <InboxIcon className="size-6 text-muted-foreground" />
              <p className="text-sm font-medium">Nothing here</p>
              <p className="text-xs text-muted-foreground">
                {query ? "No conversation matches your search." : "This list is empty for now."}
              </p>
            </div>
          ) : (
            list
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className={cn("min-w-0 flex-1", !mobileThread && "hidden md:block")}>
        {channel === "SMS" && smsThread ? (
          <SmsThread
            conversation={smsThread}
            agentName={AGENT_NAME}
            onBack={() => setMobileThread(false)}
            onSend={sendSms}
            onAction={handleAction}
          />
        ) : channel === "Email" && emailThread ? (
          <EmailThread
            thread={emailThread}
            agentName={AGENT_NAME}
            onBack={() => setMobileThread(false)}
            onSend={sendEmail}
            onAction={handleAction}
          />
        ) : channel === "Voicemail" && voicemail ? (
          <VoicemailView
            voicemail={voicemail}
            onBack={() => setMobileThread(false)}
            onAction={handleAction}
            onToggleComplete={() => {
              setVoicemails((l) => l.map((v) => (v.id === voicemail.id ? { ...v, completed: !v.completed } : v)));
              log(voicemail.leadId, voicemail.completed ? "Voicemail reopened" : "Voicemail marked complete");
              toast.success(voicemail.completed ? "Marked as open" : "Voicemail completed");
            }}
          />
        ) : (
          <EmptyThread icon={ChannelIcon} title={`No ${channel.toLowerCase()} selected`} description={channelMeta[channel].empty} />
        )}
      </div>

      {/* Quick actions rail */}
      {conversationRef ? (
        <div className="hidden xl:block">
          <QuickActionsRail conversation={conversationRef} onAction={handleAction} />
        </div>
      ) : null}

      {/* Dialogs */}
      <ActionDialogs
        action={action}
        onClose={() => setAction(null)}
        onPatch={patch}
        onLog={log}
        timeline={timeline}
      />
      <NewSmsDialog open={composeOpen === "SMS"} onOpenChange={(v) => setComposeOpen(v ? "SMS" : null)} onCreate={createSms} />
      <NewEmailDialog open={composeOpen === "Email"} onOpenChange={(v) => setComposeOpen(v ? "Email" : null)} onCreate={createEmail} />
      <NewVoicemailDialog
        open={composeOpen === "Voicemail"}
        onOpenChange={(v) => setComposeOpen(v ? "Voicemail" : null)}
        onCreate={createVoicemail}
      />
      <DialerDrawer
        open={dialer.open}
        onOpenChange={(v) => setDialer((d) => ({ ...d, open: v }))}
        initialNumber={dialer.number}
      />
    </div>
  );
}
