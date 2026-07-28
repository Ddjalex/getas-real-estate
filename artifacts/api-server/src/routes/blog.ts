import { Router } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const rows =
      typeof category === "string" && category
        ? await db
            .select()
            .from(blogPostsTable)
            .where(eq(blogPostsTable.category, category))
            .orderBy(blogPostsTable.publishedAt)
        : await db.select().from(blogPostsTable).orderBy(blogPostsTable.publishedAt);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [row] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.id, req.params.id));

    if (!row) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

export default router;
