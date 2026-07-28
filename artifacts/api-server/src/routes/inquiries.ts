import { Router } from "express";
import { db, inquiriesTable, insertInquirySchema } from "@workspace/db";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const parsed = insertInquirySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid inquiry data", details: parsed.error.issues });
      return;
    }

    const [row] = await db.insert(inquiriesTable).values(parsed.data).returning();
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: "Failed to save inquiry" });
  }
});

export default router;
