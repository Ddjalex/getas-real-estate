/**
 * Local-disk image storage.
 *
 * Replaces the Replit-specific @google-cloud/storage approach.
 * Uploaded images are written to the `uploads/` directory at the
 * application root (a sibling of `dist/`, so rebuilds never touch it).
 *
 * In production (cPanel) the uploads/ folder must exist at the app root
 * with write permissions for the Node process before first deploy.
 */
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

// __dirname in the compiled bundle resolves to dist/
// uploads/ lives one level up so it survives rebuilds.
export const uploadsDir = path.join(__dirname, "..", "uploads");

/** Ensure uploads/ exists — called once at server startup. */
export function ensureUploadsDir(): void {
  mkdirSync(uploadsDir, { recursive: true });
}

export interface SaveImageResult {
  /** Relative URL path stored in the database, e.g. /uploads/abc123.webp */
  url: string;
  /** Absolute filesystem path where the file was written. */
  filePath: string;
}

/**
 * Decode a base64 data URL and persist it to uploads/.
 * Returns the public URL path ( /uploads/<uuid>.<ext> ).
 */
export function saveImageFromDataUrl(dataUrl: string): SaveImageResult {
  // dataUrl format: "data:<mime>;base64,<data>"
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/s);
  if (!match) {
    throw new Error("Invalid data URL — expected data:image/…;base64,…");
  }

  const [, mime, base64Data] = match;
  const ext = mimeToExt(mime);
  const filename = `${randomUUID()}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  writeFileSync(filePath, Buffer.from(base64Data, "base64"));

  return { url: `/uploads/${filename}`, filePath };
}

function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/svg+xml": "svg",
  };
  return map[mime.toLowerCase()] ?? "bin";
}
