/** Frontend-only demo data for the Organization module. */

export type WorkspaceData = {
  companyName: string;
  legalName: string;
  website: string;
  industry: string;
  size: string;
  supportEmail: string;
  phone: string;
  addressLine: string;
  timezone: string;
  weekStart: string;
  businessHoursStart: string;
  businessHoursEnd: string;
  workingDays: string[];
  status: "Active" | "Trial" | "Suspended";
};

export const workspaceSeed: WorkspaceData = {
  companyName: "Quality Dial",
  legalName: "Quality Dial Technologies Ltd.",
  website: "https://qualitydial.com",
  industry: "SaaS / Contact Center",
  size: "51–200 employees",
  supportEmail: "support@qualitydial.com",
  phone: "+92 300 1234567",
  addressLine: "Plot 22, Gulberg III, Lahore, Pakistan",
  timezone: "Asia/Karachi (UTC+5)",
  weekStart: "Monday",
  businessHoursStart: "09:00",
  businessHoursEnd: "18:00",
  workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  status: "Active",
};

export const workspaceTimezones = [
  "Asia/Karachi (UTC+5)",
  "Asia/Dubai (UTC+4)",
  "Europe/London (UTC+1)",
  "America/New_York (UTC-4)",
];

export const industries = [
  "SaaS / Contact Center",
  "Financial Services",
  "Real Estate",
  "Healthcare",
  "E-commerce",
];

export const companySizes = ["1–10 employees", "11–50 employees", "51–200 employees", "200+ employees"];

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const workspaceLimits = [
  { label: "Seats", used: 24, total: 40, unit: "" },
  { label: "AI agents", used: 6, total: 10, unit: "" },
  { label: "Calling minutes", used: 18400, total: 25000, unit: " min" },
  { label: "Knowledge storage", used: 3.4, total: 10, unit: " GB" },
];

export const subscription = {
  plan: "Scale",
  price: "$499 / month",
  billingCycle: "Monthly",
  renews: "24 Sep 2026",
  paymentMethod: "Visa •••• 4242",
  invoices: [
    { id: "INV-2026-08", date: "24 Aug 2026", amount: "$499.00", status: "Paid" },
    { id: "INV-2026-07", date: "24 Jul 2026", amount: "$499.00", status: "Paid" },
    { id: "INV-2026-06", date: "24 Jun 2026", amount: "$462.00", status: "Paid" },
  ],
};

/* ---------------------------------------------------------------- Teams */

export type Team = {
  id: string;
  name: string;
  description: string;
  supervisor: string;
  members: string[];
  aiAgents: string[];
  campaign: string | null;
  createdAt: string;
  active: boolean;
  performance: { calls: number; connectRate: number; conversion: number; avgHandle: string };
  activity: { id: string; text: string; when: string }[];
};

export const teams: Team[] = [
  {
    id: "team-sales",
    name: "Sales Team",
    description: "Outbound revenue pod covering mid-market accounts.",
    supervisor: "Ahmed Raza",
    members: ["Ali Khan", "Sara Malik", "Hamza Iqbal"],
    aiAgents: ["Sales AI 1", "Sales AI 2"],
    campaign: "Summer Sale 2026",
    createdAt: "12 Mar 2026",
    active: true,
    performance: { calls: 4820, connectRate: 42, conversion: 11, avgHandle: "4m 12s" },
    activity: [
      { id: "a1", text: "Sara Malik joined the team", when: "2 days ago" },
      { id: "a2", text: "Campaign “Summer Sale 2026” assigned", when: "5 days ago" },
      { id: "a3", text: "Sales AI 2 enabled", when: "1 week ago" },
    ],
  },
  {
    id: "team-support",
    name: "Support Team",
    description: "Inbound support and escalation handling.",
    supervisor: "Fatima Noor",
    members: ["Bilal Ahmed", "Ayesha Siddiqui"],
    aiAgents: ["Support AI"],
    campaign: "Renewal Outreach",
    createdAt: "02 Feb 2026",
    active: true,
    performance: { calls: 3120, connectRate: 65, conversion: 8, avgHandle: "6m 03s" },
    activity: [{ id: "a1", text: "Support AI re-trained", when: "3 days ago" }],
  },
  {
    id: "team-retention",
    name: "Retention Squad",
    description: "Win-back and churn prevention calling.",
    supervisor: "Usman Tariq",
    members: ["Zoya Rehman"],
    aiAgents: [],
    campaign: null,
    createdAt: "18 Jan 2026",
    active: false,
    performance: { calls: 940, connectRate: 31, conversion: 5, avgHandle: "5m 40s" },
    activity: [{ id: "a1", text: "Team paused by admin", when: "2 weeks ago" }],
  },
];

