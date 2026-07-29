import { Router } from "express";
import { db, servicesTable, insertServiceSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../middleware/requireAdmin";

const router = Router();
router.use(requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(servicesTable).orderBy(servicesTable.order);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

router.post("/", async (req, res) => {
  const parsed = insertServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  try {
    const [row] = await db.insert(servicesTable).values(parsed.data).returning();
    res.status(201).json(row);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: "Failed to create service", detail: msg });
  }
});

router.put("/:id", async (req, res) => {
  const parsed = insertServiceSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  try {
    const [row] = await db
      .update(servicesTable)
      .set(parsed.data)
      .where(eq(servicesTable.id, req.params.id))
      .returning();
    if (!row) { res.status(404).json({ error: "Service not found" }); return; }
    res.json(row);
  } catch {
    res.status(500).json({ error: "Failed to update service" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [row] = await db
      .delete(servicesTable)
      .where(eq(servicesTable.id, req.params.id))
      .returning({ id: servicesTable.id });
    if (!row) { res.status(404).json({ error: "Service not found" }); return; }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete service" });
  }
});

export default router;
