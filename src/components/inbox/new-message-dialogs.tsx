import * as React from "react";
import { Mic, Square, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/dashboard/crud";
import { leadSeed } from "@/data/crm";
import type { Attachment } from "@/data/inbox";
import { cn } from "@/lib/utils";
import { AiDraftPopover, AttachButton, TemplatePicker } from "./composer-tools";
import { AttachmentChip, filesToAttachments, formatBytes } from "./shared";

const NO_LEAD = "__none__";

function ComposeShell({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  confirmTitle,
  confirmDescription,
  canSubmit,
  onSubmit,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  confirmTitle: string;
  confirmDescription: string;
  canSubmit: boolean;
  onSubmit: () => void;
  children: React.ReactNode;
}) {
  const [confirming, setConfirming] = React.useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">{children}</div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={!canSubmit} onClick={() => setConfirming(true)}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={submitLabel}
        onConfirm={() => {
          setConfirming(false);
          onSubmit();
          onOpenChange(false);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ SMS */

export type NewSmsPayload = {
  leadId: string | null;
  contact: string;
  phone: string;
  body: string;
  attachments: Attachment[];
};

export function NewSmsDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (p: NewSmsPayload) => void;
}) {
  const [leadId, setLeadId] = React.useState(NO_LEAD);
  const [phone, setPhone] = React.useState("");
  const [body, setBody] = React.useState("");
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);

  React.useEffect(() => {
    if (!open) return;
    setLeadId(NO_LEAD);
    setPhone("");
    setBody("");
    setAttachments([]);
  }, [open]);

  const lead = leadSeed.find((l) => l.id === leadId);
  const targetPhone = lead?.phone ?? phone.trim();
  const canSubmit = Boolean(targetPhone) && body.trim().length > 0;

  return (
    <ComposeShell
      open={open}
      onOpenChange={onOpenChange}
      title="New SMS"
      description="Start a text conversation with a lead or any phone number."
      submitLabel="Send SMS"
      confirmTitle="Send this SMS?"
      confirmDescription={`The message will be sent to ${targetPhone || "the selected number"} from your workspace number.`}
      canSubmit={canSubmit}
      onSubmit={() =>
        onCreate({
          leadId: lead?.id ?? null,
          contact: lead?.name ?? phone.trim(),
          phone: targetPhone,
          body: body.trim(),
          attachments,
        })
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Select lead</Label>
          <Select value={leadId} onValueChange={setLeadId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a lead" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_LEAD}>No lead — enter a number</SelectItem>
              {leadSeed.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name} · {l.company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-sms-phone">Or enter number</Label>
          <Input
            id="new-sms-phone"
            value={lead ? lead.phone : phone}
            disabled={Boolean(lead)}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 300 0000000"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="new-sms-body">Message</Label>
          <span className="text-xs text-muted-foreground">{body.length}/320</span>
        </div>
        <Textarea
          id="new-sms-body"
          rows={4}
          maxLength={320}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type your message…"
        />
      </div>
      {attachments.length ? (
        <div className="flex flex-wrap gap-2">
          {attachments.map((a) => (
            <AttachmentChip key={a.id} attachment={a} onRemove={() => setAttachments((l) => l.filter((x) => x.id !== a.id))} />
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-dashed border-border p-1">
        <AttachButton onFiles={(f) => setAttachments((l) => [...l, ...f])} />
        <TemplatePicker
          channel="SMS"
          values={{ LeadName: lead?.name ?? "there", AgentName: "Sara Ahmed", ProductName: "Quality Dial" }}
          onPick={(t) => setBody(t.body)}
        />
        <AiDraftPopover
          channel="SMS"
          values={{ LeadName: lead?.name ?? "there", AgentName: "Sara Ahmed" }}
          onPick={setBody}
        />
      </div>
    </ComposeShell>
  );
}

/* ---------------------------------------------------------------- Email */

export type NewEmailPayload = {
  to: string;
  subject: string;
  body: string;
  attachments: Attachment[];
};

export function NewEmailDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (p: NewEmailPayload) => void;
}) {
  const [to, setTo] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);

  React.useEffect(() => {
    if (!open) return;
    setTo("");
    setSubject("");
    setBody("");
    setAttachments([]);
  }, [open]);

  const matchedLead = leadSeed.find((l) => l.email.toLowerCase() === to.trim().toLowerCase());
  const canSubmit = /\S+@\S+\.\S+/.test(to.trim()) && subject.trim().length > 0 && body.trim().length > 0;

  return (
    <ComposeShell
      open={open}
      onOpenChange={onOpenChange}
      title="New Email"
      description="Compose an email from your workspace address."
      submitLabel="Send email"
      confirmTitle="Send this email?"
      confirmDescription={`“${subject || "Untitled"}” will be sent to ${to || "the recipient"}.`}
      canSubmit={canSubmit}
      onSubmit={() => onCreate({ to: to.trim(), subject: subject.trim(), body: body.trim(), attachments })}
    >
      <div className="space-y-2">
        <Label htmlFor="new-email-to">To</Label>
        <Input
          id="new-email-to"
          list="inbox-lead-emails"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="name@company.com"
        />
        <datalist id="inbox-lead-emails">
          {leadSeed.map((l) => (
            <option key={l.id} value={l.email}>
              {l.name}
            </option>
          ))}
        </datalist>
        {matchedLead ? (
          <p className="text-xs text-muted-foreground">
            Linked to lead <span className="font-medium text-foreground">{matchedLead.name}</span> · {matchedLead.company}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-email-subject">Subject</Label>
        <Input id="new-email-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-email-body">Message</Label>
        <Textarea id="new-email-body" rows={7} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your email…" />
      </div>
      {attachments.length ? (
        <div className="flex flex-wrap gap-2">
          {attachments.map((a) => (
            <AttachmentChip key={a.id} attachment={a} onRemove={() => setAttachments((l) => l.filter((x) => x.id !== a.id))} />
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-dashed border-border p-1">
        <AttachButton onFiles={(f) => setAttachments((l) => [...l, ...f])} />
        <TemplatePicker
          channel="Email"
          values={{ LeadName: matchedLead?.name ?? "there", AgentName: "Sara Ahmed", ProductName: "Quality Dial" }}
          onPick={(t) => {
            if (t.subject) setSubject(t.subject);
            setBody(t.body);
          }}
        />
        <AiDraftPopover
          channel="Email"
          values={{ LeadName: matchedLead?.name ?? "there", AgentName: "Sara Ahmed" }}
          onPick={setBody}
        />
      </div>
    </ComposeShell>
  );
}

/* ------------------------------------------------------------ Voicemail */

export type NewVoicemailPayload = {
  title: string;
  leadId: string | null;
  notes: string;
  file: string;
  duration: string;
};

export function NewVoicemailDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (p: NewVoicemailPayload) => void;
}) {
  const [title, setTitle] = React.useState("");
  const [mode, setMode] = React.useState<"upload" | "record">("upload");
  const [file, setFile] = React.useState<Attachment | null>(null);
  const [recording, setRecording] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [notes, setNotes] = React.useState("");
  const [leadId, setLeadId] = React.useState(NO_LEAD);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) return;
    setTitle("");
    setMode("upload");
    setFile(null);
    setRecording(false);
    setSeconds(0);
    setNotes("");
    setLeadId(NO_LEAD);
  }, [open]);

  React.useEffect(() => {
    if (!recording) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [recording]);

  const stopRecording = () => {
    setRecording(false);
    setFile({ id: crypto.randomUUID(), name: `recording-${Date.now()}.webm`, size: formatBytes(seconds * 12_000) });
  };

  const duration = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  const canSubmit = title.trim().length > 0 && Boolean(file);

  return (
    <ComposeShell
      open={open}
      onOpenChange={onOpenChange}
      title="New Voicemail"
      description="Upload or record a voicemail message and optionally link it to a lead."
      submitLabel="Save voicemail"
      confirmTitle="Save this voicemail?"
      confirmDescription="It will appear in the Voicemail inbox and be transcribed by AI."
      canSubmit={canSubmit}
      onSubmit={() =>
        onCreate({
          title: title.trim(),
          leadId: leadId === NO_LEAD ? null : leadId,
          notes: notes.trim(),
          file: file!.name,
          duration: mode === "record" ? duration : "0:00",
        })
      }
    >
      <div className="space-y-2">
        <Label htmlFor="new-vm-title">Title</Label>
        <Input id="new-vm-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Callback request — Sheikh Motors" />
      </div>

      <div className="space-y-2">
        <Label>Recording</Label>
        <div className="grid grid-cols-2 gap-2">
          {(["upload", "record"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setFile(null);
                setSeconds(0);
                setRecording(false);
              }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                mode === m ? "border-primary bg-primary-soft text-primary" : "border-border bg-card hover:bg-secondary",
              )}
            >
              {m === "upload" ? <Upload className="size-4" /> : <Mic className="size-4" />}
              {m === "upload" ? "Upload recording" : "Record audio"}
            </button>
          ))}
        </div>

        {mode === "upload" ? (
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm hover:bg-muted/60"
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const [a] = filesToAttachments(e.target.files);
                setFile(a ?? null);
                e.target.value = "";
              }}
            />
            <Upload className="size-5 text-muted-foreground" />
            <span className="font-medium">{file ? file.name : "Click to choose an audio file"}</span>
            <span className="text-xs text-muted-foreground">{file ? file.size : "MP3, WAV or M4A up to 25 MB"}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
            <div>
              <p className="font-display text-lg tabular-nums">{duration}</p>
              <p className="text-xs text-muted-foreground">
                {recording ? "Recording… speak now" : file ? "Recording captured" : "Press record to start"}
              </p>
            </div>
            {recording ? (
              <Button variant="destructive" size="sm" onClick={stopRecording}>
                <Square className="size-3.5" />
                Stop
              </Button>
            ) : (
              <Button
                size="sm"
                variant={file ? "outline" : "default"}
                onClick={() => {
                  setSeconds(0);
                  setFile(null);
                  setRecording(true);
                }}
              >
                <Mic className="size-3.5" />
                {file ? "Re-record" : "Record"}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-vm-notes">Notes</Label>
        <Textarea id="new-vm-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Context for the team (optional)" />
      </div>

      <div className="space-y-2">
        <Label>Assign to lead (optional)</Label>
        <Select value={leadId} onValueChange={setLeadId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_LEAD}>Not linked</SelectItem>
            {leadSeed.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.name} · {l.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </ComposeShell>
  );
}

export function notifyDraftSaved(kind: string) {
  toast.info(`${kind} saved as draft`);
}
