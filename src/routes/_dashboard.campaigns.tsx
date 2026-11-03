import { createFileRoute } from "@tanstack/react-router";

import { CampaignsPage } from "@/components/campaigns/campaigns-page";

export const Route = createFileRoute("/_dashboard/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaigns — Quality Dial" },
      { name: "description", content: "Plan, launch and measure multichannel outreach campaigns." },
      { property: "og:title", content: "Campaigns — Quality Dial" },
      {
        property: "og:description",
        content: "Plan, launch and measure multichannel outreach campaigns.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return <CampaignsPage />;
}
