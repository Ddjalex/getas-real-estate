/**
 * Storage routes — local disk implementation.
 *
 * Single upload endpoint used by the admin panel:
 *   POST /storage/admin/uploads/image
 *
 * Accepts a base64 data URL image, writes it to the uploads/ directory,
 * and returns the public URL path ( /uploads/<uuid>.ext ).
 *
 * The uploads/ directory is served statically by app.ts at /uploads.
 */
import { Router, type IRouter, type Request, type Response } from "express";
import { requireAdmin } from "../middleware/requireAdmin";
import { saveImageFromDataUrl } from "../lib/localDiskStorage";

const router: IRouter = Router();

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * POST /storage/admin/uploads/image
 *
 * Body: { dataUrl: string, size?: number }
 * Response: { url: "/uploads/<uuid>.ext" }
 */
router.post(
  "/storage/admin/uploads/image",
  requireAdmin,
  async (req: Request, res: Response) => {
    const { dataUrl, size } = req.body as { dataUrl?: unknown; size?: unknown };

    if (!dataUrl || typeof dataUrl !== "string") {
      res.status(400).json({ error: "Missing dataUrl" });
      return;
    }
    if (!dataUrl.startsWith("data:image/")) {
      res.status(400).json({ error: "Only image files are allowed (JPEG, PNG, WebP, GIF)" });
      return;
    }

    // Size guard on the original file
    const sizeNum = typeof size === "number" ? size : Number(size);
    if (!isNaN(sizeNum) && sizeNum > MAX_BYTES) {
      res.status(400).json({ error: "Image must be under 10 MB" });
      return;
    }

    // Rough base64 size check (each base64 char ≈ 0.75 bytes)
    const base64Part = dataUrl.split(",")[1] ?? "";
    if (base64Part.length * 0.75 > MAX_BYTES) {
      res.status(400).json({ error: "Image must be under 10 MB" });
      return;
    }

    try {
      const { url } = saveImageFromDataUrl(dataUrl);
      res.json({ url });
    } catch (err) {
      req.log.error({ err }, "Failed to save uploaded image");
      res.status(500).json({ error: "Failed to save image" });
    }
  },
);

export default router;
