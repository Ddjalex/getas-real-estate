import { Router } from "express";
import { db, blogPostsTable, insertBlogPostSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../middleware/requireAdmin";

const router = Router();
router.use(requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(blogPostsTable).orderBy(blogPostsTable.publishedAt);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.post("/", async (req, res) => {
  const parsed = insertBlogPostSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  try {
    const [row] = await db
      .insert(blogPostsTable)
      .values({ ...parsed.data, updatedAt: new Date().toISOString() })
      .returning();
    res.status(201).json(row);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: "Failed to create post", detail: msg });
  }
});

router.put("/:id", async (req, res) => {
  const parsed = insertBlogPostSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  try {
    const [row] = await db
      .update(blogPostsTable)
      .set({ ...parsed.data, updatedAt: new Date().toISOString() })
      .where(eq(blogPostsTable.id, req.params.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(row);
  } catch {
    res.status(500).json({ error: "Failed to update post" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [row] = await db
      .delete(blogPostsTable)
      .where(eq(blogPostsTable.id, req.params.id))
      .returning({ id: blogPostsTable.id });
    if (!row) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
