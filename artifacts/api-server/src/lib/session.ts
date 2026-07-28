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
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000, // 1 hour inactivity timeout
    sameSite: "strict",
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
