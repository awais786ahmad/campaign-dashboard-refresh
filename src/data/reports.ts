/** Frontend-only demo data for the Reports & Analytics module. */

import type { Sentiment } from "@/data/calling";

export const datePresets = [
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
  "This month",
  "Last month",
  "Custom range",
];

export const filterCampaigns = [
  "Summer Sale",
  "Renewal Push Q3",
  "Spring Outbound",
  "Winback 2026",
  "Insurance Claims",
  "Demo Follow-ups",
];

export const filterTeams = ["Outbound Sales", "Renewals", "Support", "Winback", "Demo Desk"];

export const filterAgents = [
  "Sara Ahmed",
  "Bilal Khan",
  "Hina Raza",
  "Ahmed Siddiqui",
  "Sales AI",
  "Support AI",
  "AI Agent — Nova",
];

export const filterOutcomes = [
  "Interested",
  "Qualified",
  "Converted",
  "Follow-up",
  "No answer",
  "Not interested",
  "Rejected",
];

export const filterDirections = ["Outbound", "Inbound", "Broadcast"];
export const filterKinds = ["Human", "AI"];
export const filterSegments = ["VIP", "Imported leads", "Website leads", "Returning customers"];
export const qaBands = ["90–100", "80–89", "70–79", "60–69", "Below 60"];

/* ------------------------------------------------------------------- KPIs */

export type Kpi = {
  id: string;
  label: string;
  value: string;
  delta: number;
  hint: string;
  trend: number[];
};

export const overviewKpis: Kpi[] = [
  { id: "calls", label: "Total calls", value: "24,850", delta: 12.4, hint: "vs previous period", trend: [18, 22, 20, 26, 24, 30, 34] },
  { id: "connected", label: "Connected", value: "18,420", delta: 8.2, hint: "74.1% of attempts", trend: [14, 16, 15, 19, 18, 22, 25] },
  { id: "connect-rate", label: "Connect rate", value: "74.1%", delta: 2.1, hint: "connected / attempts", trend: [68, 70, 69, 72, 73, 73, 74] },
  { id: "duration", label: "Avg duration", value: "04:32", delta: -3.2, hint: "talk time per call", trend: [300, 295, 288, 284, 279, 275, 272] },
  { id: "conversions", label: "Conversions", value: "2,840", delta: 18.4, hint: "converted leads", trend: [180, 210, 230, 245, 260, 275, 284] },
  { id: "conversion-rate", label: "Conversion rate", value: "15.4%", delta: 4.6, hint: "conversions / connected", trend: [11, 12, 12.6, 13.4, 14.1, 14.8, 15.4] },
];

export type ActivityPoint = {
  label: string;
  attempts: number;
  connected: number;
  missed: number;
  conversions: number;
  minutes: number;
};

export const activityDaily: ActivityPoint[] = [
  { label: "Mon", attempts: 3820, connected: 2840, missed: 720, conversions: 402, minutes: 12800 },
  { label: "Tue", attempts: 4120, connected: 3080, missed: 780, conversions: 448, minutes: 13900 },
  { label: "Wed", attempts: 3980, connected: 2960, missed: 690, conversions: 421, minutes: 13200 },
  { label: "Thu", attempts: 4380, connected: 3320, missed: 740, conversions: 502, minutes: 14650 },
  { label: "Fri", attempts: 4210, connected: 3140, missed: 810, conversions: 478, minutes: 14100 },
  { label: "Sat", attempts: 2340, connected: 1720, missed: 460, conversions: 302, minutes: 7600 },
  { label: "Sun", attempts: 2000, connected: 1360, missed: 380, conversions: 287, minutes: 6100 },
];

export const activityHourly: ActivityPoint[] = [
  "09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00",
].map((label, i) => ({
  label,
  attempts: 280 + ((i * 97) % 240),
  connected: 190 + ((i * 71) % 180),
  missed: 40 + ((i * 23) % 60),
  conversions: 24 + ((i * 13) % 40),
  minutes: 900 + ((i * 137) % 700),
}));

export const activityWeekly: ActivityPoint[] = [
  { label: "W1", attempts: 21400, connected: 15800, missed: 3900, conversions: 2210, minutes: 71200 },
  { label: "W2", attempts: 22800, connected: 16900, missed: 4100, conversions: 2440, minutes: 74600 },
  { label: "W3", attempts: 23900, connected: 17600, missed: 4300, conversions: 2620, minutes: 78100 },
  { label: "W4", attempts: 24850, connected: 18420, missed: 4380, conversions: 2840, minutes: 81400 },
];

export const funnelStages = [
  { stage: "Attempts", value: 24850 },
  { stage: "Connected", value: 18420 },
  { stage: "Conversations", value: 11240 },
  { stage: "Interested", value: 3147 },
  { stage: "Qualified", value: 2832 },
  { stage: "Converted", value: 2380 },
];

export const outcomeBreakdown = [
  { outcome: "Interested", value: 3147, tone: "bg-emerald-500" },
  { outcome: "Qualified", value: 2832, tone: "bg-teal-500" },
  { outcome: "Follow-up", value: 2410, tone: "bg-sky-500" },
  { outcome: "No answer", value: 4180, tone: "bg-amber-500" },
  { outcome: "Not interested", value: 2960, tone: "bg-orange-500" },
  { outcome: "Rejected", value: 1180, tone: "bg-rose-500" },
  { outcome: "Other", value: 921, tone: "bg-muted-foreground" },
];

export const humanVsAi = [
  { metric: "Calls", human: "12,400", ai: "12,450" },
  { metric: "Connect rate", human: "72%", ai: "76%" },
  { metric: "Avg duration", human: "04:45", ai: "03:58" },
  { metric: "Conversions", human: "1,120", ai: "1,260" },
  { metric: "Conversion rate", human: "9.0%", ai: "10.1%" },
  { metric: "Avg QA", human: "86", ai: "91" },
  { metric: "Escalations", human: "420", ai: "180" },
];

export type TeamRow = {
  team: string;
  calls: number;
  connect: number;
  conversion: number | null;
  qa: number;
  talkTime: string;
  avgDuration: string;
  agents: number;
};

export const teamRows: TeamRow[] = [
  { team: "Outbound Sales", calls: 8420, connect: 78, conversion: 14.2, qa: 91, talkTime: "620h", avgDuration: "04:12", agents: 14 },
  { team: "Support", calls: 5210, connect: 81, conversion: null, qa: 94, talkTime: "540h", avgDuration: "06:02", agents: 11 },
  { team: "Renewals", calls: 4120, connect: 73, conversion: 18.1, qa: 89, talkTime: "412h", avgDuration: "05:10", agents: 8 },
  { team: "Winback", calls: 3820, connect: 68, conversion: 9.4, qa: 84, talkTime: "298h", avgDuration: "04:38", agents: 6 },
  { team: "Demo Desk", calls: 3280, connect: 84, conversion: 21.6, qa: 93, talkTime: "342h", avgDuration: "06:24", agents: 5 },
];