export const supervisorPool = [
  "Ahmed Raza",
  "Fatima Noor",
  "Usman Tariq",
  "Hina Shah",
  "Daniyal Aslam",
];

export const memberPool = [
  "Ali Khan",
  "Sara Malik",
  "Hamza Iqbal",
  "Bilal Ahmed",
  "Ayesha Siddiqui",
  "Zoya Rehman",
  "Omar Farooq",
  "Nida Hassan",
];

export const campaignPool = [
  "Summer Sale 2026",
  "Renewal Outreach",
  "Winter Promo",
  "Enterprise Expansion",
];

/* -------------------------------------------------------------- Members */

export type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  campaign: string | null;
  status: "Active" | "Invited" | "Deactivated";
  createdAt: string;
  lastLogin: string;
  phone: string;
  jobTitle: string;
  performance: { calls: number; talkTime: string; conversion: number; csat: number };
};

export const members: Member[] = [
  {
    id: "m1",
    name: "Ahmed Raza",
    email: "ahmed@qualitydial.com",
    role: "Supervisor",
    team: "Sales Team",
    campaign: "Summer Sale 2026",
    status: "Active",
    createdAt: "12 Mar 2026",
    lastLogin: "Today, 09:12",
    phone: "+92 301 1122334",
    jobTitle: "Sales Supervisor",
    performance: { calls: 1240, talkTime: "62h 10m", conversion: 14, csat: 4.6 },
  },
  {
    id: "m2",
    name: "Ali Khan",
    email: "ali@qualitydial.com",
    role: "Agent",
    team: "Sales Team",
    campaign: "Summer Sale 2026",
    status: "Active",
    createdAt: "14 Mar 2026",
    lastLogin: "Today, 08:40",
    phone: "+92 302 5566778",
    jobTitle: "Account Executive",
    performance: { calls: 980, talkTime: "48h 22m", conversion: 11, csat: 4.4 },
  },
  {
    id: "m3",
    name: "Sara Malik",
    email: "sara@qualitydial.com",
    role: "Agent",
    team: "Sales Team",
    campaign: "Summer Sale 2026",
    status: "Active",
    createdAt: "20 Mar 2026",
    lastLogin: "Yesterday, 17:55",
    phone: "+92 303 9988776",
    jobTitle: "Sales Development Rep",
    performance: { calls: 760, talkTime: "35h 08m", conversion: 9, csat: 4.7 },
  },
  {
    id: "m4",
    name: "Fatima Noor",
    email: "fatima@qualitydial.com",
    role: "Supervisor",
    team: "Support Team",
    campaign: "Renewal Outreach",
    status: "Active",
    createdAt: "02 Feb 2026",
    lastLogin: "Today, 10:02",
    phone: "+92 304 1231234",
    jobTitle: "Support Lead",
    performance: { calls: 1420, talkTime: "80h 41m", conversion: 7, csat: 4.8 },
  },
  {
    id: "m5",
    name: "Zoya Rehman",
    email: "zoya@qualitydial.com",
    role: "Agent",
    team: "Retention Squad",
    campaign: null,
    status: "Deactivated",
    createdAt: "18 Jan 2026",
    lastLogin: "12 Aug 2026",
    phone: "+92 305 4567890",
    jobTitle: "Retention Specialist",
    performance: { calls: 410, talkTime: "18h 12m", conversion: 6, csat: 4.1 },
  },
  {
    id: "m6",
    name: "Omar Farooq",
    email: "omar@qualitydial.com",
    role: "Admin",
    team: "Unassigned",
    campaign: null,
    status: "Invited",
    createdAt: "28 Aug 2026",
    lastLogin: "—",
    phone: "—",
    jobTitle: "Operations Manager",
    performance: { calls: 0, talkTime: "0h", conversion: 0, csat: 0 },
  },
];

