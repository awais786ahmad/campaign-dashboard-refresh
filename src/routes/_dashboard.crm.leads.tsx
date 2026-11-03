import { createFileRoute } from "@tanstack/react-router";

import { LeadsPage } from "@/components/crm/leads-page";

export const Route = createFileRoute("/_dashboard/crm/leads")({
  head: () => ({
    meta: [
      { title: "Leads — Quality Dial" },
      { name: "description", content: "Every contact in your CRM with owner, stage and last touch." },
      { property: "og:title", content: "Leads — Quality Dial" },
      { property: "og:description", content: "Every contact in your CRM with owner, stage and last touch." },
    ],
  }),
  component: Page,
});

function Page() {
  return <LeadsPage />;
}
