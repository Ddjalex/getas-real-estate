import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { admin, type Listing } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { MapPicker } from "@/components/MapPicker";

/** Convert any string into a URL-safe slug */
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const EMPTY: Partial<Listing> = {
  id: "", slug: "", title: "", type: "sale", price: "",
  location: "", neighborhood: "", bedrooms: 0, bathrooms: 0, sizeSqm: 0,
  description: "", images: [], status: "For Sale", featured: false,
  dateAdded: new Date().toISOString().split("T")[0] + "T00:00:00Z",
  latitude: null, longitude: null, mapsUrl: null,
};

export default function ListingForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const [, navigate] = useLocation();
  const [form, setForm] = useState<Partial<Listing>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew) {
      admin.listings.get(id).then((listing) => {
        setForm(listing);
      }).catch(() => {
        setError("Failed to load listing. Please go back and try again.");
      });
    }
  }, [id, isNew]);

  const set = (k: keyof Listing, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  /** On title change, keep id+slug in sync (only for new listings) */
  const handleTitleChange = (value: string) => {
    set("title", value);
    if (isNew) {
      const slug = toSlug(value);
      setForm((f) => ({ ...f, title: value, id: slug, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const priceUnit = form.type === "rent" ? "ETB/month" : "ETB";
      // Ensure id/slug are set (fallback to slug of title if somehow empty)
      const slug = form.slug || toSlug(form.title ?? "");
      const listingId = form.id || slug;
      const payload = {
        ...form,
        id: listingId,
        slug,
        priceUnit,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        sizeSqm: Number(form.sizeSqm),
      };
      if (isNew) {
        await admin.listings.create(payload);
      } else {
        await admin.listings.update(id!, payload);
      }
      navigate("/admin/dashboard");
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
          <button onClick={() => navigate("/admin/dashboard")} className="text-white/70 hover:text-white"><ArrowLeft size={20} /></button>
          <span className="font-bold">{isNew ? "New Listing" : "Edit Listing"}</span>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded shadow p-8 space-y-5">
            {field("Title", "title", "text", {
              onChange: (e) => handleTitleChange(e.target.value),
              required: true,
              placeholder: "e.g. Luxury Apartment in Bole",
            })}

            {/* Slug shown read-only so admin can see what will be used for SEO URLs */}
            {form.slug && (
              <div className="text-xs text-gray-400">
                SEO slug (auto-generated): <span className="font-mono text-gray-600">{form.slug}</span>
              </div>
            )}

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
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Price (ETB — {form.type === "rent" ? "per month" : "sale price"})
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">ETB</span>
                <input
                  type="number"
                  value={String(form.price ?? "")}
                  onChange={(e) => set("price", e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B]"
                  placeholder="e.g. 4500000"
                  required
                />
                {form.type === "rent" && <span className="text-gray-500 font-medium">/mo</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field("Location", "location", "text", { required: true })}
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

            <ImageUploader
              values={form.images ?? []}
              onChange={(paths) => set("images", paths)}
              multiple={true}
              label="Property Images"
            />

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Google Maps Link</label>
              <input
                type="url"
                value={form.mapsUrl ?? ""}
                onChange={(e) => set("mapsUrl", e.target.value || null)}
                placeholder="https://maps.app.goo.gl/..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B] font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Paste a Google Maps share link. This will be shown to visitors on the property page.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Property Location on Map (coordinates)</label>
              <MapPicker
                lat={form.latitude ?? null}
                lng={form.longitude ?? null}
                onChange={(lat, lng) => setForm((f) => ({ ...f, latitude: lat, longitude: lng }))}
              />
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
