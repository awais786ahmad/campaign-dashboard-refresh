import { createFileRoute } from "@tanstack/react-router";

import { ActivityLogPage } from "@/components/activity/activity-log-page";

export const Route = createFileRoute("/_dashboard/organization/activity-log")({
  head: () => ({
    meta: [
      { title: "Activity & Audit Log — Quality Dial" },
      { name: "description", content: "Review every change across your workspace: who did what, when, and what changed." },
      { property: "og:title", content: "Activity & Audit Log — Quality Dial" },
      { property: "og:description", content: "Review every change across your workspace: who did what, when, and what changed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ActivityLogPage,
});
