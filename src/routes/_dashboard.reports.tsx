import { createFileRoute, Outlet } from "@tanstack/react-router";

import { ReportsNav } from "@/components/reports/shared";

export const Route = createFileRoute("/_dashboard/reports")({
  component: ReportsLayout,
});

function ReportsLayout() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <ReportsNav />
      <Outlet />
    </div>
  );
}
