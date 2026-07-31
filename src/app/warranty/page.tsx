"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, ShieldAlert } from "lucide-react";

export default function WarrantyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 space-y-8 w-full">
        <div className="border-b border-asphalt-2 pb-6 space-y-2">
          <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block">
            GUARANTEE & WARRANTY
          </span>
          <h1 className="display-font text-4xl font-extrabold uppercase text-off-white">
            Warranty Policy
          </h1>
          <p className="text-steel text-sm">
            Explicit category-by-category warranty terms across all products.
          </p>
        </div>

        {/* PRD Section 4.6 Explicit Terms Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="bg-asphalt p-6 border border-asphalt-2 space-y-3">
            <div className="flex items-center gap-2 text-steel-light font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-steel" />
              <span>Parts & Mods (No Warranty)</span>
            </div>
            <p className="text-steel leading-relaxed">
              Mechanical spare parts, exhausts, brake pads, levers, foot pegs, and chain sprocket kits carry <strong className="text-off-white">no warranty</strong> on any item in this category.
            </p>
          </div>

          <div className="bg-asphalt p-6 border border-asphalt-2 space-y-3">
            <div className="flex items-center gap-2 text-steel-light font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-steel" />
              <span>Engine Oils & Fluids (No Warranty)</span>
            </div>
            <p className="text-steel leading-relaxed">
              Engine oil, brake fluids, and lubricants carry <strong className="text-off-white">no warranty</strong> once seals are broken.
            </p>
          </div>

          <div className="bg-asphalt p-6 border border-plate-yellow/40 space-y-3">
            <div className="flex items-center gap-2 text-plate-yellow font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-plate-yellow" />
              <span>Electronics & Lighting (Select Items)</span>
            </div>
            <p className="text-steel leading-relaxed">
              Electronics carry no warranty by default, except select designated subcategories (e.g. motorcycle batteries, high-beam LED fog light sets) which carry explicitly listed replacement warranties (e.g. 6 Months).
            </p>
          </div>

          <div className="bg-asphalt p-6 border border-plate-yellow/40 space-y-3">
            <div className="flex items-center gap-2 text-plate-yellow font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-plate-yellow" />
              <span>Riding Gear & Helmets</span>
            </div>
            <p className="text-steel leading-relaxed">
              Helmets and technical riding jackets carry 1-Year Manufacturer Warranties covering structural shell and stitching defects.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
