"use client";

import React from "react";
import Link from "next/link";
import { Shield, Wrench, Zap, Droplet, Shirt, Award, HelpCircle, Bike, CheckCircle2, RefreshCw, XCircle, ArrowRight, LayoutGrid, Package } from "lucide-react";

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

function getCategoryIcon(slug: string) {
  const lower = slug.toLowerCase();
  if (lower.includes("helmet")) return HelmetIcon;
  if (lower.includes("part")) return Wrench;
  if (lower.includes("accessor")) return Shield;
  if (lower.includes("electronic") || lower.includes("light") || lower.includes("gadget")) return Zap;
  if (lower.includes("oil") || lower.includes("additive") || lower.includes("fluid")) return Droplet;
  if (lower.includes("gear") || lower.includes("wear") || lower.includes("apparel") || lower.includes("jacket")) return Shirt;
  return Package;
}

export default function Navigation({
  activeCategory,
  onSelectCategory,
  selectedBike,
  onOpenBikeModal,
  onClearBike,
}: NavigationProps) {
  const [hoveredNav, setHoveredNav] = React.useState<string | null>(null);
  const [dbCategories, setDbCategories] = React.useState<any[]>([]);

  const loadCategories = React.useCallback(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setDbCategories(json.data);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    loadCategories();
    window.addEventListener("category-updated", loadCategories);
    return () => window.removeEventListener("category-updated", loadCategories);
  }, [loadCategories]);

  // Canonical subcategory defaults matching PRD §3.1 catalog structure (fallback when DB is empty)
  const DEFAULT_SUB_MAP: Record<string, { title: string; href: string; count?: number }[]> = {
    "riding-gear": [
      { title: "Helmets", href: "/category/riding-gear?sub=helmets" },
      { title: "Jackets", href: "/category/riding-gear?sub=jackets" },
      { title: "Gloves", href: "/category/riding-gear?sub=gloves" },
      { title: "Boots", href: "/category/riding-gear?sub=boots" },
      { title: "Protection & Armor", href: "/category/riding-gear?sub=armor" },
    ],
    "parts-mods": [
      { title: "Exhausts", href: "/category/parts-mods?sub=exhausts" },
      { title: "Levers & Controls", href: "/category/parts-mods?sub=levers" },
      { title: "Chains & Sprockets", href: "/category/parts-mods?sub=chains" },
      { title: "Brake Systems", href: "/category/parts-mods?sub=brakes" },
    ],
    "electronics": [
      { title: "LED Fog Lights", href: "/category/electronics?sub=fog-lights" },
      { title: "Phone Mounts & Chargers", href: "/category/electronics?sub=phone-mounts" },
      { title: "Horns", href: "/category/electronics?sub=horns" },
      { title: "GPS & Trackers", href: "/category/electronics?sub=gps" },
    ],
    "oils-additives": [
      { title: "Engine Oil", href: "/category/oils-additives?sub=engine-oil" },
      { title: "Radiator Fluid", href: "/category/oils-additives?sub=radiator-fluid" },
      { title: "Brake Fluid", href: "/category/oils-additives?sub=brake-fluid" },
      { title: "Fuel Booster & Cleaners", href: "/category/oils-additives?sub=fuel-system-cleaner" },
    ],
    "merchandise": [
      { title: "Apparel & T-Shirts", href: "/category/merchandise?sub=apparel" },
      { title: "Riding Backpacks & Bags", href: "/category/merchandise?sub=backpacks" },
      { title: "Keychains & Stickers", href: "/category/merchandise?sub=keychains" },
    ],
  };

  // Build dynamic subcategory lookup directly from Admin Category Manager DB categories
  const dynamicSubMap = React.useMemo(() => {
    const map: Record<string, { title: string; href: string; count?: number }[]> = { ...DEFAULT_SUB_MAP };

    dbCategories.forEach((cat) => {
      if (cat.children && Array.isArray(cat.children) && cat.children.length > 0) {
        // Use live database subcategories managed in Admin
        map[cat.slug] = cat.children.map((sub: any) => ({
          title: sub.name,
          href: `/category/${cat.slug}?sub=${sub.slug}`,
          count: sub._count?.products,
        }));
      }
    });

    return map;
  }, [dbCategories]);

  const navItems = React.useMemo(() => {
    // If DB categories are loaded, use them directly respecting Admin sortOrder and custom names
    if (dbCategories.length > 0) {
      const dynamicMain = dbCategories
        .filter((cat) => cat.slug !== "helmets" && cat.slug !== "accessories")
        .map((cat) => ({
          name: cat.name,
          icon: getCategoryIcon(cat.slug),
          id: cat.slug,
          href: `/category/${cat.slug}`,
        }));

      return [
        { name: "Shop All", icon: LayoutGrid, id: "shop", href: "/shop" },
        ...dynamicMain,
        { name: "Brands", icon: Award, id: "brands", href: "/brands" },
        { name: "Help", icon: HelpCircle, id: "help", href: "/faq" },
      ];
    }

    // Initial fallback while DB query loads
    const fallbackMain = [
      { name: "Riding Gear", icon: getCategoryIcon("riding-gear"), id: "riding-gear", href: "/category/riding-gear" },
      { name: "Parts & Mods", icon: getCategoryIcon("parts-mods"), id: "parts-mods", href: "/category/parts-mods" },
      { name: "Electronics", icon: getCategoryIcon("electronics"), id: "electronics", href: "/category/electronics" },
      { name: "Oils & Additives", icon: getCategoryIcon("oils-additives"), id: "oils-additives", href: "/category/oils-additives" },
      { name: "Merchandise", icon: getCategoryIcon("merchandise"), id: "merchandise", href: "/category/merchandise" },
    ];

    return [
      { name: "Shop All", icon: LayoutGrid, id: "shop", href: "/shop" },
      ...fallbackMain,
      { name: "Brands", icon: Award, id: "brands", href: "/brands" },
      { name: "Help", icon: HelpCircle, id: "help", href: "/faq" },
    ];
  }, [dbCategories]);

  return (
    <nav className="hidden md:block bg-asphalt-2 border-b border-asphalt-2 relative z-30">
      {/* Row 1: Category links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 overflow-visible">
        <div className="flex items-center justify-center gap-1 lg:gap-2 py-2 overflow-visible whitespace-nowrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            const subs = dynamicSubMap[item.id];
            const isHovered = hoveredNav === item.id;

            return (
              <div
                key={item.id}
                className="relative group shrink-0"
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Link
                  href={item.href}
                  className={`display-font text-sm lg:text-base py-2 px-3 lg:px-4 rounded-xl flex items-center gap-2.5 transition-all ${
                    isActive || isHovered
                      ? "bg-ignition-red/10 text-ignition-red font-semibold"
                      : "text-steel-light hover:text-off-white hover:bg-asphalt"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive || isHovered ? "text-ignition-red" : "text-steel"}`} />
                  <span>{item.name}</span>
                </Link>

                {/* Subcategories Hover Mega Dropdown */}
                {subs && subs.length > 0 && isHovered && (
                  <div className="absolute top-full left-0 pt-1.5 w-64 z-[100] animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-asphalt-2 border border-steel/30 rounded-2xl shadow-2xl p-3 backdrop-blur-md">
                      <div className="text-[10px] font-semibold text-plate-yellow uppercase tracking-widest border-b border-steel/20 pb-1.5 mb-2 flex items-center justify-between">
                        <span>{item.name} Subcategories</span>
                        <span className="text-[9px] text-steel font-mono">({subs.length})</span>
                      </div>
                      <div className="space-y-1">
                        {subs.map((sub, idx) => (
                          <Link
                            key={idx}
                            href={sub.href}
                            className="flex items-center justify-between text-xs font-medium text-steel-light hover:text-off-white hover:bg-asphalt rounded-xl p-2.5 transition-colors group"
                          >
                            <span>{sub.title}</span>
                            {sub.count !== undefined && sub.count > 0 && (
                              <span className="text-[10px] font-mono text-plate-yellow font-bold bg-asphalt px-1.5 py-0.5 rounded border border-steel/15 group-hover:border-plate-yellow/30">
                                {sub.count}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Bike Selection Strip — inside nav bar */}
      <div className={`border-t ${selectedBike ? "border-plate-yellow/20" : "border-asphalt/60"} relative z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 py-3">
            {selectedBike ? (
              <>
                {/* Plate */}
                <div className="bg-plate-yellow text-asphalt px-3.5 py-1.5 rounded-lg flex items-center gap-2 font-bold shadow-sm shrink-0">
                  <Bike className="w-4 h-4" />
                  <span className="text-sm tracking-wide">
                    {selectedBike.brand} {selectedBike.model}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-plate-yellow text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Compatibility filter active</span>
                </div>

                <button
                  onClick={onOpenBikeModal}
                  className="flex items-center gap-1.5 text-sm text-steel hover:text-off-white border border-steel/30 hover:border-steel rounded-lg px-3 py-1.5 transition-colors"
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
                  className="flex items-center gap-2 bg-plate-yellow text-asphalt hover:bg-plate-yellow/90 rounded-lg px-4 py-2 text-sm font-semibold transition-colors shrink-0"
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
