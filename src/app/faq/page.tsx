"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "How does the 'Shop by your bike' compatibility filter work?",
      a: "Select your motorcycle make (e.g. Yamaha), model (e.g. FZS-Fi), and generation (e.g. v3). Our platform uses a relational compatibility matrix to display only parts, exhausts, levers, and chain kits that are confirmed to fit your machine.",
    },
    {
      q: "What are the delivery charges across Bangladesh?",
      a: "We charge a flat Tk 60 delivery fee inside Dhaka metro and Tk 130 for the rest of Bangladesh, fulfilled via Pathao Logistics.",
    },
    {
      q: "Do you offer Cash on Delivery (COD)?",
      a: "Yes! Cash on Delivery is supported nationwide. You inspect your sealed package upon delivery before paying the courier rider.",
    },
    {
      q: "What is the return policy for Parts & Mods?",
      a: "Per Section 4.5 of our platform policy, Parts & Mods items cannot be returned once the packaging or seal is torn. If you receive a wrong or counterfeit item, you can submit unboxing photo/video evidence for a free replacement.",
    },
    {
      q: "Are helmets certified?",
      a: "All helmets carried on Bikers Demand are certified under DOT (US) and/or ECE 22.06 (EU) safety standards.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 space-y-8 w-full">
        <div className="border-b border-asphalt-2 pb-6 space-y-2">
          <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block">
            HELP & SUPPORT
          </span>
          <h1 className="display-font text-4xl font-extrabold uppercase text-off-white">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-asphalt-2 p-6 border border-asphalt-2 space-y-2">
              <h3 className="font-bold text-off-white text-base flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-plate-yellow shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-steel text-sm leading-relaxed pl-7 font-light">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
