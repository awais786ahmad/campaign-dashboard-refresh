/** Frontend-only demo data for the CRM & Leads module. */

export const crmCampaigns = [
  "Spring Outbound",
  "Renewal Push Q3",
  "Winback 2026",
  "Insurance Claims",
  "Demo Follow-ups",
];

export const crmAgents = [
  "Sara Ahmed",
  "Bilal Khan",
  "Hina Raza",
  "AI Agent — Nova",
  "AI Agent — Atlas",
];

/* ------------------------------------------------------------------ Tags */

export type Tag = {
  id: string;
  name: string;
  color: string;
  description: string;
  leads: number;
  system: boolean;
  createdAt: string;
};

export const tagSeed: Tag[] = [
  {
    id: "t1",
    name: "VIP",
    color: "amber",
    description: "High value accounts handled by seniors.",
    leads: 42,
    system: true,
    createdAt: "12 Jan 2026",
  },
  {
    id: "t2",
    name: "Interested",
    color: "emerald",
    description: "Positive intent on the last call.",
    leads: 118,
    system: true,
    createdAt: "12 Jan 2026",
  },
  {
    id: "t3",
    name: "High Budget",
    color: "violet",
    description: "Budget above 500k confirmed.",
    leads: 27,
    system: false,
    createdAt: "04 Mar 2026",
  },
  {
    id: "t4",
    name: "Follow-up",
    color: "sky",
    description: "Needs a callback within 7 days.",
    leads: 76,
    system: true,
    createdAt: "12 Jan 2026",
  },
  {
    id: "t5",
    name: "Returning Customer",
    color: "rose",
    description: "Bought from us before.",
    leads: 33,
    system: false,
    createdAt: "21 Apr 2026",
  },
];

export const tagColors = [
  { id: "amber", label: "Amber", className: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  {
    id: "emerald",
    label: "Emerald",
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  },
  {
    id: "violet",
    label: "Violet",
    className: "bg-violet-500/15 text-violet-600 border-violet-500/30",
  },
  { id: "sky", label: "Sky", className: "bg-sky-500/15 text-sky-600 border-sky-500/30" },
  { id: "rose", label: "Rose", className: "bg-rose-500/15 text-rose-600 border-rose-500/30" },
];

export function tagClass(color: string) {
  return tagColors.find((c) => c.id === color)?.className ?? tagColors[0]!.className;
}

/* -------------------------------------------------------------- Segments */

export type Segment = {
  id: string;
  name: string;
  description: string;
  leadCount: number;
  campaigns: string[];
  createdAt: string;
  source: "Onboarding import" | "Manual" | "Automation";
};

export const segmentSeed: Segment[] = [
  {
    id: "s1",
    name: "Imported Leads",
    description: "Created automatically from your onboarding upload.",
    leadCount: 1240,
    campaigns: ["Spring Outbound"],
    createdAt: "12 Jan 2026",
    source: "Onboarding import",
  },
  {
    id: "s2",
    name: "Lahore Region",
    description: "Leads with a Lahore billing address.",
    leadCount: 386,
    campaigns: ["Spring Outbound", "Winback 2026"],
    createdAt: "02 Feb 2026",
    source: "Manual",
  },
  {
    id: "s3",
    name: "Expiring Policies",
    description: "Policies expiring in the next 45 days.",
    leadCount: 174,
    campaigns: ["Renewal Push Q3"],
    createdAt: "18 Mar 2026",
    source: "Automation",
  },
  {
    id: "s4",
    name: "Demo No-shows",
    description: "Booked a demo and did not attend.",
    leadCount: 58,
    campaigns: ["Demo Follow-ups"],
    createdAt: "27 Apr 2026",
    source: "Manual",
  },
];

/* ----------------------------------------------------------------- Leads */

export type LeadStage = string;

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  lastContacted: string;
  stage: LeadStage;
  /** Id of a column in the lead status pipeline. */
  status: string;
  tags: string[];
  segments: string[];
  campaign: string;
  owner: string;
  notes: string;
  aiSummary: string;
  calls: {
    id: string;
    when: string;
    duration: string;
    outcome: string;
    agent: string;
    transcript: string;
  }[];
  messages: {
    id: string;
    when: string;
    channel: "SMS" | "Email";
    direction: "in" | "out";
    body: string;
  }[];
  timeline: { id: string; when: string; text: string }[];
};

