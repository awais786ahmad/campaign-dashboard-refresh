import { createFileRoute } from "@tanstack/react-router";

import { HistoryPage } from "@/components/calling/history-page";

export const Route = createFileRoute("/_dashboard/calling/history")({
  head: () => ({
    meta: [
      { title: "Call history — Quality Dial" },
      { name: "description", content: "Recordings, transcripts and outcomes for every call." },
      { property: "og:title", content: "Call history — Quality Dial" },
      { property: "og:description", content: "Recordings, transcripts and outcomes for every call." },
    ],
  }),
  component: HistoryPage,
});
