/** Frontend-only demo data for the Inbox module. */

export const inboxChannels = ["SMS", "Email", "Voicemail"] as const;
export type InboxChannel = (typeof inboxChannels)[number];

export const emailFolders = ["Inbox", "Sent", "Drafts"] as const;
export type EmailFolder = (typeof emailFolders)[number];

export const inboxAssignees = [
  "Sara Ahmed",
  "Bilal Khan",
  "Hina Raza",
  "Usman Tariq",
  "AI Agent — Nova",
];

export type Attachment = { id: string; name: string; size: string };

/* ------------------------------------------------------------------- SMS */

export type SmsMessage = {
  id: string;
  direction: "in" | "out";
  body: string;
  when: string;
  author: string;
  attachments?: Attachment[];
};

export type SmsConversation = {
  id: string;
  leadId: string;
  contact: string;
  phone: string;
  company: string;
  assignee: string;
  unread: boolean;
  archived: boolean;
  tags: string[];
  notes: string;
  lastActivity: string;
  messages: SmsMessage[];
};

export const smsSeed: SmsConversation[] = [
  {
    id: "sms1",
    leadId: "l1",
    contact: "Ali Raza",
    phone: "+92 300 1234567",
    company: "Northwind Textiles",
    assignee: "Sara Ahmed",
    unread: true,
    archived: false,
    tags: ["VIP", "High Budget"],
    notes: "Prefers WhatsApp after 6pm.",
    lastActivity: "2m ago",
    messages: [
      {
        id: "sm1",
        direction: "out",
        body: "Hello Ali, this is Sara from Quality Dial. Sharing the pilot pricing we discussed on the call.",
        when: "Today, 10:02",
        author: "Sara Ahmed",
      },
      {
        id: "sm2",
        direction: "in",
        body: "Thanks Sara. Can you confirm if the 3-seat pilot includes call recording?",
        when: "Today, 10:18",
        author: "Ali Raza",
      },
      {
        id: "sm3",
        direction: "out",
        body: "Yes — recording, transcripts and AI summaries are all included in the pilot.",
        when: "Today, 10:21",
        author: "Sara Ahmed",
        attachments: [{ id: "a1", name: "pilot-pricing.pdf", size: "218 KB" }],
      },
      {
        id: "sm4",
        direction: "in",
        body: "Perfect. Send the agreement and we will sign this week.",
        when: "Today, 10:44",
        author: "Ali Raza",
      },
    ],
  },
  {
    id: "sms2",
    leadId: "l2",
    contact: "Fatima Sheikh",
    phone: "+92 321 9876543",
    company: "Sheikh Motors",
    assignee: "Bilal Khan",
    unread: false,
    archived: false,
    tags: ["Interested"],
    notes: "",
    lastActivity: "1h ago",
    messages: [
      {
        id: "sm5",
        direction: "in",
        body: "Hi, I missed your call. What is this regarding?",
        when: "Today, 09:12",
        author: "Fatima Sheikh",
      },
      {
        id: "sm6",
        direction: "out",
        body: "Hi Fatima — we were following up on your demo request for the outbound dialer.",
        when: "Today, 09:20",
        author: "Bilal Khan",
      },
      {
        id: "sm7",
        direction: "in",
        body: "Please call me tomorrow after 3pm.",
        when: "Today, 09:31",
        author: "Fatima Sheikh",
      },
    ],
  },
  {
    id: "sms3",
    leadId: "l3",
    contact: "Daniel Okafor",
    phone: "+44 7700 900123",
    company: "Northwind Retail",
    assignee: "Hina Raza",
    unread: true,
    archived: false,
    tags: ["Follow-up"],
    notes: "",
    lastActivity: "Yesterday",
    messages: [
      {
        id: "sm8",
        direction: "out",
        body: "Reminder: your onboarding session is scheduled for Friday at 14:00.",
        when: "Yesterday, 16:40",
        author: "AI Agent — Nova",
      },
      {
        id: "sm9",
        direction: "in",
        body: "Can we move it to Monday morning instead?",
        when: "Yesterday, 17:02",
        author: "Daniel Okafor",
      },
    ],
  },
  {
    id: "sms4",
    leadId: "l4",
    contact: "Ayesha Malik",
    phone: "+92 333 4455667",
    company: "Malik Estates",
    assignee: "Sara Ahmed",
    unread: false,
    archived: false,
    tags: [],
    notes: "",
    lastActivity: "2 days ago",
    messages: [
      {
        id: "sm10",
        direction: "in",
        body: "Received the invoice, payment goes out on Thursday.",
        when: "Tue, 11:15",
        author: "Ayesha Malik",
      },
      {
        id: "sm11",
        direction: "out",
        body: "Thank you Ayesha, noted on our side.",
        when: "Tue, 11:20",
        author: "Sara Ahmed",
      },
    ],
  },
];