export const pipelineStagesSeed = [
  { id: "new", name: "New", rule: "Lead has been created and never contacted." },
  { id: "contacted", name: "Contacted", rule: "At least one call or message was answered." },
  { id: "interested", name: "Interested", rule: "Lead asked for pricing or more detail." },
  { id: "demo", name: "Demo Booked", rule: "A demo or meeting is scheduled on the calendar." },
  { id: "won", name: "Won", rule: "Deal closed and payment confirmed." },
];

export const leadSeed: Lead[] = [
  {
    id: "l1",
    name: "Ali Raza",
    phone: "+92 300 1234567",
    email: "ali.raza@northwind.pk",
    company: "Northwind Textiles",
    lastContacted: "2 hours ago",
    stage: "interested",
    status: "Qualified",
    tags: ["VIP", "High Budget"],
    segments: ["Imported Leads", "Lahore Region"],
    campaign: "Spring Outbound",
    owner: "Sara Ahmed",
    notes: "Wants a 3-seat pilot before signing annually.",
    aiSummary:
      "Strong intent. Asked for pricing twice and requested a pilot. Best next step is a demo with the ops lead.",
    calls: [
      {
        id: "c1",
        when: "Today, 11:20",
        duration: "6m 12s",
        outcome: "Connected",
        agent: "Sara Ahmed",
        transcript:
          "Ali confirmed budget and asked for a pilot for three seats before the annual contract.",
      },
      {
        id: "c2",
        when: "Mon, 15:04",
        duration: "1m 40s",
        outcome: "Voicemail",
        agent: "AI Agent — Nova",
        transcript: "Left a voicemail introducing Quality Dial and offering a callback slot.",
      },
    ],
    messages: [
      {
        id: "m1",
        when: "Today, 11:35",
        channel: "Email",
        direction: "out",
        body: "Sharing the pilot proposal we discussed.",
      },
      {
        id: "m2",
        when: "Today, 12:02",
        channel: "SMS",
        direction: "in",
        body: "Received, will review with my team today.",
      },
    ],
    timeline: [
      { id: "e1", when: "Today, 12:02", text: "Replied to SMS" },
      { id: "e2", when: "Today, 11:20", text: "Call connected — 6m 12s" },
      { id: "e3", when: "12 Jan 2026", text: "Imported from onboarding CSV" },
    ],
  },
  {
    id: "l2",
    name: "Hina Malik",
    phone: "+92 321 7654321",
    email: "hina@bluepeak.co",
    company: "BluePeak Realty",
    lastContacted: "Yesterday",
    stage: "contacted",
    status: "Contacted",
    tags: ["Follow-up"],
    segments: ["Lahore Region"],
    campaign: "Winback 2026",
    owner: "Bilal Khan",
    notes: "Prefers WhatsApp over calls.",
    aiSummary: "Lukewarm. Wants to be contacted after the next quarter budget review.",
    calls: [
      {
        id: "c1",
        when: "Yesterday, 16:10",
        duration: "3m 02s",
        outcome: "Connected",
        agent: "Bilal Khan",
        transcript: "Asked to be re-approached after the quarterly budget review.",
      },
    ],
    messages: [
      {
        id: "m1",
        when: "Yesterday, 16:40",
        channel: "SMS",
        direction: "out",
        body: "Thanks for your time — I'll follow up in July.",
      },
    ],
    timeline: [{ id: "e1", when: "Yesterday, 16:10", text: "Call connected" }],
  },
  {
    id: "l3",
    name: "Usman Sheikh",
    phone: "+92 333 4567890",
    email: "usman.sheikh@vertexins.com",
    company: "Vertex Insurance",
    lastContacted: "3 days ago",
    stage: "demo",
    status: "Qualified",
    tags: ["Interested"],
    segments: ["Expiring Policies"],
    campaign: "Renewal Push Q3",
    owner: "AI Agent — Nova",
    notes: "Demo booked for Friday 3pm.",
    aiSummary: "Demo scheduled. Needs claim-automation examples during the session.",
    calls: [
      {
        id: "c1",
        when: "3 days ago",
        duration: "8m 55s",
        outcome: "Connected",
        agent: "AI Agent — Nova",
        transcript: "Booked a demo for Friday and asked for claims automation examples.",
      },
    ],
    messages: [
      {
        id: "m1",
        when: "3 days ago",
        channel: "Email",
        direction: "out",
        body: "Calendar invite for Friday 3pm attached.",
      },
    ],
    timeline: [{ id: "e1", when: "3 days ago", text: "Demo booked" }],
  },
  {
    id: "l4",
    name: "Fatima Noor",
    phone: "+92 345 1122334",
    email: "fatima@caretrust.org",
    company: "CareTrust Health",
    lastContacted: "Never",
    stage: "new",
    status: "New",
    tags: [],
    segments: ["Imported Leads"],
    campaign: "Spring Outbound",
    owner: "Unassigned",
    notes: "",
    aiSummary: "Not contacted yet. Queue on the next outbound batch.",
    calls: [],
    messages: [],
    timeline: [{ id: "e1", when: "12 Jan 2026", text: "Imported from onboarding CSV" }],
  },
  {
    id: "l5",
    name: "Kamran Ali",
    phone: "+92 302 9988776",
    email: "kamran@sunridge.pk",
    company: "Sunridge Foods",
    lastContacted: "1 week ago",
    stage: "won",
    status: "Won",
    tags: ["VIP", "Returning Customer"],
    segments: ["Lahore Region"],
    campaign: "Winback 2026",
    owner: "Sara Ahmed",
    notes: "Signed 12-month contract, 8 seats.",
    aiSummary: "Closed won. Schedule onboarding hand-off with customer success.",
    calls: [
      {
        id: "c1",
        when: "1 week ago",
        duration: "12m 30s",
        outcome: "Connected",
        agent: "Sara Ahmed",
        transcript: "Agreed on 8 seats for 12 months, contract sent for signature.",
      },
    ],
    messages: [
      {
        id: "m1",
        when: "1 week ago",
        channel: "Email",
        direction: "out",
        body: "Contract for signature.",
      },
    ],
    timeline: [{ id: "e1", when: "1 week ago", text: "Marked as Won" }],
  },
  {
    id: "l6",
    name: "Zainab Iqbal",
    phone: "+92 311 5566778",
    email: "zainab@meridianbank.pk",
    company: "Meridian Bank",
    lastContacted: "2 weeks ago",
    stage: "contacted",
    status: "Lost",
    tags: ["Follow-up"],
    segments: ["Imported Leads"],
    campaign: "Spring Outbound",
    owner: "Hina Raza",
    notes: "Went with an in-house solution.",
    aiSummary: "Lost to an internal build. Worth revisiting in 6 months.",
    calls: [
      {
        id: "c1",
        when: "2 weeks ago",
        duration: "4m 18s",
        outcome: "Connected",
        agent: "Hina Raza",
        transcript: "Confirmed they are building the capability in-house this year.",
      },
    ],
    messages: [],
    timeline: [{ id: "e1", when: "2 weeks ago", text: "Marked as Lost" }],
  },
  {
    id: "l7",
    name: "Bilal Tariq",
    phone: "+92 336 2233445",
    email: "bilal.tariq@orbitlogix.com",
    company: "Orbit Logix",
    lastContacted: "5 days ago",
    stage: "interested",
    status: "Contacted",
    tags: ["Interested", "High Budget"],
    segments: ["Demo No-shows"],
    campaign: "Demo Follow-ups",
    owner: "AI Agent — Atlas",
    notes: "Missed the first demo, rebooking.",
    aiSummary: "Missed a demo but still engaged over email. Offer two new slots.",
    calls: [
      {
        id: "c1",
        when: "5 days ago",
        duration: "0m 45s",
        outcome: "No answer",
        agent: "AI Agent — Atlas",
        transcript: "No answer, no voicemail left.",
      },
    ],
    messages: [
      {
        id: "m1",
        when: "4 days ago",
        channel: "Email",
        direction: "in",
        body: "Sorry I missed it, can we do next week?",
      },
    ],
    timeline: [{ id: "e1", when: "4 days ago", text: "Email reply received" }],
  },
  {
    id: "l8",
    name: "Ayesha Siddiqui",
    phone: "+92 308 6677889",
    email: "ayesha@crestwoodedu.pk",
    company: "Crestwood Education",
    lastContacted: "1 month ago",
    stage: "new",
    status: "Archived",
    tags: [],
    segments: ["Imported Leads"],
    campaign: "Spring Outbound",
    owner: "Unassigned",
    notes: "Wrong number on file.",
    aiSummary: "Bad contact data. Needs enrichment before another attempt.",
    calls: [],
    messages: [],
    timeline: [{ id: "e1", when: "1 month ago", text: "Archived — invalid number" }],
  },
];

