"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">
            Content Management
          </p>
          <h1 className="font-mono text-2xl font-bold text-white tracking-tight">
            END Design Lab
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="font-mono text-sm font-semibold text-white/70 mb-6 uppercase tracking-widest">
            Admin Access
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="cms-password"
                className="font-mono text-xs text-white/40 uppercase tracking-widest"
              >
                Password
              </label>
              <input
                id="cms-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
                className="bg-white/[0.06] border border-white/[0.1] rounded-lg px-4 py-3 text-white font-mono text-sm placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
              />
            </div>

            {error && (
              <p className="font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              id="cms-login-btn"
              className="bg-white text-black font-mono font-bold text-sm px-6 py-3.5 rounded-lg hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Authenticating…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-[10px] text-white/20 mt-6 uppercase tracking-widest">
          END Design Lab © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
