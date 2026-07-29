import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { admin, type BlogPost } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";

const EMPTY: Partial<BlogPost> = {
  id: "", slug: "", title: "", excerpt: "", content: "",
  author: "", date: new Date().toISOString().split("T")[0],
  category: "Market Insights", image: "", publishedAt: new Date().toISOString(),
};

export default function BlogForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id; // route is /admin/blog/new (no param) for create, /:id/edit for update
  const [, navigate] = useLocation();
  const [form, setForm] = useState<Partial<BlogPost>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew) {
      admin.blog.list().then((all) => {
        const found = all.find((p) => p.id === id);
        if (found) setForm(found);
      });
    }
  }, [id, isNew]);

  const set = (k: keyof BlogPost, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, slug: form.slug || form.id };
      if (isNew) {
        await admin.blog.create(payload);
      } else {
        await admin.blog.update(id!, payload);
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof BlogPost, multiline = false) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea rows={key === "content" ? 12 : 3} value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B] resize-y" />
      ) : (
        <input type="text" value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B]" />
      )}
    </div>
  );

  return (
    <>
      <Helmet><title>{isNew ? "New Blog Post" : "Edit Blog Post"} — Staff Portal</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-[#0F2E24] text-white px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/admin/dashboard")} className="text-white/70 hover:text-white"><ArrowLeft size={20} /></button>
          <span className="font-bold">{isNew ? "New Blog Post" : "Edit Blog Post"}</span>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded shadow p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {field("ID (no spaces)", "id")}
              {field("Slug", "slug")}
            </div>
            {field("Title", "title")}
            {field("Excerpt (short summary)", "excerpt", true)}
            {field("Content (full article)", "content", true)}
            <div className="grid grid-cols-2 gap-4">
              {field("Author", "author")}
              {field("Category", "category")}
            </div>
            {field("Date (YYYY-MM-DD)", "date")}

            <ImageUploader
              values={form.image ? [form.image] : []}
              onChange={(paths) => set("image", paths[0] ?? "")}
              multiple={false}
              label="Cover Image"
            />

            {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}
            <button type="submit" disabled={saving} className="bg-[#1C4C3B] text-white px-8 py-3 rounded font-bold flex items-center gap-2 hover:bg-[#0F2E24] disabled:opacity-60">
              <Save size={16} /> {saving ? "Saving…" : "Save Post"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
