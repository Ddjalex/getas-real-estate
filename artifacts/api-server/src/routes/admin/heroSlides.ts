import { Router } from "express";
import { db, heroSlidesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../../middleware/requireAdmin";

const router = Router();

// GET /admin/hero-slides — list all slides ordered by displayOrder
router.get("/", requireAdmin, async (_req, res) => {
  try {
    const slides = await db
      .select()
      .from(heroSlidesTable)
      .orderBy(asc(heroSlidesTable.displayOrder));
    res.json(slides);
  } catch {
    res.status(500).json({ error: "Failed to fetch hero slides" });
  }
});

// POST /admin/hero-slides — create a new slide
router.post("/", requireAdmin, async (req, res) => {
  const { imageUrl, caption } = req.body as { imageUrl: string; caption?: string };
  if (!imageUrl) {
    res.status(400).json({ error: "imageUrl is required" });
    return;
  }
  try {
    const existing = await db.select().from(heroSlidesTable).orderBy(asc(heroSlidesTable.displayOrder));
    const maxOrder = existing.length > 0 ? Math.max(...existing.map((s) => s.displayOrder)) : -1;
    const [slide] = await db
      .insert(heroSlidesTable)
      .values({ imageUrl, caption: caption ?? "", displayOrder: maxOrder + 1, active: true })
      .returning();
    res.status(201).json(slide);
  } catch {
    res.status(500).json({ error: "Failed to create hero slide" });
  }
});

// PUT /admin/hero-slides/:id — update caption, active, or order
router.put("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { caption, active, displayOrder } = req.body as {
    caption?: string;
    active?: boolean;
    displayOrder?: number;
  };
  try {
    const updates: Partial<typeof heroSlidesTable.$inferInsert> = {};
    if (caption !== undefined) updates.caption = caption;
    if (active !== undefined) updates.active = active;
    if (displayOrder !== undefined) updates.displayOrder = displayOrder;

    const [slide] = await db
      .update(heroSlidesTable)
      .set(updates)
      .where(eq(heroSlidesTable.id, id))
      .returning();
    if (!slide) { res.status(404).json({ error: "Slide not found" }); return; }
    res.json(slide);
  } catch {
    res.status(500).json({ error: "Failed to update hero slide" });
  }
});

// DELETE /admin/hero-slides/:id
router.delete("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await db.delete(heroSlidesTable).where(eq(heroSlidesTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete hero slide" });
  }
});

// PUT /admin/hero-slides/reorder — bulk reorder: body = [{ id, displayOrder }]
router.put("/reorder/bulk", requireAdmin, async (req, res) => {
  const items = req.body as { id: number; displayOrder: number }[];
  if (!Array.isArray(items)) {
    res.status(400).json({ error: "Expected array of { id, displayOrder }" });
    return;
  }
  try {
    for (const item of items) {
      await db
        .update(heroSlidesTable)
        .set({ displayOrder: item.displayOrder })
        .where(eq(heroSlidesTable.id, item.id));
    }
    const slides = await db.select().from(heroSlidesTable).orderBy(asc(heroSlidesTable.displayOrder));
    res.json(slides);
  } catch {
    res.status(500).json({ error: "Failed to reorder slides" });
  }
});

export default router;