/* ------------------------------------------------------ Roles & permissions */

export const permissionMatrix: { module: string; features: string[] }[] = [
  { module: "Dashboard", features: ["View dashboard", "Export widgets"] },
  { module: "CRM & Leads", features: ["View leads", "Create leads", "Edit leads", "Delete leads", "Manage segments", "Manage tags", "Manage scripts"] },
  { module: "Calling", features: ["Use dialer", "Monitor live calls", "View call history", "Download recordings"] },
  { module: "Campaigns", features: ["View campaigns", "Create campaign", "Assign campaign", "Delete campaign"] },
  { module: "Inbox", features: ["View inbox", "Reply to conversations"] },
  { module: "Reports", features: ["View reports", "Export reports"] },
  { module: "Organization", features: ["View teams", "Manage teams", "Invite members", "Manage roles", "Manage AI agents"] },
  { module: "Settings", features: ["Manage workspace", "Manage automations", "Manage knowledge base", "Manage billing", "Delete workspace"] },
];

export type Role = {
  id: string;
  name: string;
  description: string;
  system: boolean;
  createdAt: string;
  members: string[];
  permissions: string[];
};

const allPermissions = permissionMatrix.flatMap((m) => m.features.map((f) => `${m.module}:${f}`));

export const supervisorPermissions = [
  "Dashboard:View dashboard",
  "CRM & Leads:View leads",
  "CRM & Leads:Create leads",
  "CRM & Leads:Edit leads",
  "Calling:Use dialer",
  "Calling:Monitor live calls",
  "Calling:View call history",
  "Campaigns:View campaigns",
  "Campaigns:Create campaign",
  "Campaigns:Assign campaign",
  "Inbox:View inbox",
  "Inbox:Reply to conversations",
  "Reports:View reports",
  "Organization:View teams",
];

export const roles: Role[] = [
  {
    id: "role-admin",
    name: "Admin",
    description: "Full access to every module, billing and workspace controls.",
    system: true,
    createdAt: "01 Jan 2026",
    members: ["Omar Farooq"],
    permissions: allPermissions,
  },
  {
    id: "role-supervisor",
    name: "Supervisor",
    description: "Runs teams and campaigns, monitors calls, no billing access.",
    system: true,
    createdAt: "01 Jan 2026",
    members: ["Ahmed Raza", "Fatima Noor"],
    permissions: supervisorPermissions,
  },
  {
    id: "role-agent",
    name: "Agent",
    description: "Day-to-day calling and lead handling.",
    system: true,
    createdAt: "01 Jan 2026",
    members: ["Ali Khan", "Sara Malik", "Zoya Rehman"],
    permissions: [
      "Dashboard:View dashboard",
      "CRM & Leads:View leads",
      "CRM & Leads:Edit leads",
      "Calling:Use dialer",
      "Calling:View call history",
      "Inbox:View inbox",
      "Inbox:Reply to conversations",
    ],
  },
  {
    id: "role-analyst",
    name: "Analyst",
    description: "Custom read-only role focused on reporting.",
    system: false,
    createdAt: "14 Jul 2026",
    members: ["Nida Hassan"],
    permissions: ["Dashboard:View dashboard", "Reports:View reports", "Reports:Export reports", "CRM & Leads:View leads"],
  },
];

