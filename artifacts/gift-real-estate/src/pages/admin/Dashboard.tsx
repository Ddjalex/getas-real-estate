import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { adminMe, adminLogout, admin } from "@/lib/api";
import { Building2, FileText, MessageSquare, LogOut, Plus, Trash2, Pencil, Eye } from "lucide-react";

type Tab = "listings" | "blog" | "inquiries";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("listings");
  const [username, setUsername] = useState("");
  const [listings, setListings] = useState<unknown[]>([]);
  const [posts, setPosts] = useState<unknown[]>([]);
  const [inquiries, setInquiries] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    adminMe().then((user) => {
      if (!user) {
        navigate("/admin");
        return;
      }
      setUsername(user.username);
    });
  }, [navigate]);

  // Load data for current tab
  useEffect(() => {
    setLoading(true);
    const load =
      tab === "listings"
        ? admin.listings.list().then(setListings)
        : tab === "blog"
        ? admin.blog.list().then(setPosts)
        : admin.inquiries.list().then(setInquiries);
    load.finally(() => setLoading(false));
  }, [tab]);

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin");
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    if (tab === "listings") {
      await admin.listings.delete(id);
      setListings((prev) => (prev as { id: string }[]).filter((l) => l.id !== id));
    } else if (tab === "blog") {
      await admin.blog.delete(id);
      setPosts((prev) => (prev as { id: string }[]).filter((p) => p.id !== id));
    }
  };

  return (
    <>
      <Helmet>
        <title>Staff Dashboard — GIFT Real Estate</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
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
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white rounded shadow p-1 w-fit">
            {(["listings", "blog", "inquiries"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded text-sm font-bold capitalize transition-colors ${tab === t ? "bg-[#1C4C3B] text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {t === "listings" ? <span className="flex items-center gap-2"><Building2 size={14} /> Listings</span>
                : t === "blog" ? <span className="flex items-center gap-2"><FileText size={14} /> Blog Posts</span>
                : <span className="flex items-center gap-2"><MessageSquare size={14} /> Inquiries</span>}
              </button>
            ))}
          </div>

          <div className="bg-white rounded shadow">
            {/* Listings */}
            {tab === "listings" && (
              <div>
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="font-bold text-xl text-gray-800">Property Listings</h2>
                  <Link href="/admin/listings/new" className="bg-[#1C4C3B] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#0F2E24]">
                    <Plus size={16} /> Add Listing
                  </Link>
                </div>
                {loading ? (
                  <div className="p-8 text-center text-gray-400">Loading…</div>
                ) : (
                  <div className="divide-y">
                    {(listings as { id: string; title: string; type: string; price: string; priceUnit: string; location: string; featured: boolean; status: string }[]).map((l) => (
                      <div key={l.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                        <div>
                          <div className="font-medium text-gray-800">{l.title}</div>
                          <div className="text-sm text-gray-500">{l.location} · {l.type} · {l.price} {l.priceUnit} {l.featured && <span className="text-[#D9B93C] font-bold">★ Featured</span>}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded ${l.status === "Featured" || l.status === "New" ? "bg-[#1C4C3B] text-white" : "bg-gray-200 text-gray-700"}`}>{l.status}</span>
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
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="font-bold text-xl text-gray-800">Blog Posts</h2>
                  <Link href="/admin/blog/new" className="bg-[#1C4C3B] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#0F2E24]">
                    <Plus size={16} /> New Post
                  </Link>
                </div>
                {loading ? (
                  <div className="p-8 text-center text-gray-400">Loading…</div>
                ) : (
                  <div className="divide-y">
                    {(posts as { id: string; title: string; author: string; date: string; category: string }[]).map((p) => (
                      <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                        <div>
                          <div className="font-medium text-gray-800">{p.title}</div>
                          <div className="text-sm text-gray-500">{p.author} · {p.category} · {new Date(p.date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-3">
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

            {/* Inquiries */}
            {tab === "inquiries" && (
              <div>
                <div className="p-6 border-b">
                  <h2 className="font-bold text-xl text-gray-800">Contact Inquiries</h2>
                </div>
                {loading ? (
                  <div className="p-8 text-center text-gray-400">Loading…</div>
                ) : (
                  <div className="divide-y">
                    {(inquiries as { id: number; name: string; email: string; phone: string; message: string; listingId: string | null; createdAt: string }[]).map((inq) => (
                      <div key={inq.id} className="px-6 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-medium text-gray-800">{inq.name}</div>
                            <div className="text-sm text-gray-500">{inq.email} {inq.phone && `· ${inq.phone}`}</div>
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
          </div>
        </div>
      </div>
    </>
  );
}
