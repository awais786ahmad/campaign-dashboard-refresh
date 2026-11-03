# Frontend Activity & Audit Log

## Goal
Implement the uploaded Activity/Audit Log specification as a polished, frontend-only experience. Use realistic in-memory sample data and preserve the existing Quality Dial design and interaction patterns. No database, authentication, permission enforcement, API, or persistence work is included.

## Build
- Add **Organization → Activity Log** to the existing sidebar and search navigation.
- Create a dedicated Activity & Audit Log page with:
  - Search across people, records, and change details.
  - Filters for date, user, action, module, team, and record type.
  - Active-filter summary and clear-all action.
  - Grouped activity table with actor, action, module, affected record, details, and timestamp.
  - Visual loading-free empty state when filters return no results.
  - Export control with frontend confirmation feedback.
- Add an activity-details drawer opened from each log row, showing:
  - Actor, source, time, module, action, team, and affected record.
  - Clear before/after field changes for updates.
  - Context metadata such as IP address, device, and event identifier where appropriate.
  - Safe treatment of sensitive values through masked mock content.
- Add reusable record activity timeline UI and use it in the key record drawers specified by the brief:
  - Lead
  - Campaign
  - Team
  - Member
  - Task
  - AI Agent
- Organize each supported drawer into clear **Overview / Activity / Notes** tabs where the record supports notes; otherwise use the relevant subset without inventing editing behavior.
- Keep all controls interactive using local component state only. Existing create, edit, delete, and call flows remain unchanged.

## Data and UX
- Add a typed frontend-only audit event catalogue with representative examples across CRM, Tasks, Campaigns, Calling, Teams, Members, Roles, AI Agents, imports, exports, login, and system automation.
- Represent human, AI-agent, and system actors distinctly.
- Use action-specific icons and semantic status treatments already available in the design system.
- Ensure tables remain horizontally usable on smaller screens and drawers/tabs remain legible at mobile widths.

## Technical details
- Add one TanStack route file for `/organization/activity-log` with route-specific title, description, Open Graph metadata, `og:type`, and `twitter:card`.
- Create focused reusable UI modules for the global log, activity drawer, and record timeline rather than duplicating markup.
- Use existing Button, Table, Select, Tabs, Badge, Drawer, and form components.
- Do not modify generated route files, add backend functions, enable Cloud, or store data in browser storage.
- Validate the new route, filters, row drawer, exports, and record-level tabs in the running preview; check desktop and narrow layouts and confirm existing modules still compile.