/* ----------------------------------------------------------------- Email */

export type EmailMessage = {
  id: string;
  from: string;
  fromEmail: string;
  to: string[];
  cc?: string[];
  when: string;
  body: string;
  attachments?: Attachment[];
  draft?: boolean;
};

export type EmailThread = {
  id: string;
  leadId: string;
  folder: EmailFolder;
  subject: string;
  contact: string;
  email: string;
  company: string;
  assignee: string;
  unread: boolean;
  archived: boolean;
  tags: string[];
  notes: string;
  lastActivity: string;
  messages: EmailMessage[];
};

export const emailSeed: EmailThread[] = [
  {
    id: "em1",
    leadId: "l1",
    folder: "Inbox",
    subject: "Pilot proposal — Northwind Textiles",
    contact: "Ali Raza",
    email: "ali.raza@northwind.pk",
    company: "Northwind Textiles",
    assignee: "Sara Ahmed",
    unread: true,
    archived: false,
    tags: ["VIP"],
    notes: "Legal review needed before signature.",
    lastActivity: "18m ago",
    messages: [
      {
        id: "emm1",
        from: "Sara Ahmed",
        fromEmail: "sara@qualitydial.com",
        to: ["ali.raza@northwind.pk"],
        cc: ["ops@northwind.pk"],
        when: "Today, 09:40",
        body: "Hi Ali,\n\nAttached is the pilot proposal covering three seats, call recording and AI summaries.\n\nBest,\nSara",
        attachments: [{ id: "ea1", name: "northwind-pilot.pdf", size: "412 KB" }],
      },
      {
        id: "emm2",
        from: "Ali Raza",
        fromEmail: "ali.raza@northwind.pk",
        to: ["sara@qualitydial.com"],
        when: "Today, 10:52",
        body: "Thanks Sara,\n\nThe scope looks right. Could you confirm the notice period and share the DPA for our legal team?\n\nAli",
      },
    ],
  },
  {
    id: "em2",
    leadId: "l2",
    folder: "Inbox",
    subject: "Re: Demo request for outbound dialer",
    contact: "Fatima Sheikh",
    email: "fatima@sheikhmotors.pk",
    company: "Sheikh Motors",
    assignee: "Bilal Khan",
    unread: false,
    archived: false,
    tags: ["Interested"],
    notes: "",
    lastActivity: "3h ago",
    messages: [
      {
        id: "emm3",
        from: "Fatima Sheikh",
        fromEmail: "fatima@sheikhmotors.pk",
        to: ["sales@qualitydial.com"],
        when: "Today, 08:05",
        body: "Hello,\n\nWe would like a demo for a team of eight agents. Tuesday or Wednesday works for us.\n\nFatima",
      },
      {
        id: "emm4",
        from: "Bilal Khan",
        fromEmail: "bilal@qualitydial.com",
        to: ["fatima@sheikhmotors.pk"],
        when: "Today, 08:32",
        body: "Hi Fatima,\n\nWednesday 11:00 is open on our side. I have held the slot for your team.\n\nBilal",
      },
    ],
  },
  {
    id: "em3",
    leadId: "l4",
    folder: "Sent",
    subject: "Invoice #4482 for August usage",
    contact: "Ayesha Malik",
    email: "ayesha@malikestates.pk",
    company: "Malik Estates",
    assignee: "Sara Ahmed",
    unread: false,
    archived: false,
    tags: ["Billing"],
    notes: "",
    lastActivity: "2 days ago",
    messages: [
      {
        id: "emm5",
        from: "Sara Ahmed",
        fromEmail: "sara@qualitydial.com",
        to: ["ayesha@malikestates.pk"],
        when: "Tue, 10:02",
        body: "Hi Ayesha,\n\nAttaching the invoice for August usage. Payment terms are net 15.\n\nThanks,\nSara",
        attachments: [{ id: "ea2", name: "invoice-4482.pdf", size: "96 KB" }],
      },
    ],
  },
  {
    id: "em4",
    leadId: "l3",
    folder: "Drafts",
    subject: "Onboarding session — reschedule options",
    contact: "Daniel Okafor",
    email: "daniel@northwindretail.co.uk",
    company: "Northwind Retail",
    assignee: "Hina Raza",
    unread: false,
    archived: false,
    tags: [],
    notes: "Waiting on the trainer calendar before sending.",
    lastActivity: "Yesterday",
    messages: [
      {
        id: "emm6",
        from: "Hina Raza",
        fromEmail: "hina@qualitydial.com",
        to: ["daniel@northwindretail.co.uk"],
        when: "Saved yesterday, 17:30",
        body: "Hi Daniel,\n\nHappy to move the onboarding session. I can offer Monday 10:00 or Tuesday 15:00.",
        draft: true,
      },
    ],
  },
];

