import { createFileRoute } from "@tanstack/react-router";

import { TeamsSettings } from "@/components/organization/teams-settings";

export const Route = createFileRoute("/_dashboard/organization/teams")({
  head: () => ({
    meta: [
      { title: "Teams — Quality Dial" },
      { name: "description", content: "Structure agents into teams with their own routing rules." },
      { property: "og:title", content: "Teams — Quality Dial" },
      { property: "og:description", content: "Structure agents into teams with their own routing rules." },
    ],
  }),
  component: Page,
});

function Page() {
  return <TeamsSettings />;
}
