import { createFileRoute } from "@tanstack/react-router";

import { TagsPage } from "@/components/crm/tags-page";

export const Route = createFileRoute("/_dashboard/crm/tags")({
  head: () => ({
    meta: [
      { title: "Tags — Quality Dial" },
      { name: "description", content: "Organise records with reusable, colour-coded tags." },
      { property: "og:title", content: "Tags — Quality Dial" },
      { property: "og:description", content: "Organise records with reusable, colour-coded tags." },
    ],
  }),
  component: Page,
});

function Page() {
  return <TagsPage />;
}
