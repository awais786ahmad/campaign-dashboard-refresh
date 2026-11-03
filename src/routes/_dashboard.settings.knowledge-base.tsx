import { createFileRoute } from "@tanstack/react-router";

import { KnowledgeSettings } from "@/components/settings/knowledge-settings";

export const Route = createFileRoute("/_dashboard/settings/knowledge-base")({
  head: () => ({
    meta: [
      { title: "Knowledge base — Quality Dial" },
      { name: "description", content: "Documents and FAQs your AI agents can ground answers in." },
      { property: "og:title", content: "Knowledge base — Quality Dial" },
      { property: "og:description", content: "Documents and FAQs your AI agents can ground answers in." },
    ],
  }),
  component: Page,
});

function Page() {
  return <KnowledgeSettings />;
}
