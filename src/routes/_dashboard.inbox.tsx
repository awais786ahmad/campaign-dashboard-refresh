import { createFileRoute } from "@tanstack/react-router";

import { InboxPage } from "@/components/inbox/inbox-page";

export const Route = createFileRoute("/_dashboard/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — Quality Dial" },
      { name: "description", content: "Manage SMS, email and voicemail conversations from one screen." },
      { property: "og:title", content: "Inbox — Quality Dial" },
      {
        property: "og:description",
        content: "Manage SMS, email and voicemail conversations from one screen.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return <InboxPage />;
}
