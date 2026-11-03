import { createFileRoute } from "@tanstack/react-router";

import { RolesSettings } from "@/components/organization/roles-settings";

export const Route = createFileRoute("/_dashboard/organization/roles")({
  head: () => ({
    meta: [
      { title: "Roles & permissions — Quality Dial" },
      { name: "description", content: "Define what each role can see and change." },
      { property: "og:title", content: "Roles & permissions — Quality Dial" },
      { property: "og:description", content: "Define what each role can see and change." },
    ],
  }),
  component: Page,
});

function Page() {
  return <RolesSettings />;
}
