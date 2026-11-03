/** Demo data for the Settings module. Frontend-only, no persistence. */

export type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  team: string;
  timezone: string;
  language: string;
  twoFactor: boolean;
  notifications: { calls: boolean; campaigns: boolean; mentions: boolean; digest: boolean };
  calendar: { provider: string; account: string; connected: boolean };
  mailbox: { provider: string; account: string; connected: boolean };
};

export const profileSeed: ProfileData = {
  fullName: "Awais Ahmad",
  email: "awais@qualitydial.io",
  phone: "+1 415 555 0182",
  jobTitle: "Sales Operations Lead",
  team: "Revenue — Outbound",
  timezone: "Asia/Karachi (UTC+5)",
  language: "English (US)",
  twoFactor: true,
  notifications: { calls: true, campaigns: true, mentions: true, digest: false },
  calendar: { provider: "Google Calendar", account: "awais@qualitydial.io", connected: true },
  mailbox: { provider: "Gmail", account: "awais@qualitydial.io", connected: false },
};

export const profileMeta = {
  assignedTeam: "Revenue — Outbound",
  assignedCampaigns: ["Q3 Renewal Outreach", "Website Demo Follow-up", "Winback — EMEA"],
  assignedAgents: ["Nova (Sales)", "Atlas (Support triage)"],
  lastLogin: "Today, 09:12 — Karachi, PK",
  accountStatus: "Active",
};

export const apiTokens = [
  { id: "t1", name: "Zapier bridge", prefix: "qd_live_9f2c…", created: "12 Jun 2026", lastUsed: "2h ago" },
  { id: "t2", name: "Internal reporting", prefix: "qd_live_41ab…", created: "03 Mar 2026", lastUsed: "Yesterday" },
];

export type CallingCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: string;
  tone: "success" | "warning" | "muted";
  summary: { label: string; value: string }[];
};

export const callingCards: CallingCard[] = [
  {
    id: "numbers",
    title: "Phone numbers",
    description: "Buy, port and manage the numbers in this workspace.",
    icon: "Phone",
    status: "6 active",
    tone: "success",
    summary: [
      { label: "Local numbers", value: "4" },
      { label: "Toll-free", value: "2" },
      { label: "Pending port", value: "1" },
      { label: "Monthly cost", value: "$42.00" },
    ],
  },
  {
    id: "assignment",
    title: "Number assignment",
    description: "Map numbers to teams, agents and campaigns.",
    icon: "Users",
    status: "5 mapped",
    tone: "success",
    summary: [
      { label: "+1 415 555 0182", value: "Outbound team" },
      { label: "+1 415 555 0134", value: "Nova (AI agent)" },
      { label: "+1 800 555 2210", value: "Support queue" },
      { label: "Unassigned", value: "1" },
    ],
  },
  {
    id: "caller-id",
    title: "Caller ID",
    description: "Outbound presentation name and verified numbers.",
    icon: "BadgeCheck",
    status: "Verified",
    tone: "success",
    summary: [
      { label: "Display name", value: "Quality Dial" },
      { label: "Default number", value: "+1 415 555 0182" },
      { label: "Local presence", value: "Enabled" },
      { label: "STIR/SHAKEN", value: "Attestation A" },
    ],
  },
  {
    id: "routing",
    title: "Call routing",
    description: "Decide where inbound calls land, in order.",
    icon: "Route",
    status: "3 rules",
    tone: "success",
    summary: [
      { label: "1. Business hours", value: "Sales ring group" },
      { label: "2. After hours", value: "Voicemail" },
      { label: "3. Overflow > 45s", value: "Support queue" },
      { label: "Fallback", value: "Nova (AI agent)" },
    ],
  },
  {
    id: "hours",
    title: "Business hours",
    description: "Working windows, holidays and timezone.",
    icon: "Clock",
    status: "Mon–Fri",
    tone: "success",
    summary: [
      { label: "Weekdays", value: "09:00 – 18:00" },
      { label: "Saturday", value: "10:00 – 14:00" },
      { label: "Sunday", value: "Closed" },
      { label: "Timezone", value: "Asia/Karachi" },
    ],
  },
  {
    id: "voicemail",
    title: "Voicemail",
    description: "Greetings, transcription and delivery.",
    icon: "Voicemail",
    status: "Enabled",
    tone: "success",
    summary: [
      { label: "Greeting", value: "Custom — recorded" },
      { label: "Transcription", value: "AI, English" },
      { label: "Email delivery", value: "sales@qualitydial.io" },
      { label: "Max length", value: "3 minutes" },
    ],
  },
  {
    id: "forwarding",
    title: "Call forwarding",
    description: "Send calls to mobiles or external numbers.",
    icon: "PhoneForwarded",
    status: "2 rules",
    tone: "warning",
    summary: [
      { label: "On no answer", value: "+1 415 555 0190" },
      { label: "On busy", value: "Voicemail" },
      { label: "Ring time", value: "25 seconds" },
      { label: "Simultaneous", value: "Off" },
    ],
  },
  {
    id: "ring-groups",
    title: "Ring groups",
    description: "Group agents so calls ring together or in order.",
    icon: "Bell",
    status: "3 groups",
    tone: "success",
    summary: [
      { label: "Sales", value: "6 agents — simultaneous" },
      { label: "Support", value: "4 agents — round robin" },
      { label: "Escalations", value: "2 agents — sequential" },
      { label: "Ring timeout", value: "30 seconds" },
    ],
  },
  {
    id: "extensions",
    title: "Extensions",
    description: "Internal dialling shortcuts for members.",
    icon: "Hash",
    status: "18 in use",
    tone: "muted",
    summary: [
      { label: "Range", value: "101 – 199" },
      { label: "Assigned", value: "18" },
      { label: "Available", value: "81" },
      { label: "Voicemail box", value: "Per extension" },
    ],
  },
  {
    id: "ivr",
    title: "IVR menus",
    description: "Press-1 style menus for inbound callers.",
    icon: "ListTree",
    status: "1 published",
    tone: "success",
    summary: [
      { label: "Main menu", value: "Published" },
      { label: "1 — Sales", value: "Sales ring group" },
      { label: "2 — Support", value: "Support queue" },
      { label: "3 — Billing", value: "Voicemail" },
    ],
  },
  {
    id: "queues",
    title: "Queue settings",
    description: "Hold behaviour, music and overflow limits.",
    icon: "Layers",
    status: "2 queues",
    tone: "warning",
    summary: [
      { label: "Max wait", value: "5 minutes" },
      { label: "Max callers", value: "25" },
      { label: "Hold music", value: "Ambient — default" },
      { label: "Announce position", value: "Every 60s" },
    ],
  },
];

