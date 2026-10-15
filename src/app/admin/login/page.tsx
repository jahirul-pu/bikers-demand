"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [from, setFrom] = useState("/admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("from");
    if (target && target.startsWith("/admin")) setFrom(target);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        setError(json?.error || "Sign in failed. Please try again.");
        setLoading(false);
        return;
      }
      router.replace(from);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-asphalt text-off-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2 text-steel text-xs">
          <ShieldCheck className="w-4 h-4 text-ignition-red" />
          <span>Restricted area — administrators only</span>
        </div>

        <div className="bg-asphalt-2 border border-asphalt-2 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2 border-b border-asphalt pb-4">
            <div className="w-12 h-12 bg-ignition-red flex items-center justify-center rounded-xl mx-auto text-white shadow-sm shadow-ignition-red/30">
              <Lock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-plate-yellow font-semibold tracking-widest text-[10px] uppercase block">
              Admin Control Panel
            </span>
            <h1 className="display-font text-2xl font-extrabold text-off-white">
              Bikers Demand Admin
            </h1>
            <p className="text-steel text-xs">
              Sign in with your administrator credentials to continue.
            </p>
          </div>

          {error && (
            <div className="bg-ignition-red/15 border border-ignition-red/60 text-ignition-red p-3 flex items-center gap-2 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-steel block text-xs font-semibold">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 rounded-xl p-3 text-off-white pl-10 focus:outline-none focus:border-ignition-red"
                />
                <Mail className="w-4 h-4 text-steel absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-steel block text-xs font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 rounded-xl p-3 text-off-white pl-10 focus:outline-none focus:border-ignition-red"
                />
                <Lock className="w-4 h-4 text-steel absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ignition-red hover:bg-red-600 disabled:opacity-70 text-white font-semibold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-ignition-red/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? "Verifying..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-asphalt text-xs text-steel">
            <Link href="/" className="hover:text-plate-yellow font-semibold">
              ← Back to store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
