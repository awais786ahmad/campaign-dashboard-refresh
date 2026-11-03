import * as React from "react";
import { History, Plus, Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRightDrawerRegistration, useShell } from "@/components/dashboard/shell-context";

type Message = { id: string; role: "user" | "agent"; text: string };

const previousConversations = [
  { id: "c1", title: "Summarise yesterday's calls", when: "Yesterday" },
  { id: "c2", title: "Draft follow-up template", when: "2 days ago" },
  { id: "c3", title: "Which leads went cold?", when: "Last week" },
];

const greeting: Message = {
  id: "greeting",
  role: "agent",
  text: "Hi! I can summarise calls, draft follow-ups, and pull up any record in your workspace. What do you need?",
};

export function CopilotLauncher() {
  const [open, setOpen] = React.useState(false);
  const { openRightDrawers } = useShell();
  useRightDrawerRegistration(open);

  const hidden = !open && openRightDrawers > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open AI copilot"
        className={cn(
          "fixed right-6 bottom-6 z-30 flex h-13 items-center gap-2 rounded-full bg-[image:var(--gradient-ink)] px-5 py-3.5 text-sm font-medium text-ink-foreground shadow-[var(--shadow-lift)] transition-all duration-200",
          hidden || open
            ? "pointer-events-none translate-y-3 opacity-0"
            : "translate-y-0 opacity-100 hover:brightness-110",
        )}
      >
        <Sparkles className="size-4 text-accent" />
        AI Copilot
      </button>

      <CopilotDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}

function CopilotDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [messages, setMessages] = React.useState<Message[]>([greeting]);
  const [draft, setDraft] = React.useState("");

  const send = () => {
    if (!draft.trim()) return;
    const text = draft.trim();
    setDraft("");
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "user", text },
      {
        id: crypto.randomUUID(),
        role: "agent",
        text: "Looking into that across your leads, calls, and campaigns…",
      },
    ]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 sm:max-w-lg">
        <SheetHeader className="flex-row items-center justify-between border-b border-border pr-12">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-accent" />
            AI Copilot
          </SheetTitle>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Previous conversations">
                  <History className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Previous conversations</DropdownMenuLabel>
                {previousConversations.map((c) => (
                  <DropdownMenuItem key={c.id} className="flex-col items-start gap-0.5">
                    <span className="text-sm">{c.title}</span>
                    <span className="text-xs text-muted-foreground">{c.when}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              aria-label="New conversation"
              onClick={() => setMessages([greeting])}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-3 p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {m.text}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2 border-t border-border p-4">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask the copilot…"
          />
          <Button size="icon" onClick={send} aria-label="Send message">
            <Send className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