export type AgentRow = {
  id: string;
  name: string;
  kind: "Human" | "AI";
  team: string;
  calls: number;
  connected: number;
  connect: number;
  avgDuration: string;
  conversions: number;
  conversion: number;
  qa: number;
  positive: number;
  transfers: number;
  escalations: number;
  resolution?: number;
  insights: { tone: "good" | "warn"; text: string }[];
  recommendation: string;
  byCampaign: { campaign: string; calls: number; conversion: number; qa: number }[];
};

export const agentRows: AgentRow[] = [
  {
    id: "a1", name: "Sara Ahmed", kind: "Human", team: "Outbound Sales", calls: 1840, connected: 1436, connect: 78,
    avgDuration: "04:21", conversions: 280, conversion: 15.2, qa: 94, positive: 71, transfers: 42, escalations: 12,
    insights: [
      { tone: "good", text: "Strong objection handling — 96 average on price objections." },
      { tone: "warn", text: "Closing score decreased 8% over the last two weeks." },
      { tone: "good", text: "High conversion on warm leads (22%)." },
    ],
    recommendation: "Improve closing consistency: always confirm the next action and date.",
    byCampaign: [
      { campaign: "Summer Sale", calls: 940, conversion: 16.8, qa: 95 },
      { campaign: "Spring Outbound", calls: 520, conversion: 13.1, qa: 92 },
      { campaign: "Renewal Push Q3", calls: 380, conversion: 14.4, qa: 94 },
    ],
  },
  {
    id: "a2", name: "Bilal Khan", kind: "Human", team: "Renewals", calls: 1620, connected: 1150, connect: 71,
    avgDuration: "05:02", conversions: 214, conversion: 13.2, qa: 88, positive: 62, transfers: 61, escalations: 28,
    insights: [
      { tone: "warn", text: "Escalation rate is 2x the team average." },
      { tone: "good", text: "Compliance statements scored 98 across reviewed calls." },
    ],
    recommendation: "Coach on de-escalation for billing disputes before transferring.",
    byCampaign: [
      { campaign: "Renewal Push Q3", calls: 880, conversion: 15.2, qa: 90 },
      { campaign: "Insurance Claims", calls: 740, conversion: 10.8, qa: 86 },
    ],
  },
  {
    id: "a3", name: "Hina Raza", kind: "Human", team: "Winback", calls: 1480, connected: 1006, connect: 68,
    avgDuration: "04:38", conversions: 118, conversion: 8.0, qa: 84, positive: 55, transfers: 28, escalations: 14,
    insights: [
      { tone: "warn", text: "Lowest connect rate in the workspace — dialling window is late." },
      { tone: "good", text: "Most improved QA this month (+6)." },
    ],
    recommendation: "Move dialling window to 11:00–15:00 where connect rate peaks.",
    byCampaign: [
      { campaign: "Winback 2026", calls: 1180, conversion: 8.4, qa: 84 },
      { campaign: "Summer Sale", calls: 300, conversion: 6.6, qa: 83 },
    ],
  },
  {
    id: "a4", name: "Ahmed Siddiqui", kind: "Human", team: "Support", calls: 1290, connected: 1045, connect: 81,
    avgDuration: "06:12", conversions: 0, conversion: 0, qa: 93, positive: 74, transfers: 34, escalations: 9,
    insights: [
      { tone: "good", text: "Highest empathy score on the support team." },
      { tone: "warn", text: "Average handle time 18% above target." },
    ],
    recommendation: "Use the knowledge base shortcuts to reduce handle time.",
    byCampaign: [{ campaign: "Insurance Claims", calls: 1290, conversion: 0, qa: 93 }],
  },
  {
    id: "a5", name: "Sales AI", kind: "AI", team: "Outbound Sales", calls: 8420, connected: 6420, connect: 76,
    avgDuration: "03:58", conversions: 1196, conversion: 14.2, qa: 94, positive: 72, transfers: 210, escalations: 680,
    resolution: 81,
    insights: [
      { tone: "good", text: "14% higher conversion than the human sales team." },
      { tone: "warn", text: "Escalates 8% of calls — mostly pricing exceptions." },
    ],
    recommendation: "Add discount-approval rules to the agent knowledge base.",
    byCampaign: [
      { campaign: "Summer Sale", calls: 5200, conversion: 15.1, qa: 95 },
      { campaign: "Spring Outbound", calls: 3220, conversion: 12.8, qa: 92 },
    ],
  },
  {
    id: "a6", name: "Support AI", kind: "AI", team: "Support", calls: 5210, connected: 4310, connect: 83,
    avgDuration: "03:12", conversions: 0, conversion: 0, qa: 96, positive: 79, transfers: 96, escalations: 172,
    resolution: 92,
    insights: [
      { tone: "good", text: "92% self-resolution rate — highest in the workspace." },
      { tone: "good", text: "Negative sentiment under 5%." },
    ],
    recommendation: "Expand coverage to after-hours claims calls.",
    byCampaign: [{ campaign: "Insurance Claims", calls: 5210, conversion: 0, qa: 96 }],
  },
  {
    id: "a7", name: "AI Agent — Nova", kind: "AI", team: "Renewals", calls: 4120, connected: 2980, connect: 72,
    avgDuration: "03:24", conversions: 486, conversion: 11.8, qa: 89, positive: 64, transfers: 142, escalations: 240,
    resolution: 74,
    insights: [
      { tone: "warn", text: "Abandonment spikes after 30 seconds on the Renewal script." },
      { tone: "good", text: "Books 38% of callbacks without human help." },
    ],
    recommendation: "Shorten the opening of the renewal script by two sentences.",
    byCampaign: [{ campaign: "Renewal Push Q3", calls: 4120, conversion: 11.8, qa: 89 }],
  },
];

export type CampaignRow = {
  id: string;
  name: string;
  type: "Inbound" | "Outbound" | "Broadcast";
  status: "Active" | "Paused" | "Completed";
  leads: number;
  calls: number;
  connected: number;
  connect: number;
  conversions: number;
  conversion: number;
  qa: number;
  avgDuration: string;
  positive: number;
  critical: number;
  humanCalls: number;
  aiCalls: number;
  inbound: number;
  outbound: number;
  leadStages: { stage: string; value: number }[];
  timeline: { label: string; calls: number; conversions: number }[];
  topics: { label: string; value: number }[];
  objections: { label: string; value: number }[];
};

