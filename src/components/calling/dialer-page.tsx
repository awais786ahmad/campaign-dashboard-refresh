import * as React from "react";
import {
  ArrowRight,
  ArrowRightLeft,
  Bot,
  CalendarClock,
  Delete,
  FileText,
  Flag,
  Mic,
  MicOff,
  Pause,
  Phone,
  PhoneCall,
  PhoneOff,
  Play,
  Sparkles,
  UserPlus,
  Users,
  X,
  ChevronDown,
  MessageSquare,
  ListChecks,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecordFormModal, DetailDrawer } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import { cn } from "@/lib/utils";
import { leadSeed, segmentSeed, crmCampaigns, type Lead } from "@/data/crm";
import {
  aiSuggestionPool,
  callOutcomes,
  dialerScript,
  transcriptScript,
  transferTargets,
  sentimentTone,
  type Sentiment,
} from "@/data/calling";

type CallState = "idle" | "dialing" | "connected" | "ended";
type TranscriptLine = { id: string; speaker: "Agent" | "Lead"; text: string };
type Note = { id: string; who: string; text: string };

const keys = [
  ["1", ""],
  ["2", "ABC"],
  ["3", "DEF"],
  ["4", "GHI"],
  ["5", "JKL"],
  ["6", "MNO"],
  ["7", "PQRS"],
  ["8", "TUV"],
  ["9", "WXYZ"],
  ["*", ""],
  ["0", "+"],
  ["#", ""],
] as const;

const AGENT = "Sara Ahmed";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function normalize(n: string) {
  return n.replace(/[^\d+]/g, "");
}

