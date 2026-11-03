import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Bot,
  CalendarPlus,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Mail,
  MessageSquare,
  Pause,
  Phone,
  Play,
  RotateCcw,
  RotateCw,
  Search,
  Sparkles,
  User,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DetailDrawer } from "@/components/dashboard/crud";
import { cn } from "@/lib/utils";
import { sentimentTone } from "@/data/calling";
import { qaCategories, type ReportCall } from "@/data/reports";
import { AiLabel, ScorePill, StatTile } from "./shared";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const tabs = ["overview", "recording", "transcript", "summary", "qa", "notes", "timeline"] as const;
type Tab = (typeof tabs)[number];

export function CallDrawer({
  call,
  onClose,
  onChange,
  initialTab,
}: {
  call: ReportCall | null;
  onClose: () => void;
  onChange: (c: ReportCall) => void;
  initialTab?: string | undefined;
}) {
  return (
    <DetailDrawer
      open={!!call}
      onOpenChange={(v) => !v && onClose()}
      title={call ? call.lead : ""}
      description={call ? `${call.code} · ${call.when} · ${call.campaign}` : ""}
    >
      {call ? <CallDetail key={call.id} call={call} onChange={onChange} initialTab={initialTab} /> : null}
    </DetailDrawer>
  );
}

function CallDetail({ call, onChange, initialTab }: { call: ReportCall; onChange: (c: ReportCall) => void; initialTab?: string | undefined }) {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState<Tab>(tabs.includes(initialTab as Tab) ? (initialTab as Tab) : "overview");

  // Shared player state so Recording and Transcript stay in sync.
  const [playing, setPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [speed, setSpeed] = React.useState("1");
  const [volume, setVolume] = React.useState(80);

  React.useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setPosition((p) => {
        const next = p + Number(speed);
        if (next >= call.seconds) {
          setPlaying(false);
          return call.seconds;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, speed, call.seconds]);

  const seek = (s: number) => {
    setPosition(Math.max(0, Math.min(call.seconds, s)));
  };
  const jumpTo = (s: number) => {
    seek(s);
    setPlaying(true);
    setTab("recording");
  };

  const player = { playing, setPlaying, position, seek, speed, setSpeed, volume, setVolume };

  return (
    <div className="space-y-4 pt-2">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{call.outcome}</Badge>
          <Badge variant="outline" className={sentimentTone[call.sentiment]}>{call.sentiment}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">QA <ScorePill score={call.qaScore} /></span>
          {call.critical ? <Badge variant="destructive">Critical: {call.critical}</Badge> : null}
          {call.escalated ? <Badge variant="secondary">Escalated</Badge> : null}
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="text-sm">
            <p className="flex items-center gap-2 font-medium">
              {call.agentKind === "AI" ? <Bot className="size-4" /> : <User className="size-4" />}
              {call.agent}
              <span className="text-muted-foreground">· {call.team}</span>
            </p>
            <p className="text-muted-foreground">{call.direction} · {call.campaign}</p>
          </div>
          <p className="font-display text-2xl font-semibold tabular-nums">{call.duration}</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList className="flex h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recording">Recording</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="summary">AI summary</TabsTrigger>
          <TabsTrigger value="qa">QA</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => toast.success(`Calling ${call.lead}…`)}><Phone className="mr-1.5 size-4" /> Call</Button>
            <Button size="sm" variant="outline" onClick={() => navigate({ to: "/inbox" })}><MessageSquare className="mr-1.5 size-4" /> SMS</Button>
            <Button size="sm" variant="outline" onClick={() => navigate({ to: "/inbox" })}><Mail className="mr-1.5 size-4" /> Email</Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("Task created")}><CalendarPlus className="mr-1.5 size-4" /> Create task</Button>
            <Button size="sm" variant="outline" onClick={() => setTab("notes")}><FileText className="mr-1.5 size-4" /> Add note</Button>
            <Button size="sm" variant="ghost" onClick={() => navigate({ to: "/crm/leads" })}><ExternalLink className="mr-1.5 size-4" /> Open lead</Button>
          </div>

          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Call information</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <StatTile label="Call ID" value={call.code} />
            <StatTile label="Date / time" value={call.when} />
            <StatTile label="Direction" value={call.direction} />
            <StatTile label="Agent" value={call.agent} sub={call.agentKind} />
            <StatTile label="Team" value={call.team} />
            <StatTile label="Campaign" value={call.campaign} />
            <StatTile label="Duration" value={call.duration} />
            <StatTile label="Outcome" value={call.outcome} />
            <StatTile label="QA score" value={call.qaScore} sub={call.qaType === "None" ? "Not reviewed" : `${call.qaType} review`} />
          </div>

          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Timing</p>
          <div className="grid grid-cols-4 gap-2">
            <StatTile label="Wait" value={call.timings.wait} />
            <StatTile label="Talk" value={call.timings.talk} />
            <StatTile label="Hold" value={call.timings.hold} />
            <StatTile label="Transfer" value={call.timings.transfer} />
          </div>

          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Lead information</p>
          <div className="grid grid-cols-2 gap-2">
            <StatTile label="Name" value={call.lead} />
            <StatTile label="Phone" value={call.number} />
            <StatTile label="Email" value={call.email} />
            <StatTile label="Segment" value={call.segment} sub={`Stage: ${call.leadStage}`} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {call.tags.map((t) => (
              <Badge key={t} variant="secondary">{t}</Badge>
            ))}
          </div>

          <SentimentBlock call={call} />
        </TabsContent>

        {/* Recording */}
        <TabsContent value="recording" className="mt-4 space-y-4">
          {call.recording ? (
            <>
              <Player call={call} {...player} />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <StatTile label="Recording length" value={call.duration} />
                <StatTile label="Recorded" value={call.when} />
                <StatTile label="Status" value="Available" sub="Stored securely" />
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Speaker markers</p>
                <div className="space-y-1.5">
                  {call.transcript.map((l) => (
                    <button
                      key={l.at}
                      onClick={() => seek(l.at)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-accent",
                        position >= l.at && "bg-accent/60",
                      )}
                    >
                      <span className="font-mono text-xs text-muted-foreground">{fmt(l.at)}</span>
                      <span className="w-16 shrink-0 text-xs font-medium">{l.speaker}</span>
                      <span className="truncate text-muted-foreground">{l.text}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.success("Recording download started")}><Download className="mr-1.5 size-4" /> Download</Button>
                <Button variant="outline" size="sm" onClick={() => { void navigator.clipboard?.writeText(call.code); toast.success("Recording reference copied"); }}><Copy className="mr-1.5 size-4" /> Copy reference</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/crm/leads" })}><ExternalLink className="mr-1.5 size-4" /> Open lead</Button>
              </div>
            </>
          ) : (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No recording is available for this call.</p>
          )}
        </TabsContent>

        {/* Transcript */}
        <TabsContent value="transcript" className="mt-4">
          {call.transcriptReady ? (
            <Transcript call={call} position={position} onJump={jumpTo} />
          ) : (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Transcript is still processing.</p>
          )}
        </TabsContent>

        {/* AI summary */}
        <TabsContent value="summary" className="mt-4 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <AiLabel>Summary</AiLabel>
            <p className="mt-2 text-sm">{call.summary}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryBlock title="Customer intent" items={[call.intent]} />
            <SummaryBlock title="Next action" items={[call.nextAction]} />
            <SummaryBlock title="Key topics" items={call.topics} chips />
            <SummaryBlock title="Objections" items={call.objections} />
            <SummaryBlock title="Customer questions" items={call.questions} quote />
            <SummaryBlock title="Outcome reason" items={[call.outcomeReason]} />
          </div>
          <SentimentBlock call={call} />
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <AiLabel>AI coaching — why this call scored {call.qaScore}</AiLabel>
            <p className="mt-2 text-sm">{call.coaching}</p>
            <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs" onClick={() => setTab("qa")}>
              View QA breakdown
            </Button>
          </div>
        </TabsContent>

        {/* QA */}
        <TabsContent value="qa" className="mt-4">
          <QaPanel call={call} onChange={onChange} />
        </TabsContent>

        {/* Notes */}
        <TabsContent value="notes" className="mt-4">
          <Notes call={call} onChange={onChange} />
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline" className="mt-4">
          <ol className="relative space-y-4 border-l border-border pl-5">
            {call.timeline.map((t, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[26px] top-1 size-3 rounded-full border-2 border-background bg-primary" />
                <p className="font-mono text-xs text-muted-foreground">{t.at}</p>
                <p className="text-sm">{t.event}</p>
              </li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ------------------------------------------------------------------ Player */

function Player({
  call,
  playing,
  setPlaying,
  position,
  seek,
  speed,
  setSpeed,
  volume,
  setVolume,
}: {
  call: ReportCall;
  playing: boolean;
  setPlaying: (v: boolean | ((p: boolean) => boolean)) => void;
  position: number;
  seek: (s: number) => void;
  speed: string;
  setSpeed: (v: string) => void;
  volume: number;
  setVolume: (v: number) => void;
}) {
  const progress = (position / call.seconds) * 100;
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex h-14 items-end gap-0.5">
        {Array.from({ length: 64 }).map((_, i) => {
          const pct = (i / 64) * 100;
          return (
            <button
              key={i}
              aria-label={`Seek to ${Math.round((pct / 100) * call.seconds)} seconds`}
              onClick={() => seek((pct / 100) * call.seconds)}
              className={cn("flex-1 rounded-full transition-colors", pct <= progress ? "bg-primary" : "bg-primary/20")}
              style={{ height: `${20 + ((i * 37) % 80)}%` }}
            />
          );
        })}
      </div>
      <Slider value={[position]} max={call.seconds} step={1} onValueChange={([v]) => seek(v ?? 0)} className="mt-3" />
      <div className="mt-1 flex justify-between font-mono text-xs text-muted-foreground">
        <span>{fmt(position)}</span>
        <span>{call.duration}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="icon" variant="outline" className="size-9" onClick={() => seek(position - 10)} aria-label="Back 10 seconds">
          <RotateCcw className="size-4" />
        </Button>
        <Button size="icon" className="size-11 rounded-full" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
        </Button>
        <Button size="icon" variant="outline" className="size-9" onClick={() => seek(position + 10)} aria-label="Forward 10 seconds">
          <RotateCw className="size-4" />
        </Button>
        <div className="ml-2 flex min-w-32 flex-1 items-center gap-2">
          <Volume2 className="size-4 text-muted-foreground" />
          <Slider value={[volume]} max={100} step={1} onValueChange={([v]) => setVolume(v ?? 0)} />
        </div>
        <Select value={speed} onValueChange={setSpeed}>
          <SelectTrigger className="h-9 w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["0.5", "0.75", "1", "1.25", "1.5", "2"].map((s) => (
              <SelectItem key={s} value={s}>{s}x</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Transcript */

function Transcript({ call, position, onJump }: { call: ReportCall; position: number; onJump: (s: number) => void }) {
  const [q, setQ] = React.useState("");
  const refs = React.useRef<Record<number, HTMLButtonElement | null>>({});
  const activeIndex = call.transcript.reduce((acc, l, i) => (l.at <= position ? i : acc), -1);

  React.useEffect(() => {
    const el = refs.current[activeIndex];
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const highlight = (text: string) => {
    if (!q.trim()) return text;
    const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
    return parts.map((p, i) =>
      p.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="rounded bg-amber-300/50 px-0.5">{p}</mark>
      ) : (
        <React.Fragment key={i}>{p}</React.Fragment>
      ),
    );
  };

  const keyMoments = new Set(call.transcript.filter((l) => l.speaker === "Customer" && /price|cancel|charged|cancelling|third time/i.test(l.text)).map((l) => l.at));

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search transcript" className="pl-9" />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-10"
          onClick={() => {
            void navigator.clipboard?.writeText(call.transcript.map((l) => `[${fmt(l.at)}] ${l.speaker}: ${l.text}`).join("\n"));
            toast.success("Transcript copied");
          }}
        >
          <Copy className="mr-1.5 size-4" /> Copy
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {call.topics.map((t) => (
          <Badge key={t} variant="secondary" className="cursor-pointer" onClick={() => setQ(t.split(" ")[0] ?? t)}>
            <Sparkles className="mr-1 size-3" /> {t}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Click a timestamp to jump the recording there. The transcript follows playback.</p>
      <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
        {call.transcript
          .filter((l) => !q.trim() || l.text.toLowerCase().includes(q.toLowerCase()))
          .map((l) => {
            const i = call.transcript.indexOf(l);
            const active = i === activeIndex;
            return (
              <button
                key={l.at}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                onClick={() => onJump(l.at)}
                className={cn(
                  "flex w-full gap-3 rounded-xl border p-3 text-left text-sm transition-colors",
                  l.speaker === "Agent" ? "bg-muted/50" : "bg-card",
                  active ? "border-primary ring-1 ring-primary/40" : "border-border hover:border-primary/40",
                  keyMoments.has(l.at) && "border-l-4 border-l-amber-500",
                )}
              >
                <span className="font-mono text-xs text-primary">{fmt(l.at)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-muted-foreground">
                    {l.speaker}
                    {keyMoments.has(l.at) ? <span className="ml-2 text-amber-600">· key moment</span> : null}
                  </span>
                  <span className="mt-0.5 block">{highlight(l.text)}</span>
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Blocks */

function SummaryBlock({ title, items, chips, quote }: { title: string; items: string[]; chips?: boolean; quote?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      {chips ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {items.map((i) => (
            <Badge key={i} variant="secondary">{i}</Badge>
          ))}
        </div>
      ) : (
        <ul className="mt-1.5 space-y-1 text-sm">
          {items.length === 0 ? <li className="text-muted-foreground">None detected</li> : null}
          {items.map((i) => (
            <li key={i}>{quote ? `“${i}”` : i}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SentimentBlock({ call }: { call: ReportCall }) {
  const s = call.sentimentSplit;
  const rows = [
    { label: "Positive", value: s.positive, tone: "bg-emerald-500" },
    { label: "Neutral", value: s.neutral, tone: "bg-sky-500" },
    { label: "Negative", value: s.negative, tone: "bg-rose-500" },
  ];
  const pts = call.sentimentTimeline;
  const w = 100 / Math.max(1, pts.length - 1);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${i * w} ${100 - p.score}`).join(" ");
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-xs font-medium text-muted-foreground">Overall sentiment</p>
        <div className="mt-2 space-y-2">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="flex justify-between text-xs"><span>{r.label}</span><span className="tabular-nums">{r.value}%</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-muted"><div className={cn("h-1.5 rounded-full", r.tone)} style={{ width: `${r.value}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-xs font-medium text-muted-foreground">Sentiment over the call</p>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-2 h-20 w-full">
          <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border)" strokeDasharray="2 2" />
          <path d={path} fill="none" stroke="var(--chart-1)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>{pts[0]?.at}</span>
          <span>{pts[pts.length - 1]?.at}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- QA */

const levels = [
  { label: "Excellent", score: 95 },
  { label: "Good", score: 85 },
  { label: "Poor", score: 60 },
];

function QaPanel({ call, onChange }: { call: ReportCall; onChange: (c: ReportCall) => void }) {
  const aiOverall = Math.round(call.qa.reduce((s, q) => s + q.ai, 0) / call.qa.length);
  const manualScored = call.qa.filter((q) => q.manual !== null);
  const manualOverall = manualScored.length ? Math.round(manualScored.reduce((s, q) => s + (q.manual ?? 0), 0) / manualScored.length) : null;

  const [draft, setDraft] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(call.qa.map((q) => [q.category, q.manual ?? 85])),
  );
  const [feedback, setFeedback] = React.useState("");
  const [critical, setCritical] = React.useState(!!call.critical);
  const draftOverall = Math.round(Object.values(draft).reduce((a, b) => a + b, 0) / Math.max(1, Object.values(draft).length));

  const save = () => {
    onChange({
      ...call,
      qaType: "Both",
      qaStatus: "Reviewed",
      reviewer: "You",
      qaScore: Math.round((aiOverall + draftOverall) / 2),
      critical: critical ? call.critical ?? "Flagged by reviewer" : null,
      qa: call.qa.map((q) => ({ ...q, manual: draft[q.category] ?? q.manual })),
      notes: feedback.trim()
        ? [{ id: crypto.randomUUID(), who: "You", kind: "Agent" as const, when: "just now", text: `QA feedback: ${feedback.trim()}` }, ...call.notes]
        : call.notes,
    });
    toast.success("Manual QA review saved");
  };

  return (
    <Tabs defaultValue="ai" className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatTile label="AI QA" value={aiOverall} sub="Automatic review" />
        <StatTile label="Manual QA" value={manualOverall ?? "—"} sub={manualOverall === null ? "Not reviewed" : `by ${call.reviewer}`} />
        <StatTile label="Agreement" value={manualOverall === null ? "—" : `${100 - Math.abs(aiOverall - manualOverall)}%`} sub="AI vs manual" />
      </div>
      <TabsList className="w-full">
        <TabsTrigger value="ai" className="flex-1">AI QA</TabsTrigger>
        <TabsTrigger value="manual" className="flex-1">Manual QA</TabsTrigger>
        <TabsTrigger value="compare" className="flex-1">Compare</TabsTrigger>
      </TabsList>

      <TabsContent value="ai" className="space-y-3">
        <ul className="divide-y divide-border rounded-xl border border-border">
          {call.qa.map((q) => (
            <li key={q.category} className="flex items-start justify-between gap-3 px-3 py-2 text-sm">
              <div>
                <p className={cn("flex items-center gap-2", q.ai < 85 && "text-amber-700")}>
                  <span>{q.ai >= 85 ? "✓" : "⚠"}</span> {q.category}
                </p>
                {q.note ? <p className="pl-5 text-xs text-muted-foreground">{q.note}</p> : null}
              </div>
              <ScorePill score={q.ai} />
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <AiLabel>AI explanation & recommendation</AiLabel>
          <p className="mt-2 text-sm">{call.coaching}</p>
          <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
            <li>Confirm the next action before ending the call</li>
            <li>State the follow-up date explicitly</li>
            <li>Ask for the customer's commitment</li>
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="manual" className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
          <span className="text-sm text-muted-foreground">Overall (draft)</span>
          <span className="font-display text-xl font-semibold">{draftOverall} / 100</span>
        </div>
        {qaCategories.map((c) => (
          <div key={c} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span>{c}</span>
              <span className="text-xs text-muted-foreground">AI: {call.qa.find((q) => q.category === c)?.ai}</span>
            </div>
            <RadioGroup
              value={String(levels.find((l) => l.score === draft[c])?.score ?? "")}
              onValueChange={(v) => setDraft((d) => ({ ...d, [c]: Number(v) }))}
              className="flex gap-3"
            >
              {levels.map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <RadioGroupItem id={`${c}-${l.label}`} value={String(l.score)} />
                  <Label htmlFor={`${c}-${l.label}`} className="text-xs font-normal">{l.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
        <Separator />
        <div className="flex items-center gap-2">
          <input id="qa-critical" type="checkbox" checked={critical} onChange={(e) => setCritical(e.target.checked)} className="size-4 accent-[var(--primary)]" />
          <Label htmlFor="qa-critical" className="text-sm font-normal">Mark as critical failure</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="qa-feedback">Feedback & coaching recommendation</Label>
          <Textarea id="qa-feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="What should the agent keep doing or change?" />
        </div>
        <Button onClick={save}>Save QA review</Button>
      </TabsContent>

      <TabsContent value="compare">
        <ul className="divide-y divide-border rounded-xl border border-border text-sm">
          <li className="grid grid-cols-3 px-3 py-2 text-xs font-medium text-muted-foreground"><span>Category</span><span className="text-right">AI</span><span className="text-right">Manual</span></li>
          {call.qa.map((q) => (
            <li key={q.category} className="grid grid-cols-3 px-3 py-2">
              <span>{q.category}</span>
              <span className="text-right tabular-nums">{q.ai}</span>
              <span className="text-right tabular-nums">{q.manual ?? "—"}</span>
            </li>
          ))}
          <li className="grid grid-cols-3 px-3 py-2 font-medium"><span>Overall</span><span className="text-right">{aiOverall}</span><span className="text-right">{manualOverall ?? "—"}</span></li>
        </ul>
      </TabsContent>
    </Tabs>
  );
}

/* ------------------------------------------------------------------- Notes */

function Notes({ call, onChange }: { call: ReportCall; onChange: (c: ReportCall) => void }) {
  const [note, setNote] = React.useState("");
  const add = () => {
    if (!note.trim()) {
      toast.error("Write a note first");
      return;
    }
    onChange({ ...call, notes: [{ id: crypto.randomUUID(), who: "You", kind: "Agent", when: "just now", text: note.trim() }, ...call.notes] });
    setNote("");
    toast.success("Note added");
  };
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="report-call-note">Add a note</Label>
        <Textarea id="report-call-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What should the team know about this call?" />
        <Button size="sm" onClick={add}><FileText className="mr-2 size-4" /> Add note</Button>
      </div>
      <Separator />
      <div className="space-y-2">
        {call.notes.length === 0 ? <p className="text-sm text-muted-foreground">No notes yet.</p> : null}
        {call.notes.map((n) => (
          <div key={n.id} className="rounded-xl border border-border bg-card p-3 text-sm">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="h-5 text-[10px]">{n.kind}</Badge>
              {n.who} · {n.when}
            </p>
            <p className="mt-1.5">{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
