import type { ReactNode } from "react";

import { DashboardShellProvider, useShell } from "@/components/dashboard/shell-context";
import {
  DashboardSidebar,
  PANEL_WIDTH,
  RAIL_WIDTH,
} from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { CopilotLauncher } from "@/components/dashboard/copilot";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <DashboardShellProvider>
      <ShellFrame>{children}</ShellFrame>
    </DashboardShellProvider>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  const { sidebarPinned } = useShell();

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar />
      <div
        style={{ marginLeft: sidebarPinned ? PANEL_WIDTH : RAIL_WIDTH }}
        className="flex min-h-screen flex-col transition-[margin] duration-300 ease-out"
      >
        <DashboardTopbar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
      <CopilotLauncher />
    </div>
  );
}
