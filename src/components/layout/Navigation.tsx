"use client";

import React from "react";
import Link from "next/link";
import { Shield, Wrench, Zap, Droplet, Shirt, Award, HelpCircle, Bike, CheckCircle2, RefreshCw, XCircle, ArrowRight, LayoutGrid } from "lucide-react";

const HelmetIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a9 9 0 0 0-9 9v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a9 9 0 0 0-9-9z" />
    <path d="M4 11.5h16v3H4z" />
    <circle cx="12" cy="7.5" r="1" fill="currentColor" />
  </svg>
);

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
  const [hoveredNav, setHoveredNav] = React.useState<string | null>(null);

  const subCategoriesMap: Record<string, { title: string; href: string }[]> = {
    helmets: [
      { title: "Full Face Helmets", href: "/category/helmets?sub=full-face" },
      { title: "Modular & Flip-Up", href: "/category/helmets?sub=modular" },
      { title: "Off-Road & Dual Sport", href: "/category/helmets?sub=dual-sport" },
      { title: "Visors & Pinlock Anti-Fog", href: "/category/helmets?sub=visors" },
      { title: "Helmet Intercoms & Spares", href: "/category/helmets?sub=accessories" },
    ],
    "riding-gear": [
      { title: "Armored Jackets", href: "/category/riding-gear?sub=jackets" },
      { title: "Leather & Mesh Gloves", href: "/category/riding-gear?sub=gloves" },
      { title: "Riding Boots & Shoes", href: "/category/riding-gear?sub=boots" },
      { title: "Knee & Elbow Guards", href: "/category/riding-gear?sub=protection" },
      { title: "Rain Gear & Base Layers", href: "/category/riding-gear?sub=rain-gear" },
    ],
    "parts-mods": [
      { title: "Exhaust Systems & Slip-Ons", href: "/category/parts-mods?sub=exhausts" },
      { title: "High-Flow Air Filters", href: "/category/parts-mods?sub=filters" },
      { title: "Brake Pads & Rotors", href: "/category/parts-mods?sub=brakes" },
      { title: "Chains & Sprocket Kits", href: "/category/parts-mods?sub=drivetrain" },
      { title: "Handlebars & CNC Levers", href: "/category/parts-mods?sub=controls" },
    ],
    electronics: [
      { title: "Bluetooth Intercoms", href: "/category/electronics?sub=intercoms" },
      { title: "Action Cameras & Mounts", href: "/category/electronics?sub=cameras" },
      { title: "Mobile Holders & Chargers", href: "/category/electronics?sub=chargers" },
      { title: "Auxiliary LED Fog Lights", href: "/category/electronics?sub=lights" },
      { title: "Anti-Theft GPS Trackers", href: "/category/electronics?sub=security" },
    ],
    additives: [
      { title: "Full Synthetic Engine Oils", href: "/category/additives?sub=engine-oils" },
      { title: "Chain Lubes & Cleaners", href: "/category/additives?sub=chain-care" },
      { title: "Radiator Coolants", href: "/category/additives?sub=coolants" },
      { title: "Fuel Additives & Injector Cleaners", href: "/category/additives?sub=fuel-care" },
      { title: "Helmet & Visor Cleaners", href: "/category/additives?sub=polish" },
    ],
  };

  const navItems = [
    { name: "Shop All", icon: LayoutGrid, id: "shop", href: "/shop" },
    { name: "Helmets", icon: HelmetIcon, id: "helmets", href: "/category/helmets" },
    { name: "Parts & Mods", icon: Wrench, id: "parts-mods", href: "/category/parts-mods" },
    { name: "Electronics", icon: Zap, id: "electronics", href: "/category/electronics" },
    { name: "Additives & Oils", icon: Droplet, id: "additives", href: "/category/additives" },
    { name: "Riding Gear", icon: Shirt, id: "riding-gear", href: "/category/riding-gear" },
    { name: "Brands", icon: Award, id: "brands", href: "/brands" },
    { name: "Help", icon: HelpCircle, id: "help", href: "/faq" },
  ];

  return (
    <nav className="hidden md:block bg-asphalt-2 border-b border-asphalt-2 relative">
      {/* Row 1: Category links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-1 lg:space-x-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            const subs = subCategoriesMap[item.id];
            const isHovered = hoveredNav === item.id;

            return (
              <div
                key={item.id}
                className="relative group"
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Link
                  href={item.href}
                  className={`display-font uppercase text-sm lg:text-base tracking-wider py-4 px-3 lg:px-4 border-b-2 flex items-center gap-2.5 transition-all ${
                    isActive || isHovered
                      ? "border-ignition-red text-ignition-red font-bold bg-asphalt/50"
                      : "border-transparent text-steel-light hover:text-off-white hover:border-steel hover:bg-asphalt/30"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive || isHovered ? "text-ignition-red" : "text-steel"}`} />
                  <span>{item.name}</span>
                </Link>

                {/* Subcategories Hover Mega Dropdown */}
                {subs && isHovered && (
                  <div className="absolute top-full left-0 w-64 bg-asphalt-2 border border-steel/30 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="text-[10px] font-mono font-bold text-plate-yellow uppercase tracking-widest border-b border-steel/20 pb-1.5 mb-2">
                      Subcategories
                    </div>
                    <div className="space-y-1">
                      {subs.map((sub, idx) => (
                        <Link
                          key={idx}
                          href={sub.href}
                          className="block text-xs font-mono text-steel-light hover:text-off-white hover:bg-asphalt p-2 transition-colors border-l-2 border-transparent hover:border-plate-yellow"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
