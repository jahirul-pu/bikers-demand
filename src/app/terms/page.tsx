import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PolicyNav from "@/components/common/PolicyNav";
import { FileText, Scale, CheckCircle2, AlertTriangle, ShieldCheck, Wrench, Landmark } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Bikers Demand Bangladesh",
  description: "Terms of service for Bikers Demand. NBR VAT-inclusive pricing, owned inventory guarantees, binding parts return rules, mechanic installation advisories, and Dhaka court jurisdiction.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />
      <PolicyNav />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10 w-full">
        {/* Header Banner */}
        <div className="border-b border-asphalt-2 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plate-yellow/10 border border-plate-yellow/30 text-plate-yellow text-xs font-mono font-semibold uppercase tracking-widest">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Agreement &amp; User Terms</span>
          </div>
          <h1 className="display-font text-4xl sm:text-5xl font-extrabold uppercase text-off-white tracking-wide">
            Terms of Service
          </h1>
          <p className="text-steel text-sm sm:text-base leading-relaxed max-w-3xl">
            Please read these Terms of Service carefully before purchasing motorcycle accessories, riding gear, or replacement parts through Bikers Demand. By placing an order, you agree to be bound by these provisions.
          </p>
        </div>

        {/* 4 Key Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-5 space-y-2">
            <span className="text-plate-yellow font-bold block text-sm">100% Owned Inventory</span>
            <p className="text-steel-light text-[11px] leading-relaxed">
              We do not dropship. All catalog items are physically warehoused in our Dhaka fulfillment facility.
            </p>
          </div>

          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-5 space-y-2">
            <span className="text-plate-yellow font-bold block text-sm">VAT-Inclusive Pricing</span>
            <p className="text-steel-light text-[11px] leading-relaxed">
              All prices displayed in BDT (৳) include statutory Value Added Tax (VAT) per NBR guidelines.
            </p>
          </div>

          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-5 space-y-2">
            <span className="text-plate-yellow font-bold block text-sm">Binding Return Rules</span>
            <p className="text-steel-light text-[11px] leading-relaxed">
              Parts &amp; Mods are strictly non-returnable once packaging is opened or torn (PRD §4.5).
            </p>
          </div>

          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-5 space-y-2">
            <span className="text-plate-yellow font-bold block text-sm">Dhaka Jurisdiction</span>
            <p className="text-steel-light text-[11px] leading-relaxed">
              All commercial transactions and disputes are governed by the laws of Bangladesh.
            </p>
          </div>
        </div>

        {/* Detailed Legal Clauses */}
        <div className="space-y-8 text-xs sm:text-sm text-steel-light leading-relaxed font-light">
          {/* Clause 1 */}
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="display-font text-2xl font-bold uppercase text-off-white">
              1. Platform Overview &amp; Commercial Scope
            </h2>
            <p>
              Bikers Demand operates as a specialized, direct-to-consumer online motorcycle accessories platform in Bangladesh. We retail certified riding gear, OEM &amp; aftermarket performance parts, auxiliary electronics, lubricants, and motorcycle merchandise. We do not operate as an open third-party marketplace or broker untested goods.
            </p>
          </div>

          {/* Clause 2 */}
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="display-font text-2xl font-bold uppercase text-off-white">
              2. Display Pricing, Currency &amp; NBR Tax Compliance
            </h2>
            <p>
              All listed product prices are quoted in Bangladeshi Taka (BDT / ৳) and are inclusive of all applicable Value Added Tax (VAT) mandated under the Value Added Tax and Supplementary Duty Act 2012 of Bangladesh. Delivery fees (Tk 60 inside Dhaka Metro, Tk 130 outside Dhaka) are itemized separately during checkout and printed on the official A5 invoice slip.
            </p>
          </div>

          {/* Clause 3 */}
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="display-font text-2xl font-bold uppercase text-off-white">
              3. Order Confirmation &amp; COD Verification Phone Calls
            </h2>
            <p>
              Receipt of an order confirmation email or SMS does not constitute final order acceptance. Bikers Demand reserves the right to verify Cash on Delivery (COD) orders via a telephone call to confirm the customer&apos;s physical address and intended motorcycle model. We reserve the right to cancel orders if the phone number is unreachable or provided address is fraudulent.
            </p>
          </div>

          {/* Clause 4 */}
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-ignition-red font-bold">
              <AlertTriangle className="w-5 h-5 text-ignition-red" />
              <span className="display-font text-2xl uppercase text-off-white">
                4. Bike Compatibility Matrix &amp; Non-Return Condition
              </span>
            </div>
            <p>
              Our &quot;Shop by your bike&quot; tool provides model-specific fitment recommendations based on verified manufacturer dimensions. However, riders must ensure their motorcycle has not undergone conflicting aftermarket chassis or engine modifications.
            </p>
            <div className="bg-asphalt p-4 rounded-xl border border-ignition-red/40 text-xs font-mono text-steel-light space-y-1">
              <strong className="text-plate-yellow block">BINDING CONDITION (PRD §4.5):</strong>
              <span>
                By placing an order for Parts &amp; Mods, you acknowledge that items are non-returnable once the factory packaging or tamper-evident seal is opened. If you are uncertain about fitment, contact our support team prior to purchasing.
              </span>
            </div>
          </div>

          {/* Clause 5 */}
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="display-font text-2xl font-bold uppercase text-off-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-plate-yellow" />
              <span>5. Professional Mechanic Installation Advisory</span>
            </h2>
            <p>
              Motorcycle brake components, sprockets, drive chains, racing exhausts, and electrical fog light harnesses require professional mechanical calibration. Bikers Demand strongly advises having all performance parts installed by a qualified motorcycle mechanic with proper torque wrenches. Bikers Demand is not liable for mechanical failures or accidents resulting from improper self-installation or overtightened bolts.
            </p>
          </div>

          {/* Clause 6 */}
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="display-font text-2xl font-bold uppercase text-off-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-400" />
              <span>6. Governing Law &amp; Dispute Resolution</span>
            </h2>
            <p>
              These Terms of Service and all related purchasing contracts are governed by and construed in accordance with the substantive laws of the People&apos;s Republic of Bangladesh. Any legal dispute, arbitration, or proceedings arising out of or in connection with Bikers Demand shall be submitted to the exclusive jurisdiction of the competent courts of Dhaka, Bangladesh.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