export const leadStatuses = [
  "All Leads",
  "New",
  "Contacted",
  "Qualified",
  "Won",
  "Lost",
  "Archived",
] as const;

/* ----------------------------------------------------------------- Tasks */

export type Task = {
  id: string;
  title: string;
  description: string;
  /** Id of a column in the task status board. */
  status: string;
  priority: "Low" | "Medium" | "High";
  assignee: string;
  createdBy: string;
  reason: string;
  /** ISO date (yyyy-mm-dd) or empty when there is no due date. */
  dueDate: string;
  createdAt: string;
  relatedLead: string;
  relatedCampaign: string;
  activity: { id: string; when: string; text: string }[];
};

export const taskSeed: Task[] = [
  {
    id: "k1",
    title: "Send pilot proposal to Ali Raza",
    description: "Three-seat pilot pricing with a 30-day trial.",
    status: "Active",
    priority: "High",
    assignee: "Sara Ahmed",
    createdBy: "AI Agent — Nova",
    reason: "Lead asked for pricing during the last call.",
    dueDate: "2026-10-12",
    createdAt: "2026-10-10",
    relatedLead: "Ali Raza",
    relatedCampaign: "Spring Outbound",
    activity: [{ id: "a1", when: "Today, 11:25", text: "Task created by AI after call analysis" }],
  },
  {
    id: "k2",
    title: "Rebook demo with Bilal Tariq",
    description: "Offer two slots next week.",
    status: "Pending",
    priority: "Medium",
    assignee: "Hina Raza",
    createdBy: "Sara Ahmed",
    reason: "Lead missed the scheduled demo.",
    dueDate: "2026-10-13",
    createdAt: "2026-10-08",
    relatedLead: "Bilal Tariq",
    relatedCampaign: "Demo Follow-ups",
    activity: [{ id: "a1", when: "4 days ago", text: "Task created manually" }],
  },
  {
    id: "k3",
    title: "Verify Crestwood phone number",
    description: "Number bounced twice — enrich before dialling.",
    status: "Active",
    priority: "Low",
    assignee: "Bilal Khan",
    createdBy: "System",
    reason: "Two consecutive invalid-number results.",
    dueDate: "2026-10-09",
    createdAt: "2026-10-05",
    relatedLead: "Ayesha Siddiqui",
    relatedCampaign: "Spring Outbound",
    activity: [{ id: "a1", when: "1 week ago", text: "Task created by system" }],
  },
  {
    id: "k4",
    title: "Renewal call — Vertex Insurance",
    description: "Policy expires in 30 days.",
    status: "Pending",
    priority: "High",
    assignee: "AI Agent — Nova",
    createdBy: "Automation",
    reason: "Policy expiry rule triggered.",
    dueDate: "2026-10-16",
    createdAt: "2026-10-09",
    relatedLead: "Usman Sheikh",
    relatedCampaign: "Renewal Push Q3",
    activity: [{ id: "a1", when: "3 days ago", text: "Created by the renewal automation" }],
  },
  {
    id: "k5",
    title: "Hand off Sunridge to onboarding",
    description: "Closed won — 8 seats, 12 months.",
    status: "Completed",
    priority: "Medium",
    assignee: "Sara Ahmed",
    createdBy: "Sara Ahmed",
    reason: "Deal marked as won.",
    dueDate: "2026-10-05",
    createdAt: "2026-09-30",
    relatedLead: "Kamran Ali",
    relatedCampaign: "Winback 2026",
    activity: [{ id: "a1", when: "1 week ago", text: "Completed by Sara Ahmed" }],
  },
];

