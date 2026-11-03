import * as React from "react";
import {
  Bot,
  CheckCircle2,
  ClipboardList,
  Download,
  FileAudio,
  MessageSquare,
  Pause,
  Phone,
  Play,
  Ticket,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { Voicemail } from "@/data/inbox";
import { QuickActionsMenu } from "./quick-actions";
import { ThreadHeader, downloadAttachment, type QuickActionKind } from "./shared";

function toSeconds(duration: string) {
  const [m, s] = duration.split(":");
  return Number(m ?? 0) * 60 + Number(s ?? 0);
}

function format(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Simulated player — the demo data ships file names, not real audio. */
function AudioPlayer({ voicemail }: { voicemail: Voicemail }) {
  const total = toSeconds(voicemail.duration);
  const [playing, setPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);

  React.useEffect(() => {
    setPlaying(false);
    setPosition(0);
  }, [voicemail.id]);

  React.useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      setPosition((p) => {
        if (p + 1 >= total) {
          window.clearInterval(t);
          setPlaying(false);
          return total;
        }
        return p + 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [playing, total]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          className="size-11 rounded-full"
          aria-label={playing ? "Pause recording" : "Play recording"}
          onClick={() => {
            if (position >= total) setPosition(0);
            setPlaying((p) => !p);
          }}
        >
          {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
        </Button>
        <div className="min-w-0 flex-1">
          <Slider
            value={[position]}
            max={total}
            step={1}
            onValueChange={([v]) => setPosition(v ?? 0)}
            aria-label="Recording position"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{format(position)}</span>
            <span className="flex items-center gap-1.5">
              <FileAudio className="size-3.5" />
              {voicemail.file}
            </span>
            <span>{voicemail.duration}</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => downloadAttachment(voicemail.file)}
        >
          <Download className="size-4" />
          Download
        </Button>
      </div>
    </div>
  );
}

export function VoicemailView({
  voicemail,
  onBack,
  onAction,
  onToggleComplete,
}: {
  voicemail: Voicemail;
  onBack: () => void;
  onAction: (kind: QuickActionKind) => void;
  onToggleComplete: () => void;
}) {
  const actions: { kind: QuickActionKind; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { kind: "call", label: "Call Back", icon: Phone },
    { kind: "sms", label: "Send SMS", icon: MessageSquare },
    { kind: "view-lead", label: "View Lead", icon: User },
    { kind: "task", label: "Create Task", icon: ClipboardList },
    { kind: "ticket", label: "Create Ticket", icon: Ticket },
  ];

  return (
    <div className="flex h-full min-w-0 flex-col">
      <ThreadHeader
        name={voicemail.caller}
        meta={
          <>
            <span>{voicemail.phone}</span>
            <span aria-hidden>·</span>
            <span>{voicemail.when}</span>
            <span aria-hidden>·</span>
            <span>{voicemail.duration}</span>
          </>
        }
        tags={voicemail.tags}
        assignee={voicemail.assignee}
        onBack={onBack}
        actionsMenu={<QuickActionsMenu onAction={onAction} />}
      >
        <Button
          variant={voicemail.completed ? "secondary" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={onToggleComplete}
        >
          <CheckCircle2 className={cn("size-4", voicemail.completed && "text-primary")} />
          {voicemail.completed ? "Completed" : "Mark Complete"}
        </Button>
      </ThreadHeader>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-surface/40 px-4 py-5 md:px-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-display text-base font-semibold">{voicemail.caller}</span>
          <Badge variant="outline" className="font-normal">
            {voicemail.company}
          </Badge>
          {voicemail.completed ? <Badge variant="secondary">Completed</Badge> : null}
        </div>

        <AudioPlayer voicemail={voicemail} />

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Bot className="size-3.5 text-accent" />
            AI summary
          </h3>
          <p className="mt-2 text-sm leading-relaxed">{voicemail.summary}</p>
        </section>

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI transcript</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{voicemail.transcript}</p>
        </section>

        {voicemail.notes ? (
          <section className="rounded-xl border border-dashed border-border bg-muted/40 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Internal notes</h3>
            <p className="mt-2 text-sm">{voicemail.notes}</p>
          </section>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-border bg-card px-4 py-3 md:px-6">
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <Button key={a.kind} variant="outline" size="sm" className="gap-1.5" onClick={() => onAction(a.kind)}>
              <a.icon className="size-4 text-primary" />
              {a.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => {
              downloadAttachment(voicemail.file);
              toast.info("Recording queued for download");
            }}
          >
            <Download className="size-4" />
            Download Recording
          </Button>
        </div>
      </div>
    </div>
  );
}
