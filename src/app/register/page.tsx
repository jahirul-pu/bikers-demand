"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { User, Lock, Phone, Mail, Bike, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bikeBrand, setBikeBrand] = useState("Yamaha");
  const [bikeModel, setBikeModel] = useState("FZS-Fi v3");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Simulate successful registration & garage bike save
      router.push("/account/garage");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white font-mono text-xs">
      <Header />
      <Navigation />

      <main className="flex-grow flex items-center justify-center max-w-lg mx-auto px-4 py-12 w-full">
        <div className="bg-asphalt-2 p-8 border border-steel/30 space-y-6 w-full shadow-2xl">
          
          {/* Header */}
          <div className="space-y-2 text-center border-b border-asphalt pb-4">
            <div className="w-12 h-12 bg-plate-yellow flex items-center justify-center rounded transform -skew-x-12 mx-auto text-asphalt mb-2">
              <Bike className="w-7 h-7 transform skew-x-12 stroke-[2.5]" />
            </div>
            <span className="text-plate-yellow font-bold uppercase tracking-widest text-[10px] block">
              JOIN BIKERS DEMAND
            </span>
            <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
              Create Rider Account
            </h1>
            <p className="text-steel text-xs font-light">
              Save your bike once for 1-click compatibility filtering across our entire catalog.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-ignition-red/20 border border-ignition-red text-ignition-red p-3 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-steel block font-bold">
                Full Name <span className="text-ignition-red">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 p-3 text-off-white pl-10 focus:outline-none focus:border-ignition-red"
                />
                <User className="w-4 h-4 text-steel absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-steel block font-bold">
                  Phone Number <span className="text-ignition-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-3 text-off-white pl-10 focus:outline-none focus:border-ignition-red"
                  />
                  <Phone className="w-4 h-4 text-steel absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-steel block font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="tanvir@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-3 text-off-white pl-10 focus:outline-none focus:border-ignition-red"
                  />
                  <Mail className="w-4 h-4 text-steel absolute left-3 top-3.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-steel block font-bold">
                Create Password <span className="text-ignition-red">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 p-3 text-off-white pl-10 focus:outline-none focus:border-ignition-red"
                />
                <Lock className="w-4 h-4 text-steel absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Initial Garage Bike Selection */}
            <div className="p-4 bg-asphalt border border-plate-yellow/40 space-y-3">
              <span className="text-plate-yellow font-bold uppercase text-[11px] flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-plate-yellow" />
                Save Primary Bike to My Garage:
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-steel block text-[10px]">Brand / Make</label>
                  <select
                    value={bikeBrand}
                    onChange={(e) => setBikeBrand(e.target.value)}
                    className="w-full bg-asphalt-2 border border-steel/30 p-2 text-off-white"
                  >
                    <option value="Yamaha">Yamaha</option>
                    <option value="Honda">Honda</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Bajaj">Bajaj</option>
                    <option value="TVS">TVS</option>
                  </select>
                </div>

                <div>
                  <label className="text-steel block text-[10px]">Model & Variant</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FZS-Fi v3"
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                    className="w-full bg-asphalt-2 border border-steel/30 p-2 text-off-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-xs py-3.5 text-center tracking-wider block transition-all transform -skew-x-6 shadow-lg cursor-pointer mt-2"
            >
              <span className="transform skew-x-6 flex items-center justify-center gap-2">
                <span>{isLoading ? "CREATING ACCOUNT..." : "CREATE MY RIDER ACCOUNT"}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </form>

          {/* Footer Login Link */}
          <div className="text-center pt-2 border-t border-asphalt text-xs text-steel">
            Already have an account?{" "}
            <Link href="/login" className="text-plate-yellow hover:underline font-bold">
              Sign In Here →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