export type StatusColumn = { id: string; name: string; description: string };

export const leadStatusColumnsSeed: StatusColumn[] = [
  { id: "New", name: "New", description: "Fresh leads that have not been contacted yet." },
  { id: "Contacted", name: "Contacted", description: "Reached at least once by an agent or AI." },
  { id: "Qualified", name: "Qualified", description: "Confirmed fit, budget and interest." },
  { id: "Won", name: "Won", description: "Closed deals and converted customers." },
  { id: "Lost", name: "Lost", description: "Not interested or chose a competitor." },
  { id: "Archived", name: "Archived", description: "Invalid, duplicate or do-not-call." },
];

export const taskStatusColumnsSeed: StatusColumn[] = [
  { id: "Pending", name: "Pending", description: "Not started yet." },
  { id: "Active", name: "Active", description: "Being worked on right now." },
  { id: "Completed", name: "Completed", description: "Done and closed." },
];

export const taskStatuses = ["Pending", "Active", "Completed"] as const;
export const taskPriorities = ["Low", "Medium", "High"] as const;

/* ----------------------------------------------------------- Data tables */

export type ColumnType = "Text" | "Number" | "Date" | "Yes/No" | "Dropdown" | "Checkbox";

export type DataColumn = {
  id: string;
  name: string;
  type: ColumnType;
  defaultValue: string;
  /** Custom values for Dropdown columns. */
  options?: string[];
};

