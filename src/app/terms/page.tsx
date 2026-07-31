"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 space-y-8 w-full">
        <div className="border-b border-asphalt-2 pb-6 space-y-2">
          <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block">
            LEGAL
          </span>
          <h1 className="display-font text-4xl font-extrabold uppercase text-off-white">
            Terms of Service
          </h1>
        </div>

        <div className="space-y-4 font-mono text-xs text-steel leading-relaxed">
          <h2 className="display-font text-2xl font-bold uppercase text-off-white">
            1. Display Pricing & VAT
          </h2>
          <p>
            All display prices on Bikers Demand are listed in Bangladeshi Taka (BDT / Tk) and are VAT-inclusive per Bangladesh tax regulations.
          </p>

          <h2 className="display-font text-2xl font-bold uppercase text-off-white pt-4">
            2. Owned Inventory & Stock Accuracy
          </h2>
          <p>
            All products listed on Bikers Demand represent physical owned inventory stocked in our Dhaka fulfillment hub.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
