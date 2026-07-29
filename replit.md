# GIFT Real Estate

A full-stack real estate website for GIFT Real Estate (Addis Ababa). Built with a React/Vite frontend and an Express API backend in a pnpm monorepo.

## Stack

- **Frontend** (`artifacts/gift-real-estate`): React 19, Vite, Tailwind CSS v4, GSAP animations, Framer Motion, Lenis smooth scroll, Leaflet maps, shadcn/ui components
- **Backend** (`artifacts/api-server`): Express 5, Drizzle ORM, PostgreSQL (Neon), Pino logging, express-session
- **DB schema** (`lib/db`): Drizzle schema + migrations; tables for listings, blog posts, hero slides, services, inquiries, agents, site settings, admin users/sessions
- **API client** (`lib/api-client-react`): Auto-generated React Query hooks from OpenAPI spec via Orval

## Running locally

The three services start automatically via Replit workflows:

| Workflow | Command |
|---|---|
| `artifacts/gift-real-estate: web` | `pnpm --filter @workspace/gift-real-estate run dev` |
| `artifacts/api-server: API Server` | `pnpm --filter @workspace/api-server run dev` |

## Database

Connects to a **Neon** PostgreSQL database via `NEON_DATABASE_URL` secret.  
To push schema changes: `pnpm --filter @workspace/db run push`

## User preferences

- Use Neon for the database (connection string in `NEON_DATABASE_URL` secret)
