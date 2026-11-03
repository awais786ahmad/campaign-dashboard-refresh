import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  BellRing,
  CalendarClock,
  Check,
  CheckCheck,
  Inbox,
  TriangleAlert,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useRightDrawerRegistration,
  useShell,
  type AlertKind,
  type ShellNotification,
} from "@/components/dashboard/shell-context";

export const kindMeta: Record<
  AlertKind,
  { label: string; dot: string; badge: string; tint: string; icon: typeof Bell }
> = {
  notification: {
    label: "Notifications",
    dot: "bg-primary",
    badge: "bg-primary text-primary-foreground",
    tint: "border-primary/30 bg-primary/10 text-primary",
    icon: BellRing,
  },
  alert: {
    label: "Alerts",
    dot: "bg-destructive",
    badge: "bg-destructive text-destructive-foreground",
    tint: "border-destructive/30 bg-destructive/10 text-destructive",
    icon: TriangleAlert,
  },
  reminder: {
    label: "Reminders",
    dot: "bg-accent",
    badge: "bg-accent text-accent-foreground",
    tint: "border-border bg-muted text-foreground",
    icon: CalendarClock,
  },
};

export const kindOrder: AlertKind[] = ["notification", "alert", "reminder"];

/**
 * Notification Center drawer — read-only. Items are produced by the Automation
 * engine; users only view, act on and dismiss them here.
 */
export function NotificationCenterDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { notifications, counts, markAllRead, markRead, dismiss, dismissKind } = useShell();
  const [tab, setTab] = React.useState<AlertKind>("notification");
  useRightDrawerRegistration(open);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Notification center</SheetTitle>
          <SheetDescription>
            Everything that needs your attention. Items are generated automatically by system
            events and automations.
          </SheetDescription>
        </SheetHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as AlertKind)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-4">
            <TabsList>
              {kindOrder.map((kind) => (
                <TabsTrigger key={kind} value={kind} className="gap-1.5">
                  {kindMeta[kind].label}
                  {counts[kind] > 0 ? (
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[10px] font-semibold",
                        kindMeta[kind].badge,
                      )}
                    >
                      {counts[kind]}
                    </span>
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-xs" onClick={markAllRead}>
                <CheckCheck className="mr-1 size-3.5" />
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-destructive"
                onClick={() => dismissKind(tab)}
              >
                Clear
              </Button>
            </div>
          </div>

          {kindOrder.map((kind) => {
            const items = notifications.filter((n) => n.kind === kind);
            return (
              <TabsContent key={kind} value={kind} className="min-h-0 flex-1">
                <ScrollArea className="h-full">
                  <div className="space-y-3 px-4 pt-3 pb-6">
                    {items.length === 0 ? (
                      <EmptyState label={kindMeta[kind].label} />
                    ) : (
                      items.map((item) => (
                        <NotificationCard
                          key={item.id}
                          item={item}
                          onRead={() => markRead(item.id)}
                          onDismiss={() => dismiss(item.id)}
                          onNavigate={() => onOpenChange(false)}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            );
          })}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
      <Inbox className="size-6 text-muted-foreground" />
      <p className="text-sm font-medium">No {label.toLowerCase()}</p>
      <p className="max-w-xs text-xs text-muted-foreground">
        You are all caught up. New items arrive automatically from system events and automations.
      </p>
    </div>
  );
}

function NotificationCard({
  item,
  onRead,
  onDismiss,
  onNavigate,
}: {
  item: ShellNotification;
  onRead: () => void;
  onDismiss: () => void;
  onNavigate: () => void;
}) {
  const meta = kindMeta[item.kind];
  const Icon = meta.icon;

  return (
    <article
      className={cn(
        "group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40",
        !item.read && "border-l-2",
        !item.read && item.kind === "alert" ? "border-l-destructive" : undefined,
        !item.read && item.kind !== "alert" ? "border-l-primary" : undefined,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg border",
            meta.tint,
          )}
        >
          <Icon className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "truncate text-sm",
                item.read ? "text-muted-foreground" : "font-semibold text-foreground",
              )}
            >
              {item.title}
            </p>
            <button
              type="button"
              onClick={onDismiss}
              aria-label={`Dismiss ${item.title}`}
              className="rounded-md p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-muted"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span>{item.time}</span>
            {item.status ? (
              <>
                <span aria-hidden>·</span>
                <Badge variant={item.kind === "alert" ? "destructive" : "secondary"}>
                  {item.status}
                </Badge>
              </>
            ) : null}
            {item.category ? <Badge variant="outline">{item.category}</Badge> : null}
            {item.related ? (
              <>
                <span aria-hidden>·</span>
                <span className="truncate">{item.related}</span>
              </>
            ) : null}
          </div>

          {item.actions && item.actions.length > 0 ? (
            <>
              <Separator className="my-3" />
              <div className="flex flex-wrap items-center gap-2">
                {item.actions.map((action, i) =>
                  action.to ? (
                    <Button key={action.label} size="sm" variant={i === 0 ? "secondary" : "outline"} asChild>
                      <Link
                        to={action.to}
                        onClick={() => {
                          onRead();
                          onNavigate();
                        }}
                      >
                        {action.label}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      key={action.label}
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onRead();
                        toast.success(`${action.label} — ${item.related ?? item.title}`);
                      }}
                    >
                      {action.label}
                    </Button>
                  ),
                )}
                {!item.read ? (
                  <Button size="sm" variant="ghost" className="text-xs" onClick={onRead}>
                    <Check className="mr-1 size-3.5" />
                    Mark read
                  </Button>
                ) : null}
                <Button size="sm" variant="ghost" className="text-xs text-destructive" onClick={onDismiss}>
                  Dismiss
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