export type KnowledgeDoc = {
  id: string;
  title: string;
  type: "PDF" | "DOCX" | "FAQ" | "TXT";
  category: string;
  size: string;
  updated: string;
  index: "Indexed" | "Processing" | "Failed";
  agents: string[];
  excerpt: string;
};

export const knowledgeDocs: KnowledgeDoc[] = [
  {
    id: "k1",
    title: "Product Catalog 2026",
    type: "PDF",
    category: "Product",
    size: "4.2 MB",
    updated: "2 days ago",
    index: "Indexed",
    agents: ["Nova (Sales)"],
    excerpt:
      "Full catalogue of dialler tiers, add-ons and hardware bundles with SKU-level pricing notes.",
  },
  {
    id: "k2",
    title: "Pricing & Discount Policy",
    type: "PDF",
    category: "Pricing",
    size: "820 KB",
    updated: "5 days ago",
    index: "Indexed",
    agents: ["Nova (Sales)", "Atlas (Support triage)"],
    excerpt: "List pricing, volume breaks and the approval matrix for discounts above 15%.",
  },
  {
    id: "k3",
    title: "Return & Refund Policy",
    type: "DOCX",
    category: "Policies",
    size: "310 KB",
    updated: "1 week ago",
    index: "Indexed",
    agents: ["Atlas (Support triage)"],
    excerpt: "30-day return window, restocking fees and the escalation path for disputed charges.",
  },
  {
    id: "k4",
    title: "Onboarding FAQ",
    type: "FAQ",
    category: "Support",
    size: "48 entries",
    updated: "Yesterday",
    index: "Processing",
    agents: [],
    excerpt: "Common questions from the first 14 days: number porting, SIP setup, seat management.",
  },
  {
    id: "k5",
    title: "Objection Handling Notes",
    type: "TXT",
    category: "Sales enablement",
    size: "96 KB",
    updated: "3 weeks ago",
    index: "Indexed",
    agents: ["Nova (Sales)"],
    excerpt: "Rebuttals for price, timing and incumbent-vendor objections gathered from top reps.",
  },
  {
    id: "k6",
    title: "Compliance & DNC Guide",
    type: "PDF",
    category: "Policies",
    size: "1.6 MB",
    updated: "1 month ago",
    index: "Failed",
    agents: [],
    excerpt: "Regional calling windows, consent capture and do-not-call list handling requirements.",
  },
];

export const knowledgeCategories = [
  "Product",
  "Pricing",
  "Policies",
  "Support",
  "Sales enablement",
];

export const aiAgents = ["Nova (Sales)", "Atlas (Support triage)", "Echo (Collections)"];

