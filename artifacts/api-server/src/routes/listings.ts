import { Router } from "express";
import { db, listingsTable } from "@workspace/db";
import { eq, and, type SQL } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { type, featured, location } = req.query;

    const conditions: SQL[] = [];

    if (type === "sale" || type === "rent") {
      conditions.push(eq(listingsTable.type, type));
    }
    if (featured === "true") {
      conditions.push(eq(listingsTable.featured, true));
    }
    if (typeof location === "string" && location) {
      conditions.push(eq(listingsTable.location, location));
    }

    const rows =
      conditions.length > 0
        ? await db
            .select()
            .from(listingsTable)
            .where(and(...conditions))
            .orderBy(listingsTable.dateAdded)
        : await db.select().from(listingsTable).orderBy(listingsTable.dateAdded);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [row] = await db
      .select()
      .from(listingsTable)
      .where(eq(listingsTable.id, req.params.id));

    if (!row) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});

export default router;
