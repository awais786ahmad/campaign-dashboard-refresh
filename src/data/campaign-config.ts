/** Typed campaign configuration schema — frontend-only demo data for the wizard. */

import type { CampaignType } from "./campaigns";

export type ConfigValue = string | number | boolean | string[];

export type RetryRule = {
  enabled: boolean;
  wait: string;
  maxRetries: string;
  waitCustom: string;
  maxCustom: string;
};

export type ConfigControl =
  | { kind: "select"; options: string[]; suffix?: string }
  | { kind: "number"; suffix?: string }
  | { kind: "toggle" }
  | { kind: "time" }
  | { kind: "datetime" }
  | { kind: "date" }
  | { kind: "days" }
  | { kind: "multi"; options: string[] }
  | { kind: "text" };

export type ConfigField = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  control: ConfigControl;
  default: ConfigValue;
  locked?: boolean;
};

/* --------------------------------------------------------------- helpers */

const sel = (
  id: string,
  label: string,
  group: string,
  options: string[],
  def: string,
  hint?: string,
  suffix?: string,
): ConfigField => ({
  id,
  label,
  group,
  control: { kind: "select", options, ...(suffix ? { suffix } : {}) },
  default: def,
  ...(hint ? { hint } : {}),
});

const tog = (
  id: string,
  label: string,
  group: string,
  def: boolean,
  hint?: string,
  locked?: boolean,
): ConfigField => ({
  id,
  label,
  group,
  control: { kind: "toggle" },
  default: def,
  ...(locked ? { locked: true } : {}),
  ...(hint ? { hint } : {}),
});

const num = (
  id: string,
  label: string,
  group: string,
  def: number,
  suffix?: string,
  hint?: string,
): ConfigField => ({
  id,
  label,
  group,
  control: { kind: "number", ...(suffix ? { suffix } : {}) },
  default: def,
  ...(hint ? { hint } : {}),
});

const time = (id: string, label: string, group: string, def: string, hint?: string): ConfigField => ({
  id,
  label,
  group,
  control: { kind: "time" },
  default: def,
  ...(hint ? { hint } : {}),
});

const dt = (id: string, label: string, group: string, hint?: string): ConfigField => ({
  id,
  label,
  group,
  control: { kind: "datetime" },
  default: "",
  ...(hint ? { hint } : {}),
});

const date = (id: string, label: string, group: string, hint?: string): ConfigField => ({
  id,
  label,
  group,
  control: { kind: "date" },
  default: "",
  ...(hint ? { hint } : {}),
});

const days = (id: string, label: string, group: string, def: string[], hint?: string): ConfigField => ({
  id,
  label,
  group,
  control: { kind: "days" },
  default: def,
  ...(hint ? { hint } : {}),
});

const multi = (
  id: string,
  label: string,
  group: string,
  options: string[],
  def: string[],
  hint?: string,
): ConfigField => ({
  id,
  label,
  group,
  control: { kind: "multi", options },
  default: def,
  ...(hint ? { hint } : {}),
});

/* ------------------------------------------------------------ constants */

export const timezoneOptions = [
  "Asia/Karachi (UTC+05:00)",
  "Asia/Dubai (UTC+04:00)",
  "Europe/London (UTC+00:00)",
  "America/New_York (UTC−05:00)",
];

const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const sixDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const purposeGroups: { category: string; purposes: string[] }[] = [
  { category: "Sales", purposes: ["Sales", "Lead Qualification", "Renewal & Upselling"] },
  { category: "Support", purposes: ["Customer Support", "Technical Support", "Complaint Handling"] },
  { category: "Customer Success", purposes: ["Welcome & Onboarding", "Follow-up", "Customer Retention"] },
  { category: "Operations", purposes: ["Appointment Booking", "Appointment Reminders", "Order Confirmation"] },
  { category: "Payments", purposes: ["Collections", "Payment Reminders", "Debt Recovery"] },
  { category: "Research", purposes: ["Survey & Research", "Feedback & Reviews"] },
  { category: "Other", purposes: ["Verification & Authentication", "Event Invitations", "Custom"] },
];

export const priorities = ["Low", "Normal", "High", "Urgent"];

export const audienceSources = [
  "Saved segment",
  "Contact list",
  "CRM filters",
  "Data table",
  "All eligible contacts",
];

export const aiAgentOptions = ["Nova", "Atlas", "Echo", "None"];

export const retryWaitOptions = [
  "Immediate",
  "1 minute",
  "5 minutes",
  "15 minutes",
  "30 minutes",
  "1 hour",
  "4 hours",
  "12 hours",
  "24 hours",
  "Custom",
];

