import React from "react";
import Link from "next/link";
import { Bike, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-asphalt-2 text-steel text-xs border-t border-asphalt-2 mt-auto">
      {/* Top Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-ignition-red flex items-center justify-center rounded transform -skew-x-12 group-hover:bg-red-600 transition-colors">
                <Bike className="w-5 h-5 text-asphalt transform skew-x-12 stroke-[2.5]" />
              </div>
              <span className="display-font text-xl font-extrabold tracking-wider text-off-white group-hover:text-ignition-red transition-colors">
                BIKERS<span className="text-ignition-red group-hover:text-off-white transition-colors">DEMAND</span>
              </span>
            </Link>
            <p className="text-xs text-steel font-light leading-relaxed">
              Bangladesh's dedicated online-only motorcycle accessories store. Owned inventory, confirmed bike compatibility, and nationwide fast delivery.
            </p>
            <div className="text-[11px] font-mono text-plate-yellow">
              Dhaka, Bangladesh
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="display-font text-sm font-bold uppercase text-off-white tracking-wider">
              Categories
            </h4>
            <ul className="space-y-1.5 font-light">
              <li>
                <a href="#riding-gear" className="hover:text-off-white transition-colors">
                  Riding Gear & Helmets
                </a>
              </li>
              <li>
                <a href="#parts-mods" className="hover:text-off-white transition-colors">
                  Parts & Mods
                </a>
              </li>
              <li>
                <a href="#electronics" className="hover:text-off-white transition-colors">
                  Electronics & Lighting
                </a>
              </li>
              <li>
                <a href="#additives" className="hover:text-off-white transition-colors">
                  Additives & Engine Oils
                </a>
              </li>
              <li>
                <a href="#merchandise" className="hover:text-off-white transition-colors">
                  Merchandise & Apparel
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-2">
            <h4 className="display-font text-sm font-bold uppercase text-off-white tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-1.5 font-light">
              <li>
                <a href="#returns" className="hover:text-off-white transition-colors">
                  Return & Replacement Policy
                </a>
              </li>
              <li>
                <a href="#warranty" className="hover:text-off-white transition-colors">
                  Warranty Information
                </a>
              </li>
              <li>
                <a href="#shipping" className="hover:text-off-white transition-colors">
                  Shipping & Delivery Charges
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-off-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-off-white transition-colors">
                  Privacy Policy (PDPA 2026)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Hotline */}
          <div className="space-y-3">
            <h4 className="display-font text-sm font-bold uppercase text-off-white tracking-wider">
              Support & Orders
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-off-white">
                <Phone className="w-4 h-4 text-plate-yellow" />
                <span>+880 9612-BIKERS</span>
              </div>
              <div className="flex items-center gap-2 text-steel">
                <Mail className="w-4 h-4 text-steel" />
                <span>support@bikersdemand.com</span>
              </div>
              <div className="flex items-center gap-2 text-steel">
                <MapPin className="w-4 h-4 text-steel" />
                <span>Tejgaon I/A, Dhaka-1208</span>
              </div>
            </div>

            {/* Payment Icons */}
            <div className="pt-2">
              <span className="text-[10px] font-mono text-steel block mb-1.5 uppercase">
                Accepted Payment Methods:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-asphalt px-2 py-1 text-[10px] font-mono text-plate-yellow border border-asphalt-2">
                  COD
                </span>
                <span className="bg-asphalt px-2 py-1 text-[10px] font-mono text-pink-400 border border-asphalt-2">
                  bKash
                </span>
                <span className="bg-asphalt px-2 py-1 text-[10px] font-mono text-orange-400 border border-asphalt-2">
                  Nagad
                </span>
                <span className="bg-asphalt px-2 py-1 text-[10px] font-mono text-purple-400 border border-asphalt-2">
                  Rocket
                </span>
                <span className="bg-asphalt px-2 py-1 text-[10px] font-mono text-emerald-400 border border-asphalt-2">
                  BanglaQR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Version & Copyright Bar per design.md section 10 */}
      <div className="bg-asphalt py-4 border-t border-asphalt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] font-mono text-steel">
          <div>
            © {new Date().getFullYear()} Bikers Demand Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Market: Bangladesh</span>
            <span>•</span>
            <span>Version 0.2-Beta</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
