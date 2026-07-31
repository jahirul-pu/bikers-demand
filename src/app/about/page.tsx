"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import TrustSection from "@/components/landing/TrustSection";
import { Bike, ShieldCheck, Truck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 space-y-10">
        <div className="border-b border-asphalt-2 pb-6 space-y-2">
          <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block">
            ABOUT BIKERS DEMAND
          </span>
          <h1 className="display-font text-4xl sm:text-5xl font-extrabold uppercase text-off-white tracking-wide">
            Shop by your bike. Not by guesswork.
          </h1>
          <p className="text-steel text-sm leading-relaxed">
            Bangladesh's dedicated online-only motorcycle accessories store, carrying 100% owned inventory across riding gear, spare parts, electronics, and merchandise.
          </p>
        </div>

        <div className="space-y-6 text-sm text-steel-light leading-relaxed font-light">
          <h2 className="display-font text-2xl font-bold uppercase text-off-white">
            Our Vision & Inventory Model
          </h2>
          <p>
            Bangladesh's motorcycle ownership base is growing rapidly, but riders sourcing accessories face a fragmented market: scattered local shops with inconsistent stock, limited genuine options, and no dedicated online destination offering breadth, trust, and convenient delivery.
          </p>
          <p>
            Bikers Demand was built from day one to solve this problem with an owned inventory model — no dropshipping, no unverified third-party sellers, and no estimated stock. Every item listed on our site is physically stocked in our Dhaka fulfillment hub, ready for instant packing and shipping.
          </p>

          <h2 className="display-font text-2xl font-bold uppercase text-off-white pt-4">
            Market Differentiator: Confirmed Bike Compatibility
          </h2>
          <p>
            No other motorcycle accessories site in Bangladesh offers a model-specific bike compatibility matrix. At Bikers Demand, you select your motorcycle make, model, and generation once — and our store automatically filters out parts that don't fit.
          </p>
        </div>

        <TrustSection />
      </main>

      <Footer />
    </div>
  );
}