export const retryMaxOptions = ["0", "1", "2", "3", "4", "5", "Custom"];

export const retryOutcomes: { id: string; label: string; description: string }[] = [
  { id: "busy", label: "Busy line", description: "Retry after a short wait." },
  { id: "noAnswer", label: "No answer", description: "Retry the contact later." },
  { id: "voicemail", label: "Voicemail", description: "Retry if voicemail was detected." },
  { id: "networkError", label: "Temporary network error", description: "Quick technical retry." },
  { id: "disconnected", label: "Disconnected call", description: "Apply the disconnect policy." },
  { id: "rejected", label: "Rejected call", description: "Not retried automatically." },
  { id: "rateLimit", label: "Provider rate limit", description: "Retry after the provider delay." },
];

const defaultRetry: Record<string, { enabled: boolean; wait: string; maxRetries: string }> = {
  busy: { enabled: true, wait: "20 minutes", maxRetries: "3" },
  noAnswer: { enabled: true, wait: "4 hours", maxRetries: "4" },
  voicemail: { enabled: true, wait: "24 hours", maxRetries: "2" },
  networkError: { enabled: true, wait: "5 minutes", maxRetries: "2" },
  disconnected: { enabled: true, wait: "30 minutes", maxRetries: "2" },
  rejected: { enabled: false, wait: "Immediate", maxRetries: "0" },
  rateLimit: { enabled: true, wait: "4 hours", maxRetries: "2" },
};

export const defaultRetryRules = (): Record<string, RetryRule> =>
  Object.fromEntries(
    Object.entries(defaultRetry).map(([id, rule]) => [
      id,
      { ...rule, waitCustom: "", maxCustom: "" },
    ]),
  );

/* --------------------------------------------------------------- schemas */

const aiGroup = "AI & Scripts";
const safetyGroup = "Safety & Compliance";

const aiFields = (group: string): ConfigField[] => [
  sel("aiVoice", "AI voice", group, ["Aria", "Nova Voice", "Atlas Voice"], "Aria", "Preview available in AI agents"),
  sel("aiLanguage", "Language", group, ["English (US)", "English (UK)", "Urdu", "Arabic"], "English (US)"),
  sel("speakingSpeed", "Speaking speed", group, ["Slow", "Normal", "Fast"], "Normal"),
  sel("responseStyle", "Response style", group, ["Professional", "Friendly", "Formal", "Casual"], "Professional"),
  sel("maxConversationDuration", "Max conversation duration", group, ["5 minutes", "10 minutes", "15 minutes", "Platform default"], "Platform default"),
  tog("transferToHuman", "Transfer to human", group, true, "Transfer when the AI can't help"),
];

const safetyFields = (group: string, extra: ConfigField[] = []): ConfigField[] => [
  tog("respectOptOuts", "Respect opt-outs", group, true, "Always enforced — cannot be changed", true),
  tog("dncCheck", "Check do-not-contact list", group, true, "Always enforced — cannot be changed", true),
  sel("contactFrequencyLimit", "Contact frequency limit", group, ["Workspace policy"], "Workspace policy", "Workspace-level policy — read-only"),
  sel("recordingConsent", "Recording consent handling", group, ["Workspace policy"], "Workspace policy", "Workspace-level policy — read-only"),
  ...extra,
];

export const configGroupsByType: Record<CampaignType, string[]> = {
  Outbound: ["Schedule & Timing", "Dialing & Delivery", "Contact Limits", aiGroup, safetyGroup],
  Inbound: ["Schedule & Timing", "Call Handling", "Queue & Routing", aiGroup, safetyGroup],
  Broadcast: ["Schedule & Timing", "Channels & Delivery", "Sending Limits", "Message Settings", safetyGroup],
};

