import * as React from "react";
import { LayoutTemplate, Loader2, Paperclip, RefreshCw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { templateSeed } from "@/data/crm";
import { aiEmailDraft, aiSmsSuggestions, type Attachment } from "@/data/inbox";
import { cn } from "@/lib/utils";
import { fillTemplate, filesToAttachments } from "./shared";

type Channel = "SMS" | "Email";

export type TemplateValues = Parameters<typeof fillTemplate>[1];

function ToolButton({
  label,
  icon: Icon,
  compact,
  ...props
}: React.ComponentProps<typeof Button> & {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  compact?: boolean | undefined;
}) {
  const button = (
    <Button variant="ghost" size="sm" className={cn("gap-1.5 text-muted-foreground", compact && "px-2")} {...props}>
      <Icon className="size-4" />
      {compact ? <span className="sr-only">{label}</span> : <span>{label}</span>}
    </Button>
  );
  if (!compact) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/** Pick a saved template for the channel; variables are filled from the conversation. */
export function TemplatePicker({
  channel,
  values,
  onPick,
  compact,
}: {
  channel: Channel;
  values: TemplateValues;
  onPick: (t: { subject: string; body: string; name: string }) => void;
  compact?: boolean | undefined;
}) {
  const templates = templateSeed.filter((t) => t.channel === channel);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolButton label="Templates" icon={LayoutTemplate} compact={compact} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>{channel} templates</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {templates.length === 0 ? (
          <div className="px-2 py-3 text-xs text-muted-foreground">No templates for this channel yet.</div>
        ) : (
          templates.map((t) => (
            <DropdownMenuItem
              key={t.id}
              className="flex-col items-start gap-0.5"
              onSelect={() =>
                onPick({
                  name: t.name,
                  subject: fillTemplate(t.subject, values),
                  body: fillTemplate(t.body, values),
                })
              }
            >
              <span className="text-sm font-medium">{t.name}</span>
              <span className="line-clamp-1 text-xs text-muted-foreground">{t.body}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** AI reply suggestions. Simulates a short generation delay, then offers drafts. */
export function AiDraftPopover({
  channel,
  values,
  onPick,
  compact,
  context,
}: {
  channel: Channel;
  values: TemplateValues;
  onPick: (text: string) => void;
  compact?: boolean | undefined;
  /** Optional last inbound message used to label the suggestions. */
  context?: string | undefined;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [round, setRound] = React.useState(0);

  const suggestions = React.useMemo(() => {
    if (channel === "Email") return [fillTemplate(aiEmailDraft, values)];
    const rotated = [...aiSmsSuggestions.slice(round % 3), ...aiSmsSuggestions.slice(0, round % 3)];
    return rotated;
  }, [channel, values, round]);

  const generate = React.useCallback(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;
    return generate();
  }, [open, generate]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ToolButton label="AI Draft" icon={Sparkles} compact={compact} className={cn(compact && "px-2", "text-accent-foreground")} />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[22rem] p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-accent" />
            AI reply suggestions
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs"
            onClick={() => {
              setRound((r) => r + 1);
              generate();
            }}
          >
            <RefreshCw className="size-3" />
            Regenerate
          </Button>
        </div>
        {context ? (
          <p className="line-clamp-2 border-b border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            Replying to: “{context}”
          </p>
        ) : null}
        <div className="max-h-72 space-y-2 overflow-y-auto p-3">
          {loading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Drafting {channel === "Email" ? "an email" : "replies"} from the conversation…
            </div>
          ) : (
            suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onPick(s);
                  setOpen(false);
                }}
                className="w-full rounded-xl border border-border bg-card p-3 text-left text-sm leading-relaxed transition-colors hover:border-accent/60 hover:bg-accent-soft/40"
              >
                <span className="line-clamp-4 whitespace-pre-line">{s}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function AttachButton({
  onFiles,
  compact,
}: {
  onFiles: (files: Attachment[]) => void;
  compact?: boolean | undefined;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          onFiles(filesToAttachments(e.target.files));
          e.target.value = "";
        }}
      />
      <ToolButton label="Attach" icon={Paperclip} compact={compact} onClick={() => ref.current?.click()} />
    </>
  );
}
