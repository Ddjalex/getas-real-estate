import { pgTable, text, integer, boolean, timestamp, numeric, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const listingsTable = pgTable("listings", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  type: text("type").notNull(), // "sale" | "rent"
  price: numeric("price", { precision: 14, scale: 2 }).notNull(),
  priceUnit: text("price_unit").notNull(), // "ETB/month" | "USD"
  location: text("location").notNull(),
  neighborhood: text("neighborhood").notNull(),
  bedrooms: integer("bedrooms").notNull().default(0),
  bathrooms: integer("bathrooms").notNull().default(0),
  sizeSqm: integer("size_sqm").notNull(),
  description: text("description").notNull(),
  images: text("images").array().notNull().default([]),
  status: text("status").notNull(), // "For Sale" | "For Rent" | "New" | "Featured"
  featured: boolean("featured").notNull().default(false),
  dateAdded: timestamp("date_added", { mode: "string" }).notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  mapsUrl: text("maps_url"),
  propertyType: text("property_type").notNull().default(""),
  features: text("features").array().notNull().default([]),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const insertListingSchema = createInsertSchema(listingsTable);
export const selectListingSchema = createSelectSchema(listingsTable);

export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;