export const campaignRows: CampaignRow[] = [
  {
    id: "c1", name: "Summer Sale", type: "Outbound", status: "Active", leads: 12400, calls: 8420, connected: 6420,
    connect: 76, conversions: 920, conversion: 14.3, qa: 92, avgDuration: "04:12", positive: 71, critical: 18,
    humanCalls: 3220, aiCalls: 5200, inbound: 380, outbound: 8040,
    leadStages: [
      { stage: "Contacted", value: 9800 }, { stage: "Interested", value: 2410 },
      { stage: "Qualified", value: 1420 }, { stage: "Follow-up", value: 980 }, { stage: "Converted", value: 920 },
    ],
    timeline: [
      { label: "W1", calls: 1820, conversions: 180 }, { label: "W2", calls: 2140, conversions: 224 },
      { label: "W3", calls: 2180, conversions: 246 }, { label: "W4", calls: 2280, conversions: 270 },
    ],
    topics: [
      { label: "Pricing", value: 2420 }, { label: "Features", value: 1820 },
      { label: "Delivery", value: 980 }, { label: "Support", value: 640 },
    ],
    objections: [
      { label: "Too expensive", value: 820 }, { label: "Need to think", value: 610 },
      { label: "Competitor cheaper", value: 380 },
    ],
  },
  {
    id: "c2", name: "Renewal Push Q3", type: "Outbound", status: "Active", leads: 7800, calls: 5210, connected: 4210,
    connect: 81, conversions: 820, conversion: 19.4, qa: 89, avgDuration: "05:10", positive: 64, critical: 26,
    humanCalls: 1090, aiCalls: 4120, inbound: 210, outbound: 5000,
    leadStages: [
      { stage: "Contacted", value: 6200 }, { stage: "Interested", value: 1840 },
      { stage: "Qualified", value: 1120 }, { stage: "Follow-up", value: 720 }, { stage: "Converted", value: 820 },
    ],
    timeline: [
      { label: "W1", calls: 1180, conversions: 172 }, { label: "W2", calls: 1320, conversions: 198 },
      { label: "W3", calls: 1360, conversions: 218 }, { label: "W4", calls: 1350, conversions: 232 },
    ],
    topics: [
      { label: "Renewal price", value: 1840 }, { label: "Coverage", value: 1120 },
      { label: "Cancellation", value: 740 },
    ],
    objections: [
      { label: "Price increase", value: 640 }, { label: "Considering leaving", value: 410 },
      { label: "Need manager approval", value: 220 },
    ],
  },
  {
    id: "c3", name: "Spring Outbound", type: "Outbound", status: "Active", leads: 6400, calls: 4180, connected: 2980,
    connect: 71, conversions: 402, conversion: 13.5, qa: 87, avgDuration: "04:02", positive: 66, critical: 14,
    humanCalls: 960, aiCalls: 3220, inbound: 60, outbound: 4120,
    leadStages: [
      { stage: "Contacted", value: 4980 }, { stage: "Interested", value: 1210 },
      { stage: "Qualified", value: 640 }, { stage: "Follow-up", value: 520 }, { stage: "Converted", value: 402 },
    ],
    timeline: [
      { label: "W1", calls: 980, conversions: 88 }, { label: "W2", calls: 1060, conversions: 96 },
      { label: "W3", calls: 1080, conversions: 104 }, { label: "W4", calls: 1060, conversions: 114 },
    ],
    topics: [{ label: "Features", value: 1240 }, { label: "Pricing", value: 980 }, { label: "Onboarding", value: 520 }],
    objections: [{ label: "Not interested", value: 720 }, { label: "Bad timing", value: 340 }],
  },
  {
    id: "c4", name: "Winback 2026", type: "Outbound", status: "Paused", leads: 5200, calls: 3820, connected: 2600,
    connect: 68, conversions: 306, conversion: 11.8, qa: 84, avgDuration: "04:38", positive: 54, critical: 32,
    humanCalls: 3820, aiCalls: 0, inbound: 40, outbound: 3780,
    leadStages: [
      { stage: "Contacted", value: 4100 }, { stage: "Interested", value: 840 },
      { stage: "Qualified", value: 460 }, { stage: "Follow-up", value: 380 }, { stage: "Converted", value: 306 },
    ],
    timeline: [
      { label: "W1", calls: 1120, conversions: 82 }, { label: "W2", calls: 980, conversions: 74 },
      { label: "W3", calls: 900, conversions: 78 }, { label: "W4", calls: 820, conversions: 72 },
    ],
    topics: [{ label: "Why they left", value: 1120 }, { label: "Discount", value: 860 }],
    objections: [{ label: "Bad past experience", value: 480 }, { label: "Competitor cheaper", value: 300 }],
  },
  {
    id: "c5", name: "Insurance Claims", type: "Inbound", status: "Active", leads: 4200, calls: 6500, connected: 5940,
    connect: 91, conversions: 0, conversion: 0, qa: 95, avgDuration: "06:02", positive: 76, critical: 12,
    humanCalls: 1290, aiCalls: 5210, inbound: 6440, outbound: 60,
    leadStages: [
      { stage: "Contacted", value: 4200 }, { stage: "Interested", value: 0 },
      { stage: "Qualified", value: 0 }, { stage: "Follow-up", value: 640 }, { stage: "Converted", value: 0 },
    ],
    timeline: [
      { label: "W1", calls: 1520, conversions: 0 }, { label: "W2", calls: 1640, conversions: 0 },
      { label: "W3", calls: 1680, conversions: 0 }, { label: "W4", calls: 1660, conversions: 0 },
    ],
    topics: [{ label: "Claim status", value: 2840 }, { label: "Documents", value: 1420 }, { label: "Refunds", value: 640 }],
    objections: [{ label: "Claim rejected", value: 420 }, { label: "Slow response", value: 260 }],
  },
  {
    id: "c6", name: "Demo Follow-ups", type: "Outbound", status: "Active", leads: 2800, calls: 3280, connected: 2760,
    connect: 84, conversions: 392, conversion: 21.6, qa: 93, avgDuration: "06:24", positive: 78, critical: 6,
    humanCalls: 1680, aiCalls: 1600, inbound: 120, outbound: 3160,
    leadStages: [
      { stage: "Contacted", value: 2640 }, { stage: "Interested", value: 980 },
      { stage: "Qualified", value: 620 }, { stage: "Follow-up", value: 410 }, { stage: "Converted", value: 392 },
    ],
    timeline: [
      { label: "W1", calls: 780, conversions: 86 }, { label: "W2", calls: 820, conversions: 94 },
      { label: "W3", calls: 840, conversions: 102 }, { label: "W4", calls: 840, conversions: 110 },
    ],
    topics: [{ label: "Implementation", value: 980 }, { label: "Pricing", value: 720 }, { label: "Security", value: 420 }],
    objections: [{ label: "Need approval", value: 280 }, { label: "Timeline too fast", value: 180 }],
  },
];

