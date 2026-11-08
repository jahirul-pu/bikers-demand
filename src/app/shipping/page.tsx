import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PolicyNav from "@/components/common/PolicyNav";
import { Truck, Clock, ShieldCheck, MapPin, PhoneCall, CheckCircle2, AlertCircle, ArrowRight, PackageCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — Bikers Demand Bangladesh",
  description: "Bikers Demand official delivery rates: Flat Tk 60 inside Dhaka Metro, Flat Tk 130 nationwide via Pathao Courier. 2:00 PM cutoff, COD phone verification, and real-time tracking.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />
      <PolicyNav />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10 w-full">
        {/* Header Banner */}
        <div className="border-b border-asphalt-2 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plate-yellow/10 border border-plate-yellow/30 text-plate-yellow text-xs font-mono font-semibold uppercase tracking-widest">
            <Truck className="w-3.5 h-3.5" />
            <span>Fast Nationwide Logistics &amp; Transparent Rates</span>
          </div>
          <h1 className="display-font text-4xl sm:text-5xl font-extrabold uppercase text-off-white tracking-wide">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-steel text-sm sm:text-base leading-relaxed max-w-3xl">
            We partner with Pathao Courier to deliver 100% genuine motorcycle gear, helmets, and performance parts to all 64 districts in Bangladesh with real-time tracking and Cash on Delivery.
          </p>
        </div>

        {/* Flat Rate Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inside Dhaka Metro */}
          <div className="bg-asphalt-2 border-2 border-plate-yellow/70 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl shadow-plate-yellow/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest font-bold">
                Zone 1: Dhaka Metro
              </span>
              <span className="bg-plate-yellow text-asphalt text-xs font-bold font-mono px-3 py-1 rounded-full">
                SAME/NEXT DAY
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono text-steel">Flat Rate:</span>
              <span className="display-font text-5xl font-extrabold text-off-white">৳60</span>
            </div>

            <p className="text-xs text-steel-light leading-relaxed">
              Standard flat delivery fee across all Dhaka city metropolitan areas (Mirpur, Uttara, Dhanmondi, Gulshan, Banani, Motijheel, Mohammadpur, Old Dhaka).
            </p>

            <div className="pt-3 border-t border-asphalt space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span><strong>Timeline:</strong> 24 to 48 Hours Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-steel">
                <CheckCircle2 className="w-4 h-4 text-plate-yellow shrink-0" />
                <span>Orders before 2:00 PM dispatched same day</span>
              </div>
            </div>
          </div>

          {/* Outside Dhaka — Nationwide */}
          <div className="bg-asphalt-2 border-2 border-steel/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-steel-light uppercase tracking-widest font-bold">
                Zone 2: Outside Dhaka (Nationwide)
              </span>
              <span className="bg-asphalt border border-steel/30 text-steel-light text-xs font-bold font-mono px-3 py-1 rounded-full">
                64 DISTRICTS
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono text-steel">Flat Rate:</span>
              <span className="display-font text-5xl font-extrabold text-off-white">৳130</span>
            </div>

            <p className="text-xs text-steel-light leading-relaxed">
              Flat delivery fee covering all divisional cities, districts, and upazilas across Bangladesh fulfilled via Pathao Courier hub network.
            </p>

            <div className="pt-3 border-t border-asphalt space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span><strong>Timeline:</strong> 48 to 72 Hours Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-steel">
                <CheckCircle2 className="w-4 h-4 text-plate-yellow shrink-0" />
                <span>Full doorstep delivery or local hub pickup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Cutoff & Dispatch Workflow */}
        <div className="bg-asphalt-2 border border-steel/25 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <PackageCheck className="w-6 h-6 text-plate-yellow" />
            <div>
              <h2 className="display-font text-2xl font-bold uppercase text-off-white">
                Fulfillment Speed &amp; 2:00 PM Daily Cutoff
              </h2>
              <p className="text-xs text-steel">Direct dispatch from our owned inventory warehouse in Tejgaon I/A</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
            <div className="bg-asphalt p-4 rounded-xl border border-steel/15 space-y-2">
              <span className="text-plate-yellow font-bold text-sm block">1. Orders Placed Before 2 PM</span>
              <p className="text-steel-light leading-relaxed">
                Items are picked from our warehouse shelves, bubble-wrapped, and handed to Pathao riders at 4:30 PM same day.
              </p>
            </div>

            <div className="bg-asphalt p-4 rounded-xl border border-steel/15 space-y-2">
              <span className="text-plate-yellow font-bold text-sm block">2. Orders Placed After 2 PM</span>
              <p className="text-steel-light leading-relaxed">
                Queued for morning priority processing and handed to courier during the 11:00 AM dispatch slot next day.
              </p>
            </div>

            <div className="bg-asphalt p-4 rounded-xl border border-steel/15 space-y-2">
              <span className="text-plate-yellow font-bold text-sm block">3. Friday &amp; Holiday Schedule</span>
              <p className="text-steel-light leading-relaxed">
                Warehouse operates Saturday through Thursday. Friday orders are prepared for early Saturday morning dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* COD Verification & Fraud Protection Protocol */}
        <div className="bg-asphalt-2 border-l-4 border-plate-yellow rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-plate-yellow font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-plate-yellow" />
            <span className="display-font text-xl uppercase tracking-wide">
              Cash on Delivery (COD) Phone Verification Protocol
            </span>
          </div>
          <div className="text-xs text-steel-light leading-relaxed space-y-2 font-mono">
            <p>
              To ensure rider safety and eliminate fraudulent courier returns, our customer dispatch desk conducts a <strong className="text-off-white">quick verification phone call</strong> before dispatching any Cash on Delivery (COD) order.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-steel">
              <li>We confirm your delivery address, landmark, and alternate contact number.</li>
              <li>For Parts &amp; Mods, we verify your motorcycle model (make/year) to prevent accidental ordering mistakes.</li>
              <li>Unverified COD orders will be placed on hold for 48 hours before automated cancellation.</li>
            </ul>
          </div>
        </div>

        {/* Packaging Integrity & Helmet Protection */}
        <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="display-font text-xl font-bold uppercase text-off-white">
              Packaging &amp; Shock Protection Standard
            </h3>
          </div>
          <p className="text-xs text-steel-light leading-relaxed">
            Every helmet is shipped inside its original manufacturer fabric bag, placed within the factory shock-absorbing EPS box, and enveloped in a waterproof heavy-duty outer poly wrap. Visors are protected with scratch-resistant film.
          </p>
        </div>

        {/* Support Hotline CTA */}
        <div className="bg-gradient-to-r from-asphalt-2 to-asphalt border border-plate-yellow/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="display-font text-2xl font-bold uppercase text-off-white">
              Track Your Shipment or Change Address?
            </div>
            <p className="text-xs text-steel">
              Call our logistics hotline or check your dashboard tracking status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+8809612245377"
              className="bg-plate-yellow text-asphalt hover:bg-yellow-400 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Logistics Hotline</span>
            </a>
            <Link
              href="/account/orders"
              className="border border-steel/30 text-off-white hover:bg-asphalt px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>Track Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
