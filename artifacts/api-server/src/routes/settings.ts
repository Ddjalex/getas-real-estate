import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";

const router = Router();

const DEFAULTS: Record<string, string> = {
  phone: "+251 11 465 1234",
  whatsapp: "+251911234567",
  location: "GIFT Tower, 8th Floor, Bole Road, Near Olympia, Addis Ababa, Ethiopia",
  portfolio: "",
  email: "info@giftrealestate.com",
  otherInfo: "",
  about_hero_heading: "",
  about_hero_subtext: "",
  about_mission: "",
  about_vision: "",
  about_milestones: "",
};

// Public GET — no auth required
router.get("/settings", async (_req, res) => {
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

export default router;
