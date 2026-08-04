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

  // Build dynamic subcategory lookup strictly from DB categories
  const dynamicSubMap: Record<string, { title: string; href: string }[]> = {};
  dbCategories.forEach((cat) => {
    if (cat.children && cat.children.length > 0) {
      dynamicSubMap[cat.slug] = cat.children.map((sub: any) => ({
        title: sub.name,
        href: `/category/${cat.slug}?sub=${sub.slug}`,
      }));
    }
  });

  const navItems = React.useMemo(() => {
    const dynamicMain = dbCategories.map((cat) => ({
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
    <nav className="hidden md:block bg-asphalt-2 border-b border-asphalt-2 relative">
      {/* Row 1: Category links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-1 lg:space-x-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            const subs = dynamicSubMap[item.id];
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