export const roleNames = ["Admin", "Supervisor", "Agent", "Analyst"];

/* ------------------------------------------------------------- AI agents */

export type AiAgent = {
  id: string;
  name: string;
  persona: string;
  voice: string;
  knowledgeBase: string;
  team: string | null;
  campaign: string | null;
  enabled: boolean;
  status: "On call" | "Idle" | "Training" | "Disabled";
  progress: number;
  prompt: string;
  stats: { calls: number; avgDuration: string; successRate: number; escalations: number };
  history: { id: string; contact: string; outcome: string; duration: string; when: string }[];
};

export const voices = ["Emily (EN-US)", "Daniel (EN-UK)", "Aisha (UR-PK)", "Omar (AR)", "Nova (EN-US)"];
export const knowledgeBases = ["Product Catalog", "Pricing & Discounts", "Support FAQ", "Compliance Handbook"];

export const aiAgentList: AiAgent[] = [
  {
    id: "ai-1",
    name: "Sales AI 1",
    persona: "Consultative outbound closer for mid-market SaaS buyers.",
    voice: "Emily (EN-US)",
    knowledgeBase: "Product Catalog",
    team: "Sales Team",
    campaign: "Summer Sale 2026",
    enabled: true,
    status: "On call",
    progress: 72,
    prompt: "You are a friendly sales specialist for Quality Dial. Qualify the lead, uncover pain, and book a demo.",
    stats: { calls: 1820, avgDuration: "3m 48s", successRate: 24, escalations: 46 },
    history: [
      { id: "h1", contact: "Nadia Sheikh", outcome: "Demo booked", duration: "4m 20s", when: "12 min ago" },
      { id: "h2", contact: "Kamran Butt", outcome: "Not interested", duration: "1m 05s", when: "48 min ago" },
      { id: "h3", contact: "Hassan Ali", outcome: "Callback scheduled", duration: "2m 55s", when: "2 hours ago" },
    ],
  },
  {
    id: "ai-2",
    name: "Sales AI 2",
    persona: "High-volume qualifier for cold lists.",
    voice: "Nova (EN-US)",
    knowledgeBase: "Pricing & Discounts",
    team: "Sales Team",
    campaign: "Summer Sale 2026",
    enabled: true,
    status: "Idle",
    progress: 41,
    prompt: "Qualify leads in under two minutes using BANT and hand warm leads to a human agent.",
    stats: { calls: 2410, avgDuration: "1m 52s", successRate: 17, escalations: 88 },
    history: [{ id: "h1", contact: "Rida Anwar", outcome: "Transferred", duration: "2m 10s", when: "35 min ago" }],
  },
  {
    id: "ai-3",
    name: "Support AI",
    persona: "Tier-1 support resolution and ticket triage.",
    voice: "Daniel (EN-UK)",
    knowledgeBase: "Support FAQ",
    team: "Support Team",
    campaign: "Renewal Outreach",
    enabled: true,
    status: "On call",
    progress: 88,
    prompt: "Resolve common support issues, escalate billing questions to a human supervisor.",
    stats: { calls: 3140, avgDuration: "5m 12s", successRate: 61, escalations: 210 },
    history: [{ id: "h1", contact: "Areeba Khan", outcome: "Resolved", duration: "6m 02s", when: "8 min ago" }],
  },
  {
    id: "ai-4",
    name: "Retention AI",
    persona: "Win-back specialist for churned accounts.",
    voice: "Aisha (UR-PK)",
    knowledgeBase: "Compliance Handbook",
    team: null,
    campaign: null,
    enabled: false,
    status: "Disabled",
    progress: 12,
    prompt: "Reach out to lapsed customers with a tailored win-back offer.",
    stats: { calls: 320, avgDuration: "4m 01s", successRate: 9, escalations: 12 },
    history: [],
  },
];
