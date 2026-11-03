import { createFileRoute } from "@tanstack/react-router";

import { LivePage } from "@/components/calling/live-page";

export const Route = createFileRoute("/_dashboard/calling/live")({
  head: () => ({
    meta: [
      { title: "Live calls — Quality Dial" },
      { name: "description", content: "Monitor active calls, whisper and barge in real time." },
      { property: "og:title", content: "Live calls — Quality Dial" },
      { property: "og:description", content: "Monitor active calls, whisper and barge in real time." },
    ],
  }),
  component: LivePage,
});
