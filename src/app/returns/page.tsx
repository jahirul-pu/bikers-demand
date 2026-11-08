import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PolicyNav from "@/components/common/PolicyNav";
import { RotateCcw, AlertTriangle, ShieldCheck, Video, Clock, CheckCircle2, XCircle, PhoneCall, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Return & Replacement Policy — Bikers Demand Bangladesh",
  description: "Official return and replacement policy for Bikers Demand. Category-specific rules for Parts & Mods, Riding Gear size exchanges, and 48-hour counterfeit claim procedures.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />
      <PolicyNav />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10 w-full">
        {/* Header Banner */}
        <div className="border-b border-asphalt-2 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plate-yellow/10 border border-plate-yellow/30 text-plate-yellow text-xs font-mono font-semibold uppercase tracking-widest">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Store Customer Protection &amp; Return Terms</span>
          </div>
          <h1 className="display-font text-4xl sm:text-5xl font-extrabold uppercase text-off-white tracking-wide">
            Return &amp; Replacement Policy
          </h1>
          <p className="text-steel text-sm sm:text-base leading-relaxed max-w-3xl">
            At Bikers Demand, we guarantee 100% genuine motorcycle gear and parts. Because motorcycle parts directly affect rider safety and mechanical reliability, our return policy balances rider convenience with strict safety integrity.
          </p>
        </div>

        {/* PRD Section 4.5 Hard Rule Prominent Alert Box */}
        <div className="bg-asphalt-2 border-2 border-ignition-red/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl shadow-ignition-red/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-ignition-red text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-ignition-red uppercase tracking-wider font-bold">
                PRD Section 4.5 — Mandatory Store Policy
              </span>
              <h2 className="display-font text-2xl font-bold uppercase text-off-white">
                Strict Non-Return Policy on Unsealed Parts &amp; Mods
              </h2>
            </div>
          </div>

          <div className="text-sm text-steel-light leading-relaxed space-y-3 pl-0 sm:pl-16">
            <p className="bg-asphalt p-4 rounded-xl border border-steel/20 text-off-white font-medium">
              Motorcycle spare parts, exhausts, brake pads, electrical components, levers, chain kits, and body mods are <strong className="text-plate-yellow">NOT eligible for return or refund once the manufacturer seal or packaging has been opened or torn</strong>, regardless of whether installation was attempted.
            </p>
            <p className="text-xs text-steel">
              <strong className="text-steel-light">Why this rule exists:</strong> Precision automotive and motorcycle parts cannot be verified for internal electrical surge, micro-fractures, or installation stress once unsealed. To guarantee every customer receives factory-fresh, untampered parts, unsealed components cannot be restocked.
            </p>
          </div>
        </div>

        {/* Category-by-Category Return Eligibility Matrix */}
        <div className="space-y-4">
          <h2 className="display-font text-2xl sm:text-3xl font-extrabold uppercase text-off-white flex items-center gap-2">
            <span>Category-by-Category Eligibility Matrix</span>
          </h2>
          <p className="text-steel text-xs font-mono">
            Review the exact return and replacement eligibility criteria for each product line.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Riding Gear (Helmets, Jackets, Gloves) */}
            <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 space-y-4 hover:border-steel/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="display-font text-xl font-bold uppercase text-off-white">
                  Riding Gear &amp; Helmets
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
                  7-Day Size Exchange
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-steel-light">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Size Exchange Allowed:</strong> Jackets, gloves, boots, and helmets can be exchanged for size within 7 days of delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Condition Requirements:</strong> Must be 100% unworn, with all original factory tags, visor protective films, and box packaging intact.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-ignition-red shrink-0 mt-0.5" />
                  <span>Helmets ridden on roads or missing visor peel-off stickers are strictly non-exchangeable for hygienic and safety reasons.</span>
                </li>
              </ul>
            </div>

            {/* 2. Parts & Mods */}
            <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 space-y-4 hover:border-steel/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="display-font text-xl font-bold uppercase text-off-white">
                  Parts &amp; Performance Mods
                </span>
                <span className="bg-ignition-red/10 text-ignition-red border border-ignition-red/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
                  Sealed Only
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-steel-light">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Eligible for return within 48 hours <strong>ONLY IF</strong> the factory outer seal is 100% unbroken and box is undamaged.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-ignition-red shrink-0 mt-0.5" />
                  <span>Unsealed, torn packaging, or installed parts will be rejected and sent back at buyer&apos;s expense.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-plate-yellow shrink-0 mt-0.5" />
                  <span>Use our <strong>&quot;Shop by your bike&quot;</strong> garage filter before buying to prevent ordering incompatible parts.</span>
                </li>
              </ul>
            </div>

            {/* 3. Engine Oils & Fluids */}
            <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 space-y-4 hover:border-steel/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="display-font text-xl font-bold uppercase text-off-white">
                  Oils, Fluids &amp; Additives
                </span>
                <span className="bg-ignition-red/10 text-ignition-red border border-ignition-red/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
                  Non-Returnable
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-steel-light">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-ignition-red shrink-0 mt-0.5" />
                  <span>Consumable chemical products (synthetic engine oils, brake fluids, chain lubes, coolants) are strictly non-returnable.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>If bottle arrives physically damaged or leaking during Pathao transit, report within 12 hours for an immediate free reshipment.</span>
                </li>
              </ul>
            </div>

            {/* 4. Electronics & Gadgets */}
            <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 space-y-4 hover:border-steel/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="display-font text-xl font-bold uppercase text-off-white">
                  Electronics &amp; Lighting
                </span>
                <span className="bg-plate-yellow/10 text-plate-yellow border border-plate-yellow/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
                  48H DOA / Warranty
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-steel-light">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dead-on-Arrival (DOA):</strong> Report non-functioning fog lights or phone chargers within 48 hours for immediate replacement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-ignition-red shrink-0 mt-0.5" />
                  <span>Physical wire splicing, incorrect 24V hookups, or reverse-polarity burns void all replacement eligibility.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 48-Hour Unboxing Evidence Checklist */}
        <div className="bg-asphalt-2 border border-steel/25 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Video className="w-6 h-6 text-plate-yellow" />
            <div>
              <h2 className="display-font text-2xl font-bold uppercase text-off-white">
                48-Hour Wrong Item &amp; Counterfeit Claim Procedure
              </h2>
              <p className="text-xs text-steel">Mandatory protocol for transit damages or incorrect items</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-asphalt p-4 rounded-xl border border-steel/15 space-y-2">
              <span className="text-plate-yellow font-bold text-sm">Step 1: Unboxing Video</span>
              <p className="text-steel-light">
                Take a continuous, uncut video showing the Pathao shipping label and package opening.
              </p>
            </div>

            <div className="bg-asphalt p-4 rounded-xl border border-steel/15 space-y-2">
              <span className="text-plate-yellow font-bold text-sm">Step 2: Submit Evidence</span>
              <p className="text-steel-light">
                Send invoice number + video to <strong className="text-off-white">support@bikersdemand.com</strong> or WhatsApp our hotline within 48 hours.
              </p>
            </div>

            <div className="bg-asphalt p-4 rounded-xl border border-steel/15 space-y-2">
              <span className="text-plate-yellow font-bold text-sm">Step 3: Rapid Resolution</span>
              <p className="text-steel-light">
                Our QC team verifies the claim within 24 hours. A courier rider will pick up the item and deliver the replacement at zero extra cost.
              </p>
            </div>
          </div>
        </div>

        {/* Refund Timelines & Mobile Banking */}
        <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="display-font text-xl font-bold uppercase text-off-white">
              Refund Processing Times
            </h3>
          </div>
          <p className="text-xs text-steel leading-relaxed">
            When an authorized return arrives at our Tejgaon fulfillment center and clears QC inspection, refunds are issued through the original payment gateway:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-2">
            <div className="bg-asphalt p-3.5 rounded-xl border border-steel/20 flex flex-col justify-between">
              <span className="text-steel">bKash / Nagad / Rocket:</span>
              <span className="text-emerald-400 font-bold text-sm mt-1">3 to 5 Business Days</span>
            </div>
            <div className="bg-asphalt p-3.5 rounded-xl border border-steel/20 flex flex-col justify-between">
              <span className="text-steel">Visa / Mastercard / Amex:</span>
              <span className="text-emerald-400 font-bold text-sm mt-1">5 to 7 Business Days</span>
            </div>
            <div className="bg-asphalt p-3.5 rounded-xl border border-steel/20 flex flex-col justify-between">
              <span className="text-steel">Cash on Delivery (COD):</span>
              <span className="text-plate-yellow font-bold text-sm mt-1">Direct bKash / Bank Payout</span>
            </div>
          </div>
        </div>

        {/* Support Hotline CTA */}
        <div className="bg-gradient-to-r from-asphalt-2 to-asphalt border border-plate-yellow/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="display-font text-2xl font-bold uppercase text-off-white">
              Need Help with a Return or Size Exchange?
            </div>
            <p className="text-xs text-steel">
              Our Dhaka operations desk is active Saturday through Thursday, 10:00 AM – 8:00 PM.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+8809612245377"
              className="bg-plate-yellow text-asphalt hover:bg-yellow-400 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>+880 9612-BIKERS</span>
            </a>
            <Link
              href="/faq"
              className="border border-steel/30 text-off-white hover:bg-asphalt px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>View FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
