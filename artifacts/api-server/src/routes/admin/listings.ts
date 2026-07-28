import { Router } from "express";
import { db, listingsTable, insertListingSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../middleware/requireAdmin";

const router = Router();
router.use(requireAdmin);

// List all
router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(listingsTable).orderBy(listingsTable.createdAt);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// Create
router.post("/", async (req, res) => {
  const parsed = insertListingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  try {
    const [row] = await db
      .insert(listingsTable)
      .values({
        ...parsed.data,
        updatedAt: new Date().toISOString(),
      })
      .returning();
    res.status(201).json(row);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: "Failed to create listing", detail: msg });
  }
});

// Update
router.put("/:id", async (req, res) => {
  const parsed = insertListingSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  try {
    const [row] = await db
      .update(listingsTable)
      .set({ ...parsed.data, updatedAt: new Date().toISOString() })
      .where(eq(listingsTable.id, req.params.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.json(row);
  } catch {
    res.status(500).json({ error: "Failed to update listing" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const [row] = await db
      .delete(listingsTable)
      .where(eq(listingsTable.id, req.params.id))
      .returning({ id: listingsTable.id });
    if (!row) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

export default router;
