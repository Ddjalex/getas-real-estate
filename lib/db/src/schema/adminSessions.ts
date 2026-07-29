import { pgTable, varchar, json, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Session store table for connect-pg-simple (express-session).
 * Must match the tableName configured in artifacts/api-server/src/lib/session.ts.
 */
export const adminSessionsTable = pgTable(
  "admin_sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire", { precision: 6 }).notNull(),
  },
  (t) => [index("IDX_admin_sessions_expire").on(t.expire)],
);
