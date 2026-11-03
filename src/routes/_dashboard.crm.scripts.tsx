import { createFileRoute } from "@tanstack/react-router";

import { ScriptsPage } from "@/components/crm/scripts-page";

export const Route = createFileRoute("/_dashboard/crm/scripts")({
  head: () => ({
    meta: [
      { title: "Scripts — Quality Dial" },
      { name: "description", content: "Reusable talk tracks your agents and AI follow on calls." },
      { property: "og:title", content: "Scripts — Quality Dial" },
      { property: "og:description", content: "Reusable talk tracks your agents and AI follow on calls." },
    ],
  }),
  component: Page,
});

function Page() {
  return <ScriptsPage />;
}
