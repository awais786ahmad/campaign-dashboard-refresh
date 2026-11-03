import { createFileRoute } from "@tanstack/react-router";

import { AutomationsSettings } from "@/components/settings/automations-settings";

export const Route = createFileRoute("/_dashboard/settings/automations")({
  head: () => ({
    meta: [
      { title: "Automations — Quality Dial" },
      { name: "description", content: "Trigger-based workflows across leads, calls and campaigns." },
      { property: "og:title", content: "Automations — Quality Dial" },
      { property: "og:description", content: "Trigger-based workflows across leads, calls and campaigns." },
    ],
  }),
  component: Page,
});

function Page() {
  return <AutomationsSettings />;
}
