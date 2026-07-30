import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { existsSync } from "fs";
import router from "./routes";
import { logger } from "./lib/logger";
import { sessionMiddleware } from "./lib/session";
import {
  loadHtmlTemplate,
  buildHomeHtml,
  buildListingHtml,
  buildBlogPostHtml,
} from "./lib/seo";
import { ensureUploadsDir, uploadsDir } from "./lib/localDiskStorage";

// Ensure uploads/ directory exists at startup (creates it on first run)
ensureUploadsDir();

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.set("trust proxy", 1);
app.use(cors({ credentials: true, origin: true }));
// 15 MB limit to accommodate base64-encoded images (10 MB raw ≈ 13.3 MB base64)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(sessionMiddleware);

app.use("/api", router);

// ── Serve uploaded images (dev + production) ──────────────────────────────
// uploads/ lives at the app root (sibling of dist/), so it persists across
// rebuilds and redeploys.
// /uploads/<filename>      — cPanel production (frontend + API on same origin)
// /api/uploads/<filename>  — Replit dev proxy (API server mounted at /api prefix)
app.use("/uploads", express.static(uploadsDir));
app.use("/api/uploads", express.static(uploadsDir));

// ── Production: serve the built React app ────────────────────────────────────
// In dev (Replit) the public dir doesn't exist, so this block is a no-op.
// In production (cPanel) the frontend build is copied into dist/public/ by the
// deploy-build.sh script, and Express serves it here.
const publicDir = path.join(__dirname, "public");
if (existsSync(path.join(publicDir, "index.html"))) {
  loadHtmlTemplate(publicDir);

  app.use(express.static(publicDir));

  // Derive the canonical base URL from the incoming request
  function baseUrl(req: express.Request): string {
    return `${req.protocol}://${req.get("host")}`;
  }

  // ── SSR meta-tag injection for crawlers / link-preview bots ──────────────
  // These routes run BEFORE the generic SPA fallback so social platforms and
  // search engines see per-page title, description, OG, and JSON-LD tags in
  // the raw HTML — without needing to execute JavaScript.

  app.get("/", async (req, res, next) => {
    try {
      const html = await buildHomeHtml(baseUrl(req));
      if (!html) return next();
      res.type("html").send(html);
    } catch (err) {
      next(err);
    }
  });

  app.get("/properties/:slug", async (req, res, next) => {
    try {
      const html = await buildListingHtml(req.params.slug, baseUrl(req));
      if (!html) return next(); // 404 slug → fall through to SPA which shows its own 404
      res.type("html").send(html);
    } catch (err) {
      next(err);
    }
  });

  app.get("/blog/:slug", async (req, res, next) => {
    try {
      const html = await buildBlogPostHtml(req.params.slug, baseUrl(req));
      if (!html) return next();
      res.type("html").send(html);
    } catch (err) {
      next(err);
    }
  });

  // SPA fallback — all other routes return the unmodified index.html
  // Express 5 requires a named wildcard parameter (bare "*" is invalid in path-to-regexp v8)
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

export default app;