export type Automation = {
  id: string;
  name: string;
  description: string;
  category: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  enabled: boolean;
  lastRun: string;
  executions: number;
  logs: {
    id: string;
    time: string;
    status: "Success" | "Failed";
    trigger: string;
    actions: string;
    duration: string;
    error?: string;
  }[];
};

export const automationCategories = [
  "Lead Management",
  "Calling",
  "Customer Communication",
  "AI",
  "Tickets & Tasks",
  "Campaigns",
  "Scheduling & Reminders",
  "Notifications",
];

export const triggerOptions = [
  "Call Started",
  "Call Ended",
  "Incoming Call",
  "Missed Call",
  "Lead Created",
  "Lead Updated",
  "Pipeline Changed",
  "Task Created",
  "Task Completed",
  "Ticket Created",
  "Campaign Started",
  "Campaign Finished",
  "SMS Received",
  "Email Received",
  "Voicemail Received",
  "Appointment Created",
  "Reminder Due",
  "Specific Date & Time",
  "Webhook Received",
  "Manual Run",
];

export const conditionOptions = [
  "Campaign = Sales",
  "Outcome = Interested",
  "Call Duration > 2 Minutes",
  "Lead Score > 70",
  "Pipeline = Qualified",
  "Customer Language = English",
  "Team = Sales",
  "Agent = AI",
  "Tag contains VIP",
  "Working Hours Only",
];

export const actionGroups: { group: string; actions: string[] }[] = [
  { group: "CRM", actions: ["Create Lead", "Update Lead", "Move Pipeline Stage", "Add Tag", "Assign Lead"] },
  { group: "Tasks", actions: ["Create Task", "Update Task", "Assign Task"] },
  { group: "Tickets", actions: ["Create Ticket", "Assign Ticket", "Escalate Ticket"] },
  { group: "Communication", actions: ["Send SMS", "Send Email", "Send WhatsApp", "Start AI Call"] },
  { group: "Campaigns", actions: ["Pause Campaign", "Resume Campaign", "Stop Campaign", "Change Campaign Status"] },
  { group: "Calling", actions: ["Schedule Callback", "Retry Call", "Block Number", "Add to DNC List"] },
  {
    group: "Notifications",
    actions: [
      "Create Notification",
      "Create Alert",
      "Create Reminder",
      "Notify User",
      "Notify Team",
      "Notify Agent",
      "Notify Supervisor",
      "Notify Admin",
      "Show Desktop Notification",
      "Send Slack Message",
    ],
  },

  { group: "AI", actions: ["Generate Summary", "Generate Follow-up", "Score Lead", "Analyze Sentiment"] },
  { group: "Data Tables", actions: ["Insert Row", "Update Row", "Create Record", "Update Appointment", "Save Survey Response"] },
];

