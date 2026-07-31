import React from "react";
import ProductCard, { Product } from "./ProductCard";
import { Shield, ArrowRight } from "lucide-react";

interface RidingGearSectionProps {
  onAddToCart?: (product: Product) => void;
  onToggleFav?: (product: Product) => void;
}

export default function RidingGearSection({
  onAddToCart,
  onToggleFav,
}: RidingGearSectionProps) {
  const gearProducts: Product[] = [
    {
      id: "gear-1",
      name: "MT Thunder 4 SV Full Face Helmet (Matt Black)",
      brand: "MT Helmets",
      category: "riding-gear",
      price: 9800,
      originalPrice: 10500,
      imageUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&auto=format&fit=crop&q=80",
      isUniversal: true,
      stockStatus: "in-stock",
      stockQty: 9,
      certification: "ECE 22.06 / DOT",
      warranty: "1 Year Warranty",
    },
    {
      id: "gear-2",
      name: "All-Weather Mesh Riding Jacket with CE Level 2 Armor",
      brand: "Komine",
      category: "riding-gear",
      price: 12500,
      imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80",
      isUniversal: true,
      stockStatus: "in-stock",
      stockQty: 5,
      warranty: "1 Year Warranty",
    },
    {
      id: "gear-3",
      name: "Hard Knuckle Carbon Reinforced Leather Riding Gloves",
      brand: "Scoyco",
      category: "riding-gear",
      price: 2450,
      originalPrice: 2800,
      imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=80",
      isUniversal: true,
      stockStatus: "low-stock",
      stockQty: 2,
      warranty: "No Warranty",
    },
    {
      id: "gear-4",
      name: "Waterproof Heavy Duty 2-Piece Monsoon Rain Suit",
      brand: "Motowolf",
      category: "riding-gear",
      price: 3200,
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80",
      isUniversal: true,
      stockStatus: "in-stock",
      stockQty: 18,
      warranty: "No Warranty",
    },
  ];

  return (
    <section id="riding-gear" className="py-16 bg-asphalt border-b border-asphalt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-ignition-red" />
              <span className="text-xs font-mono text-ignition-red uppercase tracking-widest">
                UNIVERSAL SAFETY & COMFORT
              </span>
            </div>
            <h2 className="display-font text-3xl sm:text-4xl font-extrabold uppercase text-off-white tracking-wide">
              Riding Gear & Helmets
            </h2>
            <p className="text-steel text-sm mt-1">
              Certified helmets (DOT/ECE), armored jackets, gloves and rain gear — sized for every rider.
            </p>
          </div>

          <a
            href="#all-gear"
            className="bg-asphalt-2 hover:bg-asphalt border border-steel/30 text-off-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-1 transition-colors self-start md:self-auto"
          >
            <span>Browse All Riding Gear</span>
            <ArrowRight className="w-3.5 h-3.5 text-ignition-red" />
          </a>
        </div>

        {/* 4 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gearProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleFav={onToggleFav}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
