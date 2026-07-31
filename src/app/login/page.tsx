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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      try {
        localStorage.setItem(
          "bikers_demand_user",
          JSON.stringify({
            name: "Rider User",
            phoneOrEmail: phoneOrEmail,
            loggedInAt: new Date().toISOString(),
          })
        );
      } catch (e) {
        console.error(e);
      }
      // Redirect to garage account area
      router.push("/account/garage");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white font-mono text-xs">
      <Header />
      <Navigation />

      <main className="flex-grow flex items-center justify-center max-w-md mx-auto px-4 py-16 w-full">
        <div className="bg-asphalt-2 p-8 border border-steel/30 space-y-6 w-full shadow-2xl">
          
          {/* Header */}
          <div className="space-y-2 text-center border-b border-asphalt pb-4">
            <div className="w-12 h-12 bg-ignition-red flex items-center justify-center rounded transform -skew-x-12 mx-auto text-asphalt mb-2">
              <Bike className="w-7 h-7 transform skew-x-12 stroke-[2.5]" />
            </div>
            <span className="text-plate-yellow font-bold uppercase tracking-widest text-[10px] block">
              RIDER AUTHENTICATION
            </span>
            <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
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
                  className="w-full bg-asphalt border border-steel/30 p-3 text-off-white pl-10 focus:outline-none focus:border-ignition-red"
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
                  className="w-full bg-asphalt border border-steel/30 p-3 text-off-white pl-10 focus:outline-none focus:border-ignition-red"
                />
                <Lock className="w-4 h-4 text-steel absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-xs py-3.5 text-center tracking-wider block transition-all transform -skew-x-6 shadow-lg cursor-pointer mt-2"
            >
              <span className="transform skew-x-6 flex items-center justify-center gap-2">
                <span>{isLoading ? "AUTHENTICATING..." : "SIGN IN TO MY ACCOUNT"}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
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
