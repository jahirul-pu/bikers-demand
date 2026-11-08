import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PolicyNav from "@/components/common/PolicyNav";
import { Lock, Shield, Eye, Database, Share2, UserCheck, Trash2, Mail, PhoneCall } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy (PDPA 2026) — Bikers Demand Bangladesh",
  description: "Official privacy policy for Bikers Demand in compliance with Bangladesh Personal Data Protection Act (PDPA 2026). Data collection, encryption, courier sharing, and user rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />
      <PolicyNav />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10 w-full">
        {/* Header Banner */}
        <div className="border-b border-asphalt-2 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plate-yellow/10 border border-plate-yellow/30 text-plate-yellow text-xs font-mono font-semibold uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span>Statutory Compliance: Bangladesh PDPA 2026</span>
          </div>
          <h1 className="display-font text-4xl sm:text-5xl font-extrabold uppercase text-off-white tracking-wide">
            Privacy Policy &amp; Data Protection
          </h1>
          <p className="text-steel text-sm sm:text-base leading-relaxed max-w-3xl">
            Bikers Demand is committed to upholding the highest standards of digital privacy and data protection in full accordance with the <strong className="text-off-white">Personal Data Protection Act 2026 (PDPA 2026)</strong> and Information and Communication Technology (ICT) Act of the People&apos;s Republic of Bangladesh.
          </p>
        </div>

        {/* Legal Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-off-white font-bold block text-sm">Purpose Limitation</span>
            <p className="text-steel-light leading-relaxed text-[11px]">
              Data is strictly used to fulfill motorcycle accessory orders, deliver via courier, and personalize bike compatibility.
            </p>
          </div>

          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-plate-yellow/10 text-plate-yellow flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-off-white font-bold block text-sm">Zero Data Selling</span>
            <p className="text-steel-light leading-relaxed text-[11px]">
              We never monetize, rent, or sell your personal or garage data to third-party ad networks or brokers.
            </p>
          </div>

          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-ignition-red/10 text-ignition-red flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-off-white font-bold block text-sm">Encrypted Storage</span>
            <p className="text-steel-light leading-relaxed text-[11px]">
              Passwords hashed via bcrypt, databases encrypted with AES-256, and all network transit secured via TLS 1.3.
            </p>
          </div>
        </div>

        {/* Detailed PDPA Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-steel-light leading-relaxed font-light">
          {/* Section 1 */}
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="display-font text-2xl font-bold uppercase text-off-white flex items-center gap-2">
              <span>1. Data Controller Identification</span>
            </h2>
            <p>
              The data controller responsible for the processing of personal data collected through Bikers Demand is:
            </p>
            <div className="bg-asphalt p-4 rounded-xl border border-steel/20 font-mono text-xs text-steel space-y-1">
              <div><strong className="text-off-white">Entity:</strong> Bikers Demand Limited</div>
              <div><strong className="text-off-white">Fulfillment Hub:</strong> Tejgaon Industrial Area, Dhaka-1208, Bangladesh</div>
              <div><strong className="text-off-white">Data Protection Office:</strong> privacy@bikersdemand.com | Hotline: +880 9612-BIKERS</div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="display-font text-2xl font-bold uppercase text-off-white">
              2. Categories of Personal Data Collected
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-off-white">Contact &amp; Identity Data:</strong> Full name, verified mobile phone number, email address.</li>
              <li><strong className="text-off-white">Delivery Data:</strong> Shipping address, delivery zone (Inside Dhaka vs Outside Dhaka), district, nearest landmark.</li>
              <li><strong className="text-off-white">Motorcycle &amp; Garage Data:</strong> Saved motorcycle make, model, variant, and year (used solely to recommend and filter compatible parts).</li>
              <li><strong className="text-off-white">Transaction &amp; Order Data:</strong> Invoice history, order amounts, payment method selected (COD, bKash, card). <em>We never store credit/debit card numbers or mobile banking PINs directly.</em></li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="display-font text-2xl font-bold uppercase text-off-white">
              3. Lawful Grounds for Processing
            </h2>
            <p>
              Under Bangladesh PDPA 2026, we process your personal data under the following legal bases:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Contractual Necessity:</strong> To process your order, dispatch items, and deliver packages to your door.</li>
              <li><strong>Legitimate Interests:</strong> To verify Cash on Delivery orders by phone to protect against delivery fraud.</li>
              <li><strong>Legal Obligation:</strong> To maintain official tax and VAT records in accordance with the National Board of Revenue (NBR).</li>
              <li><strong>Explicit Consent:</strong> To send SMS/email order tracking updates and optional promotional campaigns.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="display-font text-2xl font-bold uppercase text-off-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-plate-yellow" />
              <span>4. Data Sharing with Courier &amp; Gateway Partners</span>
            </h2>
            <p>
              We disclose only minimal required information to verified partners essential to order fulfillment:
            </p>
            <div className="space-y-2 font-mono text-xs">
              <div className="bg-asphalt p-3.5 rounded-xl border border-steel/15">
                <span className="text-plate-yellow font-bold">Pathao Courier Limited:</span>
                <p className="text-steel-light mt-1">
                  Recipient name, phone number, and delivery address are shared to facilitate parcel delivery and COD collection.
                </p>
              </div>
              <div className="bg-asphalt p-3.5 rounded-xl border border-steel/15">
                <span className="text-plate-yellow font-bold">Payment Gateway Providers (SSLCommerz / bKash / Nagad):</span>
                <p className="text-steel-light mt-1">
                  Transaction amounts and order IDs are shared through PCI-DSS Level 1 compliant encrypted tunnels.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="display-font text-2xl font-bold uppercase text-off-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>5. Your Rights as a Data Subject (PDPA 2026)</span>
            </h2>
            <p>
              As a resident of Bangladesh, you are entitled to exercise the following statutory rights under the PDPA 2026:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
              <div className="bg-asphalt p-3.5 rounded-xl border border-steel/15">
                <strong className="text-off-white block">Right to Access:</strong>
                <span className="text-steel">Request an export of all personal and order data stored under your account.</span>
              </div>
              <div className="bg-asphalt p-3.5 rounded-xl border border-steel/15">
                <strong className="text-off-white block">Right to Rectification:</strong>
                <span className="text-steel">Update phone numbers, shipping addresses, or saved bikes at any time in Account Settings.</span>
              </div>
              <div className="bg-asphalt p-3.5 rounded-xl border border-steel/15">
                <strong className="text-off-white block">Right to Erasure (&quot;Be Forgotten&quot;):</strong>
                <span className="text-steel">Request complete deletion of your rider profile and contact information upon written notice.</span>
              </div>
              <div className="bg-asphalt p-3.5 rounded-xl border border-steel/15">
                <strong className="text-off-white block">Right to Withdraw Consent:</strong>
                <span className="text-steel">Opt-out of non-transactional marketing SMS/email alerts with a single click.</span>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-asphalt-2 border border-asphalt-2 rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="display-font text-2xl font-bold uppercase text-off-white">
              6. Data Retention Period
            </h2>
            <p>
              Active account information is retained for the lifetime of your account. Transaction invoices and order logs are retained for 5 years to comply with Bangladesh Income Tax Ordinance 1984 and NBR audit regulations, after which non-essential records are permanently purged.
            </p>
          </div>
        </div>

        {/* Contact DPO CTA */}
        <div className="bg-gradient-to-r from-asphalt-2 to-asphalt border border-plate-yellow/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="display-font text-2xl font-bold uppercase text-off-white">
              Exercise Your Data Rights or Contact DPO
            </div>
            <p className="text-xs text-steel">
              To request data erasure or file a privacy inquiry, reach our dedicated Data Protection Officer.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="mailto:privacy@bikersdemand.com"
              className="bg-plate-yellow text-asphalt hover:bg-yellow-400 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
            >
              <Mail className="w-4 h-4" />
              <span>Email DPO</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
