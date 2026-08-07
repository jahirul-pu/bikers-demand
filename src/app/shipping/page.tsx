import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — Bikers Demand",
  description: "Bikers Demand shipping rates: Tk 60 inside Dhaka, Tk 130 nationwide via Pathao Courier. 24-72 hour delivery with COD fraud prevention.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 space-y-8 w-full">
        <div className="border-b border-asphalt-2 pb-6 space-y-2">
          <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block">
            LOGISTICS & RATES
          </span>
          <h1 className="display-font text-4xl font-extrabold uppercase text-off-white">
            Shipping & Delivery Policy
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
          <div className="bg-asphalt p-6 border border-plate-yellow/40 space-y-3">
            <div className="flex items-center gap-2 text-plate-yellow font-bold text-sm">
              <Truck className="w-5 h-5" />
              <span>Inside Dhaka Metro — Tk 60</span>
            </div>
            <p className="text-steel leading-relaxed">
              Flat delivery charge of <strong className="text-off-white">Tk 60</strong> for all deliveries inside Dhaka city limits. Delivery timeline: 24 to 48 hours.
            </p>
          </div>

          <div className="bg-asphalt p-6 border border-plate-yellow/40 space-y-3">
            <div className="flex items-center gap-2 text-plate-yellow font-bold text-sm">
              <Truck className="w-5 h-5" />
              <span>Outside Dhaka — Tk 130</span>
            </div>
            <p className="text-steel leading-relaxed">
              Flat delivery charge of <strong className="text-off-white">Tk 130</strong> for the rest of Bangladesh via Pathao Courier logistics. Delivery timeline: 48 to 72 hours.
            </p>
          </div>
        </div>

        <div className="bg-asphalt-2 p-6 border border-asphalt-2 space-y-3 font-mono text-xs">
          <h2 className="display-font text-2xl font-bold uppercase text-off-white">
            Order Confirmation Call & COD Fraud Prevention
          </h2>
          <p className="text-steel leading-relaxed font-light">
            Consistent with Bangladesh e-commerce practices, placed orders trigger an automated SMS and order confirmation phone call from our Dhaka fulfillment center before parcels are handed over to courier logistics.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