export type DataTableView = {
  /** Columns the search bar matches against (partial, case-insensitive). */
  searchColumns: string[];
  /** Columns that expose a filter control above the table. */
  filterColumns: string[];
  /** Columns whose header can be clicked to sort. */
  sortableColumns: string[];
  defaultSort: { columnId: string; dir: "asc" | "desc" } | null;
};

export type DataTable = {
  id: string;
  name: string;
  campaign: string;
  createdAt: string;
  columns: DataColumn[];
  rows: Record<string, string>[];
  view?: DataTableView;
};

export const dataTableSeed: DataTable[] = [
  {
    id: "d1",
    name: "Customer Survey",
    campaign: "Spring Outbound",
    createdAt: "12 Feb 2026",
    columns: [
      { id: "name", name: "Name", type: "Text", defaultValue: "" },
      { id: "age", name: "Age", type: "Number", defaultValue: "" },
      { id: "city", name: "City", type: "Text", defaultValue: "Lahore" },
      { id: "budget", name: "Budget", type: "Number", defaultValue: "0" },
      { id: "interested", name: "Interested", type: "Yes/No", defaultValue: "Yes" },
      { id: "plan", name: "Plan", type: "Dropdown", defaultValue: "Basic", options: ["Basic", "Pro", "Enterprise"] },
      { id: "callback", name: "Callback", type: "Checkbox", defaultValue: "false" },
    ],
    rows: [
      { id: "r1", name: "Ali", age: "28", city: "Lahore", budget: "50000", interested: "Yes", plan: "Pro", callback: "true" },
      { id: "r2", name: "Hina", age: "34", city: "Karachi", budget: "120000", interested: "No", plan: "Enterprise", callback: "false" },
      { id: "r3", name: "Usman", age: "41", city: "Islamabad", budget: "80000", interested: "Yes", plan: "Basic", callback: "false" },
    ],
    view: {
      searchColumns: ["name", "city"],
      filterColumns: ["plan", "interested"],
      sortableColumns: ["name", "age", "budget"],
      defaultSort: { columnId: "budget", dir: "desc" },
    },
  },
  {
    id: "d2",
    name: "Property Leads",
    campaign: "Winback 2026",
    createdAt: "03 Mar 2026",
    columns: [
      { id: "name", name: "Name", type: "Text", defaultValue: "" },
      { id: "area", name: "Area", type: "Text", defaultValue: "" },
      { id: "size", name: "Size (marla)", type: "Number", defaultValue: "5" },
      { id: "visit", name: "Visit Date", type: "Date", defaultValue: "" },
    ],
    rows: [
      { id: "r1", name: "Kamran", area: "DHA Phase 6", size: "10", visit: "2026-09-12" },
      { id: "r2", name: "Zainab", area: "Bahria Town", size: "5", visit: "2026-09-18" },
    ],
  },
  {
    id: "d3",
    name: "Insurance Claims",
    campaign: "Insurance Claims",
    createdAt: "22 Apr 2026",
    columns: [
      { id: "claim", name: "Claim ID", type: "Text", defaultValue: "" },
      { id: "policy", name: "Policy", type: "Text", defaultValue: "" },
      { id: "amount", name: "Amount", type: "Number", defaultValue: "0" },
      { id: "settled", name: "Settled", type: "Yes/No", defaultValue: "No" },
    ],
    rows: [{ id: "r1", claim: "CLM-2291", policy: "VX-88301", amount: "145000", settled: "No" }],
  },
];

/* --------------------------------------------------------------- Scripts */

export type Script = {
  id: string;
  name: string;
  category: string;
  description: string;
  campaigns: string[];
  updatedAt: string;
  body: string;
};

