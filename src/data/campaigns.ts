/** Frontend-only demo data for the Campaigns module. */

export type CampaignType = "Inbound" | "Outbound" | "Broadcast";

export type CampaignStatus = "Active" | "Paused" | "Draft" | "Scheduled" | "Completed" | "Archived";

export const campaignTypes: CampaignType[] = ["Inbound", "Outbound", "Broadcast"];

export const campaignPurposes = [
  "Sales",
  "Lead Qualification",
  "Customer Support",
  "Appointment Booking",
  "Follow-up",
  "Collections",
  "Survey & Research",
  "Customer Retention",
  "Welcome & Onboarding",
  "Custom",
];

export const campaignTypeHelp: Record<CampaignType, string> = {
  Inbound: "Customer starts the conversation — support, receptionist, billing, help desk.",
  Outbound: "The assigned team starts the conversation — sales, qualification, collections.",
  Broadcast: "Send messages or AI calls to many contacts automatically — SMS, email, WhatsApp.",
};

export const campaignStatusClass: Record<CampaignStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  Paused: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  Draft: "bg-muted text-muted-foreground border-border",
  Scheduled: "bg-sky-500/15 text-sky-600 border-sky-500/30",
  Completed: "bg-violet-500/15 text-violet-600 border-violet-500/30",
  Archived: "bg-muted text-muted-foreground border-border",
};

export type CampaignMember = {
  id: string;
  name: string;
  kind: "Human" | "AI";
  role: string;
  status: "Available" | "On call" | "Break" | "Offline" | "Running";
  calls: number;
  conversion: number;
  qaScore: number;
  progress: number;
};

export type CampaignSegment = {
  id: string;
  name: string;
  description: string;
  totalLeads: number;
  contacted: number;
  interested: number;
  followUp: number;
  qualified: number;
  converted: number;
  rejected: number;
};

export type CampaignAutomation = {
  id: string;
  name: string;
  description: string;
  trigger: string;
  enabled: boolean;
  scope: "Library" | "Campaign only";
};

export type Campaign = {
  id: string;
  name: string;
  type: CampaignType;
  purpose: string;
  goal: string;
  status: CampaignStatus;
  team: string;
  supervisor: string;
  createdAt: string;
  schedule: string;
  progress: number;
  members: CampaignMember[];
  segments: CampaignSegment[];
  scripts: string[];
  templates: string[];
  dataTables: string[];
  automations: CampaignAutomation[];
  config: { label: string; value: string }[];
  metrics: {
    calls: number;
    connected: number;
    answerRate: number;
    conversionRate: number;
    avgDuration: string;
    revenue: string;
  };
  trend: { day: string; calls: number; connected: number; conversions: number }[];
};

const trend = (base: number) =>
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
    day,
    calls: Math.round(base + i * 18 + (i % 3) * 24),
    connected: Math.round((base + i * 18) * 0.62),
    conversions: Math.round((base + i * 18) * 0.14),
  }));

export const outboundConfig = [
  { label: "Dialing mode", value: "Predictive (2.0x)" },
  { label: "Working hours", value: "09:00 – 18:00 (Mon–Fri)" },
  { label: "Maximum call attempts", value: "4 per lead" },
  { label: "Ring duration", value: "30 seconds" },
  { label: "Retry delay", value: "4 hours" },
  { label: "Daily call limit per lead", value: "2 calls" },
  { label: "Stop calling rules", value: "After successful contact, conversion or rejection" },
  { label: "Compliance", value: "Skip weekends & holidays · Respect DNC list" },
];

export const inboundConfig = [
  { label: "Business hours", value: "08:00 – 20:00 (Mon–Sat)" },
  { label: "Queue timeout", value: "90 seconds" },
  { label: "Overflow routing", value: "Escalate to Support Tier 2" },
  { label: "AI receptionist", value: "Nova — enabled after 3 rings" },
  { label: "Call recording", value: "Enabled with consent prompt" },
  { label: "Voicemail fallback", value: "Enabled outside business hours" },
];

export const broadcastConfig = [
  { label: "Channel", value: "SMS → WhatsApp → Email" },
  { label: "Schedule", value: "Daily at 10:00, workspace timezone" },
  { label: "Daily message limit", value: "5,000 messages" },
  { label: "Message timing", value: "12 second delay between messages" },
  { label: "Sending limits", value: "Max 1 message per contact per day" },
  { label: "Stop rules", value: "Stop sequence on reply · Respect unsubscribes" },
];

const humans = (names: string[], role: string): CampaignMember[] =>
  names.map((name, i) => ({
    id: `${role}-${i}-${name}`,
    name,
    kind: "Human" as const,
    role,
    status: (["Available", "On call", "Break", "Offline"] as const)[i % 4]!,
    calls: 120 + i * 37,
    conversion: 18 + ((i * 5) % 22),
    qaScore: 78 + ((i * 7) % 20),
    progress: 45 + ((i * 13) % 50),
  }));

