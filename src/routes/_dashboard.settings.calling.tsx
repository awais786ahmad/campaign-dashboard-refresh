import { createFileRoute } from "@tanstack/react-router";

import { CallingSettings } from "@/components/settings/calling-settings";

export const Route = createFileRoute("/_dashboard/settings/calling")({
  head: () => ({
    meta: [
      { title: "Calling settings — Quality Dial" },
      { name: "description", content: "Caller IDs, recording, voicemail drops and dialling rules." },
      { property: "og:title", content: "Calling settings — Quality Dial" },
      { property: "og:description", content: "Caller IDs, recording, voicemail drops and dialling rules." },
    ],
  }),
  component: Page,
});

function Page() {
  return <CallingSettings />;
}