/* ------------------------------------------------------------ Lead & automation */

export const leadMetrics = [
  { label: "Total leads", value: "38,820" },
  { label: "Contacted", value: "27,420" },
  { label: "Contact rate", value: "70.6%" },
  { label: "Interested", value: "7,280" },
  { label: "Qualified", value: "4,260" },
  { label: "Converted", value: "2,840" },
];

export const leadFunnel = [
  { stage: "Total leads", value: 38820 },
  { stage: "Contacted", value: 27420 },
  { stage: "Connected", value: 18420 },
  { stage: "Interested", value: 7280 },
  { stage: "Qualified", value: 4260 },
  { stage: "Converted", value: 2840 },
];

export const segmentPerformance = [
  { segment: "VIP", leads: 2400, contact: 81, conversion: 22 },
  { segment: "Imported leads", leads: 8200, contact: 62, conversion: 11 },
  { segment: "Website leads", leads: 1820, contact: 76, conversion: 18 },
  { segment: "Returning customers", leads: 3120, contact: 69, conversion: 15 },
];

export const automationStats = [
  { label: "Executions", value: "12,420" },
  { label: "Successful", value: "11,980" },
  { label: "Failed", value: "440" },
  { label: "Success rate", value: "96.4%" },
];

export const automationRows = [
  { name: "Follow-up SMS", runs: 4200, success: 98, failed: 2 },
  { name: "Lead assignment", runs: 3800, success: 99, failed: 1 },
  { name: "AI follow-up call", runs: 2420, success: 94, failed: 6 },
  { name: "Missed call reminder", runs: 1180, success: 97, failed: 3 },
  { name: "Escalation alert", runs: 820, success: 95, failed: 5 },
];

export const aiInsights = [
  { tone: "good" as const, title: "Conversion rate increased 18% this week", body: "The largest improvement came from the Outbound Sales team on Summer Sale. Top factor: shorter response time after lead connection." },
  { tone: "warn" as const, title: "Negative sentiment increased 12%", body: "Mostly on Winback 2026 — leads mention a bad past experience within the first 30 seconds." },
  { tone: "warn" as const, title: "Support team QA dropped 6%", body: "Closing and follow-up categories fell the most. 14 calls missed a confirmed next action." },
  { tone: "good" as const, title: "Sales AI converts 14% better than humans", body: "Sales AI holds a 15.1% conversion rate on Summer Sale versus 13.2% for the human team." },
  { tone: "warn" as const, title: "Renewal Push has high early abandonment", body: "Abandonment spikes after 30 seconds. The script opening is 2 sentences longer than other campaigns." },
];

/* ------------------------------------------------------------------- Calls */

export type TranscriptLine = { at: number; speaker: "Agent" | "Customer"; text: string };

export type QaCategoryScore = { category: string; ai: number; manual: number | null; note?: string | undefined };

export type ReportCall = {
  id: string;
  code: string;
  when: string;
  lead: string;
  number: string;
  email: string;
  segment: string;
  leadStage: string;
  tags: string[];
  agent: string;
  agentKind: "Human" | "AI";
  team: string;
  campaign: string;
  direction: "Outbound" | "Inbound";
  duration: string;
  seconds: number;
  outcome: string;
  sentiment: Sentiment;
  qaScore: number;
  qaType: "AI" | "Manual" | "Both" | "None";
  reviewer: string;
  qaStatus: "Reviewed" | "Needs review";
  critical: string | null;
  recording: boolean;
  transcriptReady: boolean;
  escalated: boolean;
  summary: string;
  intent: string;
  topics: string[];
  questions: string[];
  objections: string[];
  nextAction: string;
  outcomeReason: string;
  coaching: string;
  sentimentSplit: { positive: number; neutral: number; negative: number };
  sentimentTimeline: { at: string; score: number }[];
  transcript: TranscriptLine[];
  qa: QaCategoryScore[];
  notes: { id: string; who: string; kind: "Agent" | "AI" | "System"; when: string; text: string }[];
  timeline: { at: string; event: string }[];
  timings: { wait: string; talk: string; hold: string; transfer: string };
};

export const qaCategories = [
  "Greeting",
  "Identity & verification",
  "Script compliance",
  "Product knowledge",
  "Objection handling",
  "Communication",
  "Empathy",
  "Compliance",
  "Resolution",
  "Closing",
  "Follow-up",
];

const transcriptA: TranscriptLine[] = [
  { at: 4, speaker: "Agent", text: "Hello, this is Sara from Quality Dial. Am I speaking with Ali Khan?" },
  { at: 12, speaker: "Customer", text: "Yes, that's me. I'm calling about the pricing." },
  { at: 21, speaker: "Agent", text: "Absolutely. Let me walk you through the plans and what changed this quarter." },
  { at: 46, speaker: "Customer", text: "That sounds interesting, but the monthly price feels high for us." },
  { at: 62, speaker: "Agent", text: "I hear you. On the annual plan it comes to about 12% less for the same coverage." },
  { at: 88, speaker: "Customer", text: "Okay. Can I cancel anytime if it doesn't work out?" },
  { at: 104, speaker: "Agent", text: "Yes — monthly plans cancel any time, annual plans cancel at renewal." },
  { at: 138, speaker: "Customer", text: "Good. Send me the comparison and I'll confirm with my manager." },
  { at: 160, speaker: "Agent", text: "I'll email the comparison today and follow up on Thursday." },
];

const transcriptB: TranscriptLine[] = [
  { at: 3, speaker: "Agent", text: "Hi, this is Sales AI from Quality Dial calling about your renewal." },
  { at: 11, speaker: "Customer", text: "I've been meaning to ask — is the price going up again?" },
  { at: 24, speaker: "Agent", text: "Your renewal stays flat this year, and the new tier adds call recording." },
  { at: 52, speaker: "Customer", text: "That's better than I expected. Let's move ahead." },
  { at: 70, speaker: "Agent", text: "Great, I'll send the confirmation now and your renewal is set." },
];

