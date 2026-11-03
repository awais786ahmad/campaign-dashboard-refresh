import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CallsPage } from "@/components/reports/calls-page";

const searchSchema = z.object({
  q: z.string().optional(),
  outcome: z.string().optional(),
  sentiment: z.string().optional(),
  agent: z.string().optional(),
  campaign: z.string().optional(),
  team: z.string().optional(),
  kind: z.enum(["Human", "AI"]).optional(),
  direction: z.string().optional(),
  qa: z.string().optional(),
  critical: z.boolean().optional(),
  escalated: z.boolean().optional(),
  needsReview: z.boolean().optional(),
  slot: z.string().optional(),
  call: z.string().optional(),
  tab: z.string().optional(),
});

export type CallsSearch = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/_dashboard/reports/calls")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Call analytics — Quality Dial" },
      { name: "description", content: "Investigate every call: recording, transcript, AI summary, QA and notes." },
      { property: "og:title", content: "Call analytics — Quality Dial" },
      { property: "og:description", content: "Investigate every call: recording, transcript, AI summary, QA and notes." },
    ],
  }),
  component: CallsPage,
});
