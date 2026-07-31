# GETAS Real Estate — cPanel Deployment

## Setup

1. Upload and extract this zip into your cPanel Node.js app directory.
2. In cPanel Node.js selector, set:
   - **Node.js version**: 20.x or higher
   - **Application root**: the folder where you extracted (e.g. `getas`)
   - **Application startup file**: `dist/index.mjs`
3. Set environment variables in cPanel (or create a `.env` file):
   - `NEON_DATABASE_URL` — your Neon PostgreSQL connection string
   - `SESSION_SECRET` — a long random secret (e.g. `openssl rand -hex 32`)
   - `NODE_ENV=production`
4. Run `npm install --omit=dev` in the app directory, or use cPanel's NPM install button.
5. Start / restart the app.

## Database schema

Run this once to push the schema to your Neon database:
```
npx drizzle-kit push
```
Or use the Replit environment to run `cd lib/db && pnpm run push`.

## Uploads

Property images are stored in the `uploads/` folder relative to the app root.
Make sure this directory is writable by the Node.js process.