const transcriptC: TranscriptLine[] = [
  { at: 2, speaker: "Customer", text: "I was charged twice last month and nobody called me back." },
  { at: 14, speaker: "Agent", text: "I'm sorry about that. Let me pull up the billing record now." },
  { at: 40, speaker: "Customer", text: "This is the third time I'm explaining this." },
  { at: 58, speaker: "Agent", text: "I understand. I'm escalating this to the claims desk right now." },
  { at: 92, speaker: "Customer", text: "I want it fixed this week or I'm cancelling." },
  { at: 120, speaker: "Agent", text: "You'll get a written response within 48 hours. Ticket 4821." },
];

function qa(values: Partial<Record<string, [number, number | null, string?]>>): QaCategoryScore[] {
  return qaCategories.map((category) => {
    const v = values[category];
    return { category, ai: v?.[0] ?? 90, manual: v?.[1] ?? null, note: v?.[2] };
  });
}

export const reportCalls: ReportCall[] = [
  {
    id: "rc1", code: "QD-18293", when: "10 Sep 2026, 11:20", lead: "Ali Khan", number: "+92 300 1234567",
    email: "ali.khan@northgate.pk", segment: "VIP", leadStage: "Qualified", tags: ["VIP", "High budget"],
    agent: "Sara Ahmed", agentKind: "Human", team: "Outbound Sales", campaign: "Summer Sale",
    direction: "Outbound", duration: "04:21", seconds: 261, outcome: "Qualified", sentiment: "Positive",
    qaScore: 94, qaType: "Both", reviewer: "John Meyer", qaStatus: "Reviewed", critical: null,
    recording: true, transcriptReady: true, escalated: false,
    summary: "Ali is interested in upgrading but wants the annual comparison before confirming with his manager. Follow-up agreed for Thursday.",
    intent: "Interested in upgrading plan",
    topics: ["Pricing", "Features", "Implementation", "Support"],
    questions: ["What is the monthly price?", "Can I cancel anytime?"],
    objections: ["Monthly price is considered high"],
    nextAction: "Email the annual comparison today, follow up Thursday.",
    outcomeReason: "Customer requested a follow-up before making a purchase decision.",
    coaching: "The price objection was handled well, but the agent never asked for the sale again after resolving it.",
    sentimentSplit: { positive: 72, neutral: 20, negative: 8 },
    sentimentTimeline: [
      { at: "00:00", score: 60 }, { at: "01:00", score: 48 }, { at: "02:00", score: 66 },
      { at: "03:00", score: 78 }, { at: "04:00", score: 82 },
    ],
    transcript: transcriptA,
    qa: qa({
      Greeting: [96, 94], "Identity & verification": [95, 96], "Script compliance": [93, 92],
      "Product knowledge": [92, 90], "Objection handling": [96, 95, "Handled the price objection with the annual comparison."],
      Communication: [94, 93], Empathy: [92, 92], Compliance: [98, 97],
      Resolution: [90, 88], Closing: [82, 85, "Did not re-ask for the commitment after the objection."],
      "Follow-up": [95, 94],
    }),
    notes: [
      { id: "n1", who: "Sara Ahmed", kind: "Agent", when: "10 Sep, 11:27", text: "Send the 3-seat pilot proposal by Thursday." },
      { id: "n2", who: "AI Copilot", kind: "AI", when: "10 Sep, 11:26", text: "Lead asked about SSO twice — include the security one-pager." },
      { id: "n3", who: "System", kind: "System", when: "10 Sep, 11:25", text: "Follow-up task created for Thursday 15:00." },
    ],
    timeline: [
      { at: "11:20:02", event: "Call started (outbound)" },
      { at: "11:20:14", event: "Lead connected" },
      { at: "11:22:40", event: "Objection detected: pricing" },
      { at: "11:24:23", event: "Call ended — Qualified" },
      { at: "11:25:01", event: "Follow-up task created" },
      { at: "11:26:10", event: "AI summary generated" },
    ],
    timings: { wait: "00:08", talk: "04:13", hold: "00:00", transfer: "00:00" },
  },
  {
    id: "rc2", code: "QD-18294", when: "10 Sep 2026, 10:02", lead: "Sana Javed", number: "+92 331 5550188",
    email: "sana.javed@meridian.pk", segment: "Returning customers", leadStage: "Converted", tags: ["Renewal"],
    agent: "Sales AI", agentKind: "AI", team: "Outbound Sales", campaign: "Renewal Push Q3",
    direction: "Outbound", duration: "03:14", seconds: 194, outcome: "Converted", sentiment: "Positive",
    qaScore: 91, qaType: "AI", reviewer: "AI", qaStatus: "Reviewed", critical: null,
    recording: true, transcriptReady: true, escalated: false,
    summary: "Renewal confirmed on the flat-price tier. Confirmation email sent automatically.",
    intent: "Confirm renewal terms",
    topics: ["Renewal price", "Call recording", "Coverage"],
    questions: ["Is the price going up again?"],
    objections: [],
    nextAction: "No action required — renewal confirmed.",
    outcomeReason: "Flat renewal price removed the only objection.",
    coaching: "Strong, efficient close. Could offer the annual upsell next time.",
    sentimentSplit: { positive: 84, neutral: 14, negative: 2 },
    sentimentTimeline: [
      { at: "00:00", score: 62 }, { at: "01:00", score: 70 }, { at: "02:00", score: 84 }, { at: "03:00", score: 88 },
    ],
    transcript: transcriptB,
    qa: qa({
      Greeting: [96, null], "Script compliance": [98, null], "Product knowledge": [94, null],
      "Objection handling": [92, null], Closing: [95, null], Compliance: [99, null],
    }),
    notes: [{ id: "n4", who: "Sales AI", kind: "AI", when: "10 Sep, 10:06", text: "Renewal confirmed; invoice scheduled." }],
    timeline: [
      { at: "10:02:00", event: "Call started (outbound, AI)" },
      { at: "10:02:09", event: "Lead connected" },
      { at: "10:05:14", event: "Call ended — Converted" },
      { at: "10:05:20", event: "Confirmation email sent" },
    ],
    timings: { wait: "00:06", talk: "03:08", hold: "00:00", transfer: "00:00" },
  },
  {
    id: "rc3", code: "QD-18295", when: "9 Sep 2026, 16:40", lead: "Kamran Ali", number: "+92 302 5550903",
    email: "kamran.ali@zenith.pk", segment: "Imported leads", leadStage: "Escalated", tags: [],
    agent: "Bilal Khan", agentKind: "Human", team: "Renewals", campaign: "Insurance Claims",
    direction: "Inbound", duration: "06:32", seconds: 392, outcome: "Follow-up", sentiment: "Negative",
    qaScore: 72, qaType: "Both", reviewer: "John Meyer", qaStatus: "Needs review",
    critical: "Missed required verification", recording: true, transcriptReady: true, escalated: true,
    summary: "Customer disputing a double charge with no prior follow-up. Escalated to the claims desk with a 48-hour written response promised.",
    intent: "Resolve a billing dispute",
    topics: ["Billing", "Double charge", "Cancellation risk"],
    questions: ["When will I get my refund?"],
    objections: ["Threatening to cancel"],
    nextAction: "Claims desk response within 48 hours (ticket 4821).",
    outcomeReason: "Issue could not be resolved on the call — required claims desk.",
    coaching: "Verification step was skipped before discussing billing details. Acknowledge the repeat contact earlier.",
    sentimentSplit: { positive: 8, neutral: 22, negative: 70 },
    sentimentTimeline: [
      { at: "00:00", score: 40 }, { at: "01:30", score: 24 }, { at: "03:00", score: 18 },
      { at: "04:30", score: 26 }, { at: "06:00", score: 34 },
    ],
    transcript: transcriptC,
    qa: qa({
      Greeting: [84, 82], "Identity & verification": [42, 40, "Account was not verified before discussing billing."],
      "Script compliance": [70, 72], "Product knowledge": [78, 80],
      "Objection handling": [66, 70], Communication: [80, 78], Empathy: [74, 72],
      Compliance: [58, 60, "Required disclosure not read."], Resolution: [62, 64],
      Closing: [76, 78], "Follow-up": [88, 86],
    }),
    notes: [
      { id: "n5", who: "Bilal Khan", kind: "Agent", when: "9 Sep, 16:55", text: "Escalated to claims desk — ticket #4821." },
      { id: "n6", who: "System", kind: "System", when: "9 Sep, 16:52", text: "Escalation alert sent to supervisor." },
    ],
    timeline: [
      { at: "16:40:00", event: "Inbound call received" },
      { at: "16:40:22", event: "Answered by Bilal Khan" },
      { at: "16:43:10", event: "Negative sentiment detected" },
      { at: "16:46:32", event: "Escalated to claims desk" },
      { at: "16:46:52", event: "Call ended — Follow-up" },
    ],
    timings: { wait: "00:22", talk: "05:48", hold: "00:44", transfer: "00:00" },
  },
  {
    id: "rc4", code: "QD-18296", when: "9 Sep 2026, 14:12", lead: "Zainab Malik", number: "+92 345 5550311",
    email: "zainab.malik@lumen.pk", segment: "Returning customers", leadStage: "Contacted", tags: ["Winback"],
    agent: "Hina Raza", agentKind: "Human", team: "Winback", campaign: "Winback 2026",
    direction: "Outbound", duration: "00:41", seconds: 41, outcome: "No answer", sentiment: "Neutral",
    qaScore: 0, qaType: "None", reviewer: "—", qaStatus: "Needs review", critical: null,
    recording: true, transcriptReady: false, escalated: false,
    summary: "Voicemail left with the winback offer and a callback number.",
    intent: "Unknown — no conversation",
    topics: [], questions: [], objections: [],
    nextAction: "Retry in the 11:00–15:00 window.",
    outcomeReason: "No answer — voicemail left.",
    coaching: "Dialling window is outside the peak connect hours for this segment.",
    sentimentSplit: { positive: 0, neutral: 100, negative: 0 },
    sentimentTimeline: [{ at: "00:00", score: 50 }, { at: "00:40", score: 50 }],
    transcript: [],
    qa: [],
    notes: [],
    timeline: [
      { at: "14:12:00", event: "Call started (outbound)" },
      { at: "14:12:41", event: "Call ended — No answer" },
    ],
    timings: { wait: "00:00", talk: "00:00", hold: "00:00", transfer: "00:00" },
  },
  {
    id: "rc5", code: "QD-18297", when: "8 Sep 2026, 12:30", lead: "Hamza Sheikh", number: "+92 301 5550980",
    email: "hamza@sheikh.co", segment: "Website leads", leadStage: "Interested", tags: ["Demo"],
    agent: "Support AI", agentKind: "AI", team: "Demo Desk", campaign: "Demo Follow-ups",
    direction: "Outbound", duration: "04:22", seconds: 262, outcome: "Interested", sentiment: "Positive",
    qaScore: 96, qaType: "AI", reviewer: "AI", qaStatus: "Reviewed", critical: null,
    recording: true, transcriptReady: true, escalated: false,
    summary: "Missed demo rebooked for Wednesday 15:00. Calendar invite emailed.",
    intent: "Reschedule a missed demo",
    topics: ["Implementation", "Security", "Pricing"],
    questions: ["Do you support SSO?"],
    objections: ["Timeline feels fast"],
    nextAction: "Demo Wednesday 15:00 — send the security one-pager beforehand.",
    outcomeReason: "Lead wants to see the product before committing.",
    coaching: "Excellent discovery. Confirm the attendee list next time.",
    sentimentSplit: { positive: 80, neutral: 18, negative: 2 },
    sentimentTimeline: [
      { at: "00:00", score: 58 }, { at: "01:30", score: 68 }, { at: "03:00", score: 80 }, { at: "04:00", score: 86 },
    ],
    transcript: transcriptB,
    qa: qa({ Greeting: [98, null], "Script compliance": [96, null], Closing: [94, null], Compliance: [99, null] }),
    notes: [{ id: "n7", who: "Support AI", kind: "AI", when: "8 Sep, 12:35", text: "Demo rebooked; invite sent to hamza@sheikh.co." }],
    timeline: [
      { at: "12:30:00", event: "Call started (outbound, AI)" },
      { at: "12:34:22", event: "Call ended — Interested" },
      { at: "12:35:00", event: "Calendar invite sent" },
    ],
    timings: { wait: "00:05", talk: "04:17", hold: "00:00", transfer: "00:00" },
  },
  {
    id: "rc6", code: "QD-18298", when: "8 Sep 2026, 09:15", lead: "Fatima Noor", number: "+92 321 5550192",
    email: "fatima.noor@harbour.pk", segment: "VIP", leadStage: "At risk", tags: ["Billing"],
    agent: "AI Agent — Nova", agentKind: "AI", team: "Renewals", campaign: "Renewal Push Q3",
    direction: "Inbound", duration: "05:08", seconds: 308, outcome: "Not interested", sentiment: "Negative",
    qaScore: 78, qaType: "AI", reviewer: "AI", qaStatus: "Needs review",
    critical: "Incorrect product information", recording: true, transcriptReady: true, escalated: true,
    summary: "Lead pushed back on switching and mentioned a competitor. Nova quoted an outdated coverage limit before transferring.",
    intent: "Compare renewal against a competitor",
    topics: ["Competitor pricing", "Coverage", "Cancellation"],
    questions: ["Does the new plan still cover roadside?"],
    objections: ["Competitor cheaper", "Not interested in switching"],
    nextAction: "Human callback with the corrected coverage sheet.",
    outcomeReason: "Incorrect coverage answer damaged trust mid-call.",
    coaching: "Update the coverage entry in the knowledge base; escalate earlier on competitor comparisons.",
    sentimentSplit: { positive: 10, neutral: 26, negative: 64 },
    sentimentTimeline: [
      { at: "00:00", score: 52 }, { at: "01:30", score: 44 }, { at: "03:00", score: 22 }, { at: "05:00", score: 28 },
    ],
    transcript: transcriptC,
    qa: qa({
      Greeting: [92, null], "Product knowledge": [54, null, "Quoted an outdated coverage limit."],
      "Objection handling": [70, null], Compliance: [96, null], Closing: [72, null],
    }),
    notes: [{ id: "n8", who: "System", kind: "System", when: "8 Sep, 09:21", text: "Transferred to human queue after AI escalation." }],
    timeline: [
      { at: "09:15:00", event: "Inbound call received" },
      { at: "09:15:04", event: "Answered by AI Agent — Nova" },
      { at: "09:18:30", event: "Knowledge gap detected" },
      { at: "09:20:08", event: "Escalated to human queue" },
    ],
    timings: { wait: "00:04", talk: "04:36", hold: "00:28", transfer: "00:12" },
  },
  {
    id: "rc7", code: "QD-18299", when: "7 Sep 2026, 15:48", lead: "Usman Tariq", number: "+92 333 5550744",
    email: "usman.tariq@orbit.pk", segment: "Imported leads", leadStage: "Follow-up", tags: [],
    agent: "Ahmed Siddiqui", agentKind: "Human", team: "Support", campaign: "Insurance Claims",
    direction: "Inbound", duration: "07:02", seconds: 422, outcome: "Follow-up", sentiment: "Neutral",
    qaScore: 88, qaType: "Manual", reviewer: "Ayesha Raza", qaStatus: "Reviewed", critical: null,
    recording: true, transcriptReady: true, escalated: false,
    summary: "Claim documents explained and a checklist emailed. Customer will resubmit within a week.",
    intent: "Understand claim documentation",
    topics: ["Documents", "Claim status", "Timelines"],
    questions: ["Which documents do you need?"],
    objections: ["Process feels slow"],
    nextAction: "Follow up in 7 days if documents are not received.",
    outcomeReason: "Waiting on customer documents.",
    coaching: "Very clear explanation; handle time can be shortened using the checklist template.",
    sentimentSplit: { positive: 42, neutral: 50, negative: 8 },
    sentimentTimeline: [
      { at: "00:00", score: 50 }, { at: "02:00", score: 46 }, { at: "05:00", score: 58 }, { at: "07:00", score: 62 },
    ],
    transcript: transcriptA,
    qa: qa({
      Greeting: [90, 92], "Identity & verification": [94, 96], Empathy: [92, 94],
      Resolution: [86, 88], Closing: [84, 86], "Follow-up": [90, 92],
    }),
    notes: [{ id: "n9", who: "Ahmed Siddiqui", kind: "Agent", when: "7 Sep, 15:58", text: "Checklist emailed; reminder set for 14 Sep." }],
    timeline: [
      { at: "15:48:00", event: "Inbound call received" },
      { at: "15:48:12", event: "Answered by Ahmed Siddiqui" },
      { at: "15:55:02", event: "Call ended — Follow-up" },
    ],
    timings: { wait: "00:12", talk: "06:34", hold: "00:16", transfer: "00:00" },
  },
  {
    id: "rc8", code: "QD-18300", when: "7 Sep 2026, 10:26", lead: "Maryam Siddiqui", number: "+92 312 5550421",
    email: "maryam.s@vertex.pk", segment: "VIP", leadStage: "Converted", tags: ["VIP"],
    agent: "Sales AI", agentKind: "AI", team: "Outbound Sales", campaign: "Summer Sale",
    direction: "Outbound", duration: "02:58", seconds: 178, outcome: "Converted", sentiment: "Positive",
    qaScore: 93, qaType: "AI", reviewer: "AI", qaStatus: "Reviewed", critical: null,
    recording: true, transcriptReady: true, escalated: false,
    summary: "Upgrade closed on the annual plan after a short discount explanation.",
    intent: "Upgrade to annual plan",
    topics: ["Pricing", "Discount"],
    questions: ["Is the discount applied immediately?"],
    objections: [],
    nextAction: "Onboarding email queued.",
    outcomeReason: "Annual discount matched the customer's budget.",
    coaching: "Efficient close with clear next steps.",
    sentimentSplit: { positive: 88, neutral: 10, negative: 2 },
    sentimentTimeline: [{ at: "00:00", score: 64 }, { at: "01:30", score: 78 }, { at: "02:50", score: 90 }],
    transcript: transcriptB,
    qa: qa({ Greeting: [95, null], "Script compliance": [94, null], Closing: [92, null], Compliance: [97, null] }),
    notes: [],
    timeline: [
      { at: "10:26:00", event: "Call started (outbound, AI)" },
      { at: "10:28:58", event: "Call ended — Converted" },
    ],
    timings: { wait: "00:04", talk: "02:54", hold: "00:00", transfer: "00:00" },
  },
];

