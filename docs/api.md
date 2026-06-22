# ResolveIQ API

All API responses use this envelope:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "error": null
}
```

Protected endpoints require:

```http
Authorization: Bearer <jwt>
```

The backend runs under `/api`.

## Auth

- `POST /api/auth/register`: create account.
- `POST /api/auth/login`: return `{ user, token }`.
- `GET /api/auth/me`: return current authenticated user.

## Chat

- `POST /api/chat/ask`: body `{ message }`; returns detected intent, answer, confidence, sources, and `shouldCreateTicket`.
- `POST /api/chat/create-ticket`: body `{ message, title? }`; creates a smart routed ticket from chat.

## Tickets

- `GET /api/tickets?page=1&limit=25`: role-aware paginated ticket list.
- `GET /api/tickets/:id`: ticket detail with messages and assignments.
- `POST /api/tickets`: multipart or JSON ticket creation with optional `attachments`.
- `PATCH /api/tickets/:id/status`: update status.
- `PATCH /api/tickets/:id/assign`: admin-only assignment.
- `POST /api/tickets/:id/messages`: add customer or agent reply.
- `GET /api/tickets/:id/copilot`: agent/admin copilot summary, suggested reply, similar tickets.
- `POST /api/tickets/:id/feedback`: customer support rating.

## Knowledge Base

- `GET /api/kb`: agent/admin article list.
- `POST /api/kb/upload`: admin article upload with title, content/file, source type, and tags.
- `DELETE /api/kb/:id`: admin article deletion.

## Analytics

- `GET /api/analytics/overview`: KPI cards.
- `GET /api/analytics/category-wise`: category, priority, status, and sentiment groups.
- `GET /api/analytics/agent-performance`: agent workload and resolved counts.

## Teams

- `GET /api/teams`: agent/admin team list.
- `GET /api/teams/agents`: agent list for assignment UI.

## Frontend Pages

- `/`: landing page.
- `/demo`: sample company overview and seeded demo-account details.
- `/login` and `/register`: authentication.
- `/app/chat`: user AI support chatbot.
- `/app/new-ticket`: direct ticket creation with attachments.
- `/app/tickets`: role-aware ticket tracking and ticket management.
- `/app/agent`: agent/admin copilot desk with admin assignment controls.
- `/app/admin/analytics`: admin analytics dashboard.
- `/app/admin/kb`: knowledge-base upload and management.
