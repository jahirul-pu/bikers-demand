import React from "react";
import { Shield, Wrench, Zap, Droplet, Shirt, ArrowUpRight } from "lucide-react";

interface CategoryGridProps {
  onSelectCategory?: (category: string) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const categories = [
    {
      id: "riding-gear",
      name: "Riding Gear",
      tagline: "Helmets, Jackets, Gloves & Protection",
      icon: Shield,
      count: "120+ Products",
      badge: "DOT / ECE Certified",
      bgGradient: "from-red-950/40 via-asphalt-2 to-asphalt-2",
      borderColor: "group-hover:border-ignition-red",
      iconColor: "text-ignition-red",
      subcategories: ["Helmets", "Jackets", "Gloves", "Boots", "Rain Gear"],
    },
    {
      id: "parts-mods",
      name: "Parts & Mods",
      tagline: "Exhausts, Levers, Sprockets & Brakes",
      icon: Wrench,
      count: "250+ Products",
      badge: "Model Specific",
      bgGradient: "from-amber-950/40 via-asphalt-2 to-asphalt-2",
      borderColor: "group-hover:border-plate-yellow",
      iconColor: "text-plate-yellow",
      subcategories: ["Exhausts", "Chains & Sprockets", "Levers", "Brakes"],
    },
    {
      id: "electronics",
      name: "Electronics",
      tagline: "LED Lighting, Phone Mounts, Horns & Trackers",
      icon: Zap,
      count: "80+ Products",
      badge: "12V Plug & Play",
      bgGradient: "from-blue-950/40 via-asphalt-2 to-asphalt-2",
      borderColor: "group-hover:border-blue-500",
      iconColor: "text-blue-400",
      subcategories: ["LED Fog Lights", "Phone Mounts", "GPS Trackers", "Horns"],
    },
    {
      id: "additives",
      name: "Additives & Oils",
      tagline: "Synthetic Engine Oils, Coolants & Chain Lube",
      icon: Droplet,
      count: "60+ Products",
      badge: "100% Genuine Fluids",
      bgGradient: "from-purple-950/40 via-asphalt-2 to-asphalt-2",
      borderColor: "group-hover:border-purple-500",
      iconColor: "text-purple-400",
      subcategories: ["Full Synthetic Oil", "Chain Lube", "Coolant", "Fuel Additives"],
    },
    {
      id: "merchandise",
      name: "Merchandise",
      tagline: "Riding Backpacks, Apparel, Keychains & Accessories",
      icon: Shirt,
      count: "45+ Products",
      badge: "Own Label",
      bgGradient: "from-emerald-950/40 via-asphalt-2 to-asphalt-2",
      borderColor: "group-hover:border-emerald-500",
      iconColor: "text-emerald-400",
      subcategories: ["Backpacks", "Tank Bags", "Apparel", "Keychains"],
    },
  ];

  return (
    <section id="category-grid" className="py-16 bg-asphalt border-b border-asphalt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block mb-1">
              EXPLORE CATALOG
            </span>
            <h2 className="display-font text-3xl sm:text-4xl font-extrabold uppercase text-off-white tracking-wide">
              Shop By Category
            </h2>
          </div>
          <p className="text-steel text-sm max-w-md">
            All items are owned inventory in our Dhaka fulfillment center — ready for instant packing and shipping.
          </p>
        </div>

        {/* 4 Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory?.(cat.id);
                  const el = document.getElementById(cat.id);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group relative bg-gradient-to-b ${cat.bgGradient} border border-asphalt-2 ${cat.borderColor} p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 shadow-lg`}
              >
                {/* Top Badge & Icon */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 bg-asphalt border border-asphalt-2 ${cat.iconColor}`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-asphalt/80 text-steel px-2 py-0.5 border border-steel/20">
                      {cat.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="display-font text-2xl font-bold uppercase text-off-white group-hover:text-off-white flex items-center justify-between">
                      <span>{cat.name}</span>
                      <ArrowUpRight className="w-5 h-5 text-steel group-hover:text-off-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </h3>
                    <p className="text-xs text-steel mt-1 font-light leading-relaxed">
                      {cat.tagline}
                    </p>
                  </div>
                </div>

                {/* Subcategories tags & Product Count */}
                <div className="mt-8 pt-4 border-t border-asphalt-2/80 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {cat.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] bg-asphalt px-2 py-0.5 text-steel-light border border-asphalt-2"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono text-steel">
                    <span>{cat.count}</span>
                    <span className="group-hover:text-off-white transition-colors">
                      Browse →
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
