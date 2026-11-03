import * as React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bot,
  Download,
  FileText,
  Pause,
  Play,
  Search,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailDrawer } from "@/components/dashboard/crud";
import { cn } from "@/lib/utils";
import { callOutcomes, historySeed, qaCriteria, sentimentTone, type HistoryCall } from "@/data/calling";

export function HistoryPage() {
  const [list, setList] = React.useState<HistoryCall[]>(historySeed);
  const [query, setQuery] = React.useState("");
  const [outcome, setOutcome] = React.useState("All");
  const [direction, setDirection] = React.useState("All");
  const [sentiment, setSentiment] = React.useState("All");
  const [active, setActive] = React.useState<HistoryCall | null>(null);

  const filtered = list.filter(
    (c) =>
      (outcome === "All" || c.outcome === outcome) &&
      (direction === "All" || c.direction === direction) &&
      (sentiment === "All" || c.sentiment === sentiment) &&
      (c.lead.toLowerCase().includes(query.toLowerCase()) ||
        c.agent.toLowerCase().includes(query.toLowerCase()) ||
        c.number.includes(query)),
  );

  const updateCall = (next: HistoryCall) => {
    setList((l) => l.map((c) => (c.id === next.id ? next : c)));
    setActive(next);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Call history</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Recordings, transcripts and outcomes for every call.
          </p>
        </div>
        <Button variant="outline" onClick={() => toast.success("Export queued — you'll get an email")}>
          <Download className="mr-2 size-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lead, agent or number"
            className="pl-9"
          />
        </div>
        <Select value={direction} onValueChange={setDirection}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "Outgoing", "Incoming"].map((v) => (
              <SelectItem key={v} value={v}>
                {v === "All" ? "All directions" : v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={outcome} onValueChange={setOutcome}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All outcomes</SelectItem>
            {callOutcomes.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sentiment} onValueChange={setSentiment}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "Positive", "Neutral", "Negative"].map((v) => (
              <SelectItem key={v} value={v}>
                {v === "All" ? "All sentiment" : v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead className="text-right">QA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setActive(c)}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{c.when}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2 font-medium">
                      {c.direction === "Outgoing" ? (
                        <ArrowUpRight className="size-4 text-muted-foreground" />
                      ) : (
                        <ArrowDownLeft className="size-4 text-muted-foreground" />
                      )}
                      {c.lead}
                    </span>
                    <p className="pl-6 text-xs text-muted-foreground">{c.number}</p>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {c.agentType === "AI" ? <Bot className="size-4" /> : <User className="size-4" />}
                      {c.agent}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.campaign}</TableCell>
                  <TableCell className="font-mono text-xs">{c.duration}</TableCell>
                  <TableCell>{c.outcome}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={sentimentTone[c.sentiment]}>
                      {c.sentiment}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {c.qaScored ? (
                      <span className="font-medium">{avg(c)}/5</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not scored</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    No calls match these filters.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DetailDrawer
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        title={active ? `${active.lead} — ${active.outcome}` : ""}
        description={active ? `${active.when} · ${active.agent} · ${active.duration}` : ""}
      >
        {active ? <CallDetail call={active} onChange={updateCall} /> : null}
      </DetailDrawer>
    </div>
  );
}

function avg(call: HistoryCall) {
  if (call.qa.length === 0) return "0.0";
  return (call.qa.reduce((s, q) => s + q.score, 0) / call.qa.length).toFixed(1);
}

function CallDetail({ call, onChange }: { call: HistoryCall; onChange: (c: HistoryCall) => void }) {
  const [note, setNote] = React.useState("");
  const [playing, setPlaying] = React.useState(false);
  const [scores, setScores] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(qaCriteria.map((c) => [c, call.qa.find((q) => q.criteria === c)?.score ?? 3])),
  );

  const addNote = () => {
    if (!note.trim()) {
      toast.error("Write a note first");
      return;
    }
    onChange({
      ...call,
      notes: [{ id: crypto.randomUUID(), who: "You", when: "just now", text: note.trim() }, ...call.notes],
    });
    setNote("");
    toast.success("Note added");
  };

  const saveQa = () => {
    onChange({
      ...call,
      qaScored: true,
      qa: qaCriteria.map((c) => ({ criteria: c, score: scores[c] ?? 3 })),
    });
    toast.success("QA score saved");
  };

  return (
    <Tabs defaultValue="details" className="pt-2">
      <TabsList className="w-full">
        <TabsTrigger value="details" className="flex-1">
          Details
        </TabsTrigger>
        <TabsTrigger value="transcript" className="flex-1">
          Transcript
        </TabsTrigger>
        <TabsTrigger value="recording" className="flex-1">
          Recording
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex-1">
          Notes
        </TabsTrigger>
        <TabsTrigger value="qa" className="flex-1">
          QA
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Info label="Lead" value={call.lead} />
          <Info label="Number" value={call.number} />
          <Info label="Agent" value={call.agent} />
          <Info label="Campaign" value={call.campaign} />
          <Info label="Direction" value={call.direction} />
          <Info label="Duration" value={call.duration} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={sentimentTone[call.sentiment]}>
            {call.sentiment}
          </Badge>
          {call.tags.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="size-4" /> AI summary
          </p>
          <p className="mt-2">{call.summary}</p>
        </div>
      </TabsContent>

      <TabsContent value="transcript" className="mt-4 space-y-2">
        {call.transcript.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No transcript available for this call.
          </p>
        ) : (
          call.transcript.map((line, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border border-border p-3 text-sm",
                line.speaker === "Agent" ? "bg-muted/50" : "bg-card",
              )}
            >
              <p className="text-xs font-medium text-muted-foreground">{line.speaker}</p>
              <p className="mt-1">{line.text}</p>
            </div>
          ))
        )}
      </TabsContent>

      <TabsContent value="recording" className="mt-4 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <Button size="icon" className="size-12 rounded-full" onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
            </Button>
            <div className="flex-1">
              <div className="flex h-10 items-end gap-0.5">
                {Array.from({ length: 48 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "flex-1 rounded-full bg-primary/30",
                      playing && "bg-primary/70",
                    )}
                    style={{ height: `${20 + ((i * 37) % 80)}%` }}
                  />
                ))}
              </div>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {playing ? "Playing" : "Paused"} · {call.duration}
              </p>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => toast.success("Recording download started")}>
          <Download className="mr-2 size-4" />
          Download recording
        </Button>
      </TabsContent>

      <TabsContent value="notes" className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="call-note">Add a note</Label>
          <Textarea
            id="call-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What happened on this call?"
          />
          <Button size="sm" onClick={addNote}>
            <FileText className="mr-2 size-4" />
            Add note
          </Button>
        </div>
        <Separator />
        <div className="space-y-3">
          {call.notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes yet.</p>
          ) : (
            call.notes.map((n) => (
              <div key={n.id} className="rounded-xl border border-border bg-card p-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  {n.who} · {n.when}
                </p>
                <p className="mt-1">{n.text}</p>
              </div>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="qa" className="mt-4 space-y-5">
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="size-4" /> Overall score
          </span>
          <span className="font-display text-xl font-semibold">
            {(
              qaCriteria.reduce((s, c) => s + (scores[c] ?? 0), 0) / qaCriteria.length
            ).toFixed(1)}
            /5
          </span>
        </div>
        {qaCriteria.map((c) => (
          <div key={c} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{c}</span>
              <span className="font-medium">{scores[c]}</span>
            </div>
            <Slider
              value={[scores[c] ?? 3]}
              min={1}
              max={5}
              step={1}
              onValueChange={([v]) => setScores((s) => ({ ...s, [c]: v ?? 3 }))}
            />
          </div>
        ))}
        <Button onClick={saveQa}>{call.qaScored ? "Update QA score" : "Save QA score"}</Button>
      </TabsContent>
    </Tabs>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
