import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { PerformancePage } from "@/components/reports/performance-page";

const searchSchema = z.object({
  tab: z.enum(["teams", "human", "ai"]).optional(),
  agent: z.string().optional(),
  team: z.string().optional(),
});

export const Route = createFileRoute("/_dashboard/reports/performance")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Performance analytics — Quality Dial" },
      { name: "description", content: "Team, human agent and AI agent performance with coaching insights." },
      { property: "og:title", content: "Performance analytics — Quality Dial" },
      { property: "og:description", content: "Team, human agent and AI agent performance with coaching insights." },
    ],
  }),
  component: PerformancePage,
});