/* ------------------------------------------------------------- Quality & AI */

export const qualityKpis = [
  { label: "Average QA score", value: "91.4", delta: 1.8 },
  { label: "Calls reviewed", value: "4,820", delta: 6.2 },
  { label: "AI reviewed", value: "3,950", delta: 9.4 },
  { label: "Manual reviewed", value: "870", delta: -2.4 },
  { label: "Critical issues", value: "126", delta: -11.2 },
];

export const qaDistribution = [
  { band: "90–100", value: 2410 },
  { band: "80–89", value: 1420 },
  { band: "70–79", value: 620 },
  { band: "60–69", value: 250 },
  { band: "Below 60", value: 120 },
];

export const manualVsAi = [
  { category: "Greeting", ai: 96, manual: 94 },
  { category: "Script compliance", ai: 98, manual: 97 },
  { category: "Product knowledge", ai: 92, manual: 90 },
  { category: "Objection handling", ai: 90, manual: 91 },
  { category: "Closing", ai: 82, manual: 85 },
  { category: "Overall", ai: 92, manual: 91 },
];

export const qaAgreement = 94;

export const criticalIssues = [
  { issue: "Failed compliance disclosure", calls: 12, outcomeFilter: "Rejected" },
  { issue: "Incorrect product information", calls: 8, outcomeFilter: "Not interested" },
  { issue: "Missed required verification", calls: 6, outcomeFilter: "Follow-up" },
  { issue: "Inappropriate closing", calls: 4, outcomeFilter: "Follow-up" },
];

