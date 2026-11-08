import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PolicyNav from "@/components/common/PolicyNav";
import { ShieldCheck, ShieldAlert, Award, FileCheck, Clock, CheckCircle2, XCircle, PhoneCall, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Warranty Information — Bikers Demand Bangladesh",
  description: "Category-by-category warranty terms for Parts & Mods, Engine Oils, Electronics, and Riding Gear. 1-Year helmet manufacturer warranties and 6-month electronic coverage rules.",
};

export default function WarrantyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />
      <PolicyNav />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10 w-full">
        {/* Header Banner */}
        <div className="border-b border-asphalt-2 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guaranteed Genuine &amp; Direct Manufacturer Warranties</span>
          </div>
          <h1 className="display-font text-4xl sm:text-5xl font-extrabold uppercase text-off-white tracking-wide">
            Warranty Information &amp; Coverage
          </h1>
          <p className="text-steel text-sm sm:text-base leading-relaxed max-w-3xl">
            Every product sold at Bikers Demand is sourced from authorized global brand distributors and factory suppliers. We maintain transparent, legally binding warranty terms categorized strictly by product type.
          </p>
        </div>

        {/* PRD Section 4.6 Category Breakdown Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="display-font text-2xl sm:text-3xl font-extrabold uppercase text-off-white">
              Category Coverage Matrix
            </h2>
            <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest hidden sm:inline">
              PRD Section 4.6
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
            {/* 1. Riding Gear & Helmets */}
            <div className="bg-asphalt-2 border-2 border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-lg shadow-emerald-500/5">
              <div className="flex items-center justify-between border-b border-asphalt pb-3">
                <div className="flex items-center gap-2 text-off-white font-bold text-sm">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span className="display-font text-xl uppercase">Helmets &amp; Riding Gear</span>
                </div>
                <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] px-2.5 py-1 rounded-full font-bold">
                  1-YEAR WARRANTY
                </span>
              </div>
              <p className="text-steel-light leading-relaxed">
                Brand helmets (LS2, MT Helmets, Bilmola, SMK) carry a <strong className="text-off-white">1-Year Official Manufacturer Warranty</strong> against structural shell defects and EPS liner bonding failure.
              </p>
              <div className="space-y-2 pt-1 border-t border-asphalt/80 text-[11px]">
                <div className="flex items-start gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span><strong>Covered:</strong> Shell cracking without impact, visor ratchet hinge failure, chin-strap buckle failure.</span>
                </div>
                <div className="flex items-start gap-2 text-steel">
                  <XCircle className="w-4 h-4 text-ignition-red shrink-0 mt-0.5" />
                  <span><strong>Not Covered:</strong> Crash impact damage, scratch/stone chip on visors, normal foam aging from sweat.</span>
                </div>
              </div>
            </div>

            {/* 2. Select Electronics */}
            <div className="bg-asphalt-2 border-2 border-plate-yellow/40 rounded-2xl p-6 space-y-4 shadow-lg shadow-plate-yellow/5">
              <div className="flex items-center justify-between border-b border-asphalt pb-3">
                <div className="flex items-center gap-2 text-off-white font-bold text-sm">
                  <Zap className="w-5 h-5 text-plate-yellow" />
                  <span className="display-font text-xl uppercase">Select Electronics</span>
                </div>
                <span className="bg-plate-yellow/15 text-plate-yellow border border-plate-yellow/30 text-[10px] px-2.5 py-1 rounded-full font-bold">
                  6 MONTHS LIMITED
                </span>
              </div>
              <p className="text-steel-light leading-relaxed">
                High-grade LED auxiliary fog lights, smart GPS trackers, digital tire pressure monitors (TPMS), and motorcycle batteries carry a <strong className="text-off-white">6-Month Service Warranty</strong>.
              </p>
              <div className="space-y-2 pt-1 border-t border-asphalt/80 text-[11px]">
                <div className="flex items-start gap-2 text-plate-yellow">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span><strong>Covered:</strong> Internal LED driver failure, factory circuit burnout under standard 12V DC input.</span>
                </div>
                <div className="flex items-start gap-2 text-steel">
                  <XCircle className="w-4 h-4 text-ignition-red shrink-0 mt-0.5" />
                  <span><strong>Not Covered:</strong> High-pressure waterjet intrusion inside seals, cut wire harnesses, overvoltage.</span>
                </div>
              </div>
            </div>

            {/* 3. Parts & Mods */}
            <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-asphalt pb-3">
                <div className="flex items-center gap-2 text-off-white font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 text-steel" />
                  <span className="display-font text-xl uppercase">Parts &amp; Performance Mods</span>
                </div>
                <span className="bg-asphalt text-steel border border-steel/20 text-[10px] px-2.5 py-1 rounded-full font-bold">
                  NO WARRANTY
                </span>
              </div>
              <p className="text-steel-light leading-relaxed">
                Mechanical spare parts, performance slip-on exhausts, brake pads, CNC levers, foot pegs, and chain-sprocket kits carry <strong className="text-off-white">no operational warranty</strong>.
              </p>
              <div className="space-y-2 pt-1 border-t border-asphalt/80 text-[11px]">
                <div className="text-steel">
                  <strong>Rationale:</strong> Operating life depends entirely on motorcycle tuning, rider clutching style, chain tensioning, and mechanic skill.
                </div>
                <div className="flex items-start gap-2 text-plate-yellow">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Guaranteed 100% genuine with factory fitment verification.</span>
                </div>
              </div>
            </div>

            {/* 4. Engine Oils & Fluids */}
            <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-asphalt pb-3">
                <div className="flex items-center gap-2 text-off-white font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 text-steel" />
                  <span className="display-font text-xl uppercase">Engine Oils &amp; Fluids</span>
                </div>
                <span className="bg-asphalt text-steel border border-steel/20 text-[10px] px-2.5 py-1 rounded-full font-bold">
                  NO WARRANTY
                </span>
              </div>
              <p className="text-steel-light leading-relaxed">
                Consumable fluids, fully synthetic 4T oils (Motul, Mobil, Liqui Moly), radiator coolants, and brake fluids carry <strong className="text-off-white">no warranty</strong> once foil seal is opened.
              </p>
              <div className="space-y-2 pt-1 border-t border-asphalt/80 text-[11px]">
                <div className="text-steel">
                  <strong>Authenticity Guarantee:</strong> Every batch is directly imported with authentic QR verification codes on the bottle cap.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Warranty Claim Filing Process */}
        <div className="bg-asphalt-2 border border-steel/25 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="display-font text-2xl font-bold uppercase text-off-white">
                How to File a Warranty Claim
              </h2>
              <p className="text-xs text-steel font-mono">Turnaround time: 7 to 10 business days across Bangladesh</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-asphalt p-4 rounded-xl border border-steel/15 space-y-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <span className="text-off-white font-bold block">Locate Invoice</span>
              <p className="text-steel-light text-[11px]">
                Have your Bikers Demand order invoice (A5 slip) or account order number ready.
              </p>
            </div>

            <div className="bg-asphalt p-4 rounded-xl border border-steel/15 space-y-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <span className="text-off-white font-bold block">Send Fault Proof</span>
              <p className="text-steel-light text-[11px]">
                Email high-res photos and video showing the manufacturing defect to <strong className="text-off-white">claims@bikersdemand.com</strong>.
              </p>
            </div>

            <div className="bg-asphalt p-4 rounded-xl border border-steel/15 space-y-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <span className="text-off-white font-bold block">Fulfillment Inspection</span>
              <p className="text-steel-light text-[11px]">
                Courier rider collects the item for testing at our Dhaka workshop.
              </p>
            </div>

            <div className="bg-asphalt p-4 rounded-xl border border-steel/15 space-y-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <span className="text-off-white font-bold block">Replacement Dispatch</span>
              <p className="text-steel-light text-[11px]">
                Upon approval, a brand-new unit is dispatched via Pathao priority logistics.
              </p>
            </div>
          </div>
        </div>

        {/* Support Hotline CTA */}
        <div className="bg-gradient-to-r from-asphalt-2 to-asphalt border border-emerald-500/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="display-font text-2xl font-bold uppercase text-off-white">
              Have Questions About a Product Warranty?
            </div>
            <p className="text-xs text-steel">
              Our technical support team can check warranty status by SKU or invoice ID.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+8809612245377"
              className="bg-emerald-500 text-white hover:bg-emerald-600 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Talk to Claims Desk</span>
            </a>
            <Link
              href="/returns"
              className="border border-steel/30 text-off-white hover:bg-asphalt px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>Return Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
