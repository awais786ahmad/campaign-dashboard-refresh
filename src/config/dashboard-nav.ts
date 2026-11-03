import type { LinkProps } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  Megaphone,
  Inbox,
  BarChart3,
  Building2,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type AppRoute = LinkProps["to"];

export type NavChild = { label: string; to: AppRoute };

export type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  to?: AppRoute;
  children?: NavChild[];
};

export const dashboardNav: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  {
    id: "crm",
    label: "CRM & Leads",
    icon: Users,
    children: [
      { label: "Segments", to: "/crm/segments" },
      { label: "Leads", to: "/crm/leads" },
      { label: "Tags", to: "/crm/tags" },
      { label: "Tasks", to: "/crm/tasks" },
      { label: "Data table", to: "/crm/data-table" },
      { label: "Scripts", to: "/crm/scripts" },
      { label: "Templates", to: "/crm/templates" },
    ],
  },
  {
    id: "calling",
    label: "Calling",
    icon: PhoneCall,
    children: [
      { label: "Dialer", to: "/calling/dialer" },
      { label: "Live", to: "/calling/live" },
      { label: "History", to: "/calling/history" },
    ],
  },
  { id: "campaigns", label: "Campaigns", icon: Megaphone, to: "/campaigns" },
  { id: "inbox", label: "Inbox", icon: Inbox, to: "/inbox" },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: BarChart3,
    children: [
      { label: "Overview", to: "/reports" },
      { label: "Calls", to: "/reports/calls" },
      { label: "Performance", to: "/reports/performance" },
      { label: "Campaigns", to: "/reports/campaigns" },
      { label: "Quality & AI", to: "/reports/quality" },
      { label: "Reports", to: "/reports/library" },
    ],
  },
  {
    id: "organization",
    label: "Organization",
    icon: Building2,
    children: [
      { label: "Workspace settings", to: "/organization/workspace" },
      { label: "Teams", to: "/organization/teams" },
      { label: "Members", to: "/organization/members" },
      { label: "Roles & permissions", to: "/organization/roles" },
      { label: "AI agents", to: "/organization/ai-agents" },
      { label: "Activity & Audit Log", to: "/organization/activity-log" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Profile", to: "/settings/profile" },
      { label: "Automations", to: "/settings/automations" },
      { label: "Knowledge base", to: "/settings/knowledge-base" },
      { label: "Calling", to: "/settings/calling" },
    ],
  },
];

export function findBreadcrumbs(pathname: string): { label: string; to?: AppRoute }[] {
  for (const item of dashboardNav) {
    if (item.to === pathname) return [{ label: item.label, to: item.to }];
    const child = item.children?.find((c) => c.to === pathname);
    if (child) return [{ label: item.label }, { label: child.label, to: child.to }];
  }
  return [{ label: "Dashboard", to: "/dashboard" }];
}

export const searchableEntries = [
  ...dashboardNav.flatMap((item) =>
    item.children
      ? item.children.map((c) => ({ group: item.label, label: c.label, to: c.to }))
      : [{ group: "Modules", label: item.label, to: item.to! }],
  ),
];
