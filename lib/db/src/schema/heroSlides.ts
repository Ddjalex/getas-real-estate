import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const heroSlidesTable = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export type HeroSlide = typeof heroSlidesTable.$inferSelect;
export type InsertHeroSlide = typeof heroSlidesTable.$inferInsert;
