# GETAS Real Estate

A full-stack real estate website for **GETAS Real Estate** (a division of Get-As International Plc., Addis Ababa), featuring property listings, blog, agent profiles, and an admin panel.

## Stack

- **Frontend**: React + Vite + Tailwind CSS v4 + GSAP animations (`artifacts/gift-real-estate`)
- **Backend**: Express.js API server with Drizzle ORM + PostgreSQL (`artifacts/api-server`)
- **Database**: Replit built-in PostgreSQL (schema managed via Drizzle)
- **Auth**: Session-based admin auth (express-session + connect-pg-simple)
- **Shared libs**: `lib/api-zod` (Zod schemas), `lib/api-spec` (OpenAPI), `lib/db` (Drizzle schema + client), `lib/api-client-react` (React Query hooks)

## How to run

Both workflows start automatically:
- **GETAS (web)**: `pnpm --filter @workspace/gift-real-estate run dev` → preview at `/`
- **API Server**: `pnpm --filter @workspace/api-server run dev` → preview at `/api`

## Database

Schema is in `lib/db/src/schema/`. To push schema changes to the dev database:
```
cd lib/db && pnpm run push
```

## Environment secrets required

- `SESSION_SECRET` — secret for express-session (already set)
- `DATABASE_URL` / `NEON_DATABASE_URL` — provided automatically by Replit's built-in PostgreSQL

## User preferences

<!-- Agent: add remembered user preferences here -->
