import { Router } from "express";
import { db, listingsTable, blogPostsTable } from "@workspace/db";

const router = Router();

const SITE_URL = "https://giftrealestate.et";

router.get("/sitemap.xml", async (_req, res) => {
  try {
    const [listings, posts] = await Promise.all([
      db.select({ id: listingsTable.id, updatedAt: listingsTable.updatedAt }).from(listingsTable),
      db.select({ id: blogPostsTable.id, updatedAt: blogPostsTable.updatedAt }).from(blogPostsTable),
    ]);

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "weekly" },
      { url: "/properties", priority: "0.9", changefreq: "daily" },
      { url: "/about", priority: "0.7", changefreq: "monthly" },
      { url: "/services", priority: "0.7", changefreq: "monthly" },
      { url: "/blog", priority: "0.8", changefreq: "weekly" },
      { url: "/contact", priority: "0.6", changefreq: "monthly" },
    ];

    const urls = [
      ...staticPages.map(
        (p) => `
  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
      ),
      ...listings.map(
        (l) => `
  <url>
    <loc>${SITE_URL}/properties/${l.id}</loc>
    <lastmod>${l.updatedAt?.split("T")[0] ?? new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      ),
      ...posts.map(
        (p) => `
  <url>
    <loc>${SITE_URL}/blog/${p.id}</loc>
    <lastmod>${p.updatedAt?.split("T")[0] ?? new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Failed to generate sitemap");
  }
});

router.get("/robots.txt", (_req, res) => {
  const content = `User-agent: *
Allow: /

Disallow: /staff-portal
Disallow: /api/admin/

Sitemap: ${SITE_URL}/api/sitemap.xml`;

  res.set("Content-Type", "text/plain");
  res.send(content);
});

export default router;
