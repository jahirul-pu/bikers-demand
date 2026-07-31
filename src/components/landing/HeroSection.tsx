import React from "react";
import { Bike, ShieldCheck, ArrowRight, Wrench, CheckCircle } from "lucide-react";

interface HeroSectionProps {
  onOpenBikeModal: () => void;
  onBrowseGear: () => void;
}

export default function HeroSection({
  onOpenBikeModal,
  onBrowseGear,
}: HeroSectionProps) {
  return (
    <section className="relative bg-asphalt overflow-hidden border-b border-asphalt-2 py-12 md:py-20 lg:py-24">
      {/* Background Graphic Grid / Industrial Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e2125_1px,transparent_1px),linear-gradient(to_bottom,#1e2125_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Red Accent Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-ignition-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-asphalt-2 border border-steel/30 px-3 py-1.5 text-xs text-plate-yellow font-mono uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-ignition-red animate-pulse" />
              <span>Bangladesh's 1st Bike-Specific E-Commerce Store</span>
            </div>

            {/* Main Headline */}
            <h1 className="display-font text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase text-off-white tracking-tight leading-[0.95]">
              Shop by your bike. <br />
              <span className="text-ignition-red">Not by guesswork.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-steel-light text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Add your bike once. See only the parts, mods, and accessories that actually fit your machine — 100% confirmed compatibility guarantee.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Primary CTA */}
              <button
                onClick={onOpenBikeModal}
                className="w-full sm:w-auto bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-sm sm:text-base px-8 py-4 tracking-wider flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-ignition-red/20 group transform -skew-x-6"
              >
                <div className="transform skew-x-6 flex items-center gap-2">
                  <Bike className="w-5 h-5 stroke-[2.5]" />
                  <span>Add Your Bike</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Secondary CTA */}
              <button
                onClick={onBrowseGear}
                className="w-full sm:w-auto bg-asphalt-2 hover:bg-asphalt border border-steel/40 hover:border-steel text-off-white font-bold uppercase text-sm sm:text-base px-7 py-4 tracking-wider transition-all transform -skew-x-6"
              >
                <span className="transform skew-x-6 block">Browse All Gear</span>
              </button>
            </div>

            {/* Feature Bullets */}
            <div className="pt-6 border-t border-asphalt-2/80 grid grid-cols-3 gap-2 text-left">
              <div className="flex items-center gap-2 text-xs text-steel">
                <CheckCircle className="w-4 h-4 text-ignition-red shrink-0" />
                <span>Genuine Inventory</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-steel">
                <CheckCircle className="w-4 h-4 text-plate-yellow shrink-0" />
                <span>Zero Compatibility Risk</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-steel">
                <CheckCircle className="w-4 h-4 text-ignition-red shrink-0" />
                <span>Dhaka & BD Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-asphalt-2 border border-steel/20 p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Card Badge */}
              <div className="flex justify-between items-center border-b border-asphalt pb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-plate-yellow" />
                  <span className="display-font text-lg uppercase font-bold text-off-white">
                    Compatibility Matrix
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-asphalt px-2 py-1 text-plate-yellow border border-plate-yellow/30">
                  REAL-TIME FILTER
                </span>
              </div>

              {/* Interactive Demo Selector Mockup */}
              <div className="space-y-3 bg-asphalt p-4 border border-asphalt-2">
                <label className="text-xs text-steel uppercase font-mono block">
                  1. Select Make & Model
                </label>
                <div className="bg-asphalt-2 text-off-white px-3 py-2 text-sm border border-steel/30 flex justify-between items-center">
                  <span className="font-medium">Yamaha FZS-Fi v3 (149cc)</span>
                  <span className="text-xs text-plate-yellow">✓ Active</span>
                </div>
              </div>

              {/* Dynamic Filter Output Demo */}
              <div className="space-y-2">
                <span className="text-xs text-steel font-mono uppercase block">
                  2. Showing 48 Verified Accessories:
                </span>
                <div className="space-y-2">
                  <div className="bg-asphalt/80 p-2.5 flex items-center justify-between border-l-2 border-plate-yellow text-xs">
                    <span className="text-off-white font-medium">Racing Exhaust Slip-On</span>
                    <span className="bg-plate-yellow/20 text-plate-yellow px-1.5 py-0.5 text-[10px] font-mono">
                      EXACT FIT
                    </span>
                  </div>
                  <div className="bg-asphalt/80 p-2.5 flex items-center justify-between border-l-2 border-plate-yellow text-xs">
                    <span className="text-off-white font-medium">Chain & Sprocket Kit (428-132L)</span>
                    <span className="bg-plate-yellow/20 text-plate-yellow px-1.5 py-0.5 text-[10px] font-mono">
                      EXACT FIT
                    </span>
                  </div>
                  <div className="bg-asphalt/80 p-2.5 flex items-center justify-between border-l-2 border-plate-yellow text-xs">
                    <span className="text-off-white font-medium">Adjustable CNC Levers Set</span>
                    <span className="bg-plate-yellow/20 text-plate-yellow px-1.5 py-0.5 text-[10px] font-mono">
                      EXACT FIT
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center text-xs text-steel font-mono">
                No guessing thread pitches, socket sizes, or bolt patterns.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
