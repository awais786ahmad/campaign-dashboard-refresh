import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ReportLibraryPage } from "@/components/reports/library-page";

const searchSchema = z.object({
  report: z.string().optional(),
  tab: z.enum(["library", "scheduled"]).optional(),
});

export const Route = createFileRoute("/_dashboard/reports/library")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Report library — Quality Dial" },
      { name: "description", content: "Save, export and schedule call, agent, campaign, QA and executive reports." },
      { property: "og:title", content: "Report library — Quality Dial" },
      { property: "og:description", content: "Save, export and schedule call, agent, campaign, QA and executive reports." },
    ],
  }),
  component: ReportLibraryPage,
});
