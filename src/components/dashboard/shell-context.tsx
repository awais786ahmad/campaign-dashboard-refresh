import * as React from "react";
import { toast } from "sonner";

import {
  notificationSeed,
  type AlertKind,
  type NotificationAction,
  type NotificationCategory,
  type ShellNotification,
} from "@/data/notifications";

export type { AlertKind, NotificationAction, NotificationCategory, ShellNotification };

type ShellContextValue = {
  sidebarPinned: boolean;
  setSidebarPinned: (v: boolean) => void;
  openRightDrawers: number;
  registerRightDrawer: (open: boolean) => void;
  notifications: ShellNotification[];
  counts: Record<AlertKind, number>;
  totalUnread: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  dismiss: (id: string) => void;
  dismissKind: (kind: AlertKind) => void;
  push: (n: Omit<ShellNotification, "id" | "time" | "read">) => void;
  /** Notification Center drawer, opened from "View all" in the bell dropdown. */
  notificationCenterOpen: boolean;
  setNotificationCenterOpen: (open: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const ShellContext = React.createContext<ShellContextValue | null>(null);

export function useShell() {
  const ctx = React.useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within DashboardShellProvider");
  return ctx;
}

/** Registers an open right-side drawer so the copilot button hides while it is visible. */
export function useRightDrawerRegistration(open: boolean) {
  const { registerRightDrawer } = useShell();
  React.useEffect(() => {
    if (!open) return;
    registerRightDrawer(true);
    return () => registerRightDrawer(false);
  }, [open, registerRightDrawer]);
}

export function fireAlertToast(n: Pick<ShellNotification, "title" | "description">) {
  toast.warning(n.title, { description: n.description, duration: 10_000 });
}

export function fireReminderToast(n: Pick<ShellNotification, "title" | "description" | "time">) {
  toast(n.title, {
    description: (
      <div className="mt-1 space-y-2">
        <p className="text-sm text-muted-foreground">{n.description}</p>
        <p className="text-xs font-medium text-foreground">Scheduled for {n.time}</p>
      </div>
    ),
    duration: Infinity,
    closeButton: true,
    className: "w-[26rem] items-start",
  });
}

export function DashboardShellProvider({ children }: { children: React.ReactNode }) {
  const [sidebarPinned, setSidebarPinned] = React.useState(false);
  const [openRightDrawers, setOpenRightDrawers] = React.useState(0);
  const [notifications, setNotifications] = React.useState<ShellNotification[]>(notificationSeed);
  const [notificationCenterOpen, setNotificationCenterOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const stored = window.localStorage.getItem("qd-theme");
    if (stored === "dark" || stored === "light") setTheme(stored);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("qd-theme", theme);
  }, [theme]);

  // Demonstrates the two live surfaces: alerts auto-dismiss after 10s,
  // reminders stay until manually closed.
  React.useEffect(() => {
    const firstAlert = notificationSeed.find((n) => n.kind === "alert");
    const firstReminder = notificationSeed.find((n) => n.kind === "reminder");
    const alertTimer = window.setTimeout(() => firstAlert && fireAlertToast(firstAlert), 1500);
    const reminderTimer = window.setTimeout(
      () => firstReminder && fireReminderToast(firstReminder),
      3500,
    );
    return () => {
      window.clearTimeout(alertTimer);
      window.clearTimeout(reminderTimer);
    };
  }, []);

  const registerRightDrawer = React.useCallback((open: boolean) => {
    setOpenRightDrawers((c) => Math.max(0, c + (open ? 1 : -1)));
  }, []);

  const push = React.useCallback((n: Omit<ShellNotification, "id" | "time" | "read">) => {
    const item: ShellNotification = { ...n, id: crypto.randomUUID(), time: "just now" };
    setNotifications((list) => [item, ...list]);
    if (item.kind === "alert") fireAlertToast(item);
    if (item.kind === "reminder") fireReminderToast(item);
  }, []);

  const counts = React.useMemo(() => {
    const base: Record<AlertKind, number> = { notification: 0, alert: 0, reminder: 0 };
    for (const n of notifications) if (!n.read) base[n.kind] += 1;
    return base;
  }, [notifications]);

  const value: ShellContextValue = {
    sidebarPinned,
    setSidebarPinned,
    openRightDrawers,
    registerRightDrawer,
    notifications,
    counts,
    totalUnread: counts.notification + counts.alert + counts.reminder,
    markAllRead: () => setNotifications((l) => l.map((n) => ({ ...n, read: true }))),
    markRead: (id) => setNotifications((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))),
    dismiss: (id) => setNotifications((l) => l.filter((n) => n.id !== id)),
    dismissKind: (kind) => setNotifications((l) => l.filter((n) => n.kind !== kind)),
    push,
    notificationCenterOpen,
    setNotificationCenterOpen,
    theme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}
