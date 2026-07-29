# GIFT Real Estate

A full-stack real estate website for GIFT Real Estate (Addis Ababa, Ethiopia). Built with a React/Vite frontend and an Express API backend backed by PostgreSQL.

## Architecture

- **`artifacts/gift-real-estate/`** — React + Vite + Tailwind frontend (previews at `/`)
- **`artifacts/api-server/`** — Express 5 API server (previews at `/api`)
- **`lib/db/`** — Drizzle ORM schema + PostgreSQL client (`@workspace/db`)
- **`lib/api-zod/`** — Shared Zod validation schemas
- **`lib/api-client-react/`** — React Query hooks for the API

## Running the project

Both workflows start automatically:
- **`artifacts/gift-real-estate: web`** — `pnpm --filter @workspace/gift-real-estate run dev`
- **`artifacts/api-server: API Server`** — `pnpm --filter @workspace/api-server run dev`

## Database

Uses a Neon PostgreSQL database. The connection string is stored as the `NEON_DATABASE_URL` secret. The db client checks for `NEON_DATABASE_URL` first, then falls back to `DATABASE_URL`.

Push schema changes:
```
cd lib/db && pnpm run push
```

Seed initial data (listings, blog posts, agents, admin user):
```
pnpm --filter @workspace/api-server run seed
```

## Required secrets

- `SESSION_SECRET` — Express session secret (already set)

## Optional secrets (for image uploads)

- Google Cloud Storage credentials — needed for the file storage routes (`/api/storage`). Without them, the admin image upload feature will not work, but the rest of the site functions normally.

## Admin panel

Visit `/admin` on the frontend. Default credentials are set during the seed step.

## Setup verification

Verified on import:
- `pnpm install` — all 572 packages installed cleanly
- DB schema pushed via `cd lib/db && pnpm run push`
- Seed data loaded: 7 listings, 4 blog posts, 5 agents, admin user (`admin` / `gift2024!` — change after first login)
- Both workflows confirmed running: frontend at `/`, API at `/api`

## User preferences
