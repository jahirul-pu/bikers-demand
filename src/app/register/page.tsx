"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { User, Lock, Phone, Mail, Bike, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { DBBike } from "@/types/db";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registeredBikes, setRegisteredBikes] = useState<DBBike[]>([]);
  const [bikeBrand, setBikeBrand] = useState("Yamaha");
  const [bikeModel, setBikeModel] = useState("FZS-Fi v3");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bikes")
      .then((res) => res.json())
      .then((bikes: DBBike[]) => {
        setRegisteredBikes(bikes);
        if (bikes.length > 0) {
          setBikeBrand(bikes[0].brand);
          setBikeModel(bikes[0].model);
        }
      })
      .catch(() => {
        // silent fail
      });
  }, []);

  const availableBrands = Array.from(new Set(registeredBikes.map((b) => b.brand)));
  const availableModels = registeredBikes.filter((b) => b.brand === bikeBrand);

  const handleBrandChange = (brand: string) => {
    setBikeBrand(brand);
    const modelsForBrand = registeredBikes.filter((b) => b.brand === brand);
    if (modelsForBrand.length > 0) {
      setBikeModel(modelsForBrand[0].model);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const selected = registeredBikes.find((b) => b.brand === bikeBrand && b.model === bikeModel);

      const res = await fetch("/api/auth/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          password,
          bikeModelId: selected?.id,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setErrorMsg(json.error || "Registration failed. Please check your details.");
        setIsLoading(false);
        return;
      }

      const userToSave = {
        name: json.data.name,
        phone: json.data.phone,
        email: json.data.email,
        phoneOrEmail: json.data.phone || json.data.email,
        bikeBrand,
        bikeModel,
        registeredAt: new Date().toISOString(),
      };

      localStorage.setItem("bikers_demand_user", JSON.stringify(userToSave));
      if (selected) {
        localStorage.setItem("bd_selected_bike", JSON.stringify({
          brand: selected.brand,
          model: selected.model,
          variant: selected.variant,
        }));
      }
      window.dispatchEvent(new Event("storage"));
      router.push("/account/garage");
    } catch (err: any) {
      console.error("Registration error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white font-mono text-xs">
      <Header />
      <Navigation />

      <main className="flex-grow flex items-center justify-center max-w-lg mx-auto px-4 py-12 w-full">
        <div className="bg-asphalt-2 p-8 border border-asphalt-2 rounded-3xl space-y-6 w-full shadow-xl">
          
          {/* Header */}
          <div className="space-y-2 text-center border-b border-asphalt pb-4">
            <div className="w-12 h-12 bg-plate-yellow flex items-center justify-center rounded-xl mx-auto text-white mb-2 shadow-sm shadow-plate-yellow/30">
              <Bike className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-plate-yellow font-semibold tracking-widest text-[10px] uppercase block">
              Join Bikers Demand
            </span>
            <h1 className="display-font text-3xl font-extrabold text-off-white">
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
                  className="w-full bg-asphalt border border-steel/30 p-3 text-off-white pl-10 focus:outline-none focus:border-plate-yellow"
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
                    className="w-full bg-asphalt border border-steel/30 p-3 text-off-white pl-10 focus:outline-none focus:border-plate-yellow"
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
                    className="w-full bg-asphalt border border-steel/30 p-3 text-off-white pl-10 focus:outline-none focus:border-plate-yellow"
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
                  className="w-full bg-asphalt border border-steel/30 p-3 text-off-white pl-10 focus:outline-none focus:border-plate-yellow"
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
                  <label className="text-steel block text-[10px] font-bold">Registered Brand</label>
                  <select
                    value={bikeBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="w-full bg-asphalt-2 border border-steel/30 p-2 text-off-white focus:border-plate-yellow"
                  >
                    {availableBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-steel block text-[10px] font-bold">Registered Model</label>
                  <select
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                    className="w-full bg-asphalt-2 border border-steel/30 p-2 text-off-white focus:border-plate-yellow"
                  >
                    {availableModels.map((b) => (
                      <option key={b.id} value={b.model}>
                        {b.model} ({b.displacementCc} cc)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ignition-red hover:bg-red-600 text-white font-semibold text-sm py-3.5 text-center rounded-xl transition-all shadow-lg shadow-ignition-red/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isLoading ? "Creating account..." : "Create My Rider Account"}</span>
              <ArrowRight className="w-4 h-4" />
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