const aiAgent = (name: string, i: number): CampaignMember => ({
  id: `ai-${name}`,
  name,
  kind: "AI",
  role: "AI Agent",
  status: "Running",
  calls: 640 + i * 210,
  conversion: 24 + i * 4,
  qaScore: 90 + i,
  progress: 72 + i * 9,
});

const seg = (
  id: string,
  name: string,
  description: string,
  totalLeads: number,
): CampaignSegment => ({
  id,
  name,
  description,
  totalLeads,
  contacted: Math.round(totalLeads * 0.62),
  interested: Math.round(totalLeads * 0.21),
  followUp: Math.round(totalLeads * 0.16),
  qualified: Math.round(totalLeads * 0.12),
  converted: Math.round(totalLeads * 0.07),
  rejected: Math.round(totalLeads * 0.09),
});

export const campaignSeed: Campaign[] = [
  {
    id: "c1",
    name: "Spring Outbound",
    type: "Outbound",
    purpose: "Sales",
    goal: "Sell 250 solar panel installations before the end of the quarter.",
    status: "Active",
    team: "Outbound Sales Pod",
    supervisor: "Sara Ahmed",
    createdAt: "12 Jan 2026",
    schedule: "Mon–Fri · 09:00 – 18:00",
    progress: 64,
    members: [
      ...humans(["Sara Ahmed", "Bilal Khan", "Hina Raza"], "Human Agent"),
      aiAgent("Nova", 0),
      aiAgent("Atlas", 1),
    ],
    segments: [
      seg("cs1", "Imported Leads", "Created from your onboarding upload.", 1240),
      seg("cs2", "Lahore Region", "Leads with a Lahore billing address.", 386),
    ],
    scripts: ["Cold Calling Script", "Sales Script"],
    templates: ["Thank You SMS", "Welcome Email", "WhatsApp Intro"],
    dataTables: ["Customer Survey"],
    automations: [
      {
        id: "a1",
        name: "Send Follow-up SMS",
        description: "Sends a follow-up SMS 2 hours after an unanswered call.",
        trigger: "Call ended — no answer",
        enabled: true,
        scope: "Library",
      },
      {
        id: "a2",
        name: "Create Task",
        description: "Creates a callback task when a lead is marked interested.",
        trigger: "Lead marked interested",
        enabled: true,
        scope: "Campaign only",
      },
      {
        id: "a3",
        name: "Move Lead Stage",
        description: "Moves qualified leads into the proposal stage.",
        trigger: "Lead qualified",
        enabled: false,
        scope: "Library",
      },
    ],
    config: outboundConfig,
    metrics: {
      calls: 4820,
      connected: 2946,
      answerRate: 61,
      conversionRate: 18,
      avgDuration: "3m 42s",
      revenue: "$184,200",
    },
    trend: trend(180),
  },
  {
    id: "c2",
    name: "Support Front Desk",
    type: "Inbound",
    purpose: "Customer Support",
    goal: "Answer 95% of support calls within 60 seconds.",
    status: "Active",
    team: "Support Desk",
    supervisor: "Hina Raza",
    createdAt: "02 Feb 2026",
    schedule: "Mon–Sat · 08:00 – 20:00",
    progress: 88,
    members: [...humans(["Hina Raza", "Omar Farooq"], "Support Agent"), aiAgent("Echo", 0)],
    segments: [],
    scripts: ["Support Script"],
    templates: ["Welcome Email", "WhatsApp Support Handoff"],
    dataTables: ["Property Leads"],
    automations: [
      {
        id: "a4",
        name: "Appointment Reminder",
        description: "Reminds customers 24 hours before a scheduled callback.",
        trigger: "Callback scheduled",
        enabled: true,
        scope: "Library",
      },
    ],
    config: inboundConfig,
    metrics: {
      calls: 3120,
      connected: 2984,
      answerRate: 96,
      conversionRate: 0,
      avgDuration: "5m 08s",
      revenue: "—",
    },
    trend: trend(140),
  },
  {
    id: "c3",
    name: "Renewal Push Q3",
    type: "Broadcast",
    purpose: "Customer Retention",
    goal: "Recover 1,000 expiring policies with a three-channel reminder sequence.",
    status: "Scheduled",
    team: "Retention Squad",
    supervisor: "Bilal Khan",
    createdAt: "18 Mar 2026",
    schedule: "Daily · 10:00",
    progress: 12,
    members: [...humans(["Bilal Khan"], "Human Agent"), aiAgent("Nova", 0)],
    segments: [seg("cs3", "Expiring Policies", "Policies expiring in the next 45 days.", 174)],
    scripts: ["Collection Script"],
    templates: ["Appointment Reminder", "Payment Reminder", "WhatsApp Intro"],
    dataTables: ["Insurance Claims"],
    automations: [
      {
        id: "a5",
        name: "Payment Reminder",
        description: "Sends a payment reminder when an invoice stays unpaid.",
        trigger: "Invoice unpaid for 3 days",
        enabled: true,
        scope: "Library",
      },
    ],
    config: broadcastConfig,
    metrics: {
      calls: 0,
      connected: 0,
      answerRate: 0,
      conversionRate: 0,
      avgDuration: "—",
      revenue: "$0",
    },
    trend: trend(40),
  },
  {
    id: "c4",
    name: "Winback 2026",
    type: "Outbound",
    purpose: "Lead Qualification",
    goal: "Re-engage churned accounts from the last 12 months.",
    status: "Paused",
    team: "Outbound Sales Pod",
    supervisor: "Sara Ahmed",
    createdAt: "04 Apr 2026",
    schedule: "Mon–Fri · 11:00 – 17:00",
    progress: 41,
    members: [...humans(["Sara Ahmed", "Ayesha Malik"], "Human Agent"), aiAgent("Atlas", 0)],
    segments: [seg("cs4", "Churned Accounts", "Cancelled in the last 12 months.", 512)],
    scripts: ["Sales Script"],
    templates: ["Welcome Email"],
    dataTables: ["Property Leads"],
    automations: [],
    config: outboundConfig,
    metrics: {
      calls: 1180,
      connected: 604,
      answerRate: 51,
      conversionRate: 9,
      avgDuration: "2m 51s",
      revenue: "$22,400",
    },
    trend: trend(70),
  },
  {
    id: "c5",
    name: "Feedback Survey",
    type: "Broadcast",
    purpose: "Survey & Research",
    goal: "Collect 2,000 post-service feedback responses.",
    status: "Draft",
    team: "Retention Squad",
    supervisor: "Bilal Khan",
    createdAt: "28 Apr 2026",
    schedule: "Not scheduled",
    progress: 0,
    members: [aiAgent("Echo", 0)],
    segments: [],
    scripts: [],
    templates: ["Thank You SMS"],
    dataTables: ["Customer Survey"],
    automations: [],
    config: broadcastConfig,
    metrics: {
      calls: 0,
      connected: 0,
      answerRate: 0,
      conversionRate: 0,
      avgDuration: "—",
      revenue: "—",
    },
    trend: trend(20),
  },
];

