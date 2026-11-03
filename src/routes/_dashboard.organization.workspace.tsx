import { createFileRoute } from "@tanstack/react-router";

import { WorkspaceSettings } from "@/components/organization/workspace-settings";

export const Route = createFileRoute("/_dashboard/organization/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace settings — Quality Dial" },
      { name: "description", content: "Brand, numbers, compliance and workspace-wide defaults." },
      { property: "og:title", content: "Workspace settings — Quality Dial" },
      { property: "og:description", content: "Brand, numbers, compliance and workspace-wide defaults." },
    ],
  }),
  component: Page,
});

function Page() {
  return <WorkspaceSettings />;
}
