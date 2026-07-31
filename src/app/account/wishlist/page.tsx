"use client";

import React, { useState } from "react";
import ProductCard, { Product } from "@/components/landing/ProductCard";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const [favProducts] = useState<Product[]>([
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
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-asphalt pb-4">
        <span className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
          SAVED ACCESSORIES
        </span>
        <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
          Favorites & Wishlist
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favProducts.map((product) => (
          <ProductCard key={product.id} product={product} isFav={true} />
        ))}
      </div>
    </div>
  );
}
