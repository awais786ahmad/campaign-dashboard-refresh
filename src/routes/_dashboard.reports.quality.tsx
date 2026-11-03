import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { QualityPage } from "@/components/reports/quality-page";

const searchSchema = z.object({
  tab: z.enum(["overview", "reviews", "ai", "intelligence", "sentiment"]).optional(),
  type: z.string().optional(),
});

export const Route = createFileRoute("/_dashboard/reports/quality")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Quality & AI analytics — Quality Dial" },
      { name: "description", content: "QA scores, manual vs AI review, AI agent performance, conversation intelligence and sentiment." },
      { property: "og:title", content: "Quality & AI analytics — Quality Dial" },
      { property: "og:description", content: "QA scores, manual vs AI review, AI agent performance, conversation intelligence and sentiment." },
    ],
  }),
  component: QualityPage,
});
