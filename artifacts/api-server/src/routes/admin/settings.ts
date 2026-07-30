import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../middleware/requireAdmin";

const router = Router();

// Default contact info keys
const DEFAULTS: Record<string, string> = {
  phone: "",
  whatsapp: "",
  location: "",
  portfolio: "",
  email: "",
  otherInfo: "",
};

router.get("/", requireAdmin, async (_req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    const settings: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put("/", requireAdmin, async (req, res) => {
  try {
    const allowed = [
      "phone", "whatsapp", "location", "portfolio", "email", "otherInfo",
      "about_hero_heading", "about_hero_subtext", "about_mission", "about_vision", "about_milestones",
    ];
    const updates = req.body as Record<string, string>;

    for (const key of allowed) {
      if (key in updates) {
        const value = String(updates[key] ?? "");
        // upsert
        const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
        if (existing.length > 0) {
          await db.update(siteSettingsTable).set({ value }).where(eq(siteSettingsTable.key, key));
        } else {
          await db.insert(siteSettingsTable).values({ key, value });
        }
      }
    }

    // Return updated settings
    const rows = await db.select().from(siteSettingsTable);
    const settings: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
