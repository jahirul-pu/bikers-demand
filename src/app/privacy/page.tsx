import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Bikers Demand",
  description: "Bikers Demand privacy policy aligned with Bangladesh Personal Data Protection Act (PDPA 2026). Data collection, storage, and security practices.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 space-y-8 w-full">
        <div className="border-b border-asphalt-2 pb-6 space-y-2">
          <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block">
            LEGAL & PRIVACY
          </span>
          <h1 className="display-font text-4xl font-extrabold uppercase text-off-white">
            Privacy Policy
          </h1>
          <p className="text-steel text-sm font-mono">
            Aligned with Bangladesh Personal Data Protection Act (PDPA 2026).
          </p>
        </div>

        <div className="space-y-4 font-mono text-xs text-steel leading-relaxed">
          <h2 className="display-font text-2xl font-bold uppercase text-off-white">
            1. Data Collection & Purpose
          </h2>
          <p>
            Bikers Demand collects personal information (name, phone number, shipping address, saved motorcycle models) strictly for fulfilling order logistics, verifying Cash on Delivery (COD) orders, and providing model-specific compatibility recommendations.
          </p>

          <h2 className="display-font text-2xl font-bold uppercase text-off-white pt-4">
            2. Data Security & Storage
          </h2>
          <p>
            Customer data is stored securely in encrypted databases. In accordance with Bangladesh's Personal Data Protection Act 2026, we do not sell or share customer personal information with unverified third parties.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
