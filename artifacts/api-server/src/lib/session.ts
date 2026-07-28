import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";

const PgSession = connectPgSimple(session);

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionMiddleware = session({
  store: new PgSession({
    pool,
    tableName: "admin_sessions",
    // Table is pre-created via schema push; do NOT set createTableIfMissing
    // because connect-pg-simple can't find its bundled table.sql after esbuild
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000, // 1 hour inactivity timeout
    sameSite: "lax", // "strict" blocks cookies through Replit's proxy redirect
  },
  rolling: true, // reset expiry on each request (inactivity timeout)
});

// Extend the Session type with our admin field
declare module "express-session" {
  interface SessionData {
    adminId?: number;
    adminUsername?: string;
  }
}
