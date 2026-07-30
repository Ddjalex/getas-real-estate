# GETAS Real Estate

A full-stack real estate website for **GETAS Real Estate** (Addis Ababa), built as a pnpm monorepo.

## Stack

- **Frontend** (`artifacts/gift-real-estate`): React 19 + Vite + Tailwind CSS v4 + GSAP animations + Framer Motion + Leaflet maps
- **Backend** (`artifacts/api-server`): Express 5 + Drizzle ORM + PostgreSQL (Neon)
- **Libraries** (`lib/`): `db` (Drizzle schema + client), `api-zod` (shared Zod schemas), `api-client-react` (TanStack Query hooks), `api-spec` (OpenAPI/Orval codegen)

## Running the project

Both services start automatically via Replit workflows:

| Workflow | Command |
|---|---|
| `artifacts/gift-real-estate: web` | `pnpm --filter @workspace/gift-real-estate run dev` |
| `artifacts/api-server: API Server` | `pnpm --filter @workspace/api-server run dev` |

The frontend is available at `/` and the API at `/api`.

## Environment / Secrets

| Key | Purpose |
|---|---|
| `NEON_DATABASE_URL` | Neon PostgreSQL connection string |
| `SESSION_SECRET` | Express session signing key |

## Database

Schema is managed with Drizzle Kit. To push schema changes:

```bash
pnpm --filter @workspace/db run push
```

## User preferences

- Use the existing project structure — do not migrate or restructure without asking.
