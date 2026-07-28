import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { admin, type Listing } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";

const EMPTY: Partial<Listing> = {
  id: "", slug: "", title: "", type: "sale", price: "", priceUnit: "USD",
  location: "", neighborhood: "", bedrooms: 0, bathrooms: 0, sizeSqm: 0,
  description: "", images: [], status: "For Sale", featured: false,
  dateAdded: new Date().toISOString().split("T")[0] + "T00:00:00Z",
};

export default function ListingForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const [, navigate] = useLocation();
  const [form, setForm] = useState<Partial<Listing>>(EMPTY);
  const [imagesStr, setImagesStr] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew) {
      admin.listings.list().then((all) => {
        const found = all.find((l) => l.id === id);
        if (found) {
          setForm(found);
          setImagesStr((found.images ?? []).join("\n"));
        }
      });
    }
  }, [id, isNew]);

  const set = (k: keyof Listing, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        images: imagesStr.split("\n").map((s) => s.trim()).filter(Boolean),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        sizeSqm: Number(form.sizeSqm),
        slug: form.slug || form.id,
      };
      if (isNew) {
        await admin.listings.create(payload);
      } else {
        await admin.listings.update(id!, payload);
      }
      navigate("/staff-portal/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof Listing, type = "text", extra?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={String(form[key] ?? "")}
        onChange={(e) => set(key, e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B]"
        {...extra}
      />
    </div>
  );

  return (
    <>
      <Helmet><title>{isNew ? "New Listing" : "Edit Listing"} — Staff Portal</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-[#0F2E24] text-white px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/staff-portal/dashboard")} className="text-white/70 hover:text-white"><ArrowLeft size={20} /></button>
          <span className="font-bold">{isNew ? "New Listing" : "Edit Listing"}</span>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded shadow p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {field("ID (slug, no spaces)", "id")}
              {field("Slug", "slug")}
            </div>
            {field("Title", "title")}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Type</label>
                <select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B]">
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Status</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B]">
                  <option>For Sale</option>
                  <option>For Rent</option>
                  <option>New</option>
                  <option>Featured</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field("Price (number only)", "price")}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Price Unit</label>
                <select value={form.priceUnit} onChange={(e) => set("priceUnit", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B]">
                  <option value="USD">USD</option>
                  <option value="ETB/month">ETB/month</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field("Location", "location")}
              {field("Neighborhood", "neighborhood")}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {field("Bedrooms", "bedrooms", "number")}
              {field("Bathrooms", "bathrooms", "number")}
              {field("Size (sqm)", "sizeSqm", "number")}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Description</label>
              <textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B] resize-y" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Image URLs (one per line)</label>
              <textarea rows={4} value={imagesStr} onChange={(e) => setImagesStr(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B] font-mono text-sm resize-y" placeholder="https://images.unsplash.com/...&#10;https://..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-[#1C4C3B]" />
              <label htmlFor="featured" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Mark as Featured</label>
            </div>
            {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}
            <button type="submit" disabled={saving} className="bg-[#1C4C3B] text-white px-8 py-3 rounded font-bold flex items-center gap-2 hover:bg-[#0F2E24] disabled:opacity-60">
              <Save size={16} /> {saving ? "Saving…" : "Save Listing"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
