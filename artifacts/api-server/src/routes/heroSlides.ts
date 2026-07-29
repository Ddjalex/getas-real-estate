import { Router } from "express";
import { db, heroSlidesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

// GET /hero-slides — public: only active slides, ordered
router.get("/", async (_req, res) => {
  try {
    const slides = await db
      .select()
      .from(heroSlidesTable)
      .where(eq(heroSlidesTable.active, true))
      .orderBy(asc(heroSlidesTable.displayOrder));
    res.json(slides);
  } catch {
    res.status(500).json({ error: "Failed to fetch hero slides" });
  }
});

export default router;