export const automationSeed: Automation[] = [
  {
    id: "a1",
    name: "Create Follow-up Task after Call",
    description: "Every interested call gets a task on the rep's queue within one business day.",
    category: "Lead Management",
    trigger: "Call Ended",
    conditions: ["Outcome = Interested", "Working Hours Only"],
    actions: ["Create Follow-up Task", "Send Thank You SMS", "Move Pipeline Stage", "Notify Supervisor"],
    enabled: true,
    lastRun: "12 minutes ago",
    executions: 1284,
    logs: [
      { id: "l1", time: "Today 13:41", status: "Success", trigger: "Call Ended", actions: "4 actions", duration: "1.2s" },
      { id: "l2", time: "Today 12:08", status: "Success", trigger: "Call Ended", actions: "4 actions", duration: "0.9s" },
      { id: "l3", time: "Today 10:55", status: "Failed", trigger: "Call Ended", actions: "2 of 4 actions", duration: "3.4s", error: "SMS provider timed out (gateway 504)." },
    ],
  },
  {
    id: "a2",
    name: "Retry Missed Calls",
    description: "Re-queues missed calls twice with a two-hour gap before creating a task.",
    category: "Calling",
    trigger: "Missed Call",
    conditions: ["Working Hours Only"],
    actions: ["Retry Call", "Schedule Callback", "Create Task"],
    enabled: true,
    lastRun: "38 minutes ago",
    executions: 642,
    logs: [
      { id: "l1", time: "Today 13:20", status: "Success", trigger: "Missed Call", actions: "3 actions", duration: "0.6s" },
      { id: "l2", time: "Today 11:02", status: "Success", trigger: "Missed Call", actions: "3 actions", duration: "0.7s" },
    ],
  },
  {
    id: "a3",
    name: "Send Thank You SMS",
    description: "Sends a branded thank-you message after a positive conversation.",
    category: "Customer Communication",
    trigger: "Call Ended",
    conditions: ["Outcome = Interested"],
    actions: ["Send SMS"],
    enabled: false,
    lastRun: "3 days ago",
    executions: 208,
    logs: [{ id: "l1", time: "25 Aug 16:12", status: "Success", trigger: "Call Ended", actions: "1 action", duration: "0.4s" }],
  },
  {
    id: "a4",
    name: "AI Summarize Call",
    description: "Generates a call summary and attaches it to the lead timeline.",
    category: "AI",
    trigger: "Call Ended",
    conditions: ["Call Duration > 2 Minutes"],
    actions: ["Generate Summary", "Update Lead"],
    enabled: true,
    lastRun: "4 minutes ago",
    executions: 3102,
    logs: [
      { id: "l1", time: "Today 13:52", status: "Success", trigger: "Call Ended", actions: "2 actions", duration: "2.8s" },
      { id: "l2", time: "Today 13:31", status: "Success", trigger: "Call Ended", actions: "2 actions", duration: "3.1s" },
    ],
  },
  {
    id: "a5",
    name: "Create Ticket for Angry Customer",
    description: "Sentiment drops below threshold, a ticket is raised and a supervisor is paged.",
    category: "Tickets & Tasks",
    trigger: "Call Ended",
    conditions: ["Agent = AI"],
    actions: ["Create Ticket", "Assign Ticket", "Notify Supervisor", "Send Slack Message"],
    enabled: true,
    lastRun: "Yesterday 17:44",
    executions: 57,
    logs: [{ id: "l1", time: "27 Aug 17:44", status: "Success", trigger: "Call Ended", actions: "4 actions", duration: "1.9s" }],
  },
  {
    id: "a6",
    name: "Pause Campaign if Daily Limit Reached",
    description: "Protects deliverability by pausing a campaign once the daily dial cap is hit.",
    category: "Campaigns",
    trigger: "Campaign Started",
    conditions: ["Campaign = Sales"],
    actions: ["Pause Campaign", "Notify Admin"],
    enabled: false,
    lastRun: "Never",
    executions: 0,
    logs: [],
  },
  {
    id: "a7",
    name: "Appointment Reminder",
    description: "Reminds the customer 24 hours and 1 hour before a booked appointment.",
    category: "Scheduling & Reminders",
    trigger: "Reminder Due",
    conditions: [],
    actions: ["Send WhatsApp", "Send SMS"],
    enabled: true,
    lastRun: "1 hour ago",
    executions: 431,
    logs: [{ id: "l1", time: "Today 12:58", status: "Success", trigger: "Reminder Due", actions: "2 actions", duration: "0.5s" }],
  },
  {
    id: "a8",
    name: "Notify Supervisor on Failed Call",
    description: "Escalates carrier failures so the ops team can react quickly.",
    category: "Notifications",
    trigger: "Call Ended",
    conditions: [],
    actions: ["Notify Supervisor", "Send Slack Message"],
    enabled: true,
    lastRun: "22 minutes ago",
    executions: 96,
    logs: [{ id: "l1", time: "Today 13:36", status: "Success", trigger: "Call Ended", actions: "2 actions", duration: "0.3s" }],
  },
];

export const automationLibrary: { category: string; recipes: { name: string; description: string }[] }[] = [
  {
    category: "Lead Management",
    recipes: [
      { name: "Move Lead to Next Pipeline Stage", description: "Advance the lead when the call outcome is positive." },
      { name: "Add Tag based on Call Outcome", description: "Keep segments clean without manual tagging." },
      { name: "Mark Lead as Cold after X Days", description: "Age out leads with no activity in 30 days." },
    ],
  },
  {
    category: "Calling",
    recipes: [
      { name: "Stop Calling after Maximum Attempts", description: "Respect attempt caps per lead automatically." },
      { name: "Send Missed Call SMS", description: "Text back within 60 seconds of a missed call." },
      { name: "Auto Disposition Calls", description: "Let AI set the disposition from the transcript." },
    ],
  },
  {
    category: "Customer Communication",
    recipes: [
      { name: "Send Welcome Email", description: "Greet new customers the moment they convert." },
      { name: "Payment Reminder", description: "Nudge overdue invoices on a fixed cadence." },
      { name: "Survey Request", description: "Ask for CSAT one hour after a resolved call." },
    ],
  },
  {
    category: "AI",
    recipes: [
      { name: "AI Qualify Lead", description: "Score and route inbound leads with an AI pass." },
      { name: "AI Follow-up Call", description: "Have an AI agent place the second-touch call." },
      { name: "AI Auto Tag Lead", description: "Derive tags from the conversation transcript." },
    ],
  },
];
