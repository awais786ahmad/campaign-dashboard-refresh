import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/dashboard/app-shell";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
