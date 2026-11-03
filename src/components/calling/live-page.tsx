import * as React from "react";
import {
  Activity,
  ArrowRightLeft,
  Bot,
  Ear,
  Flag,
  Headphones,
  MessageSquare,
  Mic,
  PhoneCall,
  PhoneOff,
  Search,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog, DetailDrawer } from "@/components/dashboard/crud";
import { cn } from "@/lib/utils";
import {
  aiSuggestionPool,
  liveAgentSeed,
  liveCallSeed,
  sentimentTone,
  transferTargets,
  waitingCallSeed,
  type LiveCall,
} from "@/data/calling";

const statusTone: Record<LiveCall["status"], string> = {
  Talking: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  "On hold": "bg-amber-500/15 text-amber-600 border-amber-500/30",
  Escalated: "bg-rose-500/15 text-rose-600 border-rose-500/30",
  Transferring: "bg-sky-500/15 text-sky-600 border-sky-500/30",
};

const agentStatusTone: Record<string, string> = {
  "On call": "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  Available: "bg-sky-500/15 text-sky-600 border-sky-500/30",
  "Wrap-up": "bg-amber-500/15 text-amber-600 border-amber-500/30",
  Break: "bg-muted text-muted-foreground border-border",
};

export function LivePage() {
  const [calls, setCalls] = React.useState<LiveCall[]>(liveCallSeed);
  const [query, setQuery] = React.useState("");
  const [agentFilter, setAgentFilter] = React.useState("All");
  const [sentimentFilter, setSentimentFilter] = React.useState("All");
  const [active, setActive] = React.useState<LiveCall | null>(null);
  const [mode, setMode] = React.useState<"none" | "listen" | "whisper" | "barge">("none");
  const [ending, setEnding] = React.useState<LiveCall | null>(null);

  const filtered = calls.filter(
    (c) =>
      (agentFilter === "All" || c.agentType === agentFilter) &&
      (sentimentFilter === "All" || c.sentiment === sentimentFilter) &&
      (c.lead.toLowerCase().includes(query.toLowerCase()) ||
        c.agent.toLowerCase().includes(query.toLowerCase()) ||
        c.campaign.toLowerCase().includes(query.toLowerCase())),
  );

  const openCall = (call: LiveCall) => {
    setActive(call);
    setMode("none");
  };

  const endCall = (call: LiveCall) => {
    setCalls((l) => l.filter((c) => c.id !== call.id));
    setActive((a) => (a && a.id === call.id ? null : a));
    toast.error(`Call with ${call.lead} ended`);
  };

  const negative = calls.filter((c) => c.sentiment === "Negative").length;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Live calls</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor active calls, whisper and barge in real time.
          </p>
        </div>
        <Badge variant="outline" className="gap-2 px-3 py-1.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Live monitoring
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={PhoneCall} label="Active calls" value={String(calls.length)} />
        <Stat icon={Users} label="Waiting in queue" value={String(waitingCallSeed.length)} />
        <Stat
          icon={Bot}
          label="AI agents on call"
          value={String(calls.filter((c) => c.agentType === "AI").length)}
        />
        <Stat icon={Flag} label="Negative sentiment" value={String(negative)} tone="warn" />
      </div>

      <Tabs defaultValue="calls">
        <TabsList>
          <TabsTrigger value="calls">Active calls</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="calls" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-56 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lead, agent or campaign"
                className="pl-9"
              />
            </div>
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["All", "Human", "AI"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v === "All" ? "All agents" : `${v} agents`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
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

          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((call) => (
              <Card key={call.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                  <div className="min-w-0">
                    <CardTitle className="font-display truncate text-base">{call.lead}</CardTitle>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {call.number} · {call.campaign}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("shrink-0", statusTone[call.status])}>
                    {call.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
                      {call.agentType === "AI" ? <Bot className="size-3.5" /> : <User className="size-3.5" />}
                      {call.agent}
                    </span>
                    <Badge variant="outline" className={sentimentTone[call.sentiment]}>
                      {call.sentiment}
                    </Badge>
                    <span className="ml-auto font-mono text-muted-foreground">{call.duration}</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{call.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => openCall(call)}>
                      <Headphones className="mr-2 size-4" />
                      Monitor
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openCall(call)}>
                      <MessageSquare className="mr-2 size-4" />
                      Transcript
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEnding(call)}>
                      <PhoneOff className="mr-2 size-4 text-destructive" />
                      End
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 ? (
              <Card className="border-dashed lg:col-span-2">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No active calls match these filters.
                </CardContent>
              </Card>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="queue" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Caller</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Waiting</TableHead>
                    <TableHead>Assigned to</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitingCallSeed.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell>
                        <p className="font-medium">{w.caller}</p>
                        <p className="text-xs text-muted-foreground">{w.number}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{w.campaign}</TableCell>
                      <TableCell className="text-muted-foreground">{w.reason}</TableCell>
                      <TableCell className="font-mono">{w.waiting}</TableCell>
                      <TableCell className="text-muted-foreground">{w.assignedTo}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast.success(`Connecting ${w.caller}`)}
                        >
                          Pick up
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Calls today</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveAgentSeed.map((a) => {
                    const call = calls.find((c) => c.id === a.callId);
                    return (
                      <TableRow key={a.id}>
                        <TableCell>
                          <span className="flex items-center gap-2 font-medium">
                            {a.type === "AI" ? <Bot className="size-4" /> : <User className="size-4" />}
                            {a.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{a.team}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={agentStatusTone[a.status]}>
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{a.callsToday}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!call}
                            onClick={() => call && openCall(call)}
                          >
                            Monitor
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DetailDrawer
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        title={active ? `Live call — ${active.lead}` : ""}
        description={active ? `${active.agent} · ${active.campaign} · ${active.duration}` : ""}
        footer={
          active ? (
            <div className="flex flex-wrap gap-2">
              <MonitorButton
                icon={Ear}
                label="Listen"
                active={mode === "listen"}
                onClick={() => {
                  setMode(mode === "listen" ? "none" : "listen");
                  toast.info(mode === "listen" ? "Stopped listening" : "Listening in silently");
                }}
              />
              <MonitorButton
                icon={Mic}
                label="Whisper"
                active={mode === "whisper"}
                onClick={() => {
                  setMode(mode === "whisper" ? "none" : "whisper");
                  toast.info(mode === "whisper" ? "Whisper ended" : "Whispering to agent only");
                }}
              />
              <MonitorButton
                icon={PhoneCall}
                label="Barge in"
                active={mode === "barge"}
                onClick={() => {
                  setMode(mode === "barge" ? "none" : "barge");
                  toast.info(mode === "barge" ? "Left the call" : "You joined the call");
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Transfer requested")}
                className="ml-auto"
              >
                <ArrowRightLeft className="mr-2 size-4" />
                Transfer
              </Button>
              <Button variant="ghost" size="sm" onClick={() => active && setEnding(active)}>
                <PhoneOff className="mr-2 size-4 text-destructive" />
                End call
              </Button>
            </div>
          ) : null
        }
      >
        {active ? (
          <div className="space-y-5 pt-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Lead" value={active.lead} />
              <Info label="Number" value={active.number} />
              <Info label="Agent" value={active.agent} />
              <Info label="Campaign" value={active.campaign} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={statusTone[active.status]}>
                {active.status}
              </Badge>
              <Badge variant="outline" className={sentimentTone[active.sentiment]}>
                {active.sentiment} sentiment
              </Badge>
              {active.recording ? (
                <Badge variant="outline" className="gap-1.5">
                  <span className="size-2 rounded-full bg-destructive" />
                  Recording
                </Badge>
              ) : null}
              {mode !== "none" ? <Badge>{`Supervisor: ${mode}`}</Badge> : null}
            </div>

            <Separator />

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="size-4" /> Live transcript
              </h3>
              <div className="space-y-2">
                {active.transcript.map((line, i) => (
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
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-4" /> AI insights
              </h3>
              <div className="rounded-xl border border-border bg-card p-4 text-sm">
                <p className="text-muted-foreground">Summary</p>
                <p className="mt-1">{active.summary}</p>
              </div>
              <ul className="space-y-2">
                {aiSuggestionPool.slice(0, 3).map((s) => (
                  <li key={s} className="rounded-xl border border-dashed border-border p-3 text-sm">
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-medium">Transfer to</h3>
              <div className="flex flex-wrap gap-2">
                {transferTargets.map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Transferring to ${t}`)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        open={!!ending}
        onOpenChange={(v) => !v && setEnding(null)}
        title="End this call?"
        description="The call will be disconnected and moved to call history."
        confirmLabel="End call"
        destructive
        onConfirm={() => {
          if (ending) endCall(ending);
          setEnding(null);
        }}
      />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "warn";
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-5">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-xl border border-border bg-muted/50",
            tone === "warn" && "text-destructive",
          )}
        >
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-display text-xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
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

function MonitorButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button size="sm" variant={active ? "default" : "outline"} onClick={onClick}>
      <Icon className="mr-2 size-4" />
      {label}
    </Button>
  );
}

export { Activity };
