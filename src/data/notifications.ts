/**
 * Notification Center seeds.
 *
 * Everything here is system-generated: notifications, alerts and reminders are
 * produced by the Automation engine, never created by hand in the UI.
 */

export type AlertKind = "notification" | "alert" | "reminder";

export type NotificationCategory = "Calling" | "Campaign" | "CRM" | "System" | "Inbox" | "AI";

export type NotificationAction = {
  label: string;
  /** Optional in-app destination. When omitted the action is handled locally. */
  to?: string;
};

export type ShellNotification = {
  id: string;
  kind: AlertKind;
  title: string;
  description: string;
  time: string;
  read?: boolean;
  category?: NotificationCategory;
  /** The record this item was raised for, e.g. "Lead · John Smith". */
  related?: string;
  /** Short status chip, e.g. "Needs action", "Due today". */
  status?: string;
  actions?: NotificationAction[];
};

export const notificationSeed: ShellNotification[] = [
  // ---------------------------------------------------------------- Notifications
  {
    id: "n1",
    kind: "notification",
    title: "New lead assigned",
    description: "Priya Raman was routed to you from the Website Demo segment.",
    time: "2m ago",
    category: "CRM",
    related: "Lead · Priya Raman",
    actions: [{ label: "View lead", to: "/crm/leads" }],
  },
  {
    id: "n2",
    kind: "notification",
    title: "New SMS received",
    description: "Ali Raza replied to the pilot proposal follow-up.",
    time: "6m ago",
    category: "Inbox",
    related: "SMS · Ali Raza",
    actions: [{ label: "Open inbox", to: "/inbox" }],
  },
  {
    id: "n3",
    kind: "notification",
    title: "New voicemail received",
    description: "Fatima Sheikh left a 0:42 voicemail about per-seat pricing.",
    time: "24m ago",
    category: "Inbox",
    related: "Voicemail · Fatima Sheikh",
    actions: [{ label: "Listen", to: "/inbox" }],
  },
  {
    id: "n4",
    kind: "notification",
    title: "Campaign started",
    description: "Q3 Renewal Outreach began dialling with 4 agents online.",
    time: "1h ago",
    category: "Campaign",
    related: "Campaign · Q3 Renewal Outreach",
    actions: [{ label: "View campaign", to: "/campaigns" }],
  },
  {
    id: "n5",
    kind: "notification",
    title: "AI agent finished campaign",
    description: "Nova completed Winback Q2 with 118 conversations handled.",
    time: "2h ago",
    category: "AI",
    related: "AI agent · Nova",
    actions: [{ label: "View report", to: "/reports" }],
  },
  {
    id: "n6",
    kind: "notification",
    title: "Recording ready",
    description: "Call recording and AI summary for Northwind Textiles are available.",
    time: "3h ago",
    category: "Calling",
    related: "Call · Northwind Textiles",
    actions: [{ label: "Open history", to: "/calling/history" }],
  },
  {
    id: "n7",
    kind: "notification",
    title: "Knowledge base finished indexing",
    description: "42 documents were embedded and are now searchable by AI agents.",
    time: "5h ago",
    category: "System",
    related: "Knowledge base · Product docs",
    actions: [{ label: "Open knowledge base", to: "/settings/knowledge-base" }],
  },
  {
    id: "n8",
    kind: "notification",
    title: "Team member joined",
    description: "Bilal Khan accepted the invitation and joined the Sales team.",
    time: "Yesterday",
    category: "System",
    related: "Member · Bilal Khan",
    actions: [{ label: "View members", to: "/organization/members" }],
  },
  {
    id: "n9",
    kind: "notification",
    title: "Automation completed",
    description: "\"Qualified lead handoff\" ran on 36 records without errors.",
    time: "Yesterday",
    category: "System",
    related: "Automation · Qualified lead handoff",
    actions: [{ label: "View automation", to: "/settings/automations" }],
  },
  {
    id: "n10",
    kind: "notification",
    title: "Campaign imported successfully",
    description: "1,284 contacts were imported into Autumn Winback.",
    time: "2d ago",
    category: "Campaign",
    related: "Import · autumn-winback.csv",
    actions: [{ label: "View data table", to: "/crm/data-table" }],
  },

  // ----------------------------------------------------------------------- Alerts
  {
    id: "a1",
    kind: "alert",
    title: "Missed call",
    description: "John Smith called twice and no agent was available.",
    time: "5m ago",
    category: "Calling",
    related: "Lead · John Smith",
    status: "Needs action",
    actions: [
      { label: "View lead", to: "/crm/leads" },
      { label: "Call back" },
    ],
  },
  {
    id: "a2",
    kind: "alert",
    title: "Dialer capacity at 92%",
    description: "Concurrency is close to the plan limit for this workspace.",
    time: "12m ago",
    category: "Calling",
    related: "Queue · Outbound sales",
    status: "Monitoring",
    actions: [{ label: "Open live calls", to: "/calling/live" }],
  },
  {
    id: "a3",
    kind: "alert",
    title: "Phone number offline",
    description: "+92 21 111 0134 could not be verified with the carrier.",
    time: "22m ago",
    category: "Calling",
    related: "Number · +92 21 111 0134",
    status: "Needs action",
    actions: [{ label: "Calling settings", to: "/settings/calling" }],
  },
  {
    id: "a4",
    kind: "alert",
    title: "AI confidence low",
    description: "Nova escalated 3 conversations after low-confidence answers.",
    time: "40m ago",
    category: "AI",
    related: "AI agent · Nova",
    status: "Escalated",
    actions: [{ label: "Review agent", to: "/organization/ai-agents" }],
  },
  {
    id: "a5",
    kind: "alert",
    title: "Campaign stopped",
    description: "Winback Q2 stopped early: no available agents in the rotation.",
    time: "1h ago",
    category: "Campaign",
    related: "Campaign · Winback Q2",
    status: "Stopped",
    actions: [{ label: "View campaign", to: "/campaigns" }],
  },
  {
    id: "a6",
    kind: "alert",
    title: "Duplicate lead found",
    description: "Two records share ali.raza@northwind.pk — merge is recommended.",
    time: "2h ago",
    category: "CRM",
    related: "Lead · Ali Raza",
    status: "Needs review",
    actions: [{ label: "Review leads", to: "/crm/leads" }],
  },
  {
    id: "a7",
    kind: "alert",
    title: "Overdue ticket",
    description: "Ticket #4482 has breached its 24h response target.",
    time: "3h ago",
    category: "CRM",
    related: "Ticket · #4482",
    status: "Overdue",
    actions: [{ label: "Open tasks", to: "/crm/tasks" }],
  },
  {
    id: "a8",
    kind: "alert",
    title: "Low AI credits",
    description: "You have 8% of this month's AI credits remaining.",
    time: "5h ago",
    category: "System",
    related: "Billing · Workspace plan",
    status: "Needs action",
    actions: [{ label: "Workspace settings", to: "/organization/workspace" }],
  },
  {
    id: "a9",
    kind: "alert",
    title: "Payment failed",
    description: "The card ending 4242 was declined for the September invoice.",
    time: "Yesterday",
    category: "System",
    related: "Invoice · SEP-2026",
    status: "Needs action",
    actions: [{ label: "Billing", to: "/organization/workspace" }],
  },
  {
    id: "a10",
    kind: "alert",
    title: "Failed import",
    description: "312 rows in leads-sep.csv were rejected for invalid numbers.",
    time: "Yesterday",
    category: "CRM",
    related: "Import · leads-sep.csv",
    status: "Failed",
    actions: [{ label: "View data table", to: "/crm/data-table" }],
  },

  // -------------------------------------------------------------------- Reminders
  {
    id: "r1",
    kind: "reminder",
    title: "Callback reminder",
    description: "Call Daniel Okafor about the pilot rollout and pricing tier.",
    time: "Today 16:30",
    category: "Calling",
    related: "Lead · Daniel Okafor",
    status: "Due today",
    actions: [
      { label: "View lead", to: "/crm/leads" },
      { label: "Call now" },
    ],
  },
  {
    id: "r2",
    kind: "reminder",
    title: "Task due today",
    description: "Send the signed DPA to the Northwind legal team.",
    time: "Today 18:00",
    category: "CRM",
    related: "Task · Send DPA",
    status: "Due today",
    actions: [{ label: "Open tasks", to: "/crm/tasks" }],
  },
  {
    id: "r3",
    kind: "reminder",
    title: "Appointment reminder",
    description: "Product walkthrough with Sheikh Motors.",
    time: "Tomorrow 11:00",
    category: "CRM",
    related: "Appointment · Sheikh Motors",
    status: "Scheduled",
    actions: [{ label: "View lead", to: "/crm/leads" }],
  },
  {
    id: "r4",
    kind: "reminder",
    title: "Campaign starts tomorrow",
    description: "Autumn Winback is scheduled to start at 09:00.",
    time: "Tomorrow 09:00",
    category: "Campaign",
    related: "Campaign · Autumn Winback",
    status: "Scheduled",
    actions: [{ label: "View campaign", to: "/campaigns" }],
  },
  {
    id: "r5",
    kind: "reminder",
    title: "Follow-up reminder",
    description: "Check whether Ayesha Malik reviewed the proposal.",
    time: "Fri 10:00",
    category: "CRM",
    related: "Lead · Ayesha Malik",
    status: "Scheduled",
    actions: [{ label: "View lead", to: "/crm/leads" }],
  },
  {
    id: "r6",
    kind: "reminder",
    title: "Payment reminder",
    description: "Invoice 4482 for Sheikh Motors is due on Thursday.",
    time: "Thu 09:00",
    category: "System",
    related: "Invoice · 4482",
    status: "Scheduled",
    actions: [{ label: "Open inbox", to: "/inbox" }],
  },
  {
    id: "r7",
    kind: "reminder",
    title: "Renew contract",
    description: "Northwind Textiles annual contract expires in 14 days.",
    time: "Sep 24",
    category: "CRM",
    related: "Account · Northwind Textiles",
    status: "Upcoming",
    actions: [{ label: "View lead", to: "/crm/leads" }],
  },
  {
    id: "r8",
    kind: "reminder",
    title: "Knowledge base needs update",
    description: "Pricing article is 90 days old and used by 2 AI agents.",
    time: "Next week",
    category: "System",
    related: "Knowledge base · Pricing",
    status: "Upcoming",
    actions: [{ label: "Open knowledge base", to: "/settings/knowledge-base" }],
  },
];
