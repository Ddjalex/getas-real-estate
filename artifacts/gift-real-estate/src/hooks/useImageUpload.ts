import { useState, useCallback } from "react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const UPLOAD_URL = `${BASE}/api/storage/admin/uploads/image`;

export interface UploadResult {
  objectPath: string;
  url: string;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
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
      const MAX_BYTES = 5 * 1024 * 1024;
      if (file.size > MAX_BYTES) {
        throw new Error("Image must be under 5 MB");
      }

      // Convert file to base64 data URL
      const dataUrl = await readFileAsDataURL(file);
      setProgress(60);

      // Send to server for validation
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dataUrl, name: file.name, contentType: file.type, size: file.size }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Upload failed (${res.status})`);
      }

      const { url } = await res.json() as { url: string };
      setProgress(100);

      // objectPath == the data URL; stored directly in the images[] column
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