export const configSchemaByType: Record<CampaignType, ConfigField[]> = {
  Outbound: [
    sel("executionMode", "Execution mode", "Schedule & Timing", ["Manual start", "Scheduled start", "Recurring schedule"], "Manual start", "When this campaign begins"),
    dt("startAt", "Start date & time", "Schedule & Timing", "Required for scheduled or recurring starts"),
    sel("timezone", "Timezone", "Schedule & Timing", timezoneOptions, timezoneOptions[0]!),
    sel("endCondition", "End condition", "Schedule & Timing", ["Complete all eligible contacts", "Stop at a selected date and time", "Stop after reaching a target", "Stop manually"], "Complete all eligible contacts"),
    sel("dialingMode", "Dialing mode", "Dialing & Delivery", ["Manual", "Preview", "Progressive", "Power", "Predictive"], "Progressive", "Progressive dials when an agent is available"),
    sel("maxConcurrentCalls", "Maximum concurrent calls", "Dialing & Delivery", ["5", "10", "20", "50", "Custom"], "20", "Based on plan and provider capacity"),
    sel("callsPerMinute", "Calls per minute", "Dialing & Delivery", ["10", "20", "40", "60", "Custom"], "40", "Provider-recommended safe limit"),
    sel("ringTimeout", "Ring timeout", "Dialing & Delivery", ["15", "20", "25", "30", "45", "60"], "30", undefined, "seconds"),
    days("workingDays", "Working days", "Dialing & Delivery", weekdays, "When outreach is allowed"),
    time("workingHoursStart", "Start time", "Dialing & Delivery", "09:00"),
    time("workingHoursEnd", "End time", "Dialing & Delivery", "18:00"),
    sel("maxAttemptsPerContact", "Max attempts per contact", "Contact Limits", ["1", "2", "3", "4", "5", "Custom"], "4"),
    sel("maxAttemptsPerDay", "Max attempts per day", "Contact Limits", ["1", "2", "3", "4", "Custom"], "2"),
    tog("stopAfterContact", "Stop after successful contact", "Contact Limits", true),
    tog("stopAfterConversion", "Stop after conversion", "Contact Limits", true),
    ...aiFields(aiGroup),
    ...safetyFields(safetyGroup, [
      tog("callRecording", "Call recording", safetyGroup, true, "Based on consent and policy"),
      tog("quietHours", "Quiet hours", safetyGroup, true, "Pause outreach overnight"),
    ]),
  ],
  Inbound: [
    time("businessHoursStart", "Business hours start", "Schedule & Timing", "08:00"),
    time("businessHoursEnd", "Business hours end", "Schedule & Timing", "20:00"),
    days("workingDays", "Working days", "Schedule & Timing", sixDays),
    sel("timezone", "Timezone", "Schedule & Timing", timezoneOptions, timezoneOptions[0]!),
    sel("afterHoursAction", "After-hours action", "Schedule & Timing", ["AI receptionist", "Voicemail", "Closed message", "Forward to another team", "End the call"], "AI receptionist"),
    tog("aiReceptionist", "AI receptionist", "Call Handling", true, "Answers when no human agent picks up"),
    sel("inboundAiAgent", "AI agent", "Call Handling", aiAgentOptions, "Echo", "Agent that answers inbound calls"),
    sel("answerDelay", "Answer delay", "Call Handling", ["Immediately", "1 ring", "2 rings", "3 rings", "4 rings", "5 rings"], "3 rings"),
    sel("welcomeScript", "Welcome script", "Call Handling", ["No selection", "Sales Script", "Support Script", "Collection Script", "Cold Calling Script"], "No selection", "Searchable in the scripts library"),
    sel("maxCallDuration", "Max call duration", "Call Handling", ["15 minutes", "30 minutes", "60 minutes", "Platform default"], "Platform default"),
    tog("callRecording", "Call recording", "Call Handling", false, "Disabled unless consent is configured"),
    sel("queueTimeout", "Queue timeout", "Queue & Routing", ["30", "60", "90", "120", "180"], "90", undefined, "seconds"),
    sel("queueStrategy", "Queue strategy", "Queue & Routing", ["Round-robin", "Longest idle", "Least active calls", "Priority-based"], "Round-robin"),
    sel("overflowAction", "Overflow action", "Queue & Routing", ["Forward to another team", "Send to AI receptionist", "Send to voicemail", "Offer callback", "End the call"], "Forward to another team"),
    sel("overflowTeam", "Overflow destination", "Queue & Routing", ["Support Tier 2", "Outbound Sales Pod", "Retention Squad", "Collections Unit"], "Support Tier 2"),
    sel("noAnswerAction", "No-answer action", "Queue & Routing", ["Voicemail", "AI receptionist", "End the call"], "Voicemail"),
    tog("callbackOption", "Offer callback when queue is busy", "Queue & Routing", false),
    ...aiFields(aiGroup),
    ...safetyFields(safetyGroup, [
      tog("missedCallAlerts", "Missed-call notifications", safetyGroup, true, "Notify the team when a call is missed"),
    ]),
  ],
  Broadcast: [
    sel("deliveryMode", "Delivery mode", "Schedule & Timing", ["Send once", "Scheduled", "Recurring", "Multi-step sequence"], "Send once"),
    dt("startAt", "Start date & time", "Schedule & Timing", "Required for scheduled or recurring sends"),
    sel("timezone", "Timezone", "Schedule & Timing", timezoneOptions, timezoneOptions[0]!),
    date("endAt", "Campaign end date", "Schedule & Timing", "Optional — stop sending after this date"),
    multi("channels", "Channels", "Channels & Delivery", ["Voice call", "SMS", "WhatsApp", "Email"], ["SMS"], "Only channels enabled for the workspace"),
    sel("fallbackChannel", "Fallback channel", "Channels & Delivery", ["None", "Voice call", "SMS", "WhatsApp", "Email"], "None", "Used when the primary channel fails"),
    tog("stopOnReply", "Stop when contact replies", "Channels & Delivery", true),
    num("dailyLimit", "Daily sending limit", "Sending Limits", 5000, "messages", "Provider-recommended safe limit"),
    sel("maxPerContactPerDay", "Messages per contact per day", "Sending Limits", ["1", "2", "3", "Custom"], "1"),
    num("delayBetweenSends", "Delay between sends", "Sending Limits", 12, "seconds", "Provider-recommended safe limit"),
    tog("deliveryTracking", "Delivery tracking", "Sending Limits", true, "Track delivery, failure and opt-outs"),
    sel("messageTemplate", "Message template", "Message Settings", ["No selection", "Thank You SMS", "Welcome Email", "WhatsApp Intro", "Appointment Reminder", "Payment Reminder"], "No selection"),
    sel("senderIdentity", "Sender identity", "Message Settings", ["Default approved sender", "Quality Dial", "Support Team"], "Default approved sender"),
    tog("retryFailedDelivery", "Retry failed delivery", "Message Settings", true),
    sel("maxDeliveryRetries", "Max delivery retries", "Message Settings", ["0", "1", "2", "3"], "2"),
    ...safetyFields(safetyGroup, [
      tog("quietHours", "Quiet hours", safetyGroup, true, "Pause sending overnight"),
    ]),
  ],
};

