import * as React from "react";
import {
  BadgeCheck,
  Bell,
  Clock,
  Hash,
  Layers,
  ListTree,
  Phone,
  PhoneForwarded,
  Route as RouteIcon,
  Users,
  Voicemail,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog, DetailDrawer } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import { callingCards, type CallingCard } from "@/data/settings";

const icons: Record<string, LucideIcon> = {
  Phone,
  Users,
  BadgeCheck,
  Route: RouteIcon,
  Clock,
  Voicemail,
  PhoneForwarded,
  Bell,
  Hash,
  ListTree,
  Layers,
};

const toneClass: Record<CallingCard["tone"], string> = {
  success: "border-primary/30 bg-primary/10 text-primary",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  muted: "border-border bg-muted text-muted-foreground",
};

export function CallingSettings() {
  const [active, setActive] = React.useState<CallingCard | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [recording, setRecording] = React.useState(true);

  const openCard = (card: CallingCard) => {
    setActive(card);
    setEditing(false);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Calling"
        description="Everything that controls how calls enter, route through and leave this workspace."
        actions={
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2">
            <Label htmlFor="call-recording" className="text-sm text-muted-foreground">
              Call recording
            </Label>
            <Switch
              id="call-recording"
              checked={recording}
              onCheckedChange={(v) => {
                setRecording(v);
                toast.success(`Call recording ${v ? "enabled" : "disabled"}`);
              }}
            />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {callingCards.map((card) => {
          const Icon = icons[card.icon] ?? Phone;
          return (
            <Card
              key={card.id}
              role="button"
              tabIndex={0}
              onClick={() => openCard(card)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openCard(card);
                }
              }}
              className="cursor-pointer transition-colors hover:border-primary/40"
            >
              <CardHeader className="gap-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted">
                    <Icon className="size-5 text-primary" />
                  </span>
                  <Badge variant="outline" className={toneClass[card.tone]}>
                    {card.status}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="font-display text-base">{card.title}</CardTitle>
                  <CardDescription className="mt-1">{card.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="space-y-1">
                  {card.summary.slice(0, 3).map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
                      <dt className="truncate text-muted-foreground">{row.label}</dt>
                      <dd className="shrink-0 font-medium">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <DetailDrawer
        open={active !== null}
        onOpenChange={(v) => {
          if (!v) {
            setActive(null);
            setEditing(false);
          }
        }}
        title={active?.title ?? ""}
        description={active?.description ?? ""}
        footer={
          editing ? (
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={() => setConfirming(true)}>Save changes</Button>
            </div>
          ) : (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActive(null)}>
                Close
              </Button>
              <Button onClick={() => setEditing(true)}>Edit configuration</Button>
            </div>
          )
        }
      >
        {active ? (
          <div className="space-y-4 pt-2">
            <Badge variant="outline" className={toneClass[active.tone]}>
              {active.status}
            </Badge>
            <div className="rounded-xl border border-border bg-card px-4">
              {active.summary.map((row) =>
                editing ? (
                  <div key={row.label} className="space-y-2 border-b border-border/60 py-3 last:border-0">
                    <Label htmlFor={`${active.id}-${row.label}`} className="text-xs text-muted-foreground">
                      {row.label}
                    </Label>
                    <Input id={`${active.id}-${row.label}`} defaultValue={row.value} />
                  </div>
                ) : (
                  <FieldRow key={row.label} label={row.label} value={row.value} />
                ),
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Changes apply to every agent in this workspace as soon as they are saved.
            </p>
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Save calling configuration?"
        description="These settings affect live call handling for the whole workspace."
        confirmLabel="Save"
        onConfirm={() => {
          setConfirming(false);
          setEditing(false);
          toast.success(`${active?.title ?? "Configuration"} updated`);
        }}
      />
    </div>
  );
}
