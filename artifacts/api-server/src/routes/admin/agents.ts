import { Router } from "express";
import { db, agentsTable, insertAgentSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../middleware/requireAdmin";

const router = Router();
router.use(requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(agentsTable);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

router.post("/", async (req, res) => {
  const parsed = insertAgentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  try {
    const [row] = await db.insert(agentsTable).values(parsed.data).returning();
    res.status(201).json(row);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: "Failed to create agent", detail: msg });
  }
});

router.put("/:id", async (req, res) => {
  const parsed = insertAgentSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  try {
    const [row] = await db
      .update(agentsTable)
      .set(parsed.data)
      .where(eq(agentsTable.id, req.params.id))
      .returning();
    if (!row) { res.status(404).json({ error: "Agent not found" }); return; }
    res.json(row);
  } catch {
    res.status(500).json({ error: "Failed to update agent" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [row] = await db
      .delete(agentsTable)
      .where(eq(agentsTable.id, req.params.id))
      .returning({ id: agentsTable.id });
    if (!row) { res.status(404).json({ error: "Agent not found" }); return; }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete agent" });
  }
});

export default router;
