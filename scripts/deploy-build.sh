#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# GIFT Real Estate — cPanel deployment builder
# Run from the workspace root:  bash scripts/deploy-build.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "🏗️  Building GIFT Real Estate for cPanel deployment..."

# ── 1. Clean old output ───────────────────────────────────────────────────────
# NOTE: we only clean deploy-package/ and the zip — never uploads/ on the live
# server. The uploads/ folder is a sibling of dist/ on cPanel and must persist
# across every redeploy.  See "cPanel folder structure" notes at bottom of script.
rm -rf deploy-package gift-real-estate-deploy.zip

# ── 2. Build React frontend (base path = / for cPanel root deployment) ────────
echo ""
echo "→ Building frontend…"
BASE_PATH=/ pnpm --filter @workspace/gift-real-estate run build

# ── 3. Build Express API server ───────────────────────────────────────────────
echo ""
echo "→ Building API server…"
pnpm --filter @workspace/api-server run build

# ── 4. Assemble package ───────────────────────────────────────────────────────
echo ""
echo "→ Assembling deployment package…"
mkdir -p deploy-package/dist/public

# API server compiled files (bundled, no node_modules needed for most deps)
cp -r artifacts/api-server/dist/* deploy-package/dist/

# React frontend static files → served by Express as /public
cp -r artifacts/gift-real-estate/dist/public/. deploy-package/dist/public/

# ── 5. package.json for cPanel ────────────────────────────────────────────────
# cPanel runs `npm install` from Application Root.
# All dependencies are bundled into dist/index.mjs — no npm install needed.
cat > deploy-package/package.json << 'PKGJSON'
{
  "name": "gift-real-estate",
  "version": "1.0.0",
  "type": "module",
  "description": "GIFT Real Estate — Express API + React frontend",
  "main": "dist/index.mjs",
  "scripts": {
    "start": "node dist/index.mjs"
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "dependencies": {}
}
PKGJSON

# ── 6. .env.example ──────────────────────────────────────────────────────────
cat > deploy-package/.env.example << 'ENVFILE'
# Rename this file to .env and fill in your values.
# In cPanel "Setup Node.js App" you set these as Environment Variables — no
# .env file is needed if you use that interface.

NODE_ENV=production

# PORT is assigned automatically by cPanel; do NOT set it manually.

# Your Neon PostgreSQL connection string (required)
NEON_DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require

# A long random string used to sign session cookies (required)
SESSION_SECRET=replace-with-32-plus-random-characters
ENVFILE

# ── 7. Zip ────────────────────────────────────────────────────────────────────
echo ""
echo "→ Creating gift-real-estate-deploy.zip…"
cd deploy-package
zip -r ../gift-real-estate-deploy.zip . --exclude "*.map"
cd "$ROOT"

# ── 8. Summary ────────────────────────────────────────────────────────────────
echo ""
echo "✅  Done!  →  gift-real-estate-deploy.zip"
echo ""
echo "File structure inside the zip:"
find deploy-package -not -name "*.map" -type f \
  | sed "s|deploy-package/||" \
  | sort
echo ""
echo "Zip size: $(du -sh gift-real-estate-deploy.zip | cut -f1)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  cPanel folder structure — IMPORTANT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  FIRST DEPLOY — create this structure manually before starting:"
echo ""
echo "    <app_root>/          ← your cPanel Node.js Application Root"
echo "    ├── dist/            ← extracted from this zip"
echo "    │   ├── index.mjs"
echo "    │   └── public/"
echo "    ├── uploads/         ← create this empty folder manually!"
echo "    │                       chmod 755 uploads/"
echo "    ├── package.json     ← extracted from this zip"
echo "    └── .env             ← set NEON_DATABASE_URL and SESSION_SECRET"
echo ""
echo "  EVERY FUTURE REDEPLOY — only replace dist/ and package.json."
echo "  NEVER delete or overwrite uploads/ — that folder holds all"
echo "  property photos and is NOT included in this zip."
echo ""
echo "  Quick redeploy checklist:"
echo "    1. Unzip gift-real-estate-deploy.zip into a temp folder"
echo "    2. Upload/replace only: dist/  and  package.json"
echo "    3. Leave uploads/ and .env completely untouched"
echo "    4. Restart the Node.js application in cPanel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
