import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { existsSync } from "fs";
import router from "./routes";
import { logger } from "./lib/logger";
import { sessionMiddleware } from "./lib/session";

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

// ── Production: serve the built React app ────────────────────────────────────
// In dev (Replit) the public dir doesn't exist, so this block is a no-op.
// In production (cPanel) the frontend build is copied into dist/public/ by the
// deploy-build.sh script, and Express serves it here.
const publicDir = path.join(__dirname, "public");
if (existsSync(path.join(publicDir, "index.html"))) {
  app.use(express.static(publicDir));
  // SPA fallback — any non-API route returns index.html so React Router works
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

export default app;