/* ---------------------------------------------------------- Wizard data */

export const availableTeams = [
  { id: "t1", name: "Outbound Sales Pod", supervisor: "Sara Ahmed", humans: 6, ai: 2 },
  { id: "t2", name: "Support Desk", supervisor: "Hina Raza", humans: 4, ai: 1 },
  { id: "t3", name: "Retention Squad", supervisor: "Bilal Khan", humans: 3, ai: 2 },
  { id: "t4", name: "Collections Unit", supervisor: "Omar Farooq", humans: 5, ai: 1 },
];

export const availableAutomations = [
  { id: "au1", name: "Send Follow-up SMS", description: "Follow-up SMS after an unanswered call." },
  { id: "au2", name: "Create Task", description: "Create a callback task for the owner." },
  {
    id: "au3",
    name: "Appointment Reminder",
    description: "Reminder 24 hours before an appointment.",
  },
  { id: "au4", name: "AI Callback", description: "AI agent calls the lead back automatically." },
  { id: "au5", name: "Payment Reminder", description: "Reminder for unpaid invoices." },
  { id: "au6", name: "Move Lead Stage", description: "Advance the lead in the pipeline." },
  { id: "au7", name: "Assign Tags", description: "Tag leads based on call outcome." },
];

export const configFieldsByType: Record<CampaignType, { label: string; hint: string }[]> = {
  Inbound: [
    { label: "Business hours", hint: "08:00 – 20:00" },
    { label: "Queue timeout", hint: "90 seconds" },
    { label: "Overflow routing", hint: "Escalate to Tier 2" },
    { label: "AI receptionist", hint: "Nova" },
  ],
  Outbound: [
    { label: "Dialing mode", hint: "Predictive" },
    { label: "Working hours", hint: "09:00 – 18:00" },
    { label: "Maximum call attempts", hint: "4" },
    { label: "Ring duration", hint: "30 seconds" },
    { label: "Retry delay", hint: "4 hours" },
    { label: "Stop calling rules", hint: "After successful contact" },
  ],
  Broadcast: [
    { label: "Channel", hint: "SMS" },
    { label: "Schedule", hint: "Daily at 10:00" },
    { label: "Sending limits", hint: "1 per contact per day" },
    { label: "Message timing", hint: "12 seconds between messages" },
    { label: "Daily message limit", hint: "5000" },
  ],
};
