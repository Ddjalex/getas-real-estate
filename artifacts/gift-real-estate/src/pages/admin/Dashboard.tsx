import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { adminMe, adminLogout, admin, type Service, type Agent, type HeroSlide } from "@/lib/api";
import { ImageUploader } from "@/components/ImageUploader";
import {
  Building2, FileText, MessageSquare, LogOut, Plus, Trash2, Pencil, Eye,
  Users, Layers, Phone, Settings, MapPin, Globe, Info, MessageCircle,
  Image, ChevronUp, ChevronDown, ToggleLeft, ToggleRight,
} from "lucide-react";

type Tab = "listings" | "blog" | "agents" | "services" | "inquiries" | "contact" | "hero" | "about" | "settings";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const STORAGE_BASE = `${BASE}/api/storage`;

function resolveImageUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `${STORAGE_BASE}${path}`;
  if (path.startsWith("/uploads/")) return `${BASE}/api${path}`;
  return path;
}

// ── Hero Slider Tab ───────────────────────────────────────────────────────────
function HeroSliderTab() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    admin.heroSlides.list().then(setSlides).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (paths: string[]) => {
    if (!paths.length) return;
    setUploading(true); setError("");
    try {
      for (const imageUrl of paths) {
        await admin.heroSlides.create({ imageUrl, caption: "" });
      }
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    try {
      const updated = await admin.heroSlides.update(slide.id, { active: !slide.active });
      setSlides((prev) => prev.map((s) => s.id === slide.id ? updated : s));
    } catch { setError("Failed to update slide"); }
  };

  const deleteSlide = async (id: number) => {
    if (!confirm("Delete this slide?")) return;
    try {
      await admin.heroSlides.delete(id);
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } catch { setError("Failed to delete slide"); }
  };

  const saveCaption = async (id: number) => {
    try {
      const updated = await admin.heroSlides.update(id, { caption: editCaption });
      setSlides((prev) => prev.map((s) => s.id === id ? updated : s));
      setEditId(null);
    } catch { setError("Failed to save caption"); }
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const next = [...slides];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    const reordered = next.map((s, i) => ({ ...s, displayOrder: i }));
    setSlides(reordered);
    try {
      await admin.heroSlides.reorder(reordered.map((s) => ({ id: s.id, displayOrder: s.displayOrder })));
    } catch { setError("Failed to reorder"); load(); }
  };

  return (
    <div>
      <div className="p-6 border-b">
        <h2 className="font-bold text-xl text-gray-800">Hero Slider Images</h2>
        <p className="text-sm text-gray-500 mt-1">Upload and manage the full-screen background images on the home page hero section.</p>
      </div>

      <div className="p-6 border-b">
        <ImageUploader
          values={[]}
          onChange={handleUpload}
          multiple={true}
          label="Upload New Slide Images"
        />
        {uploading && <p className="text-sm text-[#E31E24] mt-2 font-medium">Adding slides…</p>}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading…</div>
      ) : slides.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <Image size={32} className="mx-auto mb-3 text-gray-300" />
          <p>No slides yet. Upload an image above to get started.</p>
          <p className="text-xs mt-1 text-gray-400">If no slides are configured, the home page shows the default background image.</p>
        </div>
      ) : (
        <div className="divide-y">
          {slides.map((slide, idx) => (
            <div key={slide.id} className={`flex items-center gap-4 px-6 py-4 ${!slide.active ? "opacity-50" : ""}`}>
              {/* Thumbnail */}
              <img
                src={resolveImageUrl(slide.imageUrl)}
                alt=""
                className="w-28 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
              />

              {/* Caption editor */}
              <div className="flex-1 min-w-0">
                {editId === slide.id ? (
                  <div className="flex gap-2 items-center">
                    <input
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="flex-1 border border-[#E31E24] rounded px-2 py-1 text-sm focus:outline-none"
                      placeholder="Optional caption"
                      autoFocus
                    />
                    <button onClick={() => saveCaption(slide.id)} className="text-xs bg-[#E31E24] text-white px-3 py-1 rounded font-bold">Save</button>
                    <button onClick={() => setEditId(null)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 truncate">
                      {slide.caption || <span className="italic text-gray-400">No caption</span>}
                    </span>
                    <button
                      onClick={() => { setEditId(slide.id); setEditCaption(slide.caption); }}
                      className="text-gray-400 hover:text-[#E31E24] flex-shrink-0"
                      title="Edit caption"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">Slide {idx + 1} of {slides.length}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Reorder */}
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-gray-400 hover:text-[#E31E24] disabled:opacity-30" title="Move up">
                    <ChevronUp size={16} />
                  </button>
                  <button onClick={() => move(idx, 1)} disabled={idx === slides.length - 1} className="text-gray-400 hover:text-[#E31E24] disabled:opacity-30" title="Move down">
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Toggle active */}
                <button onClick={() => toggleActive(slide)} title={slide.active ? "Hide slide" : "Show slide"} className={slide.active ? "text-[#E31E24]" : "text-gray-300"}>
                  {slide.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>

                {/* Delete */}
                <button onClick={() => deleteSlide(slide.id)} className="text-gray-400 hover:text-red-500" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {slides.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          <p className="text-xs text-gray-500">
            ✓ Active slides auto-cycle on the home page every 5 seconds · Toggle the switch to show/hide a slide without deleting it
          </p>
        </div>
      )}
    </div>
  );
}

// ── Contact Info Tab ──────────────────────────────────────────────────────────
function ContactTab() {
  const [fields, setFields] = useState({
    phone: "", whatsapp: "", location: "", email: "", portfolio: "", otherInfo: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    admin.settings.get().then((s) => {
      setFields({
        phone: s.phone ?? "",
        whatsapp: s.whatsapp ?? "",
        location: s.location ?? "",
        email: s.email ?? "",
        portfolio: s.portfolio ?? "",
        otherInfo: s.otherInfo ?? "",
      });
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(""); setSaved(false);
    try {
      await admin.settings.update(fields);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;

  return (
    <div>
      <div className="p-6 border-b">
        <h2 className="font-bold text-xl text-gray-800">Contact Information</h2>
        <p className="text-sm text-gray-500 mt-1">Manage the contact details shown on the public site and footer.</p>
      </div>
      <form onSubmit={handleSave} className="p-6 space-y-5 max-w-2xl">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <Phone size={14} className="text-[#E31E24]" /> Phone Number
          </label>
          <input
            type="tel"
            value={fields.phone}
            onChange={(e) => setFields({ ...fields, phone: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
            placeholder="+251 11 465 1234"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <MessageCircle size={14} className="text-[#E31E24]" /> WhatsApp Number
          </label>
          <input
            type="tel"
            value={fields.whatsapp}
            onChange={(e) => setFields({ ...fields, whatsapp: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
            placeholder="+251911234567 (digits only, no spaces)"
          />
          <p className="text-xs text-gray-400 mt-1">Used to generate the WhatsApp chat link.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <MapPin size={14} className="text-[#E31E24]" /> Office Location
          </label>
          <textarea
            value={fields.location}
            onChange={(e) => setFields({ ...fields, location: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] resize-none"
            placeholder="GETAS Tower, 8th Floor, Bole Road, Addis Ababa"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <span className="text-[#E31E24] font-bold text-xs">@</span> Email Address
          </label>
          <input
            type="email"
            value={fields.email}
            onChange={(e) => setFields({ ...fields, email: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
            placeholder="info@getasrealestate.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <Globe size={14} className="text-[#E31E24]" /> Portfolio / Website Link
          </label>
          <input
            type="url"
            value={fields.portfolio}
            onChange={(e) => setFields({ ...fields, portfolio: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
            placeholder="https://getasrealestate.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <Info size={14} className="text-[#E31E24]" /> Other Information
          </label>
          <textarea
            value={fields.otherInfo}
            onChange={(e) => setFields({ ...fields, otherInfo: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] resize-none"
            placeholder="Opening hours, social media handles, etc."
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {saved && <p className="text-green-600 text-sm font-medium">✓ Contact info saved successfully.</p>}
        <button
          type="submit"
          disabled={saving}
          className="bg-[#E31E24] text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-[#1A1A1A] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
function SettingsTab({ currentUsername }: { currentUsername: string }) {
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!currentPassword) { setError("Current password is required."); return; }
    if (newPassword && newPassword !== confirmPassword) { setError("New passwords do not match."); return; }
    if (newPassword && newPassword.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (!newPassword && newUsername === currentUsername) { setError("No changes to save."); return; }

    setSaving(true);
    try {
      await admin.auth.changeCredentials({
        currentPassword,
        newUsername: newUsername !== currentUsername ? newUsername : undefined,
        newPassword: newPassword || undefined,
      });
      setSuccess("Credentials updated successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update credentials");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="p-6 border-b">
        <h2 className="font-bold text-xl text-gray-800">Account Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Change your admin username and password.</p>
      </div>
      <form onSubmit={handleSave} className="p-6 space-y-5 max-w-md">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Username (Email / Login ID)</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            autoComplete="username"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
          />
        </div>
        <hr className="border-gray-200" />
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Change Password</p>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">New Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span></label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
            placeholder="Min. 8 characters"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
          />
        </div>
        <hr className="border-gray-200" />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password <span className="text-red-500">*</span></label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
            placeholder="Required to confirm changes"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm font-medium">✓ {success}</p>}
        <button
          type="submit"
          disabled={saving}
          className="bg-[#E31E24] text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-[#1A1A1A] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Update Credentials"}
        </button>
      </form>
    </div>
  );
}

// ── About Page Tab ────────────────────────────────────────────────────────────
type Milestone = { year: string; title: string; desc: string };

const DEFAULT_MILESTONES: Milestone[] = [
  { year: "1994", title: "Foundation", desc: "Get-As International Plc. established in Addis Ababa." },
  { year: "2002", title: "First Mega Project", desc: "Successfully completed and delivered a 50-villa complex in CMC, setting a new standard for gated communities." },
  { year: "2015", title: "Commercial Expansion", desc: "Launched the commercial real estate division, managing premium office spaces in Bole and Kazanchis." },
  { year: "2024", title: "Modern Era", desc: "Celebrating over three decades of trust with a portfolio of over 1,200 managed and sold properties." },
];

function AboutTab() {
  const [fields, setFields] = React.useState({
    about_hero_heading: "",
    about_hero_subtext: "",
    about_mission: "",
    about_vision: "",
  });
  const [milestones, setMilestones] = React.useState<Milestone[]>(DEFAULT_MILESTONES);
  const [loaded, setLoaded] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    admin.settings.get().then((s) => {
      setFields({
        about_hero_heading: s.about_hero_heading ?? "",
        about_hero_subtext: s.about_hero_subtext ?? "",
        about_mission: s.about_mission ?? "",
        about_vision: s.about_vision ?? "",
      });
      if (s.about_milestones) {
        try { setMilestones(JSON.parse(s.about_milestones)); } catch { /* keep defaults */ }
      }
      setLoaded(true);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(""); setSaved(false);
    try {
      await admin.settings.update({ ...fields, about_milestones: JSON.stringify(milestones) });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateMilestone = (i: number, field: keyof Milestone, val: string) =>
    setMilestones((m) => m.map((ms, idx) => idx === i ? { ...ms, [field]: val } : ms));
  const addMilestone = () => setMilestones((m) => [...m, { year: "", title: "", desc: "" }]);
  const removeMilestone = (i: number) => setMilestones((m) => m.filter((_, idx) => idx !== i));

  if (!loaded) return <div className="p-8 text-center text-gray-400">Loading…</div>;

  return (
    <div>
      <div className="p-6 border-b">
        <h2 className="font-bold text-xl text-gray-800">About Page Content</h2>
        <p className="text-sm text-gray-500 mt-1">Edit the text shown on the public About page. Leave a field blank to use the built-in default.</p>
      </div>
      <form onSubmit={handleSave} className="p-6 space-y-8 max-w-2xl">
        {/* Hero */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Hero Banner</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Heading</label>
              <input
                value={fields.about_hero_heading}
                onChange={(e) => setFields({ ...fields, about_hero_heading: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
                placeholder="About GETAS Real Estate"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subtext</label>
              <textarea
                value={fields.about_hero_subtext}
                onChange={(e) => setFields({ ...fields, about_hero_subtext: e.target.value })}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] resize-none"
                placeholder="A division of Get-As International Plc. since 2005…"
              />
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Mission & Vision</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Our Mission</label>
              <textarea
                value={fields.about_mission}
                onChange={(e) => setFields({ ...fields, about_mission: e.target.value })}
                rows={5}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] resize-y"
                placeholder="To provide unparalleled real estate services in Ethiopia…"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Our Vision</label>
              <textarea
                value={fields.about_vision}
                onChange={(e) => setFields({ ...fields, about_vision: e.target.value })}
                rows={5}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] resize-y"
                placeholder="To remain the most trusted, respected, and innovative…"
              />
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">History Milestones</h3>
            <button type="button" onClick={addMilestone} className="text-xs bg-[#E31E24] text-white px-3 py-1.5 rounded font-bold flex items-center gap-1 hover:bg-[#1A1A1A]">
              <Plus size={12} /> Add Milestone
            </button>
          </div>
          <div className="space-y-4">
            {milestones.map((ms, i) => (
              <div key={i} className="border border-gray-200 rounded p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="w-24">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Year</label>
                    <input
                      value={ms.year}
                      onChange={(e) => updateMilestone(i, "year", e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
                      placeholder="1994"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                    <input
                      value={ms.title}
                      onChange={(e) => updateMilestone(i, "title", e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
                      placeholder="Foundation"
                    />
                  </div>
                  <button type="button" onClick={() => removeMilestone(i)} className="self-end mb-1 text-gray-300 hover:text-red-400" title="Remove milestone">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                  <textarea
                    value={ms.desc}
                    onChange={(e) => updateMilestone(i, "desc", e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] resize-none"
                  />
                </div>
              </div>
            ))}
            {milestones.length === 0 && (
              <p className="text-sm text-gray-400 italic">No milestones. Click "Add Milestone" to add one.</p>
            )}
          </div>
        </section>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {saved && <p className="text-green-600 text-sm font-medium">✓ About page saved successfully.</p>}
        <button
          type="submit"
          disabled={saving}
          className="bg-[#E31E24] text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-[#1A1A1A] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Save About Page"}
        </button>
      </form>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("listings");
  const [username, setUsername] = useState("");
  const [listings, setListings] = useState<unknown[]>([]);
  const [posts, setPosts] = useState<unknown[]>([]);
  const [inquiries, setInquiries] = useState<unknown[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminMe().then((user) => {
      if (!user) { navigate("/admin"); return; }
      setUsername(user.username);
    });
  }, [navigate]);

  useEffect(() => {
    if (tab === "contact" || tab === "settings" || tab === "about") return;
    setLoading(true);
    const load =
      tab === "listings" ? admin.listings.list().then(setListings) :
      tab === "blog" ? admin.blog.list().then(setPosts) :
      tab === "agents" ? admin.agents.list().then(setAgents) :
      tab === "services" ? admin.services.list().then(setServices) :
      admin.inquiries.list().then(setInquiries);
    load.finally(() => setLoading(false));
  }, [tab]);

  const handleLogout = async () => { await adminLogout(); navigate("/admin"); };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    if (tab === "listings") { await admin.listings.delete(id); setListings((p) => (p as { id: string }[]).filter((l) => l.id !== id)); }
    else if (tab === "blog") { await admin.blog.delete(id); setPosts((p) => (p as { id: string }[]).filter((p2) => p2.id !== id)); }
    else if (tab === "agents") { await admin.agents.delete(id); setAgents((p) => p.filter((a) => a.id !== id)); }
    else if (tab === "services") { await admin.services.delete(id); setServices((p) => p.filter((s) => s.id !== id)); }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "listings", label: "Listings", icon: <Building2 size={14} /> },
    { id: "blog", label: "Blog Posts", icon: <FileText size={14} /> },
    { id: "agents", label: "Agents", icon: <Users size={14} /> },
    { id: "services", label: "Services", icon: <Layers size={14} /> },
    { id: "inquiries", label: "Inquiries", icon: <MessageSquare size={14} /> },
    { id: "hero", label: "Hero Slider", icon: <Image size={14} /> },
    { id: "about", label: "About Page", icon: <Info size={14} /> },
    { id: "contact", label: "Contact Info", icon: <Phone size={14} /> },
    { id: "settings", label: "Settings", icon: <Settings size={14} /> },
  ];

  return (
    <>
      <Helmet>
        <title>Staff Dashboard — GETAS Real Estate</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-[#1A1A1A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 size={24} className="text-[#E31E24]" />
            <span className="font-bold text-lg">GETAS Staff Portal</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" target="_blank" className="text-white/60 hover:text-white text-sm flex items-center gap-1">
              <Eye size={14} /> View Site
            </Link>
            <span className="text-white/60 text-sm">{username}</span>
            <button onClick={handleLogout} className="text-white/60 hover:text-white text-sm flex items-center gap-1">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-1 mb-6 bg-white rounded shadow p-1 w-fit">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors ${tab === t.id ? "bg-[#E31E24] text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded shadow">
            {/* Listings */}
            {tab === "listings" && (
              <div>
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="font-bold text-xl text-gray-800">Property Listings</h2>
                  <Link href="/admin/listings/new" className="bg-[#E31E24] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#1A1A1A]">
                    <Plus size={16} /> New Listing
                  </Link>
                </div>
                {loading ? <div className="p-8 text-center text-gray-400">Loading…</div> : (
                  <div className="divide-y">
                    {(listings as { id: string; title: string; type: string; price: string; location: string; status: string; images: string[] }[]).map((l) => (
                      <div key={l.id} className="px-6 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {l.images?.[0] && (
                            <img src={resolveImageUrl(l.images[0])} alt="" className="w-14 h-10 rounded object-cover bg-gray-100 flex-shrink-0" />
                          )}
                          <div>
                            <div className="font-medium text-gray-800">{l.title}</div>
                            <div className="text-sm text-gray-500">{l.status} · {l.location} · ETB {Number(l.price).toLocaleString("en-ET")}{l.type === "rent" ? "/mo" : ""}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Link href={`/properties/${l.id}`} target="_blank" className="text-gray-400 hover:text-[#E31E24]"><Eye size={16} /></Link>
                          <Link href={`/admin/listings/${l.id}/edit`} className="text-gray-400 hover:text-[#E31E24]"><Pencil size={16} /></Link>
                          <button onClick={() => deleteItem(l.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                    {listings.length === 0 && <div className="p-8 text-center text-gray-400">No listings yet.</div>}
                  </div>
                )}
              </div>
            )}

            {/* Blog */}
            {tab === "blog" && (
              <div>
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="font-bold text-xl text-gray-800">Blog Posts</h2>
                  <Link href="/admin/blog/new" className="bg-[#E31E24] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#1A1A1A]">
                    <Plus size={16} /> New Post
                  </Link>
                </div>
                {loading ? <div className="p-8 text-center text-gray-400">Loading…</div> : (
                  <div className="divide-y">
                    {(posts as { id: string; title: string; author: string; category: string; date: string; image: string }[]).map((p) => (
                      <div key={p.id} className="px-6 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {p.image && (
                            <img src={resolveImageUrl(p.image)} alt="" className="w-14 h-10 rounded object-cover bg-gray-100 flex-shrink-0" />
                          )}
                          <div>
                            <div className="font-medium text-gray-800">{p.title}</div>
                            <div className="text-sm text-gray-500">{p.author} · {p.category} · {new Date(p.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Link href={`/admin/blog/${p.id}/edit`} className="text-gray-400 hover:text-[#E31E24]"><Pencil size={16} /></Link>
                          <button onClick={() => deleteItem(p.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                    {posts.length === 0 && <div className="p-8 text-center text-gray-400">No posts yet.</div>}
                  </div>
                )}
              </div>
            )}

            {/* Agents */}
            {tab === "agents" && (
              <div>
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="font-bold text-xl text-gray-800">Agents (About Page)</h2>
                  <Link href="/admin/agents/new" className="bg-[#E31E24] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#1A1A1A]">
                    <Plus size={16} /> New Agent
                  </Link>
                </div>
                {loading ? <div className="p-8 text-center text-gray-400">Loading…</div> : (
                  <div className="divide-y">
                    {agents.map((a) => (
                      <div key={a.id} className="px-6 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {a.image ? (
                            <img src={resolveImageUrl(a.image)} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100 flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400"><Users size={16} /></div>
                          )}
                          <div>
                            <div className="font-medium text-gray-800">{a.name}</div>
                            <div className="text-sm text-gray-500">{a.role} · {a.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Link href={`/admin/agents/${a.id}/edit`} className="text-gray-400 hover:text-[#E31E24]"><Pencil size={16} /></Link>
                          <button onClick={() => deleteItem(a.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                    {agents.length === 0 && <div className="p-8 text-center text-gray-400">No agents yet.</div>}
                  </div>
                )}
              </div>
            )}

            {/* Services */}
            {tab === "services" && (
              <div>
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="font-bold text-xl text-gray-800">Services (Services Page)</h2>
                  <Link href="/admin/services/new" className="bg-[#E31E24] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#1A1A1A]">
                    <Plus size={16} /> New Service
                  </Link>
                </div>
                {loading ? <div className="p-8 text-center text-gray-400">Loading…</div> : (
                  <div className="divide-y">
                    {services.map((s) => (
                      <div key={s.id} className="px-6 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {s.image ? (
                            <img src={resolveImageUrl(s.image)} alt="" className="w-14 h-10 rounded object-cover bg-gray-100 flex-shrink-0" />
                          ) : (
                            <div className="w-14 h-10 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400"><Layers size={16} /></div>
                          )}
                          <div>
                            <div className="font-medium text-gray-800">{s.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{s.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Link href={`/admin/services/${s.id}/edit`} className="text-gray-400 hover:text-[#E31E24]"><Pencil size={16} /></Link>
                          <button onClick={() => deleteItem(s.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                    {services.length === 0 && <div className="p-8 text-center text-gray-400">No services yet.</div>}
                  </div>
                )}
              </div>
            )}

            {/* Inquiries */}
            {tab === "inquiries" && (
              <div>
                <div className="p-6 border-b">
                  <h2 className="font-bold text-xl text-gray-800">Contact Inquiries</h2>
                </div>
                {loading ? <div className="p-8 text-center text-gray-400">Loading…</div> : (
                  <div className="divide-y">
                    {(inquiries as { id: number; name: string; email: string; phone: string; message: string; listingId: string | null; createdAt: string }[]).map((inq) => (
                      <div key={inq.id} className="px-6 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-medium text-gray-800">{inq.name}</div>
                            <div className="text-sm text-gray-500">{inq.email}{inq.phone && ` · ${inq.phone}`}</div>
                            {inq.listingId && <div className="text-xs text-[#E31E24] mt-1 font-medium">Property: {inq.listingId}</div>}
                            <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap line-clamp-3">{inq.message}</p>
                          </div>
                          <div className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                            {new Date(inq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {inquiries.length === 0 && <div className="p-8 text-center text-gray-400">No inquiries yet.</div>}
                  </div>
                )}
              </div>
            )}

            {/* Hero Slider */}
            {tab === "hero" && <HeroSliderTab />}

            {/* About Page */}
            {tab === "about" && <AboutTab />}

            {/* Contact Info */}
            {tab === "contact" && <ContactTab />}

            {/* Settings */}
            {tab === "settings" && <SettingsTab currentUsername={username} />}
          </div>
        </div>
      </div>
    </>
  );
}
