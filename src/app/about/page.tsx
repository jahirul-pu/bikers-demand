import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PolicyNav from "@/components/common/PolicyNav";
import TrustSection from "@/components/landing/TrustSection";
import { Bike, ShieldCheck, Truck, Package, Award, CheckCircle2, MapPin, ArrowRight, PhoneCall } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — Bikers Demand | Bangladesh's Bike-Specific Motorcycle Accessories Store",
  description: "Learn about Bikers Demand — Bangladesh's dedicated motorcycle accessories store with owned inventory, model-specific bike compatibility, certified helmets (DOT/ECE), and nationwide Pathao COD delivery.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />
      <PolicyNav />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12 w-full">
        {/* Hero Section */}
        <div className="border-b border-asphalt-2 pb-8 space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plate-yellow/10 border border-plate-yellow/30 text-plate-yellow text-xs font-mono font-semibold uppercase tracking-widest">
            <Bike className="w-3.5 h-3.5" />
            <span>Our Mission &amp; Infrastructure</span>
          </div>
          <h1 className="display-font text-4xl sm:text-6xl font-extrabold uppercase text-off-white tracking-wide leading-tight">
            Shop by your bike. <br className="hidden sm:inline" />
            <span className="text-ignition-red">Not by guesswork.</span>
          </h1>
          <p className="text-steel text-sm sm:text-base leading-relaxed max-w-3xl">
            Bikers Demand is Bangladesh&apos;s first motorcycle accessories destination engineered around your specific bike model. We pair 100% owned inventory with a verified compatibility matrix so riders get parts that fit on the first try.
          </p>
        </div>

        {/* 4 Core Operational Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 space-y-3 hover:border-steel/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-plate-yellow/10 text-plate-yellow flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="display-font text-xl font-bold uppercase text-off-white">
              100% Owned Inventory
            </h3>
            <p className="text-xs text-steel-light leading-relaxed">
              No dropshipping. No ghost listings. Every product you see online is physically stored in our Tejgaon warehouse ready to pack.
            </p>
          </div>

          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 space-y-3 hover:border-steel/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-ignition-red/10 text-ignition-red flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <h3 className="display-font text-xl font-bold uppercase text-off-white">
              Model Compatibility
            </h3>
            <p className="text-xs text-steel-light leading-relaxed">
              Our relational garage database maps parts to exact bike make, model, and year variants to eliminate compatibility mismatches.
            </p>
          </div>

          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 space-y-3 hover:border-steel/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="display-font text-xl font-bold uppercase text-off-white">
              Certified Helmets Only
            </h3>
            <p className="text-xs text-steel-light leading-relaxed">
              We reject uncertified roadside helmets. Every helmet SKU is certified under strict European ECE 22.06 or US DOT standards.
            </p>
          </div>

          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 space-y-3 hover:border-steel/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-steel/10 text-plate-yellow flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="display-font text-xl font-bold uppercase text-off-white">
              Nationwide Pathao COD
            </h3>
            <p className="text-xs text-steel-light leading-relaxed">
              Flat Tk 60 in Dhaka, Tk 130 nationwide. Cash on Delivery supported across all 64 districts with 2:00 PM same-day dispatch.
            </p>
          </div>
        </div>

        {/* The Bangladesh Motorcycle Market Problem & Solution */}
        <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest font-bold">
              The Story Behind Bikers Demand
            </span>
            <h2 className="display-font text-3xl font-extrabold uppercase text-off-white">
              Solving the Frustrations of Bangladeshi Riders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-steel-light leading-relaxed font-light">
            <div className="space-y-4">
              <h3 className="text-off-white font-semibold text-base flex items-center gap-2">
                <span className="text-ignition-red">✕</span> The Fragmented Roadside Market
              </h3>
              <p>
                Bangladesh&apos;s motorcycle ownership base has exploded over the past decade. Yet, finding genuine riding gear and performance parts remains an arduous experience: scattered local shops, uncertain authenticity, no verified returns, and frequent cases of buying parts that turn out not to fit your bike&apos;s specific chassis.
              </p>
              <p>
                Riders were forced to rely on hearsay from mechanics or wait weeks for unverified overseas imports with zero post-purchase warranty or support.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-off-white font-semibold text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> The Bikers Demand Standard
              </h3>
              <p>
                We built Bikers Demand from the ground up to solve this with trust, data, and owned inventory. When you select your bike on Bikers Demand, you don&apos;t need to cross-reference mechanic forums — our engine only presents items engineered to fit your machine.
              </p>
              <p>
                Because we own our warehouse stock, orders placed before 2:00 PM leave our Dhaka dispatch hub on the same business day, protected by professional unboxing replacement guarantees.
              </p>
            </div>
          </div>
        </div>

        {/* Fulfillment Center & Operation Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
          <div className="bg-asphalt-2 border border-steel/20 rounded-2xl p-5 space-y-1">
            <span className="display-font text-3xl sm:text-4xl font-extrabold text-plate-yellow">100%</span>
            <span className="text-[11px] text-steel block uppercase tracking-wider">Owned Stock</span>
          </div>
          <div className="bg-asphalt-2 border border-steel/20 rounded-2xl p-5 space-y-1">
            <span className="display-font text-3xl sm:text-4xl font-extrabold text-off-white">64</span>
            <span className="text-[11px] text-steel block uppercase tracking-wider">Districts Covered</span>
          </div>
          <div className="bg-asphalt-2 border border-steel/20 rounded-2xl p-5 space-y-1">
            <span className="display-font text-3xl sm:text-4xl font-extrabold text-emerald-400">2:00 PM</span>
            <span className="text-[11px] text-steel block uppercase tracking-wider">Same-Day Cutoff</span>
          </div>
          <div className="bg-asphalt-2 border border-steel/20 rounded-2xl p-5 space-y-1">
            <span className="display-font text-3xl sm:text-4xl font-extrabold text-ignition-red">ECE / DOT</span>
            <span className="text-[11px] text-steel block uppercase tracking-wider">Helmet Standard</span>
          </div>
        </div>

        {/* Trust Signals Section */}
        <TrustSection />

        {/* Warehouse Location & Contact Strip */}
        <div className="bg-gradient-to-r from-asphalt-2 to-asphalt border border-plate-yellow/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-plate-yellow font-mono text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Dhaka Central Operations Hub</span>
            </div>
            <div className="display-font text-2xl font-bold uppercase text-off-white">
              Tejgaon Industrial Area, Dhaka-1208
            </div>
            <p className="text-xs text-steel">
              Customer Support Helpline: +880 9612-BIKERS | Saturday – Thursday, 10 AM – 8 PM
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="bg-ignition-red text-white hover:bg-red-600 px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md shadow-ignition-red/30"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
