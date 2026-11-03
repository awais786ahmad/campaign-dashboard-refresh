export type AuditActorType = "human" | "ai" | "system";
export type AuditAction = "Created" | "Updated" | "Deleted" | "Assigned" | "Launched" | "Completed" | "Imported" | "Exported" | "Signed in" | "Role changed" | "Call ended" | "Automated";
export type AuditModule = "CRM & Leads" | "Tasks" | "Campaigns" | "Calling" | "Organization" | "Reports & Analytics" | "Settings";

export type AuditChange = { field: string; before: string; after: string };

export type AuditEvent = {
  id: string;
  day: "Today" | "Yesterday" | "18 September 2026";
  time: string;
  isoDate: string;
  actor: string;
  actorInitials: string;
  actorType: AuditActorType;
  action: AuditAction;
  module: AuditModule;
  submodule: string;
  entityType: string;
  entityId: string;
  record: string;
  team: string;
  summary: string;
  changes?: AuditChange[];
  metadata?: { label: string; value: string }[];
  sensitive?: boolean;
};

export const auditEvents: AuditEvent[] = [
  { id: "evt_8f2a91", day: "Today", time: "7:42 PM", isoDate: "25 Sep 2026, 7:42 PM", actor: "Ahmed Khan", actorInitials: "AK", actorType: "human", action: "Updated", module: "CRM & Leads", submodule: "Leads", entityType: "Lead", entityId: "lead_1024", record: "Ali Raza", team: "Outbound Sales", summary: "Changed lead status and assignment", changes: [{ field: "Status", before: "New", after: "Interested" }, { field: "Assigned agent", before: "Bilal Khan", after: "Sara Ahmed" }, { field: "Campaign", before: "—", after: "Spring Outbound" }], metadata: [{ label: "IP address", value: "192.168.••.••" }, { label: "Device", value: "Chrome 128 / Linux" }] },
  { id: "evt_734bc2", day: "Today", time: "7:31 PM", isoDate: "25 Sep 2026, 7:31 PM", actor: "Sara Ahmed", actorInitials: "SA", actorType: "human", action: "Launched", module: "Campaigns", submodule: "Campaigns", entityType: "Campaign", entityId: "camp_2026_07", record: "Summer Campaign", team: "Outbound Sales", summary: "Launched campaign with 2,840 eligible leads", metadata: [{ label: "Dialling mode", value: "Predictive" }, { label: "Lead segment", value: "Lahore Region" }] },
  { id: "evt_620f88", day: "Today", time: "7:18 PM", isoDate: "25 Sep 2026, 7:18 PM", actor: "Quality Dial AI", actorInitials: "AI", actorType: "ai", action: "Automated", module: "Tasks", submodule: "Tasks", entityType: "Task", entityId: "task_102", record: "Follow up with Ali Raza", team: "Outbound Sales", summary: "Created follow-up from call analysis", changes: [{ field: "Priority", before: "—", after: "High" }, { field: "Due date", before: "—", after: "26 Sep 2026" }], metadata: [{ label: "Automation", value: "Post-call follow-up" }, { label: "Confidence", value: "94%" }] },
  { id: "evt_51da20", day: "Today", time: "6:54 PM", isoDate: "25 Sep 2026, 6:54 PM", actor: "Awais Ahmad", actorInitials: "AA", actorType: "human", action: "Role changed", module: "Organization", submodule: "Members", entityType: "Member", entityId: "member_304", record: "Sarah Malik", team: "Customer Success", summary: "Changed member role and team permissions", changes: [{ field: "Role", before: "Agent", after: "Supervisor" }, { field: "Team", before: "Support", after: "Customer Success" }, { field: "Permissions added", before: "—", after: "Team reports, Live monitoring, Manage leads" }], sensitive: true, metadata: [{ label: "IP address", value: "203.99.••.••" }, { label: "Device", value: "Safari / macOS" }] },
  { id: "evt_499b13", day: "Today", time: "6:37 PM", isoDate: "25 Sep 2026, 6:37 PM", actor: "Nova AI", actorInitials: "NA", actorType: "ai", action: "Call ended", module: "Calling", submodule: "History", entityType: "Call", entityId: "call_8941", record: "Usman Sheikh", team: "Renewals", summary: "Connected call ended after 8m 55s", changes: [{ field: "Outcome", before: "In progress", after: "Demo booked" }, { field: "Sentiment", before: "Neutral", after: "Positive" }], metadata: [{ label: "Direction", value: "Outgoing" }, { label: "Recording", value: "Available" }] },
  { id: "evt_348e02", day: "Today", time: "5:59 PM", isoDate: "25 Sep 2026, 5:59 PM", actor: "Bilal Khan", actorInitials: "BK", actorType: "human", action: "Completed", module: "Tasks", submodule: "Tasks", entityType: "Task", entityId: "task_091", record: "Send renewal quote", team: "Renewals", summary: "Marked task as complete", changes: [{ field: "Status", before: "In progress", after: "Completed" }] },
  { id: "evt_27cc17", day: "Yesterday", time: "4:28 PM", isoDate: "24 Sep 2026, 4:28 PM", actor: "Awais Ahmad", actorInitials: "AA", actorType: "human", action: "Created", module: "Organization", submodule: "Teams", entityType: "Team", entityId: "team_cs", record: "Customer Success", team: "Customer Success", summary: "Created a new team with 6 members", changes: [{ field: "Team name", before: "—", after: "Customer Success" }, { field: "Supervisor", before: "—", after: "Sarah Malik" }] },
  { id: "evt_16bc05", day: "Yesterday", time: "2:12 PM", isoDate: "24 Sep 2026, 2:12 PM", actor: "Hina Malik", actorInitials: "HM", actorType: "human", action: "Imported", module: "CRM & Leads", submodule: "Leads", entityType: "Import", entityId: "import_772", record: "Lahore prospects.csv", team: "Outbound Sales", summary: "Imported 1,248 leads; 36 duplicates skipped", metadata: [{ label: "Source", value: "CSV upload" }, { label: "Completed in", value: "42 seconds" }] },
  { id: "evt_05eaf1", day: "Yesterday", time: "11:03 AM", isoDate: "24 Sep 2026, 11:03 AM", actor: "System", actorInitials: "SY", actorType: "system", action: "Automated", module: "Settings", submodule: "Automations", entityType: "Automation", entityId: "auto_44", record: "Cold lead ageing", team: "Workspace", summary: "Archived 82 leads inactive for more than 30 days", metadata: [{ label: "Rule", value: "Mark Lead as Cold after X Days" }, { label: "Run type", value: "Scheduled" }] },
  { id: "evt_f4d183", day: "18 September 2026", time: "5:45 PM", isoDate: "18 Sep 2026, 5:45 PM", actor: "Sara Ahmed", actorInitials: "SA", actorType: "human", action: "Exported", module: "Reports & Analytics", submodule: "Calls", entityType: "Report", entityId: "report_calls_q3", record: "Q3 call performance", team: "Outbound Sales", summary: "Exported call performance as CSV", sensitive: true, metadata: [{ label: "Rows", value: "8,402" }, { label: "Format", value: "CSV" }] },
  { id: "evt_e3a266", day: "18 September 2026", time: "9:06 AM", isoDate: "18 Sep 2026, 9:06 AM", actor: "Ahmed Khan", actorInitials: "AK", actorType: "human", action: "Signed in", module: "Organization", submodule: "Members", entityType: "Session", entityId: "session_9f1", record: "Ahmed Khan", team: "Outbound Sales", summary: "Signed in with password and verification code", sensitive: true, metadata: [{ label: "IP address", value: "182.180.••.••" }, { label: "Device", value: "Chrome / Windows" }, { label: "Location", value: "Lahore, PK" }] },
];

