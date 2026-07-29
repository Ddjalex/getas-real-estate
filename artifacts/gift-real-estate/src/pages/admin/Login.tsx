import React, { useState } from "react";
import { useLocation } from "wouter";
import { adminLogin } from "@/lib/api";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(username, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError((err as Error).message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Staff Login — GIFT Real Estate</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded shadow-lg w-full max-w-md p-10 border-t-4 border-[#1C4C3B]">
          <div className="text-center mb-8">
            <div className="text-[#1C4C3B] font-serif text-2xl font-bold mb-1">GIFT Real Estate</div>
            <p className="text-gray-500 text-sm">Staff Portal — Authorised Access Only</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Username</label>
              <input
                required
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-[#1C4C3B] focus:ring-1 focus:ring-[#1C4C3B]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 pr-11 focus:outline-none focus:border-[#1C4C3B] focus:ring-1 focus:ring-[#1C4C3B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-[#1C4C3B] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C4C3B] text-white py-3 rounded font-bold hover:bg-[#0F2E24] transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-8">This portal is for authorised GIFT staff only. Unauthorised access is prohibited.</p>
        </div>
      </div>
    </>
  );
}
