import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Shield, Wrench, Zap, Droplet, Shirt, Package, ArrowUpRight } from "lucide-react";

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

function getCategoryMeta(slug: string) {
  const lower = slug.toLowerCase();
  if (lower.includes("helmet")) {
    return {
      icon: HelmetIcon,
      badge: "DOT / ECE Certified",
      image: "/images/categories/riding-gear.png",
      borderColor: "group-hover:border-ignition-red",
      iconColor: "text-ignition-red",
    };
  }
  if (lower.includes("part") || lower.includes("mod")) {
    return {
      icon: Wrench,
      badge: "Model Specific",
      image: "/images/categories/parts-mods.png",
      borderColor: "group-hover:border-plate-yellow",
      iconColor: "text-plate-yellow",
    };
  }
  if (lower.includes("electronic") || lower.includes("light") || lower.includes("gadget")) {
    return {
      icon: Zap,
      badge: "12V Plug & Play",
      image: "/images/categories/electronics.png",
      borderColor: "group-hover:border-blue-500",
      iconColor: "text-blue-400",
    };
  }
  if (lower.includes("oil") || lower.includes("additive") || lower.includes("fluid")) {
    return {
      icon: Droplet,
      badge: "100% Genuine Fluids",
      image: "/images/categories/additives.png",
      borderColor: "group-hover:border-purple-500",
      iconColor: "text-purple-400",
    };
  }
  if (lower.includes("gear") || lower.includes("wear") || lower.includes("apparel")) {
    return {
      icon: Shirt,
      badge: "CE Level 2 Armor",
      image: "/images/categories/merchandise.png",
      borderColor: "group-hover:border-emerald-500",
      iconColor: "text-emerald-400",
    };
  }
  return {
    icon: Package,
    badge: "Genuine Inventory",
    image: "/images/categories/merchandise.png",
    borderColor: "group-hover:border-plate-yellow",
    iconColor: "text-plate-yellow",
  };
}

interface CategoryGridProps {
  onSelectCategory?: (category: string) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  const loadCategories = useCallback(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setDbCategories(json.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadCategories();
    window.addEventListener("category-updated", loadCategories);
    return () => window.removeEventListener("category-updated", loadCategories);
  }, [loadCategories]);

  const defaultCategories = [
    { id: "helmets", name: "Helmets", tagline: "Full Face, Modular, Off-Road & Visors", subcategories: ["Full Face", "Modular", "Visors", "Bluetooth"] },
    { id: "parts-mods", name: "Parts & Mods", tagline: "Exhausts, Levers, Sprockets & Brakes", subcategories: ["Exhausts", "Chains", "Levers", "Brakes"] },
    { id: "electronics", name: "Electronics", tagline: "LED Lighting, Phone Mounts, Horns & Trackers", subcategories: ["LED Lights", "Phone Mounts", "GPS", "Horns"] },
    { id: "additives", name: "Additives & Oils", tagline: "Synthetic Engine Oils, Coolants & Chain Lube", subcategories: ["Synthetic Oil", "Chain Lube", "Coolant"] },
    { id: "riding-gear", name: "Riding Gear", tagline: "Armored Jackets, Gloves, Boots & Protection", subcategories: ["Jackets", "Gloves", "Boots", "Rain Suits"] },
  ];

  const displayCategories = dbCategories.length > 0
    ? dbCategories.map((c) => {
        const meta = getCategoryMeta(c.slug);
        const subs = c.children && c.children.length > 0
          ? c.children.map((child: any) => child.name)
          : [];
        return {
          id: c.slug,
          name: c.name,
          tagline: c.description || `${c.name} motorcycle accessories & gear`,
          icon: meta.icon,
          badge: c._count?.products ? `${c._count.products} Products` : meta.badge,
          image: meta.image,
          borderColor: meta.borderColor,
          iconColor: meta.iconColor,
          subcategories: subs.length > 0 ? subs : ["All Items"],
        };
      })
    : defaultCategories.map((c) => ({
        ...c,
        ...getCategoryMeta(c.id),
      }));

  return (
    <section id="category-grid" className="py-8 sm:py-10 bg-asphalt border-b border-asphalt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="text-[11px] font-mono text-plate-yellow uppercase tracking-widest block mb-0.5">
            EXPLORE CATALOG
          </span>
          <h2 className="display-font text-2xl sm:text-3xl font-extrabold uppercase text-off-white tracking-wide">
            Shop By Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {displayCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className={`group relative overflow-hidden bg-asphalt-2 border border-asphalt-2 ${cat.borderColor} p-3.5 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 shadow-lg min-w-0 min-h-[200px]`}
              >
                {/* Background Image with Vibrant Visibility */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-90"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/70 to-asphalt/30 group-hover:via-asphalt/55 transition-colors duration-300" />

                {/* Card Content */}
                <div className="relative z-10 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <div className={`p-2 bg-asphalt/90 backdrop-blur-sm border border-asphalt-2 ${cat.iconColor}`}>
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="text-[9px] font-mono uppercase bg-asphalt/90 backdrop-blur-sm text-steel px-1.5 py-0.5 border border-steel/20">
                      {cat.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="display-font text-lg sm:text-xl font-bold uppercase text-off-white group-hover:text-off-white flex items-center justify-between">
                      <span>{cat.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-steel group-hover:text-off-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-1" />
                    </h3>
                    <p className="text-[11px] text-steel mt-0.5 font-light leading-snug line-clamp-2">
                      {cat.tagline}
                    </p>
                  </div>
                </div>

                {/* Subcategories tags & Action */}
                <div className="relative z-10 mt-3.5 pt-2.5 border-t border-asphalt-2/80 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {cat.subcategories.slice(0, 4).map((sub: string) => (
                      <span
                        key={sub}
                        className="text-[9px] bg-asphalt/90 backdrop-blur-sm px-1.5 py-0.5 text-steel-light border border-asphalt-2"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end items-center text-[11px] font-mono text-steel">
                    <span className="group-hover:text-off-white transition-colors text-[10px]">
                      Browse →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

