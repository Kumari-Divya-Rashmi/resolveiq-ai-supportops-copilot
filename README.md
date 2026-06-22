# ResolveIQ AI SupportOps Copilot

ResolveIQ is a full-stack MERN support automation platform. It answers user questions from a company knowledge base, creates smart tickets when confidence is low, detects urgency and sentiment, routes work to the right team, and gives agents/admins an operational dashboard.

## What Is Implemented

This project is being delivered in 10 phases:

1. Foundation
2. Backend core
3. Auth and roles
4. Data models and seed data
5. AI and RAG
6. Ticket workflow
7. User frontend
8. Agent frontend
9. Admin frontend
10. Polish and verification

## Local Requirements

- Node.js 20+
- npm 10+
- MongoDB Atlas connection string for persistent data, or built-in local demo database
- OpenAI API key for live AI calls, with deterministic local fallbacks when it is absent

This machine already has Node/npm available. Local MongoDB and Docker were not detected, so the backend now starts with an in-memory demo database when `MONGODB_URI` is blank. Use MongoDB Atlas through `MONGODB_URI` when you want persistent data. If `OPENAI_API_KEY` is missing or invalid, ResolveIQ keeps running with local demo AI fallbacks.

## Quick Start

```powershell
npm install
Copy-Item .env.example server/.env
# Optional: edit server/.env and set MONGODB_URI, JWT_SECRET, and OPENAI_API_KEY
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Environment Variables

Set these in `server/.env` for persistent or production-style runs:

| Name | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas database connection string. Leave blank for local memory demo mode |
| `USE_MEMORY_DB` | Force local in-memory MongoDB when `true` |
| `AUTO_SEED` | Seed demo users, teams, KB articles, and tickets at startup when `true` |
| `JWT_SECRET` | Long random string used to sign auth tokens. A local demo fallback is used outside production |
| `OPENAI_API_KEY` | OpenAI key used for live AI answers, embeddings, summaries, and suggested replies |
| `OPENAI_MODEL` | Chat/reasoning model, defaults to `gpt-5.4-mini` |
| `OPENAI_EMBEDDING_MODEL` | Embedding model, defaults to `text-embedding-3-small` |

## Main Workflows

- User asks the AI support chatbot a question.
- ResolveIQ detects whether the message is a support question, urgent request, feedback, or direct ticket request.
- ResolveIQ searches knowledge base articles and generates a source-grounded answer.
- If confidence is low, the user can create a support ticket.
- Users can create a ticket directly with up to three screenshot/file attachments.
- AI classifies the ticket, scores urgency/sentiment, creates a summary, suggests a reply, and routes it to a team.
- Agents review assigned tickets, use copilot suggestions, reply, and resolve cases.
- Admins monitor analytics, update ticket assignment, and maintain the knowledge base.

## Scripts

```powershell
npm run dev       # run client and server together
npm run seed      # seed Atlas or the configured database manually
npm run lint      # lint client and server
npm test          # run unit/API tests that do not require Atlas
npm run build     # build the frontend
```

## Demo Accounts

The seed command creates:

- Admin: `admin@resolveiq.test` / `ResolveIQ#123`
- Agent: `agent@resolveiq.test` / `ResolveIQ#123`
- User: `user@resolveiq.test` / `ResolveIQ#123`

## Security Notes

- JWT authentication
- Role-based access for users, agents, and admins
- Password hashing with bcrypt
- Zod input validation
- Helmet, CORS, and rate limiting
- Environment-only secrets
- Basic prompt-injection protection
- Knowledge-base grounded AI answers with a confidence threshold

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/chat/ask`
- `POST /api/chat/create-ticket`
- `GET /api/tickets?page=1&limit=25`
- `GET /api/tickets/:id`
- `POST /api/tickets`
- `PATCH /api/tickets/:id/status`
- `PATCH /api/tickets/:id/assign`
- `POST /api/tickets/:id/messages`
- `POST /api/tickets/:id/feedback`
- `POST /api/kb/upload`
- `GET /api/kb`
- `DELETE /api/kb/:id`
- `GET /api/analytics/overview`
- `GET /api/analytics/category-wise`
- `GET /api/analytics/agent-performance`

## Deployment Notes

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas
- File upload: local MVP storage, Cloudinary-ready future extension
- AI: OpenAI API

Public GitHub and demo video links should be accessible if submitted for a program or review.

## Scalability Plan

- Keep AI calls behind a separate service layer.
- Move heavy embedding and summary work into a queue for larger deployments.
- Add Redis caching for repeated questions and hot knowledge-base answers.
- Move from Mongo vector arrays to a dedicated vector database when KB volume grows.
- Use ticket pagination and indexes on status, category, and priority.
- Keep role-based dashboards separate so user, agent, and admin workflows can scale independently.
- The backend structure is microservice-ready because routes, controllers, services, and models are already separated.
