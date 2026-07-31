"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 space-y-8 w-full">
        <div className="border-b border-asphalt-2 pb-6 space-y-2">
          <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block">
            STORE POLICY
          </span>
          <h1 className="display-font text-4xl font-extrabold uppercase text-off-white">
            Return & Replacement Policy
          </h1>
          <p className="text-steel text-sm">
            Transparent policy touchpoints for Parts & Mods, Riding Gear, Electronics, and Merchandise.
          </p>
        </div>

        {/* PRD Section 4.5 Hard Rule Notice Box */}
        <div className="bg-asphalt p-6 border-l-4 border-plate-yellow space-y-3 font-mono">
          <div className="flex items-center gap-2 text-plate-yellow font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-plate-yellow" />
            <span>PARTS & MODS RETURN POLICY RULE (CONFIRMED)</span>
          </div>
          <p className="text-xs text-steel leading-relaxed">
            Parts & Mods items are <strong className="text-off-white">not eligible for return once the packaging/seal is torn or opened</strong>, regardless of whether the part was installed.
          </p>
          <div className="text-[11px] text-steel">
            Rationale: Auto/motorcycle parts packaging cannot verify installation or electrical use once opened, making unsealed parts non-resalable as new.
          </div>
        </div>

        {/* Exception — Wrong Item / Counterfeit Replacement */}
        <div className="bg-asphalt-2 p-6 border border-asphalt-2 space-y-4 font-mono text-xs">
          <h2 className="display-font text-2xl font-bold uppercase text-off-white">
            Exception — Wrong Item or Counterfeit Claim
          </h2>
          <p className="text-steel leading-relaxed font-light">
            If the packet is unsealed and you discover the product is different from what was ordered or is a counterfeit/copy, a replacement will be issued under documented proof.
          </p>

          <div className="bg-asphalt p-4 border border-steel/30 space-y-2">
            <strong className="text-plate-yellow uppercase block">Required Evidence:</strong>
            <ul className="list-disc list-inside text-steel space-y-1">
              <li>Unboxing video showing package seal before opening</li>
              <li>Clear photographs of packaging labels, serial numbers, and part markings</li>
              <li>Submission via Account Order Detail Claim Queue within 48 hours of delivery</li>
            </ul>
          </div>
        </div>

        {/* Category Specific Breakdown */}
        <div className="space-y-4 text-xs font-mono">
          <h2 className="display-font text-2xl font-bold uppercase text-off-white">
            Category Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-asphalt p-4 border border-asphalt-2 space-y-2">
              <h3 className="text-plate-yellow font-bold">Riding Gear</h3>
              <p className="text-steel">7-day size exchange supported for unused helmets, jackets, and gloves with tags intact.</p>
            </div>
            <div className="bg-asphalt p-4 border border-asphalt-2 space-y-2">
              <h3 className="text-plate-yellow font-bold">Electronics</h3>
              <p className="text-steel">Defective-on-arrival (DOA) units covered under warranty claim path within 7 days.</p>
            </div>
            <div className="bg-asphalt p-4 border border-asphalt-2 space-y-2">
              <h3 className="text-plate-yellow font-bold">Merchandise</h3>
              <p className="text-steel">7-day return policy for unused apparel and riding bags in original condition.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
