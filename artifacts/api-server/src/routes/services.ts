import { Router } from "express";
import { db, servicesTable } from "@workspace/db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(servicesTable).orderBy(servicesTable.order);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

export default router;
