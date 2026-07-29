import { useState, useCallback } from "react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const STORAGE_BASE = `${BASE}/api/storage`;

export interface UploadResult {
  objectPath: string;
  url: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(async (file: File): Promise<UploadResult | null> => {
    setIsUploading(true);
    setProgress(10);
    try {
      // Step 1: request presigned URL
      const metaRes = await fetch(`${STORAGE_BASE}/uploads/request-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || "application/octet-stream" }),
      });
      if (!metaRes.ok) {
        const err = await metaRes.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Failed to get upload URL");
      }
      const { uploadURL, objectPath } = await metaRes.json();
      setProgress(30);

      // Step 2: upload directly to GCS
      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Failed to upload file");
      setProgress(100);

      return { objectPath, url: `${STORAGE_BASE}${objectPath}` };
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, []);

  return { uploadFile, isUploading, progress };
}
