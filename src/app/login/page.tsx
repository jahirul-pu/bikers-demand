"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { User, Lock, Phone, ArrowRight, CheckCircle2, Bike, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneOrEmail: phoneOrEmail.trim(),
          password,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setErrorMsg(json.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      const userToSave = {
        id: json.data.id,
        name: json.data.name,
        phone: json.data.phone,
        email: json.data.email,
        phoneOrEmail: json.data.phone || json.data.email,
        loggedInAt: new Date().toISOString(),
      };

      localStorage.setItem("bikers_demand_user", JSON.stringify(userToSave));
      window.dispatchEvent(new Event("storage"));

      // Also sync user's garage if available
      try {
        const garageRes = await fetch("/api/user/garage");
        const garageJson = await garageRes.json();
        if (garageJson.success && Array.isArray(garageJson.data) && garageJson.data.length > 0) {
          const primary = garageJson.data.find((b: any) => b.isPrimary) || garageJson.data[0];
          if (primary?.bikeModel) {
            localStorage.setItem("bd_selected_bike", JSON.stringify({
              brand: primary.bikeModel.brand,
              model: primary.bikeModel.model,
              variant: primary.bikeModel.variant,
            }));
            window.dispatchEvent(new Event("storage"));
          }
        }
      } catch { /* non-fatal */ }

      router.push("/account/garage");
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white font-mono text-xs">
      <Header />
      <Navigation />

      <main className="flex-grow flex items-center justify-center max-w-md mx-auto px-4 py-16 w-full">
        <div className="bg-asphalt-2 p-8 border border-asphalt-2 rounded-3xl space-y-6 w-full shadow-xl">
          
          {/* Header */}
          <div className="space-y-2 text-center border-b border-asphalt pb-4">
            <div className="w-12 h-12 bg-ignition-red flex items-center justify-center rounded-xl mx-auto text-white mb-2 shadow-sm shadow-ignition-red/30">
              <Bike className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-plate-yellow font-semibold tracking-widest text-[10px] uppercase block">
              Rider Authentication
            </span>
            <h1 className="display-font text-3xl font-extrabold text-off-white">
              Sign In to Bikers Demand
            </h1>
            <p className="text-steel text-xs font-light">
              Access your saved garage bikes, order tracking, and compatible parts recommendations.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-ignition-red/20 border border-ignition-red text-ignition-red p-3 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-steel block font-bold">
                Phone Number or Email <span className="text-ignition-red">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="017xxxxxxxx or rider@example.com"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 p-3 text-off-white pl-10 focus:outline-none focus:border-plate-yellow"
                />
                <Phone className="w-4 h-4 text-steel absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-steel font-bold">
                  Password <span className="text-ignition-red">*</span>
                </label>
                <a href="#forgot" className="text-steel hover:text-plate-yellow text-[11px] underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 p-3 text-off-white pl-10 focus:outline-none focus:border-plate-yellow"
                />
                <Lock className="w-4 h-4 text-steel absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ignition-red hover:bg-red-600 text-white font-semibold text-sm py-3.5 text-center rounded-xl transition-all shadow-lg shadow-ignition-red/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to My Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Register Link */}
          <div className="text-center pt-2 border-t border-asphalt text-xs text-steel">
            Don't have a rider account?{" "}
            <Link href="/register" className="text-plate-yellow hover:underline font-bold">
              Create New Account →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