export const scriptCategories = ["Cold Calling", "Sales", "Support", "Collection", "Renewal"];

export const scriptSeed: Script[] = [
  {
    id: "sc1",
    name: "Cold Calling Script",
    category: "Cold Calling",
    description: "First-touch opener for outbound lists.",
    campaigns: ["Spring Outbound"],
    updatedAt: "2 days ago",
    body: "Hi {{LeadName}}, this is {{AgentName}} from Quality Dial. We help contact centres cut idle time by half. Do you have 30 seconds?",
  },
  {
    id: "sc2",
    name: "Sales Script",
    category: "Sales",
    description: "Discovery to close for qualified leads.",
    campaigns: ["Spring Outbound", "Demo Follow-ups"],
    updatedAt: "1 week ago",
    body: "Great to reconnect {{LeadName}}. Last time you mentioned {{PainPoint}} — let me show you how we solve that.",
  },
  {
    id: "sc3",
    name: "Support Script",
    category: "Support",
    description: "Inbound troubleshooting flow.",
    campaigns: [],
    updatedAt: "3 weeks ago",
    body: "Thanks for calling support, {{LeadName}}. Can you confirm the number linked to your account?",
  },
  {
    id: "sc4",
    name: "Collection Script",
    category: "Collection",
    description: "Polite overdue payment reminder.",
    campaigns: ["Renewal Push Q3"],
    updatedAt: "5 days ago",
    body: "Hello {{LeadName}}, your invoice {{InvoiceNo}} is {{DaysOverdue}} days overdue. Can we settle it today?",
  },
];

/* ------------------------------------------------------------- Templates */

export type Template = {
  id: string;
  name: string;
  channel: "SMS" | "Email" | "WhatsApp";
  category: string;
  subject: string;
  body: string;
  campaigns: string[];
  updatedAt: string;
};

export const templateCategories = ["Transactional", "Follow-up", "Onboarding", "Billing"];

export const templateVariables = [
  "{{LeadName}}",
  "{{AgentName}}",
  "{{ProductName}}",
  "{{Date}}",
  "{{Amount}}",
];

export const templateSeed: Template[] = [
  {
    id: "tp1",
    name: "Thank You SMS",
    channel: "SMS",
    category: "Follow-up",
    subject: "",
    body: "Hello {{LeadName}}, thank you for your time today. — {{AgentName}}, Quality Dial",
    campaigns: ["Spring Outbound"],
    updatedAt: "1 day ago",
  },
  {
    id: "tp2",
    name: "Appointment Reminder",
    channel: "SMS",
    category: "Transactional",
    subject: "",
    body: "Reminder: your demo is on {{Date}}. Reply R to reschedule.",
    campaigns: ["Demo Follow-ups"],
    updatedAt: "4 days ago",
  },
  {
    id: "tp3",
    name: "Welcome Email",
    channel: "Email",
    category: "Onboarding",
    subject: "Welcome to {{ProductName}}",
    body: "Hello {{LeadName}},\n\nThank you for your interest in {{ProductName}}. Here is everything you need to get started.",
    campaigns: ["Spring Outbound", "Winback 2026"],
    updatedAt: "2 weeks ago",
  },
  {
    id: "tp5",
    name: "WhatsApp Intro",
    channel: "WhatsApp",
    category: "Follow-up",
    subject: "",
    body: "Hi {{LeadName}}, this is {{AgentName}} from Quality Dial. Happy to share details about {{ProductName}} here on WhatsApp — is now a good time?",
    campaigns: ["Spring Outbound", "Renewal Push Q3"],
    updatedAt: "2 days ago",
  },
  {
    id: "tp6",
    name: "WhatsApp Support Handoff",
    channel: "WhatsApp",
    category: "Transactional",
    subject: "",
    body: "Hello {{LeadName}}, your support request is with our team. We will reply on WhatsApp within 15 minutes.",
    campaigns: ["Support Front Desk"],
    updatedAt: "1 week ago",
  },
  {
    id: "tp4",
    name: "Payment Reminder",
    channel: "Email",
    category: "Billing",
    subject: "Invoice due — {{Amount}}",
    body: "Hello {{LeadName}},\n\nYour invoice of {{Amount}} is due. You can pay securely using the link below.",
    campaigns: ["Renewal Push Q3"],
    updatedAt: "6 days ago",
  },
];
