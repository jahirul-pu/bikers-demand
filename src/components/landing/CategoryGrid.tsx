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
    <section id="category-grid" className="py-10 sm:py-12 bg-asphalt border-b border-asphalt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-7">
          <span className="text-[11px] font-semibold text-ignition-red uppercase tracking-[0.18em] block mb-1">
            Explore Catalog
          </span>
          <h2 className="display-font text-2xl sm:text-3xl font-extrabold text-off-white tracking-tight">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {displayCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-asphalt-2 bg-asphalt-2 transition-all duration-300 hover:-translate-y-1.5 hover:border-ignition-red/30 hover:shadow-xl hover:shadow-black/10"
              >
                <div className="relative h-32 sm:h-36 w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-asphalt-2 via-asphalt-2/10 to-transparent" />
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    {cat.badge}
                  </span>
                </div>

                <div className="relative -mt-6 flex flex-1 flex-col px-3.5 pb-3.5">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-asphalt-2 bg-asphalt-2 shadow-sm ${cat.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="display-font mt-2.5 text-base font-bold text-off-white">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-steel">
                    {cat.tagline}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-semibold text-ignition-red">
                    Shop now
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

