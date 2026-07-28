import { Router } from "express";
import { db, agentsTable } from "@workspace/db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(agentsTable);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

export default router;
