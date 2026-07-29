import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const STORAGE_BASE = `${BASE}/api/storage`;

interface ImageUploaderProps {
  /** Current image paths/URLs stored in the record */
  values: string[];
  onChange: (paths: string[]) => void;
  multiple?: boolean;
  label?: string;
}

export function ImageUploader({ values, onChange, multiple = true, label = "Images" }: ImageUploaderProps) {
  const { uploadFile, isUploading } = useImageUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const resolveDisplayUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    if (path.startsWith("/objects/")) return `${STORAGE_BASE}${path}`;
    return path;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const toUpload = multiple ? Array.from(files) : [files[0]];
    for (const file of toUpload) {
      const result = await uploadFile(file);
      if (result) {
        onChange(multiple ? [...values, result.objectPath] : [result.objectPath]);
      }
    }
  };

  const remove = (idx: number) => onChange(values.filter((_, i) => i !== idx));

  const move = (from: number, to: number) => {
    const next = [...values];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">{label}</label>

      {/* Existing images */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {values.map((path, idx) => (
            <div key={idx} className="relative group w-24 h-24 rounded border border-gray-200 overflow-hidden bg-gray-50">
              <img src={resolveDisplayUrl(path)} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {idx > 0 && (
                  <button type="button" onClick={() => move(idx, idx - 1)} className="bg-white/90 rounded p-0.5 text-xs text-gray-700 hover:bg-white" title="Move left">←</button>
                )}
                <button type="button" onClick={() => remove(idx)} className="bg-white/90 rounded p-0.5 text-red-600 hover:bg-white" title="Remove"><X size={14} /></button>
                {idx < values.length - 1 && (
                  <button type="button" onClick={() => move(idx, idx + 1)} className="bg-white/90 rounded p-0.5 text-xs text-gray-700 hover:bg-white" title="Move right">→</button>
                )}
              </div>
              {idx === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-[#1C4C3B]/80 text-white text-[10px] text-center py-0.5">Cover</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded px-4 py-6 text-center cursor-pointer transition-colors ${dragOver ? "border-[#1C4C3B] bg-[#1C4C3B]/5" : "border-gray-300 hover:border-[#1C4C3B]/50"}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-[#1C4C3B]">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm font-medium">Uploading…</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            {values.length > 0 ? <Upload size={20} /> : <ImageIcon size={24} />}
            <span className="text-sm">{multiple ? "Click or drag to add images" : "Click or drag to replace image"}</span>
            <span className="text-xs text-gray-400">JPG, PNG, WebP</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={isUploading}
      />
    </div>
  );
}
