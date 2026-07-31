import React from "react";
import ProductCard, { Product } from "./ProductCard";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface CompatibleProductsProps {
  selectedBike: {
    brand: string;
    model: string;
    variant?: string;
  } | null;
  onOpenBikeModal: () => void;
  onAddToCart?: (product: Product) => void;
  onToggleFav?: (product: Product) => void;
}

export default function CompatibleProducts({
  selectedBike,
  onOpenBikeModal,
  onAddToCart,
  onToggleFav,
}: CompatibleProductsProps) {
  const bikeName = selectedBike ? `${selectedBike.brand} ${selectedBike.model}` : "Yamaha FZS-Fi v3";

  // Mock compatible products matching bike compatibility PRD specifications
  const products: Product[] = [
    {
      id: "prod-1",
      name: "Performance Slip-On Racing Exhaust (Black Coated)",
      brand: "Akrapovič Replica",
      category: "parts-mods",
      price: 6500,
      originalPrice: 7200,
      imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
      fitBadge: `Fits ${bikeName}`,
      stockStatus: "in-stock",
      stockQty: 14,
      warranty: "No Warranty",
      returnPolicyNote: "No return if opened",
    },
    {
      id: "prod-2",
      name: "O-Ring Heavy Duty Chain & Sprocket Set (428H - 132L)",
      brand: "DID Japan",
      category: "parts-mods",
      price: 3450,
      imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=80",
      fitBadge: `Fits ${bikeName}`,
      stockStatus: "in-stock",
      stockQty: 8,
      warranty: "No Warranty",
      returnPolicyNote: "No return if opened",
    },
    {
      id: "prod-3",
      name: "Adjustable 6-Stage CNC Billet Aluminum Brake & Clutch Levers",
      brand: "Racing Boy (RCB)",
      category: "parts-mods",
      price: 2200,
      originalPrice: 2500,
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=80",
      fitBadge: `Fits ${bikeName}`,
      stockStatus: "low-stock",
      stockQty: 3,
      warranty: "No Warranty",
      returnPolicyNote: "No return if opened",
    },
    {
      id: "prod-4",
      name: "Dual Lens High Power LED Fog Lights with Bracket & Relay Wire",
      brand: "Future Eye",
      category: "electronics",
      price: 2950,
      imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop&q=80",
      fitBadge: `Fits ${bikeName}`,
      stockStatus: "in-stock",
      stockQty: 22,
      warranty: "6 Months Replacement",
    },
  ];

  return (
    <section id="parts-mods" className="py-16 bg-asphalt-2/60 border-b border-asphalt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-plate-yellow" />
              <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest">
                VERIFIED BIKE COMPATIBILITY
              </span>
            </div>
            <h2 className="display-font text-3xl sm:text-4xl font-extrabold uppercase text-off-white tracking-wide">
              Compatible Parts & Mods
            </h2>
            <p className="text-steel text-sm mt-1">
              Currently showing parts matching:{" "}
              <strong className="text-plate-yellow font-mono">{bikeName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBikeModal}
              className="text-xs font-mono text-steel hover:text-plate-yellow underline underline-offset-4 transition-colors"
            >
              Change Bike Model
            </button>
            <a
              href="#all-parts"
              className="bg-asphalt hover:bg-asphalt/80 border border-steel/30 text-off-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-1 transition-colors"
            >
              <span>View All Parts</span>
              <ArrowRight className="w-3.5 h-3.5 text-ignition-red" />
            </a>
          </div>
        </div>

        {/* 4 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selectedBikeName={bikeName}
              onAddToCart={onAddToCart}
              onToggleFav={onToggleFav}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
