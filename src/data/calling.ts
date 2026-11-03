/** Frontend-only demo data for the Calling module. */

export type Sentiment = "Positive" | "Neutral" | "Negative";

export const sentimentTone: Record<Sentiment, string> = {
  Positive: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  Neutral: "bg-sky-500/15 text-sky-600 border-sky-500/30",
  Negative: "bg-rose-500/15 text-rose-600 border-rose-500/30",
};

export const callOutcomes = [
  "Connected",
  "Interested",
  "Not interested",
  "Callback requested",
  "Voicemail",
  "No answer",
  "Wrong number",
  "Do not call",
];

export const transferTargets = ["Bilal Khan", "Hina Raza", "Support queue", "Sales queue", "AI Agent — Nova"];

export const transcriptScript = [
  { speaker: "Agent" as const, text: "Hi, this is {agent} from Quality Dial. Am I speaking with {lead}?" },
  { speaker: "Lead" as const, text: "Yes, that's me. What is this about?" },
  { speaker: "Agent" as const, text: "We noticed your policy renews next month and wanted to walk you through the new plan." },
  { speaker: "Lead" as const, text: "Okay, how much would it cost compared to the current one?" },
  { speaker: "Agent" as const, text: "It's about 12% lower with the same coverage. I can send the comparison by SMS." },
  { speaker: "Lead" as const, text: "That would be helpful. Can you also call back on Thursday?" },
  { speaker: "Agent" as const, text: "Absolutely, I'll schedule a follow-up for Thursday at 3pm." },
];

export const aiSuggestionPool = [
  "Lead mentioned price — offer the annual discount comparison.",
  "Ask for the decision maker's availability this week.",
  "Confirm the preferred contact channel before closing.",
  "Sentiment dipped — slow down and acknowledge the concern.",
  "Offer to send the summary by SMS right after the call.",
];

export const dialerScript = {
  title: "Renewal outreach — v3",
  steps: [
    "Introduce yourself and confirm you're speaking with the lead.",
    "Reference the renewal date and the reason for the call.",
    "Present the new plan and the savings compared to the current one.",
    "Handle objections: price, coverage, timing.",
    "Agree on a next step and confirm contact details.",
  ],
};

/* ------------------------------------------------------------------ Live */

export type LiveCall = {
  id: string;
  agent: string;
  agentType: "Human" | "AI";
  lead: string;
  number: string;
  campaign: string;
  duration: string;
  sentiment: Sentiment;
  status: "Talking" | "On hold" | "Escalated" | "Transferring";
  transcript: { speaker: "Agent" | "Lead"; text: string }[];
  summary: string;
  recording: boolean;
};

export const liveCallSeed: LiveCall[] = [
  {
    id: "lc1",
    agent: "Bilal Khan",
    agentType: "Human",
    lead: "Fatima Noor",
    number: "+92 321 5550192",
    campaign: "Renewal Push Q3",
    duration: "08:42",
    sentiment: "Negative",
    status: "Escalated",
    transcript: [
      { speaker: "Lead", text: "I was charged twice last month and nobody called me back." },
      { speaker: "Agent", text: "I'm really sorry about that. Let me pull up the billing record now." },
      { speaker: "Lead", text: "This is the third time I'm explaining this." },
    ],
    summary: "Billing dispute from last month. Customer frustrated about lack of follow-up. Escalated to supervisor.",
    recording: true,
  },
  {
    id: "lc2",
    agent: "AI Agent — Nova",
    agentType: "AI",
    lead: "Usman Tariq",
    number: "+92 333 5550744",
    campaign: "Spring Outbound",
    duration: "03:15",
    sentiment: "Negative",
    status: "Talking",
    transcript: [
      { speaker: "Agent", text: "I understand you're busy. Would a callback tomorrow work better?" },
      { speaker: "Lead", text: "I already said I'm not interested in switching." },
    ],
    summary: "Lead pushing back on switching providers. Nova is attempting to book a callback.",
    recording: true,
  },
  {
    id: "lc3",
    agent: "Sara Ahmed",
    agentType: "Human",
    lead: "Ali Raza",
    number: "+92 300 1234567",
    campaign: "Spring Outbound",
    duration: "12:07",
    sentiment: "Positive",
    status: "Talking",
    transcript: [
      { speaker: "Lead", text: "The pilot pricing works for us. When can we start?" },
      { speaker: "Agent", text: "We can have the three seats provisioned by Monday." },
    ],
    summary: "Pilot pricing accepted. Discussing kickoff timeline for three seats.",
    recording: true,
  },
  {
    id: "lc4",
    agent: "Hina Raza",
    agentType: "Human",
    lead: "Zainab Malik",
    number: "+92 345 5550311",
    campaign: "Winback 2026",
    duration: "01:58",
    sentiment: "Neutral",
    status: "On hold",
    transcript: [
      { speaker: "Agent", text: "Let me check whether the winback discount still applies to your account." },
      { speaker: "Lead", text: "Sure, I'll wait." },
    ],
    summary: "Checking eligibility for the winback discount.",
    recording: true,
  },
  {
    id: "lc5",
    agent: "AI Agent — Atlas",
    agentType: "AI",
    lead: "Hamza Sheikh",
    number: "+92 301 5550980",
    campaign: "Demo Follow-ups",
    duration: "05:31",
    sentiment: "Positive",
    status: "Talking",
    transcript: [
      { speaker: "Agent", text: "Would Tuesday or Wednesday be better for the rescheduled demo?" },
      { speaker: "Lead", text: "Wednesday afternoon is good." },
    ],
    summary: "Rebooking the missed demo. Lead available Wednesday afternoon.",
    recording: false,
  },
];

