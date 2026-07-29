import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { adminMe, adminLogout, admin, type Service, type Agent } from "@/lib/api";
import {
  Building2, FileText, MessageSquare, LogOut, Plus, Trash2, Pencil, Eye,
  Users, Layers, Phone, Settings, MapPin, Globe, Info, MessageCircle,
} from "lucide-react";

type Tab = "listings" | "blog" | "agents" | "services" | "inquiries" | "contact" | "settings";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const STORAGE_BASE = `${BASE}/api/storage`;

function resolveImageUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `${STORAGE_BASE}${path}`;
  return path;
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
            <Phone size={14} className="text-[#1C4C3B]" /> Phone Number
          </label>
          <input
            type="tel"
            value={fields.phone}
            onChange={(e) => setFields({ ...fields, phone: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4C3B]"
            placeholder="+251 11 465 1234"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <MessageCircle size={14} className="text-[#1C4C3B]" /> WhatsApp Number
          </label>
          <input
            type="tel"
            value={fields.whatsapp}
            onChange={(e) => setFields({ ...fields, whatsapp: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4C3B]"
            placeholder="+251911234567 (digits only, no spaces)"
          />
          <p className="text-xs text-gray-400 mt-1">Used to generate the WhatsApp chat link.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <MapPin size={14} className="text-[#1C4C3B]" /> Office Location
          </label>
          <textarea
            value={fields.location}
            onChange={(e) => setFields({ ...fields, location: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4C3B] resize-none"
            placeholder="GIFT Tower, 8th Floor, Bole Road, Addis Ababa"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <span className="text-[#1C4C3B] font-bold text-xs">@</span> Email Address
          </label>
          <input
            type="email"
            value={fields.email}
            onChange={(e) => setFields({ ...fields, email: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4C3B]"
            placeholder="info@giftrealestate.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <Globe size={14} className="text-[#1C4C3B]" /> Portfolio / Website Link
          </label>
          <input
            type="url"
            value={fields.portfolio}
            onChange={(e) => setFields({ ...fields, portfolio: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4C3B]"
            placeholder="https://giftrealestate.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <Info size={14} className="text-[#1C4C3B]" /> Other Information
          </label>
          <textarea
            value={fields.otherInfo}
            onChange={(e) => setFields({ ...fields, otherInfo: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4C3B] resize-none"
            placeholder="Opening hours, social media handles, etc."
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {saved && <p className="text-green-600 text-sm font-medium">✓ Contact info saved successfully.</p>}
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1C4C3B] text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-[#0F2E24] disabled:opacity-50 transition-colors"
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4C3B]"
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4C3B]"
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4C3B]"
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4C3B]"
            placeholder="Required to confirm changes"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm font-medium">✓ {success}</p>}
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1C4C3B] text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-[#0F2E24] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Update Credentials"}
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
    if (tab === "contact" || tab === "settings") return;
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
    { id: "contact", label: "Contact Info", icon: <Phone size={14} /> },
    { id: "settings", label: "Settings", icon: <Settings size={14} /> },
  ];

  return (
    <>
      <Helmet>
        <title>Staff Dashboard — GIFT Real Estate</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-[#0F2E24] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 size={24} className="text-[#D9B93C]" />
            <span className="font-bold text-lg">GIFT Staff Portal</span>
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
                className={`px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors ${tab === t.id ? "bg-[#1C4C3B] text-white" : "text-gray-600 hover:bg-gray-100"}`}
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
                  <Link href="/admin/listings/new" className="bg-[#1C4C3B] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#0F2E24]">
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
                          <Link href={`/properties/${l.id}`} target="_blank" className="text-gray-400 hover:text-[#1C4C3B]"><Eye size={16} /></Link>
                          <Link href={`/admin/listings/${l.id}/edit`} className="text-gray-400 hover:text-[#1C4C3B]"><Pencil size={16} /></Link>
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
                  <Link href="/admin/blog/new" className="bg-[#1C4C3B] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#0F2E24]">
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
                          <Link href={`/admin/blog/${p.id}/edit`} className="text-gray-400 hover:text-[#1C4C3B]"><Pencil size={16} /></Link>
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
                  <Link href="/admin/agents/new" className="bg-[#1C4C3B] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#0F2E24]">
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
                          <Link href={`/admin/agents/${a.id}/edit`} className="text-gray-400 hover:text-[#1C4C3B]"><Pencil size={16} /></Link>
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
                  <Link href="/admin/services/new" className="bg-[#1C4C3B] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#0F2E24]">
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
                          <Link href={`/admin/services/${s.id}/edit`} className="text-gray-400 hover:text-[#1C4C3B]"><Pencil size={16} /></Link>
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
                            {inq.listingId && <div className="text-xs text-[#1C4C3B] mt-1 font-medium">Property: {inq.listingId}</div>}
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
