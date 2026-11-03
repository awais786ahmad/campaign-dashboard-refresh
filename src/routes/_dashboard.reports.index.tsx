import { createFileRoute } from "@tanstack/react-router";

import { OverviewPage } from "@/components/reports/overview-page";

export const Route = createFileRoute("/_dashboard/reports/")({
  head: () => ({
    meta: [
      { title: "Analytics overview — Quality Dial" },
      { name: "description", content: "Call center KPIs, funnel, outcomes, human vs AI and AI insights in one view." },
      { property: "og:title", content: "Analytics overview — Quality Dial" },
      { property: "og:description", content: "Call center KPIs, funnel, outcomes, human vs AI and AI insights in one view." },
    ],
  }),
  component: OverviewPage,
});
