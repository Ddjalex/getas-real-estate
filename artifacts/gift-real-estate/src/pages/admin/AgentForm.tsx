import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { admin, type Agent } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";

const EMPTY: Partial<Agent> = {
  id: "", name: "", role: "", phone: "", email: "", bio: "", image: "",
};

export default function AgentForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const [, navigate] = useLocation();
  const [form, setForm] = useState<Partial<Agent>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew) {
      admin.agents.list().then((all) => {
        const found = all.find((a) => a.id === id);
        if (found) setForm(found);
      });
    }
  }, [id, isNew]);

  const set = (k: keyof Agent, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (isNew) {
        await admin.agents.create(form as Agent);
      } else {
        await admin.agents.update(id!, form as Agent);
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof Agent, multiline = false) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea rows={4} value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B] resize-y" />
      ) : (
        <input type="text" value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1C4C3B]" />
      )}
    </div>
  );

  return (
    <>
      <Helmet><title>{isNew ? "New Agent" : "Edit Agent"} — Staff Portal</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-[#0F2E24] text-white px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/admin/dashboard")} className="text-white/70 hover:text-white"><ArrowLeft size={20} /></button>
          <span className="font-bold">{isNew ? "New Agent" : "Edit Agent"}</span>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded shadow p-8 space-y-5">
            {field("ID (no spaces)", "id")}
            {field("Full Name", "name")}
            {field("Role / Title", "role")}
            <div className="grid grid-cols-2 gap-4">
              {field("Phone", "phone")}
              {field("Email", "email")}
            </div>
            {field("Bio", "bio", true)}

            <ImageUploader
              values={form.image ? [form.image] : []}
              onChange={(paths) => set("image", paths[0] ?? "")}
              multiple={false}
              label="Profile Photo"
            />

            {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}
            <button type="submit" disabled={saving} className="bg-[#1C4C3B] text-white px-8 py-3 rounded font-bold flex items-center gap-2 hover:bg-[#0F2E24] disabled:opacity-60">
              <Save size={16} /> {saving ? "Saving…" : "Save Agent"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