export const defaultConfig = (type: CampaignType): Record<string, ConfigValue> =>
  Object.fromEntries(configSchemaByType[type].map((f) => [f.id, f.default]));

/* ----------------------------------------------------------- describing */

export function describeDays(days: string[]): string {
  const selected = dayOrder.filter((d) => days.includes(d));
  if (selected.length === 0) return "—";
  if (selected.length === 7) return "Every day";
  const parts: string[] = [];
  let start = 0;
  for (let i = 1; i <= selected.length; i++) {
    const prev = dayOrder.indexOf(selected[i - 1]!);
    const cur = i < selected.length ? dayOrder.indexOf(selected[i]!) : -2;
    if (cur !== prev + 1) {
      if (i - 1 > start) parts.push(`${selected[start]}–${selected[i - 1]}`);
      else parts.push(selected[start]!);
      start = i;
    }
  }
  return parts.join(", ");
}

export function describeConfigValue(
  field: ConfigField,
  value: ConfigValue | undefined,
): string {
  const v = value === undefined || value === "" ? field.default : value;
  if (typeof v === "boolean") return v ? "Enabled" : "Disabled";
  if (Array.isArray(v)) {
    if (v.length === 0) return "—";
    return field.control.kind === "days" ? describeDays(v) : v.join(", ");
  }
  if (typeof v === "number") {
    return field.control.kind === "number" && field.control.suffix ? `${v} ${field.control.suffix}` : String(v);
  }
  if (v === "") return field.control.kind === "datetime" ? "Not scheduled" : "—";
  return v;
}

export function retryWaitDisplay(rule: RetryRule): string {
  if (!rule.enabled) return "Never";
  if (rule.wait === "Custom") return `${rule.waitCustom || "0"} minutes`;
  return rule.wait.toLowerCase();
}

export function retryMaxDisplay(rule: RetryRule): string {
  return rule.maxRetries === "Custom" ? rule.maxCustom || "0" : rule.maxRetries;
}

export function retryRulesSummary(rules: Record<string, RetryRule>): string {
  const active = retryOutcomes.filter((o) => rules[o.id]?.enabled);
  if (active.length === 0) return "Retries disabled — failed calls are not retried.";
  return active
    .map((o) => {
      const rule = rules[o.id]!;
      return `${o.label} after ${retryWaitDisplay(rule)} (max ${retryMaxDisplay(rule)})`;
    })
    .join(" · ");
}
