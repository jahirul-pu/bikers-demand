"use client";

import React, { useState } from "react";
import ProductCard, { Product } from "@/components/landing/ProductCard";
import { Bike, CheckCircle2, Wrench, ArrowRight } from "lucide-react";

import { LocalStorageDB } from "@/lib/localStorageDB";

export default function CompatiblePartsPage() {
  const [primaryBike, setPrimaryBike] = useState<string | null>(null);

  React.useEffect(() => {
    try {
      const garage = LocalStorageDB.getUserGarage();
      if (garage.length > 0) {
        setPrimaryBike(`${garage[0].brand} ${garage[0].model}`);
      } else {
        const saved = localStorage.getItem("bd_selected_bike");
        if (saved) {
          const parsed = JSON.parse(saved);
          setPrimaryBike(`${parsed.brand} ${parsed.model}`);
        }
      }
    } catch {
      // silent
    }
  }, []);

  const compatibleProducts: Product[] = [
    {
      id: "prod-1",
      name: "Performance Slip-On Racing Exhaust (Black Coated)",
      brand: "Akrapovič Replica",
      category: "parts-mods",
      price: 6500,
      originalPrice: 7200,
      imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
      fitBadge: primaryBike ? `Fits ${primaryBike}` : "Select Bike to Check Fit",
      stockStatus: "in-stock",
      stockQty: 14,
      warranty: "No Warranty",
    },
    {
      id: "prod-2",
      name: "O-Ring Heavy Duty Chain & Sprocket Set (428H - 132L)",
      brand: "DID Japan",
      category: "parts-mods",
      price: 3450,
      imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=80",
      fitBadge: primaryBike ? `Fits ${primaryBike}` : "Select Bike to Check Fit",
      stockStatus: "in-stock",
      stockQty: 8,
      warranty: "No Warranty",
    },
    {
      id: "prod-3",
      name: "Adjustable 6-Stage CNC Billet Aluminum Brake & Clutch Levers",
      brand: "Racing Boy (RCB)",
      category: "parts-mods",
      price: 2200,
      originalPrice: 2500,
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=80",
      fitBadge: primaryBike ? `Fits ${primaryBike}` : "Select Bike to Check Fit",
      stockStatus: "low-stock",
      stockQty: 3,
      warranty: "No Warranty",
    },
    {
      id: "prod-4",
      name: "Dual Lens High Power LED Fog Lights with Bracket & Relay Wire",
      brand: "Future Eye",
      category: "electronics",
      price: 2950,
      imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop&q=80",
      fitBadge: `Fits ${primaryBike}`,
      stockStatus: "in-stock",
      stockQty: 22,
      warranty: "6 Months Replacement",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-asphalt pb-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-plate-yellow">
          <CheckCircle2 className="w-4 h-4 text-plate-yellow" />
          <span className="uppercase font-bold">MY GARAGE FIT FILTER ACTIVE</span>
        </div>
        <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
          Compatible Parts for {primaryBike}
        </h1>
        <p className="text-steel text-xs font-mono">
          Showing parts, mods, and electronics matching your primary saved machine.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {compatibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selectedBikeName={primaryBike}
          />
        ))}
      </div>
    </div>
  );
}
