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
| `NEON_DATABASE_URL` | Neon PostgreSQL connection string (set as a Replit Secret) |
| `SESSION_SECRET` | Express session secret (set as a Replit Secret) |

## Database

Uses Neon (serverless PostgreSQL). Schema is managed by Drizzle ORM.

To push schema changes:
```bash
pnpm --filter @workspace/db run push
```

To seed the database with sample data:
```bash
pnpm --filter @workspace/api-server run seed
```

## API routes

The Express server mounts all routes under `/api`. Key public endpoints:

| Route | Description |
|---|---|
| `GET /api/listings` | Property listings |
| `GET /api/blog` | Blog posts |
| `GET /api/agents` | Agent profiles |
| `GET /api/services` | Services |
| `GET /api/hero-slides` | Homepage hero slides |
| `POST /api/inquiries` | Submit a property enquiry |

Admin routes live under `/api/admin/*` and require session authentication.

## User preferences
