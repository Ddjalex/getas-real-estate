import { Router } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { requireAdmin } from "../../middleware/requireAdmin";

const router = Router();
router.use(requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(inquiriesTable)
      .orderBy(inquiriesTable.createdAt);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

export default router;