/* ------------------------------------------------------------- Voicemail */

export type Voicemail = {
  id: string;
  leadId: string;
  caller: string;
  phone: string;
  company: string;
  when: string;
  duration: string;
  assignee: string;
  unread: boolean;
  archived: boolean;
  completed: boolean;
  tags: string[];
  notes: string;
  transcript: string;
  summary: string;
  file: string;
};

export const voicemailSeed: Voicemail[] = [
  {
    id: "vm1",
    leadId: "l2",
    caller: "Fatima Sheikh",
    phone: "+92 321 9876543",
    company: "Sheikh Motors",
    when: "Today, 09:04",
    duration: "0:42",
    assignee: "Bilal Khan",
    unread: true,
    archived: false,
    completed: false,
    tags: ["Interested"],
    notes: "",
    transcript:
      "Hi, this is Fatima from Sheikh Motors. I missed your call earlier. We are comparing two dialers and I would like to understand your per-seat pricing and whether local numbers are included. Please call me back after 3pm today.",
    summary:
      "Pricing comparison in progress. Wants per-seat pricing and confirmation that local numbers are included. Asked for a callback after 3pm.",
    file: "voicemail-fatima-sheikh.mp3",
  },
  {
    id: "vm2",
    leadId: "l5",
    caller: "Unknown caller",
    phone: "+92 302 5566778",
    company: "—",
    when: "Today, 08:12",
    duration: "0:18",
    assignee: "Unassigned",
    unread: true,
    archived: false,
    completed: false,
    tags: [],
    notes: "",
    transcript:
      "Hello, I saw your ad about the AI calling agent. Please send details on WhatsApp on this number.",
    summary: "Inbound enquiry from an ad. Requests product details over WhatsApp.",
    file: "voicemail-unknown-0812.mp3",
  },
  {
    id: "vm3",
    leadId: "l1",
    caller: "Ali Raza",
    phone: "+92 300 1234567",
    company: "Northwind Textiles",
    when: "Yesterday, 18:22",
    duration: "1:06",
    assignee: "Sara Ahmed",
    unread: false,
    archived: false,
    completed: true,
    tags: ["VIP"],
    notes: "Handled on the follow-up call this morning.",
    transcript:
      "Sara, Ali here. Our legal team has one question on the data processing agreement. Nothing blocking, but we want it resolved before signature. Call me tomorrow morning.",
    summary:
      "One open legal question on the DPA before signature. Not blocking. Requested a morning callback.",
    file: "voicemail-ali-raza.mp3",
  },
  {
    id: "vm4",
    leadId: "l4",
    caller: "Ayesha Malik",
    phone: "+92 333 4455667",
    company: "Malik Estates",
    when: "Tue, 14:48",
    duration: "0:31",
    assignee: "Sara Ahmed",
    unread: false,
    archived: false,
    completed: false,
    tags: ["Billing"],
    notes: "",
    transcript:
      "Hi, calling about invoice 4482. Payment is scheduled for Thursday, no action needed from your side.",
    summary: "Payment for invoice 4482 scheduled for Thursday. No action required.",
    file: "voicemail-ayesha-malik.mp3",
  },
];

/* -------------------------------------------------------- AI suggestions */

export const aiSmsSuggestions = [
  "Thanks for confirming — I'll send the agreement within the hour.",
  "Happy to help. Would a quick 10 minute call today work better?",
  "Noted. I've scheduled a callback and you'll get an SMS confirmation shortly.",
];

export const aiEmailDraft =
  "Hi {{LeadName}},\n\nThanks for the quick turnaround. The notice period is 30 days and I've attached our standard DPA for your legal team.\n\nHappy to jump on a short call if it's easier to walk through together.\n\nBest regards,\n{{AgentName}}\nQuality Dial";
