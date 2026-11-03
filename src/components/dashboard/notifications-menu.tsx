import * as React from "react";
import { ArrowRight, Bell, CheckCheck, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  kindMeta,
  kindOrder,
  NotificationCenterDrawer,
} from "@/components/dashboard/notification-center";
import {
  useShell,
  type AlertKind,
  type ShellNotification,
} from "@/components/dashboard/shell-context";

/** Bell dropdown: a compact preview of the Notification Center. */
export function NotificationsMenu() {
  const {
    notifications,
    counts,
    totalUnread,
    markAllRead,
    markRead,
    dismiss,
    notificationCenterOpen,
    setNotificationCenterOpen,
  } = useShell();
  const [tab, setTab] = React.useState<AlertKind>("notification");
  const [menuOpen, setMenuOpen] = React.useState(false);

  const items = notifications.filter((n) => n.kind === tab).slice(0, 5);

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="size-5" />
            {totalUnread > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {totalUnread}
              </span>
            ) : null}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-96 p-0">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Notification center</p>
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
              <CheckCheck className="mr-1 size-3.5" />
              Mark all read
            </Button>
          </div>

          <div className="flex items-center gap-1 border-b border-border px-2 py-2">
            {kindOrder.map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => setTab(kind)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                  tab === kind
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60",
                )}
              >
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
              </button>
            ))}
          </div>

          <ScrollArea className="max-h-80">
            <div className="divide-y divide-border">
              {items.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No {kindMeta[tab].label.toLowerCase()} right now.
                </p>
              ) : (
                items.map((item) => (
                  <Row
                    key={item.id}
                    item={item}
                    onRead={() => markRead(item.id)}
                    onDismiss={() => dismiss(item.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border p-2">
            <Button
              variant="ghost"
              className="w-full justify-center text-xs"
              onClick={() => {
                setMenuOpen(false);
                setNotificationCenterOpen(true);
              }}
            >
              View all
              <ArrowRight className="ml-1.5 size-3.5" />
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <NotificationCenterDrawer
        open={notificationCenterOpen}
        onOpenChange={setNotificationCenterOpen}
      />
    </>
  );
}

function Row({
  item,
  onRead,
  onDismiss,
}: {
  item: ShellNotification;
  onRead: () => void;
  onDismiss: () => void;
}) {
  const meta = kindMeta[item.kind];
  const Icon = meta.icon;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onRead}
      onKeyDown={(e) => e.key === "Enter" && onRead()}
      className="group flex w-full items-start gap-3 px-4 py-2.5 text-left hover:bg-muted/60"
    >
      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", item.read ? "bg-border" : meta.dot)} />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "flex items-center gap-1.5 text-sm",
            item.read ? "text-muted-foreground" : "font-medium text-foreground",
          )}
        >
          <Icon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{item.title}</span>
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.description}</p>
        <p className="mt-1 text-[11px] text-muted-foreground/80">
          {item.time}
          {item.related ? ` · ${item.related}` : ""}
        </p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        aria-label="Dismiss"
        className="rounded-md p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-muted"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
