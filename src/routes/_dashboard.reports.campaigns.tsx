import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CampaignsAnalyticsPage } from "@/components/reports/campaigns-page";

const searchSchema = z.object({
  campaign: z.string().optional(),
  compare: z.array(z.string()).optional(),
});

export const Route = createFileRoute("/_dashboard/reports/campaigns")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Campaign analytics — Quality Dial" },
      { name: "description", content: "Compare campaigns by calls, connect rate, conversion, QA and sentiment." },
      { property: "og:title", content: "Campaign analytics — Quality Dial" },
      { property: "og:description", content: "Compare campaigns by calls, connect rate, conversion, QA and sentiment." },
    ],
  }),
  component: CampaignsAnalyticsPage,
});
