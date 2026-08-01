import React from "react";
import { Bike, ArrowRight, CheckCircle } from "lucide-react";

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
        <div className="max-w-4xl mx-auto">
          {/* Hero Content */}
          <div className="space-y-6 text-center">
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
            <p className="text-steel-light text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Add your bike once. See only the parts, mods, and accessories that actually fit your machine — 100% confirmed compatibility guarantee.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
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
                <span>Genuine Parts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-steel">
                <CheckCircle className="w-4 h-4 text-plate-yellow shrink-0" />
                <span>Zero Compatibility Risk</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-steel justify-center">
                <CheckCircle className="w-4 h-4 text-ignition-red shrink-0" />
                <span>Home Delivery All Over Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
