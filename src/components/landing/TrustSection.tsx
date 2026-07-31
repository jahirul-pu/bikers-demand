import React from "react";
import { ShieldCheck, CheckCircle2, Truck, CreditCard, RotateCcw } from "lucide-react";

export default function TrustSection() {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: "100% Genuine Owned Inventory",
      description:
        "No dropshipping or unverified marketplace sellers. Every item is stocked and quality checked in our Dhaka fulfillment hub.",
      color: "text-ignition-red",
      borderColor: "border-ignition-red/30",
    },
    {
      icon: CheckCircle2,
      title: "Confirmed Compatibility Guarantee",
      description:
        "Filter by your exact bike make and model. If a part tagged as compatible does not fit your stock bike, we replace it hassle-free.",
      color: "text-plate-yellow",
      borderColor: "border-plate-yellow/30",
    },
    {
      icon: Truck,
      title: "Nationwide Fast Delivery",
      description:
        "Flat delivery charge of Tk 60 inside Dhaka and Tk 130 for the rest of Bangladesh via Pathao Courier logistics.",
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
    },
    {
      icon: CreditCard,
      title: "COD & Mobile Banking",
      description:
        "Pay Cash on Delivery or via bKash, Nagad, Rocket, and BanglaQR. Real-time order tracking via SMS and user panel.",
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
    },
  ];

  return (
    <section className="py-16 bg-asphalt-2/90 border-b border-asphalt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block mb-1">
            WHY BIKERS TRUST US
          </span>
          <h2 className="display-font text-3xl sm:text-4xl font-extrabold uppercase text-off-white tracking-wide">
            Built for Bangladeshi Riders
          </h2>
          <p className="text-steel text-sm mt-2">
            Eliminating guesswork, counterfeit parts, and delivery delays with a dedicated local inventory model.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-asphalt border ${item.borderColor} p-6 flex flex-col justify-between space-y-4 hover:border-steel/50 transition-colors`}
              >
                <div className="space-y-3">
                  <div className={`p-3 bg-asphalt-2 w-fit ${item.color}`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-base font-bold text-off-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-steel leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-mono text-steel uppercase">
                  ✓ Verified Policy
                </div>
              </div>
            );
          })}
        </div>

        {/* Return Policy Notice Box per PRD section 4.5 */}
        <div className="mt-10 bg-asphalt p-4 border border-asphalt-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-plate-yellow shrink-0" />
            <div>
              <span className="font-bold text-off-white uppercase font-mono">
                Parts & Mods Return Policy Notice:
              </span>
              <span className="text-steel ml-2">
                Parts & Mods items are non-returnable once packaging is opened/torn. Counterfeit or wrong items are covered by photo/video evidence replacement.
              </span>
            </div>
          </div>
          <a
            href="#returns"
            className="text-plate-yellow hover:underline text-[11px] font-mono whitespace-nowrap"
          >
            Read Full Return Terms →
          </a>
        </div>
      </div>
    </section>
  );
}
