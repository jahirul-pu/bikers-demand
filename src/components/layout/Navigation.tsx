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

  // Canonical top-level categories defined by PRD §3.1 and design.md
  const CANONICAL_KEYS = [
    "riding-gear",
    "parts-mods",
    "electronics",
    "oils-additives",
    "merchandise",
  ];

    // Canonical subcategory defaults matching PRD §3.1 catalog structure
  const DEFAULT_SUB_MAP: Record<string, { title: string; href: string }[]> = {
    "riding-gear": [
      { title: "Helmets (Full Face, Modular, Visors)", href: "/category/riding-gear?sub=helmets" },
      { title: "Riding Jackets (Armored)", href: "/category/riding-gear?sub=jackets" },
      { title: "Gloves (Touchscreen, Leather)", href: "/category/riding-gear?sub=gloves" },
      { title: "Riding Boots", href: "/category/riding-gear?sub=boots" },
      { title: "Protection & Armor (Chest, Knee, Elbow)", href: "/category/riding-gear?sub=armor" },
    ],
    "parts-mods": [
      { title: "Exhausts & Performance Headers", href: "/category/parts-mods?sub=exhausts" },
      { title: "CNC Levers & Controls", href: "/category/parts-mods?sub=levers" },
      { title: "Drive Chains & Sprockets", href: "/category/parts-mods?sub=chains" },
      { title: "Brake Pads & Disc Rotors", href: "/category/parts-mods?sub=brakes" },
    ],
    "electronics": [
      { title: "LED Auxiliary Fog Lights", href: "/category/electronics?sub=fog-lights" },
      { title: "Phone Mounts & Fast Chargers", href: "/category/electronics?sub=phone-mounts" },
      { title: "Dual Tone Horns", href: "/category/electronics?sub=horns" },
      { title: "GPS Trackers & Anti-Theft", href: "/category/electronics?sub=gps" },
    ],
    "oils-additives": [
      { title: "Fully Synthetic Engine Oil (4T)", href: "/category/oils-additives?sub=engine-oil" },
      { title: "Radiator Coolants & Fluids", href: "/category/oils-additives?sub=radiator-fluid" },
      { title: "DOT 4 Brake Fluid", href: "/category/oils-additives?sub=brake-fluid" },
      { title: "Chain Lube & Fuel System Cleaner", href: "/category/oils-additives?sub=fuel-system-cleaner" },
    ],
    "merchandise": [
      { title: "Rider Apparel & T-Shirts", href: "/category/merchandise?sub=apparel" },
      { title: "Waterproof Riding Backpacks & Tank Bags", href: "/category/merchandise?sub=backpacks" },
      { title: "Keychains, Stickers & Decals", href: "/category/merchandise?sub=keychains" },
    ],
  };

  // Build dynamic subcategory lookup, seeded with default subcategories and augmented by DB
  const dynamicSubMap: Record<string, { title: string; href: string }[]> = { ...DEFAULT_SUB_MAP };
  dbCategories.forEach((cat) => {
    const targetKey = cat.slug === "helmets" ? "riding-gear" : cat.slug;
    if (cat.children && cat.children.length > 0) {
      const existing = dynamicSubMap[targetKey] || [];
      const newItems = cat.children.map((sub: any) => ({
        title: sub.name,
        href: `/category/${cat.slug}?sub=${sub.slug}`,
      }));
      // Merge unique by title
      const titles = new Set(existing.map((e) => e.title.toLowerCase()));
      const filtered = newItems.filter((n: any) => !titles.has(n.title.toLowerCase()));
      dynamicSubMap[targetKey] = [...existing, ...filtered];
    }
  });

  const navItems = React.useMemo(() => {
    // Normalization map to eliminate duplicates like "Additives & Oils" vs "Oils & Additives" or "Parts" vs "Parts & Mods"
    const normalizeSlug = (slug: string): string => {
      const s = slug.toLowerCase();
      if (s.includes("oil") || s.includes("additive") || s.includes("fluid")) return "oils-additives";
      if (s.includes("part") || s.includes("mod")) return "parts-mods";
      if (s.includes("gear") || s.includes("wear") || s.includes("apparel") || s.includes("jacket")) return "riding-gear";
      if (s.includes("electronic") || s.includes("light") || s.includes("gadget")) return "electronics";
      if (s.includes("merchandise") || s.includes("merch")) return "merchandise";
      return s;
    };

    // Default canonical categories from PRD §3.1 so nav is never empty or delayed
    const canonicalMeta: Record<string, { name: string; slug: string }> = {
      "riding-gear": { name: "Riding Gear", slug: "riding-gear" },
      "parts-mods": { name: "Parts & Mods", slug: "parts-mods" },
      "electronics": { name: "Electronics", slug: "electronics" },
      "oils-additives": { name: "Oils & Additives", slug: "oils-additives" },
      "merchandise": { name: "Merchandise", slug: "merchandise" },
    };

    // Deduplicate and filter out subcategories (e.g. "Helmets" which belongs under "Riding Gear")
    const seenSlugs = new Set<string>();
    const filteredCategories: { name: string; slug: string }[] = [];

    // Prioritize DB categories first
    dbCategories.forEach((cat) => {
      if (cat.slug === "helmets" || cat.slug === "accessories") {
        // Helmets is a subcategory of Riding Gear per PRD §3.1, not a top-level navbar item
        return;
      }
      const norm = normalizeSlug(cat.slug);
      if (!seenSlugs.has(norm) && canonicalMeta[norm]) {
        seenSlugs.add(norm);
        filteredCategories.push({
          name: canonicalMeta[norm].name,
          slug: canonicalMeta[norm].slug,
        });
      }
    });

    // Fill in any missing canonical categories so nav is always complete
    CANONICAL_KEYS.forEach((key) => {
      if (!seenSlugs.has(key)) {
        seenSlugs.add(key);
        filteredCategories.push(canonicalMeta[key]);
      }
    });

    // Sort in strict canonical PRD §3.1 order
    filteredCategories.sort((a, b) => {
      const idxA = CANONICAL_KEYS.indexOf(a.slug);
      const idxB = CANONICAL_KEYS.indexOf(b.slug);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });

    const dynamicMain = filteredCategories.map((cat) => ({
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
                            className="block text-xs font-medium text-steel-light hover:text-off-white hover:bg-asphalt rounded-xl p-2.5 transition-colors"
                          >
                            {sub.title}
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