export type WaitingCall = {
  id: string;
  caller: string;
  number: string;
  campaign: string;
  waiting: string;
  reason: string;
  assignedTo: string;
  known: boolean;
};

export const waitingCallSeed: WaitingCall[] = [
  { id: "w1", caller: "Maryam Siddiqui", number: "+92 312 5550421", campaign: "Insurance Claims", waiting: "00:48", reason: "Inbound — claims line", assignedTo: "Sara Ahmed", known: true },
  { id: "w2", caller: "Unknown caller", number: "+92 300 5550277", campaign: "—", waiting: "01:22", reason: "Inbound — main number", assignedTo: "Unassigned", known: false },
  { id: "w3", caller: "Imran Qureshi", number: "+92 322 5550655", campaign: "Renewal Push Q3", waiting: "00:15", reason: "Callback requested", assignedTo: "Bilal Khan", known: true },
];

export type LiveAgent = {
  id: string;
  name: string;
  type: "Human" | "AI";
  team: string;
  status: "On call" | "Available" | "Wrap-up" | "Break";
  callId?: string;
  callsToday: number;
};

export const liveAgentSeed: LiveAgent[] = [
  { id: "ag1", name: "Sara Ahmed", type: "Human", team: "Outbound Sales", status: "On call", callId: "lc3", callsToday: 23 },
  { id: "ag2", name: "Bilal Khan", type: "Human", team: "Renewals", status: "On call", callId: "lc1", callsToday: 17 },
  { id: "ag3", name: "Hina Raza", type: "Human", team: "Winback", status: "On call", callId: "lc4", callsToday: 31 },
  { id: "ag4", name: "Ahmed Siddiqui", type: "Human", team: "Support", status: "Available", callsToday: 12 },
  { id: "ag5", name: "AI Agent — Nova", type: "AI", team: "Outbound Sales", status: "On call", callId: "lc2", callsToday: 142 },
  { id: "ag6", name: "AI Agent — Atlas", type: "AI", team: "Demo Desk", status: "On call", callId: "lc5", callsToday: 98 },
  { id: "ag7", name: "AI Agent — Iris", type: "AI", team: "Support", status: "Available", callsToday: 64 },
];

/* --------------------------------------------------------------- History */

export type HistoryCall = {
  id: string;
  when: string;
  agent: string;
  agentType: "Human" | "AI";
  direction: "Outgoing" | "Incoming";
  lead: string;
  number: string;
  campaign: string;
  duration: string;
  outcome: string;
  sentiment: Sentiment;
  tags: string[];
  summary: string;
  transcript: { speaker: "Agent" | "Lead"; text: string }[];
  notes: { id: string; who: string; when: string; text: string }[];
  qa: { criteria: string; score: number }[];
  qaScored: boolean;
};

const baseTranscript = transcriptScript.map((l) => ({ speaker: l.speaker, text: l.text }));

