# GIFT Real Estate

A real estate website for an Addis Ababa–based agency (est. 1990), with pages for browsing properties, services, blog posts, and contact.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/gift-real-estate run dev` — run the frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `cd artifacts/api-server && /home/runner/workspace/scripts/node_modules/.bin/tsx --tsconfig tsconfig.json src/scripts/seed.ts` — seed DB with sample data + create default admin
- Required env: `DATABASE_URL`, `SESSION_SECRET` (both are Replit-managed/secrets)

## Admin Portal

- URL: `/admin` (not linked anywhere on the public site)
- Default credentials: `admin` / `gift2024!` — **change immediately after first login**
- All admin API endpoints require a valid server-side session
- Rate-limited login (10 attempts per 15 min), 1-hour inactivity timeout, noindex on all admin pages

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontend: React 19, Vite 7, Tailwind CSS v4, GSAP + Lenis animations
- API: Express 5 + express-session (bcrypt auth)
- DB: PostgreSQL (Replit built-in) + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec → `lib/api-client-react` + `lib/api-zod`)
- Build: esbuild (CJS bundle)
- SEO: react-helmet-async, JSON-LD structured data, dynamic sitemap.xml, robots.txt

## Where things live

- DB schema: `lib/db/src/schema/` (listings, blogPosts, agents, inquiries, adminUsers)
- API contract: `lib/api-spec/openapi.yaml` — source of truth, run codegen after changes
- Generated API hooks: `lib/api-client-react/src/generated/`
- Frontend API client: `artifacts/gift-real-estate/src/lib/api.ts`
- SEO component + JSON-LD helpers: `artifacts/gift-real-estate/src/components/SEO.tsx`
- Admin panel pages: `artifacts/gift-real-estate/src/pages/admin/`
- Seed script: `artifacts/api-server/src/scripts/seed.ts`
- Sitemap: live at `/api/sitemap.xml` — auto-updates from DB content

## Architecture decisions

- **Price stored as `numeric` string**: Drizzle returns Postgres `numeric` as a string; all display code uses `parseFloat(listing.price)`.
- **Admin sessions in Postgres**: `connect-pg-simple` stores sessions in `admin_sessions` table (auto-created) — no Redis needed.
- **SEO is client-side**: `react-helmet-async` injects meta/JSON-LD on the client; for bot-crawlable SSR, a pre-rendering step would be a future improvement.
- **No public sign-up**: Admin accounts created via seed script or direct DB insert only.
- **Static data files kept but unused**: `src/data/` files still exist as reference; all pages now fetch from the API.

## Product

GIFT Real Estate is a full-stack website for a premium Addis Ababa agency (est. 1990). Public visitors browse properties, read blog posts, view agents, and submit inquiries. Staff manage all content and view submissions via a secure `/admin` panel not linked anywhere on the public site.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