export const auditModules = ["All modules", "CRM & Leads", "Tasks", "Campaigns", "Calling", "Organization", "Reports & Analytics", "Settings"] as const;
export const auditActions = ["All actions", "Created", "Updated", "Deleted", "Assigned", "Launched", "Completed", "Imported", "Exported", "Signed in", "Role changed", "Call ended", "Automated"] as const;
export const auditActors = ["All users", "Ahmed Khan", "Sara Ahmed", "Awais Ahmad", "Bilal Khan", "Hina Malik", "Nova AI", "Quality Dial AI", "System"] as const;
export const auditTeams = ["All teams", "Outbound Sales", "Renewals", "Customer Success", "Workspace"] as const;
export const auditEntityTypes = ["All records", "Lead", "Campaign", "Task", "Member", "Call", "Team", "Import", "Automation", "Report", "Session"] as const;

export function activityForRecord(entityType: string, entityId: string, record: string): AuditEvent[] {
  const exact = auditEvents.filter((event) => event.entityType === entityType && event.entityId === entityId);
  if (exact.length) return exact;
  const related = auditEvents.filter((event) => event.entityType === entityType).slice(0, 3);
  if (related.length) return related.map((event, index) => ({ ...event, id: `${entityId}_${index}`, record, entityId }));
  return auditEvents.slice(0, 3).map((event, index) => ({ ...event, id: `${entityId}_${index}`, entityType, entityId, record }));
}
