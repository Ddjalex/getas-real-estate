import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const servicesTable = pgTable("services", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull().default(""),
  order: integer("order").notNull().default(0),
});

export const insertServiceSchema = createInsertSchema(servicesTable);
export const selectServiceSchema = createSelectSchema(servicesTable);

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;
