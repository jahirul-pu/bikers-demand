import React from "react";
import Link from "next/link";
import { Bike, ArrowRight, CheckCircle } from "lucide-react";

interface HeroSectionProps {
  onOpenBikeModal: () => void;
  onBrowseGear: () => void;
  selectedBike?: { brand: string; model: string; variant?: string } | null;
}

export default function HeroSection({
  onOpenBikeModal,
  onBrowseGear,
  selectedBike,
}: HeroSectionProps) {
  const bikeLabel = selectedBike
    ? `${selectedBike.brand} ${selectedBike.model}${selectedBike.variant ? ` ${selectedBike.variant}` : ""}`
    : null;
  return (
    <section className="relative bg-asphalt overflow-hidden border-b border-asphalt-2 py-12 md:py-20 lg:py-24">
      {/* Background Graphic Grid / Industrial Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--grid-line-rgb))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--grid-line-rgb))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      {/* Red Accent Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-ignition-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Content */}
          <div className="space-y-6 text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-asphalt-2 border border-asphalt-2 rounded-full px-4 py-1.5 text-xs text-plate-yellow font-medium tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-ignition-red animate-pulse" />
              <span>Bangladesh&apos;s 1st Bike-Specific E-Commerce Store</span>
            </div>

            {/* Main Headline */}
            <h1 className="display-font text-4xl sm:text-6xl lg:text-7xl font-extrabold text-off-white tracking-tight leading-[1.02]">
              Shop by your bike. <br />
              <span className="text-ignition-red">Not by guesswork.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-steel-light text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Add your bike once. See only the parts, mods, and accessories that actually fit your machine — 100% confirmed compatibility guarantee.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              {/* Primary CTA */}
              <button
                onClick={onOpenBikeModal}
                className="w-full sm:w-auto bg-ignition-red hover:bg-red-600 text-white font-semibold text-sm sm:text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all hover:-translate-y-0.5 shadow-lg shadow-ignition-red/25 group"
              >
                <Bike className="w-5 h-5 stroke-[2.5]" />
                <span>{bikeLabel ? "Change Bike" : "Add Your Bike"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary CTA — changes based on bike selection */}
              {bikeLabel ? (
                <Link
                  href="/shop?compat=1"
                  className="w-full sm:w-auto bg-plate-yellow hover:bg-plate-yellow/90 text-white font-semibold text-sm sm:text-base px-7 py-4 rounded-xl transition-all hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 shadow-lg shadow-plate-yellow/20"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Browse Compatible Gear</span>
                </Link>
              ) : (
                <Link
                  href="/shop"
                  className="w-full sm:w-auto bg-asphalt-2 hover:bg-asphalt border border-asphalt-2 text-off-white font-semibold text-sm sm:text-base px-7 py-4 rounded-xl transition-all hover:-translate-y-0.5 text-center"
                >
                  <span>Browse All Gear</span>
                </Link>
              )}
            </div>

            {/* Feature Bullets */}
            <div className="pt-6 border-t border-asphalt-2 grid grid-cols-3 gap-2 text-left">
              <div className="flex items-center gap-2 text-xs text-steel">
                <CheckCircle className="w-4 h-4 text-ignition-red shrink-0" />
                <span>Genuine Parts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-steel">
                <CheckCircle className="w-4 h-4 text-plate-yellow shrink-0" />
                <span>Zero Compatibility Risk</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-steel justify-center">
                <CheckCircle className="w-4 h-4 text-ignition-red shrink-0" />
                <span>Delivery All Over Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
