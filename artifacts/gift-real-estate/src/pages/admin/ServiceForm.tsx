import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { admin, type Service } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";

const EMPTY: Partial<Service> = {
  id: "", title: "", description: "", image: "", order: 0,
};

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const [, navigate] = useLocation();
  const [form, setForm] = useState<Partial<Service>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew) {
      admin.services.list().then((all) => {
        const found = all.find((s) => s.id === id);
        if (found) setForm(found);
      });
    }
  }, [id, isNew]);

  const set = (k: keyof Service, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (isNew) {
        await admin.services.create(form as Service);
      } else {
        await admin.services.update(id!, form as Service);
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet><title>{isNew ? "New Service" : "Edit Service"} — Staff Portal</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-[#0F2E24] text-white px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/admin/dashboard")} className="text-white/70 hover:text-white"><ArrowLeft size={20} /></button>
          <span className="font-bold">{isNew ? "New Service" : "Edit Service"}</span>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded shadow p-8 space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">ID (no spaces)</label>
              <input type="text" value={form.id ?? ""} onChange={(e) => set("id", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Title</label>
              <input type="text" value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Description</label>
              <textarea rows={4} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B] resize-y" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Display Order</label>
              <input type="number" value={form.order ?? 0} onChange={(e) => set("order", Number(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B]" />
            </div>

            <ImageUploader
              values={form.image ? [form.image] : []}
              onChange={(paths) => set("image", paths[0] ?? "")}
              multiple={false}
              label="Service Image"
            />

            {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}
            <button type="submit" disabled={saving} className="bg-[#1C4C3B] text-white px-8 py-3 rounded font-bold flex items-center gap-2 hover:bg-[#0F2E24] disabled:opacity-60">
              <Save size={16} /> {saving ? "Saving…" : "Save Service"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