export const aiPerformanceKpis = [
  { label: "AI calls", value: "12,450" },
  { label: "AI minutes", value: "41,200" },
  { label: "Connect rate", value: "76%" },
  { label: "Avg duration", value: "03:32" },
  { label: "Conversion rate", value: "10.1%" },
  { label: "Resolution rate", value: "84%" },
  { label: "Escalation rate", value: "7.2%" },
  { label: "Avg QA", value: "91" },
];

export const conversationTopics = [
  { label: "Pricing", value: 2420 },
  { label: "Product features", value: 1820 },
  { label: "Delivery", value: 1420 },
  { label: "Support", value: 980 },
  { label: "Cancellation", value: 740 },
];

export const conversationObjections = [
  { label: "Too expensive", value: 1420 },
  { label: "Need to think", value: 980 },
  { label: "Competitor cheaper", value: 760 },
  { label: "Not interested", value: 620 },
  { label: "Need manager approval", value: 410 },
];

export const conversationQuestions = [
  { label: "Pricing", value: 1980 },
  { label: "Implementation", value: 1240 },
  { label: "Refund policy", value: 820 },
  { label: "Support hours", value: 640 },
  { label: "Features", value: 520 },
];

export const conversionReasons = [
  { label: "Good pricing", value: 1120 },
  { label: "Feature match", value: 860 },
  { label: "Fast support", value: 480 },
  { label: "Discount offered", value: 380 },
];

