"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PolicyNav from "@/components/common/PolicyNav";
import { HelpCircle, Search, Bike, CreditCard, Truck, ShieldCheck, RotateCcw, ChevronDown, PhoneCall, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  q: string;
  a: string;
  category: "compat" | "orders" | "shipping" | "helmets" | "returns";
}

const FAQ_DATA: FAQItem[] = [
  // 1. Compatibility & Garage
  {
    category: "compat",
    q: "How does the 'Shop by your bike' compatibility filter work?",
    a: "Select your motorcycle make (e.g. Yamaha), model (e.g. FZS-Fi), and CC/generation variant (e.g. v3). Our platform uses a relational compatibility matrix to display only parts, exhausts, levers, and chain kits verified to fit your specific machine, eliminating guesswork.",
  },
  {
    category: "compat",
    q: "Can I save multiple motorcycles to my account?",
    a: "Yes! Under 'My Garage' in your rider account, you can add all the bikes you own. When browsing our catalog, you can switch between your saved bikes with one tap.",
  },
  {
    category: "compat",
    q: "What if I want to buy a part for a bike not currently in my garage?",
    a: "You can freely browse without a filter or switch bikes anytime. If you try to add a model-specific part that doesn't fit your currently active bike, the system prompts a safety warning so you can confirm before checkout.",
  },

  // 2. Orders & Payment
  {
    category: "orders",
    q: "What payment methods are supported on Bikers Demand?",
    a: "We support nationwide Cash on Delivery (COD), bKash, Nagad, Rocket, BanglaQR, and major credit/debit cards (Visa, Mastercard, Amex). All transactions are encrypted and processed securely.",
  },
  {
    category: "orders",
    q: "Why do I receive a verification call for Cash on Delivery (COD)?",
    a: "To eliminate fraudulent delivery attempts and prevent riders from receiving wrong parts, our dispatch team calls first-time COD buyers to verify delivery details and confirm their motorcycle model.",
  },
  {
    category: "orders",
    q: "Do your prices include VAT / taxes?",
    a: "Yes. All prices displayed on Bikers Demand are 100% VAT-inclusive in compliance with National Board of Revenue (NBR) regulations in Bangladesh. Every order comes with an official printed A5 tax invoice.",
  },

  // 3. Shipping & Logistics
  {
    category: "shipping",
    q: "What are the delivery charges across Bangladesh?",
    a: "We charge a flat Tk 60 inside Dhaka Metro (24–48 hours) and a flat Tk 130 for the rest of Bangladesh (48–72 hours across all 64 districts) via Pathao Courier logistics.",
  },
  {
    category: "shipping",
    q: "What is your daily dispatch cutoff time?",
    a: "Orders placed before 2:00 PM (Saturday through Thursday) are packed from our owned warehouse and handed to courier riders on the same day.",
  },
  {
    category: "shipping",
    q: "How can I track my shipment?",
    a: "Once dispatched, you will receive an SMS containing your Pathao Courier Consignment Number. You can track your parcel in real-time through the Pathao app, our website tracking page, or under 'My Orders' in your account.",
  },

  // 4. Helmets & Sizing
  {
    category: "helmets",
    q: "Which safety certifications do your helmets carry?",
    a: "We exclusively carry helmets certified under ECE 22.06 (the latest European safety standard), ECE 22.05, and/or US DOT standards. Every helmet SKU displays its official safety rating badge.",
  },
  {
    category: "helmets",
    q: "How do I choose the correct helmet size?",
    a: "Wrap a flexible measuring tape around your head approximately 1 inch (2.5 cm) above your eyebrows. Compare your measurement in centimeters with our product size guide: S (55-56 cm), M (57-58 cm), L (59-60 cm), XL (61-62 cm), XXL (63-64 cm).",
  },
  {
    category: "helmets",
    q: "What if the helmet size I ordered doesn't fit my head?",
    a: "We offer a 7-day size exchange for unworn helmets with all factory visor stickers and box tags intact. Report the exchange request within 7 days and we'll arrange the size swap.",
  },

  // 5. Returns & Warranty
  {
    category: "returns",
    q: "Why can't I return a motorcycle part once the seal is opened?",
    a: "Per Section 4.5 of our store policy, automotive parts cannot be restocked once unsealed because there is no way to verify whether electrical components experienced current spikes or mechanical installation stress. We guarantee factory-sealed parts to every buyer.",
  },
  {
    category: "returns",
    q: "What if I receive a damaged or wrong item?",
    a: "Take a continuous unboxing video showing the shipping label and opened parcel. Contact our hotline or email support@bikersdemand.com within 48 hours. Upon verification, we provide an immediate free courier replacement.",
  },
  {
    category: "returns",
    q: "What is the warranty on helmets and electronics?",
    a: "Brand helmets come with a 1-Year Manufacturer Warranty covering structural shell integrity. Select electronics (fog lights, TPMS, chargers) carry a 6-Month Limited Warranty. Consumable oils and mechanical parts carry no operational warranty.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCat = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />
      <PolicyNav />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10 w-full">
        {/* Header Banner */}
        <div className="border-b border-asphalt-2 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plate-yellow/10 border border-plate-yellow/30 text-plate-yellow text-xs font-mono font-semibold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support Knowledgebase &amp; FAQs</span>
          </div>
          <h1 className="display-font text-4xl sm:text-5xl font-extrabold uppercase text-off-white tracking-wide">
            Frequently Asked Questions
          </h1>
          <p className="text-steel text-sm sm:text-base leading-relaxed max-w-3xl">
            Find immediate answers regarding bike compatibility, Cash on Delivery, Pathao shipping timelines, helmet safety certifications, and warranty claims.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search questions (e.g., compatibility, return, helmet size, delivery fee)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-asphalt-2 border border-steel/30 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-off-white placeholder:text-steel focus:outline-none focus:border-plate-yellow transition-all"
          />
          <Search className="w-5 h-5 text-steel absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: "all", label: "All Questions", icon: HelpCircle },
            { id: "compat", label: "Bike Compatibility", icon: Bike },
            { id: "orders", label: "Orders & COD", icon: CreditCard },
            { id: "shipping", label: "Shipping & Rates", icon: Truck },
            { id: "helmets", label: "Helmets & Safety", icon: ShieldCheck },
            { id: "returns", label: "Returns & Warranty", icon: RotateCcw },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-plate-yellow text-asphalt font-bold shadow-md shadow-plate-yellow/20"
                    : "bg-asphalt-2 text-steel hover:text-off-white border border-steel/20"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-10 text-center space-y-2">
              <p className="text-plate-yellow font-mono text-sm font-bold">No matching questions found</p>
              <p className="text-steel text-xs">Try searching with a different term or view all questions.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-asphalt-2 border border-asphalt-2 rounded-2xl overflow-hidden transition-all duration-200 hover:border-steel/30"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-semibold text-sm sm:text-base text-off-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-plate-yellow shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-steel-light leading-relaxed border-t border-asphalt/60 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Hotline CTA */}
        <div className="bg-gradient-to-r from-asphalt-2 to-asphalt border border-plate-yellow/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="display-font text-2xl font-bold uppercase text-off-white">
              Still Have a Question?
            </div>
            <p className="text-xs text-steel">
              Our motorcycle specialists are ready to help with fitting guidance and order inquiries.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+8809612245377"
              className="bg-plate-yellow text-asphalt hover:bg-yellow-400 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Helpline</span>
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
