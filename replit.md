# GETAS Real Estate

A full-stack real estate website for GETAS (Get-As International Plc.) — Addis Ababa's premier real estate agency.

## Stack

- **Frontend** (`artifacts/gift-real-estate`): React 19 + Vite + Tailwind CSS v4 + GSAP animations + Leaflet maps
- **Backend** (`artifacts/api-server`): Express 5 + TypeScript + Drizzle ORM + PostgreSQL (Neon)
- **Shared libs** (`lib/`): `@workspace/db`, `@workspace/api-zod`, `@workspace/api-spec`, `@workspace/api-client-react`

## How to run

Both services start automatically via Replit workflows:

| Workflow | Command |
|---|---|
| `artifacts/gift-real-estate: web` | `pnpm --filter @workspace/gift-real-estate run dev` |
| `artifacts/api-server: API Server` | `pnpm --filter @workspace/api-server run dev` |

## Environment variables

| Key | Purpose |
|---|---|
| `NEON_DATABASE_URL` | Neon PostgreSQL connection string |
| `SESSION_SECRET` | Express session secret |

## Database

Uses Neon (serverless PostgreSQL). Schema is managed by Drizzle ORM.

To push schema changes:
```bash
pnpm --filter @workspace/db run push
```

## User preferences
