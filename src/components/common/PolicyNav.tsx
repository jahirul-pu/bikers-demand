"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RotateCcw, ShieldCheck, Truck, HelpCircle, Lock, FileText, Info } from "lucide-react";

export const POLICY_LINKS = [
  { name: "Return & Replacement", href: "/returns", icon: RotateCcw, badge: "Policy" },
  { name: "Warranty Information", href: "/warranty", icon: ShieldCheck, badge: "Coverage" },
  { name: "Shipping & Delivery", href: "/shipping", icon: Truck, badge: "Pathao" },
  { name: "FAQs & Help", href: "/faq", icon: HelpCircle, badge: "Guides" },
  { name: "Privacy Policy", href: "/privacy", icon: Lock, badge: "PDPA 2026" },
  { name: "Terms of Service", href: "/terms", icon: FileText, badge: "Legal" },
  { name: "About Bikers Demand", href: "/about", icon: Info, badge: "Our Story" },
];

export default function PolicyNav() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-asphalt-2 border-y border-asphalt-2 py-3 mb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {POLICY_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-ignition-red text-white shadow-md shadow-ignition-red/20 font-bold"
                    : "bg-asphalt text-steel hover:text-off-white hover:bg-asphalt/80 border border-steel/20"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-plate-yellow"}`} />
                <span>{link.name}</span>
                {link.badge && (
                  <span
                    className={`text-[9.5px] uppercase tracking-wider px-1.5 py-0.2 rounded font-mono ${
                      isActive
                        ? "bg-white/20 text-white font-bold"
                        : "bg-asphalt-2 text-steel-light border border-steel/15"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
