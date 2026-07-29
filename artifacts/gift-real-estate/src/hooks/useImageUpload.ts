import { useState, useCallback } from "react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const UPLOAD_URL = `${BASE}/api/storage/admin/uploads/image`;

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export interface UploadResult {
  objectPath: string;
  url: string;
}

/** Convert any image File to a WebP data URL using an off-screen canvas. */
function convertToWebP(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      // Quality 0.85 gives a good size/quality balance
      const dataUrl = canvas.toDataURL("image/webp", 0.85);
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for conversion"));
    };

    img.src = objectUrl;
  });
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File): Promise<UploadResult | null> => {
    setIsUploading(true);
    setError(null);
    setProgress(10);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }
      if (file.size > MAX_BYTES) {
        throw new Error("Image must be under 10 MB");
      }

      // Convert to WebP for smaller file size
      setProgress(30);
      const dataUrl = await convertToWebP(file);
      setProgress(60);

      // Rough size check on the resulting base64 (~0.75 bytes per char)
      const base64Part = dataUrl.split(",")[1] ?? "";
      const approxBytes = base64Part.length * 0.75;
      if (approxBytes > MAX_BYTES) {
        throw new Error("Image must be under 10 MB");
      }

      // Send to server for final validation
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dataUrl, name: file.name, contentType: "image/webp", size: approxBytes }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Upload failed (${res.status})`);
      }

      const { url } = (await res.json()) as { url: string };
      setProgress(100);

      return { objectPath: url, url };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      console.error("Upload failed:", err);
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, []);

  return { uploadFile, isUploading, progress, error };
}