export const historySeed: HistoryCall[] = [
  {
    id: "h1",
    when: "Today, 11:20",
    agent: "Sara Ahmed",
    agentType: "Human",
    direction: "Outgoing",
    lead: "Ali Raza",
    number: "+92 300 1234567",
    campaign: "Spring Outbound",
    duration: "6m 12s",
    outcome: "Interested",
    sentiment: "Positive",
    tags: ["VIP", "High Budget"],
    summary: "Ali confirmed budget and asked for a pilot for three seats before signing annually. Demo to be booked with ops lead.",
    transcript: baseTranscript,
    notes: [
      { id: "n1", who: "Sara Ahmed", when: "Today, 11:27", text: "Send the 3-seat pilot proposal by Thursday." },
      { id: "n2", who: "AI Copilot", when: "Today, 11:26", text: "Lead asked about SSO twice — include the security one-pager." },
    ],
    qa: [
      { criteria: "Greeting & verification", score: 5 },
      { criteria: "Needs discovery", score: 4 },
      { criteria: "Objection handling", score: 4 },
      { criteria: "Compliance statements", score: 5 },
      { criteria: "Closing & next step", score: 4 },
    ],
    qaScored: true,
  },
  {
    id: "h2",
    when: "Today, 10:02",
    agent: "AI Agent — Nova",
    agentType: "AI",
    direction: "Outgoing",
    lead: "Sana Javed",
    number: "+92 331 5550188",
    campaign: "Renewal Push Q3",
    duration: "2m 48s",
    outcome: "Callback requested",
    sentiment: "Neutral",
    tags: ["Follow-up"],
    summary: "Lead was driving and asked for a callback tomorrow morning. Callback task created automatically.",
    transcript: baseTranscript.slice(0, 4),
    notes: [],
    qa: [],
    qaScored: false,
  },
  {
    id: "h3",
    when: "Yesterday, 16:40",
    agent: "Bilal Khan",
    agentType: "Human",
    direction: "Incoming",
    lead: "Kamran Ali",
    number: "+92 302 5550903",
    campaign: "Insurance Claims",
    duration: "14m 05s",
    outcome: "Connected",
    sentiment: "Negative",
    tags: [],
    summary: "Customer disputing a rejected claim. Bilal escalated to the claims desk and promised a written response in 48 hours.",
    transcript: baseTranscript,
    notes: [{ id: "n3", who: "Bilal Khan", when: "Yesterday, 16:55", text: "Escalated to claims desk — ticket #4821." }],
    qa: [
      { criteria: "Greeting & verification", score: 4 },
      { criteria: "Needs discovery", score: 5 },
      { criteria: "Objection handling", score: 3 },
      { criteria: "Compliance statements", score: 5 },
      { criteria: "Closing & next step", score: 4 },
    ],
    qaScored: true,
  },
  {
    id: "h4",
    when: "Yesterday, 14:12",
    agent: "Hina Raza",
    agentType: "Human",
    direction: "Outgoing",
    lead: "Zainab Malik",
    number: "+92 345 5550311",
    campaign: "Winback 2026",
    duration: "0m 41s",
    outcome: "Voicemail",
    sentiment: "Neutral",
    tags: ["Returning Customer"],
    summary: "Left a voicemail with the winback offer and a callback number.",
    transcript: baseTranscript.slice(0, 1),
    notes: [],
    qa: [],
    qaScored: false,
  },
  {
    id: "h5",
    when: "Mon, 12:30",
    agent: "AI Agent — Atlas",
    agentType: "AI",
    direction: "Outgoing",
    lead: "Hamza Sheikh",
    number: "+92 301 5550980",
    campaign: "Demo Follow-ups",
    duration: "4m 22s",
    outcome: "Interested",
    sentiment: "Positive",
    tags: ["Interested"],
    summary: "Rebooked the missed demo for Wednesday 3pm. Calendar invite sent by email.",
    transcript: baseTranscript,
    notes: [{ id: "n4", who: "AI Agent — Atlas", when: "Mon, 12:35", text: "Demo rebooked; invite sent to hamza@sheikh.co." }],
    qa: [
      { criteria: "Greeting & verification", score: 5 },
      { criteria: "Needs discovery", score: 4 },
      { criteria: "Objection handling", score: 5 },
      { criteria: "Compliance statements", score: 5 },
      { criteria: "Closing & next step", score: 5 },
    ],
    qaScored: true,
  },
  {
    id: "h6",
    when: "Mon, 09:15",
    agent: "Sara Ahmed",
    agentType: "Human",
    direction: "Outgoing",
    lead: "Unknown",
    number: "+92 300 5550001",
    campaign: "—",
    duration: "0m 00s",
    outcome: "Wrong number",
    sentiment: "Neutral",
    tags: [],
    summary: "Number belongs to a different person. Marked as wrong number.",
    transcript: [],
    notes: [],
    qa: [],
    qaScored: false,
  },
];

export const qaCriteria = [
  "Greeting & verification",
  "Needs discovery",
  "Objection handling",
  "Compliance statements",
  "Closing & next step",
];
