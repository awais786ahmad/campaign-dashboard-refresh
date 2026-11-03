import { createFileRoute } from "@tanstack/react-router";

import { AiAgentsSettings } from "@/components/organization/ai-agents-settings";

export const Route = createFileRoute("/_dashboard/organization/ai-agents")({
  head: () => ({
    meta: [
      { title: "AI agents — Quality Dial" },
      { name: "description", content: "Configure AI voice agents, tools and guardrails." },
      { property: "og:title", content: "AI agents — Quality Dial" },
      { property: "og:description", content: "Configure AI voice agents, tools and guardrails." },
    ],
  }),
  component: Page,
});

function Page() {
  return <AiAgentsSettings />;
}
