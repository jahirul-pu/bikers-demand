"use client";

import React from "react";
import Link from "next/link";
import { Shield, Wrench, Zap, Droplet, Shirt, Award, HelpCircle, Bike, CheckCircle2, RefreshCw, XCircle, ArrowRight, LayoutGrid } from "lucide-react";

interface BikeOption {
  brand: string;
  model: string;
  variant?: string;
  year?: string;
}

interface NavigationProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  selectedBike?: BikeOption | null;
  onOpenBikeModal?: () => void;
  onClearBike?: () => void;
}

export default function Navigation({
  activeCategory,
  onSelectCategory,
  selectedBike,
  onOpenBikeModal,
  onClearBike,
}: NavigationProps) {
  const navItems = [
    { name: "Shop All", icon: LayoutGrid, id: "shop", href: "/shop" },
    { name: "Riding Gear", icon: Shield, id: "riding-gear", href: "/category/riding-gear" },
    { name: "Parts & Mods", icon: Wrench, id: "parts-mods", href: "/category/parts-mods" },
    { name: "Electronics", icon: Zap, id: "electronics", href: "/category/electronics" },
    { name: "Additives & Oils", icon: Droplet, id: "additives", href: "/category/additives" },
    { name: "Merchandise", icon: Shirt, id: "merchandise", href: "/category/merchandise" },
    { name: "Brands", icon: Award, id: "brands", href: "/search?brand=all" },
    { name: "Help", icon: HelpCircle, id: "help", href: "/faq" },
  ];

  return (
    <nav className="hidden md:block bg-asphalt-2 border-b border-asphalt-2">
      {/* Row 1: Category links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-1 lg:space-x-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`display-font uppercase text-sm lg:text-base tracking-wider py-4 px-3 lg:px-4 border-b-2 flex items-center gap-2.5 transition-all ${
                  isActive
                    ? "border-ignition-red text-ignition-red font-bold bg-asphalt/50"
                    : "border-transparent text-steel-light hover:text-off-white hover:border-steel hover:bg-asphalt/30"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-ignition-red" : "text-steel"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Row 2: Bike Selection Strip — inside nav bar */}
      <div className={`border-t ${selectedBike ? "border-plate-yellow/20" : "border-asphalt/60"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 py-3">
            {selectedBike ? (
              <>
                {/* Plate */}
                <div className="bg-plate-yellow text-asphalt px-3 py-1 border border-asphalt flex items-center gap-2 font-mono font-extrabold shadow transform -skew-x-3 shrink-0">
                  <Bike className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-wide">
                    {selectedBike.brand} {selectedBike.model}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-plate-yellow text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 fill-plate-yellow text-asphalt shrink-0" />
                  <span>COMPATIBILITY FILTER ACTIVE</span>
                </div>

                <button
                  onClick={onOpenBikeModal}
                  className="flex items-center gap-1.5 text-sm text-steel hover:text-off-white border border-steel/30 hover:border-steel px-3 py-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>

                <button
                  onClick={onClearBike}
                  className="text-steel hover:text-ignition-red transition-colors"
                  title="Clear bike filter"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-steel text-sm">
                  <Bike className="w-5 h-5 shrink-0" />
                  <span>No bike selected. Select your bike to see compatible parts &amp; mods.</span>
                </div>
                <button
                  onClick={onOpenBikeModal}
                  className="flex items-center gap-2 bg-plate-yellow text-asphalt hover:bg-plate-yellow/90 px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-colors shrink-0"
                >
                  <span>Select My Bike</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
