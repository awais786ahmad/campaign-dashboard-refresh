import { createFileRoute } from "@tanstack/react-router";

import { TasksPage } from "@/components/crm/tasks-page";

export const Route = createFileRoute("/_dashboard/crm/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Quality Dial" },
      { name: "description", content: "Follow-ups, callbacks and to-dos assigned across your team." },
      { property: "og:title", content: "Tasks — Quality Dial" },
      { property: "og:description", content: "Follow-ups, callbacks and to-dos assigned across your team." },
    ],
  }),
  component: Page,
});

function Page() {
  return <TasksPage />;
}