export const sentimentOverview = [
  { label: "Positive", value: 68, tone: "bg-emerald-500" },
  { label: "Neutral", value: 23, tone: "bg-sky-500" },
  { label: "Negative", value: 8, tone: "bg-amber-500" },
  { label: "Critical", value: 1, tone: "bg-rose-500" },
];

export const sentimentByCampaign = campaignRows.map((c) => ({
  name: c.name,
  positive: c.positive,
  neutral: Math.max(0, 100 - c.positive - Math.round((100 - c.positive) * 0.45)),
  negative: Math.round((100 - c.positive) * 0.45),
}));

export const sentimentByAgent = agentRows.map((a) => ({
  name: a.name,
  kind: a.kind,
  positive: a.positive,
  negative: Math.round((100 - a.positive) * 0.4),
}));

export const negativeReasons = [
  { reason: "Pricing", calls: 148 },
  { reason: "Long wait", calls: 112 },
  { reason: "Product issue", calls: 86 },
  { reason: "Agent behaviour", calls: 42 },
  { reason: "Technical issue", calls: 26 },
  { reason: "Competitor comparison", calls: 14 },
];

/* ----------------------------------------------------------------- Reports */

export const reportTypes = [
  "Call performance",
  "Agent performance",
  "Campaign performance",
  "QA performance",
  "AI performance",
  "Team performance",
  "Lead conversion",
  "Customer sentiment",
  "Executive summary",
];

export const reportMetricOptions = [
  "Calls",
  "Connect rate",
  "Avg duration",
  "Conversions",
  "Conversion rate",
  "QA score",
  "Sentiment",
  "Escalations",
  "Talk time",
];

export type SavedReport = {
  id: string;
  name: string;
  type: string;
  createdBy: string;
  lastGenerated: string;
  schedule: string;
  recipients: string[];
  format: "PDF" | "CSV" | "Excel";
  status: "Active" | "Paused";
  description: string;
  metrics: string[];
};

export const savedReports: SavedReport[] = [
  {
    id: "r1", name: "Weekly executive summary", type: "Executive summary", createdBy: "Awais Ahmad",
    lastGenerated: "8 Sep 2026, 09:00", schedule: "Every Monday 09:00", recipients: ["Manager", "Supervisor"],
    format: "PDF", status: "Active",
    description: "Company-wide calling, conversion and quality summary for leadership.",
    metrics: ["Calls", "Connect rate", "Conversions", "QA score", "Sentiment"],
  },
  {
    id: "r2", name: "Agent performance — Outbound Sales", type: "Agent performance", createdBy: "John Meyer",
    lastGenerated: "10 Sep 2026, 07:30", schedule: "Daily 07:30", recipients: ["Team leads"],
    format: "CSV", status: "Active",
    description: "Per-agent calls, conversion and QA for the outbound sales team.",
    metrics: ["Calls", "Connect rate", "Conversions", "QA score"],
  },
  {
    id: "r3", name: "Campaign comparison — Q3", type: "Campaign performance", createdBy: "Ayesha Raza",
    lastGenerated: "1 Sep 2026, 10:00", schedule: "Monthly, 1st at 10:00", recipients: ["Marketing"],
    format: "Excel", status: "Active",
    description: "Side-by-side campaign results for the quarter.",
    metrics: ["Calls", "Conversion rate", "QA score", "Avg duration"],
  },
  {
    id: "r4", name: "QA critical issues", type: "QA performance", createdBy: "John Meyer",
    lastGenerated: "9 Sep 2026, 18:00", schedule: "Not scheduled", recipients: [],
    format: "PDF", status: "Paused",
    description: "Calls flagged with compliance or verification failures.",
    metrics: ["QA score", "Escalations"],
  },
  {
    id: "r5", name: "AI agent performance", type: "AI performance", createdBy: "Awais Ahmad",
    lastGenerated: "10 Sep 2026, 06:00", schedule: "Weekly Friday 17:00", recipients: ["Manager"],
    format: "PDF", status: "Active",
    description: "AI calls, resolution, escalation and QA versus the human baseline.",
    metrics: ["Calls", "Conversion rate", "QA score", "Escalations"],
  },
  {
    id: "r6", name: "Customer sentiment trend", type: "Customer sentiment", createdBy: "Ayesha Raza",
    lastGenerated: "7 Sep 2026, 12:00", schedule: "Weekly Monday 12:00", recipients: ["Support leads"],
    format: "CSV", status: "Active",
    description: "Sentiment split by campaign, team and AI agent.",
    metrics: ["Sentiment", "Calls"],
  },
];