export function DialerPage() {
  const [state, setState] = React.useState<CallState>("idle");
  const [number, setNumber] = React.useState("");
  const [lead, setLead] = React.useState<Lead | null>(null);
  const [segmentName, setSegmentName] = React.useState<string | null>(null);
  const [seconds, setSeconds] = React.useState(0);
  const [muted, setMuted] = React.useState(false);
  const [held, setHeld] = React.useState(false);
  const [recording, setRecording] = React.useState(true);
  const [transcript, setTranscript] = React.useState<TranscriptLine[]>([]);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [sentiment, setSentiment] = React.useState<Sentiment>("Neutral");
  const [summary, setSummary] = React.useState("");
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [noteDraft, setNoteDraft] = React.useState("");
  const [outcome, setOutcome] = React.useState<string>("");
  const [transferOpen, setTransferOpen] = React.useState(false);
  const [transferMode, setTransferMode] = React.useState<"blind" | "warm">("warm");
  const [transferTarget, setTransferTarget] = React.useState(transferTargets[0]!);
  const [smsOpen, setSmsOpen] = React.useState(false);
  const [sms, setSms] = React.useState("");
  const [followUpOpen, setFollowUpOpen] = React.useState(false);
  const [followUp, setFollowUp] = React.useState({ when: "", note: "" });
  const [newLeadOpen, setNewLeadOpen] = React.useState(false);
  const [newLead, setNewLead] = React.useState({ name: "", company: "", segment: segmentSeed[0]?.name ?? "" });
  const [leadDrawerOpen, setLeadDrawerOpen] = React.useState(false);
  const [openSegment, setOpenSegment] = React.useState<string>(segmentSeed[0]?.id ?? "");

  const active = state === "connected" || state === "dialing";
  const inSession = state !== "idle";

  const knownLead = React.useMemo(
    () => lead ?? leadSeed.find((l) => normalize(l.phone) === normalize(number)) ?? null,
    [lead, number],
  );

  const segmentLeads = React.useCallback(
    (name: string) => leadSeed.filter((l) => l.segments.includes(name)),
    [],
  );

  const nextLead = React.useMemo(() => {
    if (!segmentName) return null;
    const list = segmentLeads(segmentName);
    const idx = lead ? list.findIndex((l) => l.id === lead.id) : -1;
    return list[idx + 1] ?? null;
  }, [segmentName, lead, segmentLeads]);

  // Timer
  React.useEffect(() => {
    if (state !== "connected") return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [state]);

  // Dialing -> connected
  React.useEffect(() => {
    if (state !== "dialing") return;
    const t = window.setTimeout(() => setState("connected"), 1800);
    return () => window.clearTimeout(t);
  }, [state]);

  // Simulated live transcript + AI suggestions
  React.useEffect(() => {
    if (state !== "connected") return;
    let i = 0;
    const name = knownLead?.name ?? "there";
    const t = window.setInterval(() => {
      const line = transcriptScript[i];
      if (!line) {
        window.clearInterval(t);
        return;
      }
      setTranscript((tr) => [
        ...tr,
        {
          id: crypto.randomUUID(),
          speaker: line.speaker,
          text: line.text.replace("{agent}", AGENT).replace("{lead}", name),
        },
      ]);
      if (i % 2 === 1) {
        const s = aiSuggestionPool[Math.floor(i / 2) % aiSuggestionPool.length]!;
        setSuggestions((list) => [s, ...list].slice(0, 3));
      }
      if (i === 3) setSentiment("Neutral");
      if (i >= 5) setSentiment("Positive");
      i += 1;
    }, 2600);
    return () => window.clearInterval(t);
  }, [state, knownLead?.name]);

  // Rolling AI summary
  React.useEffect(() => {
    if (state !== "connected") return;
    if (transcript.length < 3) return;
    setSummary(
      transcript.length < 6
        ? "Lead confirmed identity. Agent is presenting the renewal plan; lead asked for a price comparison."
        : "Lead is receptive to a ~12% cheaper plan with the same coverage. Wants the comparison by SMS and a callback on Thursday at 3pm.",
    );
  }, [transcript.length, state]);

  const startCall = (target: {
    lead?: Lead | undefined;
    number?: string | undefined;
    segment?: string | undefined;
  }) => {
    const l = target.lead ?? null;
    setLead(l);
    setNumber(l?.phone ?? target.number ?? number);
    if (target.segment) setSegmentName(target.segment);
    setSeconds(0);
    setMuted(false);
    setHeld(false);
    setRecording(true);
    setTranscript([]);
    setSuggestions([]);
    setSentiment("Neutral");
    setSummary("");
    setNotes([]);
    setOutcome("");
    setState("dialing");
    toast(`Calling ${l?.name ?? target.number ?? number}…`);
  };

  const endCall = () => {
    setState("ended");
    toast.success("Call ended", { description: "Recording saved · transcript generated · AI summary ready." });
    if (!summary) setSummary("Short call. No key points captured.");
  };

  const reset = () => {
    setState("idle");
    setLead(null);
    setNumber("");
    setSegmentName(null);
    setSeconds(0);
    setTranscript([]);
    setSuggestions([]);
    setSummary("");
    setNotes([]);
    setOutcome("");
  };

  const saveWrapUp = () => {
    if (!outcome) {
      toast.error("Select a call outcome first");
      return;
    }
    toast.success("Call saved", { description: `${outcome} · lead timeline updated · added to History.` });
  };

  const addNote = (text: string, who = AGENT) => {
    if (!text.trim()) return;
    setNotes((n) => [{ id: crypto.randomUUID(), who, text: text.trim() }, ...n]);
    setNoteDraft("");
  };

  const press = (k: string) => {
    if (active) {
      toast(`DTMF ${k} sent`);
      return;
    }
    setNumber((n) => n + k);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
      <SettingsHeader
        title="Dialer"
        description="Pick a lead from a segment or dial manually. Transcript, copilot and context appear as soon as the call connects."
        actions={
          <>
            <Badge variant="outline" className="gap-1.5 py-1">
              <span className="size-2 rounded-full bg-emerald-500" />
              {AGENT} · Available
            </Badge>
            <Button variant="outline" onClick={() => toast("Power dialer queued for the open segment")}>
              <Play className="mr-2 size-4" />
              Power dialer
            </Button>
            <Button variant="outline" onClick={() => toast("AI agent Nova will take the next 20 leads")}>
              <Bot className="mr-2 size-4" />
              AI calling
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
        {/* ------------------------------------------------ Left column */}
        <Card className="flex min-h-[640px] flex-col overflow-hidden">
          {!inSession ? (
            <>
              <CardHeader className="border-b border-border/60 py-4">
                <CardTitle className="font-display text-base">Segments</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-2">
                <Accordion type="single" collapsible value={openSegment} onValueChange={(v) => setOpenSegment(v ?? "")}>
                  {segmentSeed.map((s) => {
                    const leads = segmentLeads(s.name);
                    return (
                      <AccordionItem key={s.id} value={s.id} className="border-b-0">
                        <AccordionTrigger className="rounded-lg px-3 py-2.5 hover:bg-muted/60 hover:no-underline">
                          <div className="flex flex-1 items-center justify-between pr-2 text-left">
                            <div>
                              <div className="text-sm font-medium">{s.name}</div>
                              <div className="text-xs text-muted-foreground">{s.leadCount.toLocaleString()} leads</div>
                            </div>
                            <Badge variant="secondary" className="font-normal">
                              {leads.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-1">
                          <ul className="space-y-1 px-1">
                            {leads.length === 0 ? (
                              <li className="px-2 py-3 text-xs text-muted-foreground">No leads loaded for this segment.</li>
                            ) : null}
                            {leads.map((l) => (
                              <li
                                key={l.id}
                                className="group flex items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-muted/60"
                              >
                                <button
                                  className="min-w-0 flex-1 text-left"
                                  onClick={() => {
                                    setLead(l);
                                    setNumber(l.phone);
                                    setSegmentName(s.name);
                                  }}
                                >
                                  <div className="truncate text-sm font-medium">{l.name}</div>
                                  <div className="truncate text-xs text-muted-foreground">
                                    {l.company} · {l.phone}
                                  </div>
                                </button>
                                <Button
                                  size="icon"
                                  className="size-8 shrink-0 rounded-full"
                                  aria-label={`Call ${l.name}`}
                                  onClick={() => startCall({ lead: l, segment: s.name })}
                                >
                                  <Phone className="size-3.5" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border/60 py-4">
                <CardTitle className="font-display text-base">Live transcript</CardTitle>
                <Badge variant="outline" className={cn("border", sentimentTone[sentiment])}>
                  {sentiment}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {transcript.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {state === "dialing" ? "Waiting for the call to connect…" : "Listening…"}
                    </p>
                  ) : null}
                  {transcript.map((l) => (
                    <div key={l.id} className={cn("flex", l.speaker === "Agent" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[90%] rounded-2xl px-3 py-2 text-sm",
                          l.speaker === "Agent"
                            ? "rounded-br-sm bg-primary text-primary-foreground"
                            : "rounded-bl-sm bg-muted text-foreground",
                        )}
                      >
                        <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide opacity-70">
                          {l.speaker === "Agent" ? AGENT : knownLead?.name ?? "Caller"}
                        </div>
                        {l.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-accent/40 bg-accent-soft/60 p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                    <Sparkles className="size-3.5" />
                    AI suggestions
                  </div>
                  {suggestions.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Copilot will surface tips as the conversation develops.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {suggestions.map((s, i) => (
                        <li key={i} className={cn("text-sm leading-snug", i === 0 ? "font-medium" : "text-muted-foreground")}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Bot className="size-3.5" />
                    AI summary
                  </div>
                  <p className="text-sm leading-snug">{summary || "Summary builds automatically during the call."}</p>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* ------------------------------------------------ Centre column */}
        <Card className="flex min-h-[640px] flex-col">
          <CardContent className="flex flex-1 flex-col items-center gap-6 p-6">
            {/* Number display */}
            <div className="w-full max-w-sm">
              <div className="relative">
                <Input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  readOnly={inSession}
                  placeholder="Enter a number"
                  className="h-14 border-0 bg-muted/40 pr-12 text-center font-display text-2xl tracking-widest shadow-none focus-visible:ring-1"
                />
                {!inSession && number ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete last digit"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setNumber((n) => n.slice(0, -1))}
                  >
                    <Delete className="size-4" />
                  </Button>
                ) : null}
              </div>
              {!inSession && knownLead ? (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Matches <span className="font-medium text-foreground">{knownLead.name}</span> · {knownLead.company}
                </p>
              ) : null}
            </div>

            {/* Keypad */}
            <div className="grid w-full max-w-sm grid-cols-3 gap-3">
              {keys.map(([k, sub]) => (
                <button
                  key={k}
                  onClick={() => press(k)}
                  className="flex h-16 flex-col items-center justify-center rounded-2xl border border-border bg-card font-display text-xl transition-colors hover:bg-muted active:scale-[0.98]"
                >
                  {k}
                  <span className="text-[10px] font-sans tracking-[0.2em] text-muted-foreground">{sub}</span>
                </button>
              ))}
            </div>

            {/* Primary action */}
            {!inSession ? (
              <Button
                size="lg"
                className="h-14 w-full max-w-sm rounded-2xl text-base"
                disabled={!number}
                onClick={() => startCall({ lead: knownLead ?? undefined, number, segment: segmentName ?? undefined })}
              >
                <Phone className="mr-2 size-5" />
                Call{knownLead ? ` ${knownLead.name}` : ""}
              </Button>
            ) : null}

            {/* Caller details + controls */}
            {inSession ? (
              <div className="w-full max-w-sm space-y-4">
                <Separator />
                <div className="flex items-center justify-between">
                  <button className="text-left" onClick={() => setLeadDrawerOpen(true)}>
                    <div className="font-display text-lg font-semibold leading-tight">
                      {knownLead?.name ?? "Unknown caller"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {knownLead ? `${knownLead.company} · ${knownLead.phone}` : number}
                    </div>
                  </button>
                  <div className="text-right">
                    <div className="font-display text-2xl tabular-nums">{fmt(seconds)}</div>
                    <div className="text-xs text-muted-foreground">
                      {state === "dialing" ? "Ringing…" : state === "connected" ? (held ? "On hold" : "Connected") : "Ended"}
                    </div>
                  </div>
                </div>

                {active ? (
                  <div className="grid grid-cols-4 gap-2">
                    <ControlButton
                      label={muted ? "Unmute" : "Mute"}
                      icon={muted ? MicOff : Mic}
                      active={muted}
                      onClick={() => setMuted((m) => !m)}
                    />
                    <ControlButton
                      label={held ? "Resume" : "Hold"}
                      icon={held ? Play : Pause}
                      active={held}
                      onClick={() => setHeld((h) => !h)}
                    />
                    <ControlButton label="Transfer" icon={ArrowRightLeft} onClick={() => setTransferOpen(true)} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex h-16 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card text-xs transition-colors hover:bg-muted">
                          <ChevronDown className="size-4" />
                          More
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Call options</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setRecording((r) => !r)}>
                          {recording ? "Pause recording" : "Resume recording"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast("Conference invite sent to Bilal Khan")}>
                          <Users className="mr-2 size-4" /> Add to conference
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast.warning("Escalated to supervisor")}>
                          <Flag className="mr-2 size-4" /> Escalate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="destructive" className="col-span-4 h-12 rounded-xl" onClick={endCall}>
                      <PhoneOff className="mr-2 size-4" />
                      End call
                    </Button>
                    <div className="col-span-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span className={cn("size-2 rounded-full", recording ? "animate-pulse bg-rose-500" : "bg-muted-foreground")} />
                      {recording ? "Recording" : "Recording paused"} · Live transcription on
                    </div>
                  </div>
                ) : null}

                {state === "ended" ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Call outcome</Label>
                      <div className="flex flex-wrap gap-2">
                        {callOutcomes.map((o) => (
                          <button
                            key={o}
                            onClick={() => setOutcome(o)}
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                              outcome === o
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card hover:bg-muted",
                            )}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={saveWrapUp} disabled={!outcome}>
                        Save
                      </Button>
                      <Button variant="ghost" onClick={reset}>
                        <X className="mr-2 size-4" />
                        Close
                      </Button>
                    </div>
                    {nextLead ? (
                      <button
                        disabled={!outcome}
                        onClick={() => startCall({ lead: nextLead, segment: segmentName ?? undefined })}
                        className="flex w-full items-center justify-between rounded-xl border border-border bg-muted/40 p-3 text-left transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Next in {segmentName}
                          </div>
                          <div className="text-sm font-medium">{nextLead.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {nextLead.company} · {nextLead.phone}
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                          Next call <ArrowRight className="size-4" />
                        </span>
                      </button>
                    ) : segmentName ? (
                      <p className="text-center text-xs text-muted-foreground">End of {segmentName}. Nice work.</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* ------------------------------------------------ Right column */}
        <Card className="flex min-h-[640px] flex-col overflow-hidden">
          {!inSession ? (
            <CardContent className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
                <PhoneCall className="size-5 text-muted-foreground" />
              </div>
              <div className="font-display font-semibold">No context for now</div>
              <p className="max-w-[220px] text-sm text-muted-foreground">
                Script, notes and quick actions will appear here once a call connects.
              </p>
            </CardContent>
          ) : (
            <CardContent className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
              {/* Script */}
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <FileText className="size-3.5" /> Script
                  </h3>
                  <Badge variant="secondary" className="font-normal">
                    {dialerScript.title}
                  </Badge>
                </div>
                <ol className="space-y-1.5">
                  {dialerScript.steps.map((s, i) => {
                    const done = transcript.length > i * 1.5;
                    return (
                      <li key={s} className={cn("flex gap-2 text-sm", done ? "text-muted-foreground line-through" : "")}>
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    );
                  })}
                </ol>
              </section>

              <Separator />

              {/* Notes */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <MessageSquare className="size-3.5" /> Notes
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => addNote(summary || "Lead engaged; follow up with the comparison.", "AI Copilot")}
                  >
                    <Sparkles className="mr-1 size-3.5" /> AI note
                  </Button>
                </div>
                <Textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Type a note…"
                  className="min-h-[70px] resize-none"
                />
                <div className="flex justify-end">
                  <Button size="sm" variant="secondary" disabled={!noteDraft.trim()} onClick={() => addNote(noteDraft)}>
                    Add note
                  </Button>
                </div>
                {notes.length > 0 ? (
                  <ul className="space-y-2">
                    {notes.map((n) => (
                      <li key={n.id} className="rounded-lg border border-border bg-muted/30 p-2.5 text-sm">
                        <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{n.who}</div>
                        {n.text}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>

              <Separator />

              {/* Actions */}
              <section className="space-y-2">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <ListChecks className="size-3.5" /> Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {!knownLead ? (
                    <ActionButton icon={UserPlus} label="Add as new lead" onClick={() => setNewLeadOpen(true)} />
                  ) : null}
                  <ActionButton icon={CalendarClock} label="Schedule follow-up" onClick={() => setFollowUpOpen(true)} />
                  <ActionButton icon={MessageSquare} label="Send SMS" onClick={() => setSmsOpen(true)} />
                  <ActionButton icon={ListChecks} label="Create task" onClick={() => toast.success("Task created for you")} />
                  <ActionButton icon={Ticket} label="Create ticket" onClick={() => toast.success("Ticket #4822 opened")} />
                  <ActionButton icon={Flag} label="Escalate" tone="warn" onClick={() => toast.warning("Supervisor notified")} />
                </div>
              </section>
            </CardContent>
          )}
        </Card>
      </div>

      {/* --------------------------------------------------- Modals */}
      <RecordFormModal
        open={transferOpen}
        onOpenChange={setTransferOpen}
        title="Transfer call"
        description="Hand the caller over to another agent or queue."
        mode="edit"
        submitLabel="Transfer"
        onSubmit={() => {
          toast.success(`${transferMode === "warm" ? "Warm" : "Blind"} transfer to ${transferTarget}`);
          if (transferMode === "blind") endCall();
        }}
      >
        <RadioGroup value={transferMode} onValueChange={(v) => setTransferMode(v as "blind" | "warm")} className="grid grid-cols-2 gap-2">
          {(
            [
              ["warm", "Warm transfer", "Speak to the target first, then connect."],
              ["blind", "Blind transfer", "Connect immediately and leave the call."],
            ] as const
          ).map(([v, t, d]) => (
            <Label
              key={v}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-xl border p-3",
                transferMode === v ? "border-primary bg-primary-soft/40" : "border-border",
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <RadioGroupItem value={v} /> {t}
              </span>
              <span className="text-xs font-normal text-muted-foreground">{d}</span>
            </Label>
          ))}
        </RadioGroup>
        <div className="space-y-2">
          <Label>Transfer to</Label>
          <Select value={transferTarget} onValueChange={setTransferTarget}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {transferTargets.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </RecordFormModal>

      <RecordFormModal
        open={smsOpen}
        onOpenChange={setSmsOpen}
        title="Send SMS"
        description={`To ${knownLead?.name ?? number}`}
        mode="edit"
        submitLabel="Send"
        onSubmit={() => {
          toast.success("SMS sent");
          setSms("");
        }}
      >
        <Textarea value={sms} onChange={(e) => setSms(e.target.value)} placeholder="Hi {{LeadName}}, here is the comparison we discussed…" className="min-h-[120px]" />
      </RecordFormModal>

      <RecordFormModal
        open={followUpOpen}
        onOpenChange={setFollowUpOpen}
        title="Schedule follow-up"
        description="Creates a callback reminder on your calendar."
        mode="edit"
        submitLabel="Schedule"
        onSubmit={() => toast.success("Follow-up scheduled", { description: followUp.when || "Thursday, 3:00 pm" })}
      >
        <div className="space-y-2">
          <Label>When</Label>
          <Input type="datetime-local" value={followUp.when} onChange={(e) => setFollowUp((f) => ({ ...f, when: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Note</Label>
          <Textarea value={followUp.note} onChange={(e) => setFollowUp((f) => ({ ...f, note: e.target.value }))} placeholder="What should the callback cover?" />
        </div>
      </RecordFormModal>

      <RecordFormModal
        open={newLeadOpen}
        onOpenChange={setNewLeadOpen}
        title="Add as new lead"
        description={`${number} isn't in any segment or data list yet.`}
        onSubmit={() => toast.success(`${newLead.name || "Lead"} added to ${newLead.segment}`)}
        onSaveDraft={() => toast("Lead saved as draft")}
      >
        <div className="space-y-2">
          <Label>Full name</Label>
          <Input value={newLead.name} onChange={(e) => setNewLead((l) => ({ ...l, name: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={number} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input value={newLead.company} onChange={(e) => setNewLead((l) => ({ ...l, company: e.target.value }))} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Segment</Label>
          <Select value={newLead.segment} onValueChange={(v) => setNewLead((l) => ({ ...l, segment: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {segmentSeed.map((s) => (
                <SelectItem key={s.id} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </RecordFormModal>

      {/* --------------------------------------------------- Lead drawer */}
      <DetailDrawer
        open={leadDrawerOpen}
        onOpenChange={setLeadDrawerOpen}
        title={knownLead?.name ?? "Unknown caller"}
        description={knownLead ? `${knownLead.company} · ${knownLead.phone}` : number}
      >
        {knownLead ? (
          <Tabs defaultValue="details" className="mt-2">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="calls">Calls</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <FieldRow label="Email" value={knownLead.email} />
              <FieldRow label="Stage" value={<Badge variant="secondary">{knownLead.stage}</Badge>} />
              <FieldRow label="Status" value={knownLead.status} />
              <FieldRow label="Owner" value={knownLead.owner} />
              <FieldRow label="Campaign" value={knownLead.campaign} />
              <FieldRow label="Segments" value={knownLead.segments.join(", ")} />
              <FieldRow
                label="Tags"
                value={
                  <span className="flex flex-wrap justify-end gap-1">
                    {knownLead.tags.map((t) => (
                      <Badge key={t} variant="outline">
                        {t}
                      </Badge>
                    ))}
                  </span>
                }
              />
              <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3 text-sm">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</div>
                {knownLead.notes}
              </div>
            </TabsContent>
            <TabsContent value="timeline" className="mt-4 space-y-3">
              {knownLead.timeline.map((t) => (
                <div key={t.id} className="flex gap-3 text-sm">
                  <span className="w-24 shrink-0 text-xs text-muted-foreground">{t.when}</span>
                  <span>{t.text}</span>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="calls" className="mt-4 space-y-3">
              {knownLead.calls.map((c) => (
                <div key={c.id} className="rounded-xl border border-border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.outcome}</span>
                    <span className="text-xs text-muted-foreground">
                      {c.when} · {c.duration}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{c.agent}</div>
                  <p className="mt-2 text-muted-foreground">{c.transcript}</p>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="ai" className="mt-4">
              <div className="rounded-xl border border-accent/40 bg-accent-soft/60 p-3 text-sm">{knownLead.aiSummary}</div>
            </TabsContent>
          </Tabs>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            This number isn't linked to a lead yet. Use "Add as new lead" from the call context panel.
          </p>
        )}
      </DetailDrawer>
    </div>
  );
}

function ControlButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-16 flex-col items-center justify-center gap-1 rounded-xl border text-xs transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function ActionButton({
  icon: Icon,
  label,
  tone,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone?: "warn";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted",
        tone === "warn" && "text-destructive hover:bg-destructive/10",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="leading-tight">{label}</span>
    </button>
  );
}

export { crmCampaigns };
