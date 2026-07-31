"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard, { Product } from "@/components/landing/ProductCard";
import { Heart, Trash2, ShoppingBag, ArrowRight, Check } from "lucide-react";

export default function WishlistPage() {
  const [favProducts, setFavProducts] = useState<Product[]>([
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
      id: "prod-1",
      name: "Performance Slip-On Racing Exhaust (Black Coated)",
      brand: "Akrapovič Replica",
      category: "parts-mods",
      price: 6500,
      originalPrice: 7200,
      imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
      fitBadge: "Fits Yamaha FZS-Fi v3",
      stockStatus: "in-stock",
      stockQty: 14,
      warranty: "No Warranty",
    },
  ]);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bikers_demand_favs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFavProducts(parsed);
        }
      }
    } catch (e) {
      console.error("Error loading favorites from localStorage:", e);
    }
  }, []);

  const handleRemoveFav = (id: string) => {
    const updated = favProducts.filter((p) => p.id !== id);
    setFavProducts(updated);
    try {
      localStorage.setItem("bikers_demand_favs", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving favorites to localStorage:", e);
    }
  };

  const handleClearAll = () => {
    setFavProducts([]);
    try {
      localStorage.removeItem("bikers_demand_favs");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-asphalt pb-4 font-mono text-xs">
        <div>
          <span className="text-plate-yellow uppercase tracking-wider block font-bold">
            SAVED ITEMS ({favProducts.length})
          </span>
          <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
            Favorites & Wishlist
          </h1>
          <p className="text-steel mt-1">
            Keep track of helmets, exhausts, and gear you want to buy later.
          </p>
        </div>

        {favProducts.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-steel hover:text-ignition-red transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Wishlist</span>
          </button>
        )}
      </div>

      {/* Grid or Empty View */}
      {favProducts.length === 0 ? (
        <div className="bg-asphalt p-12 text-center space-y-4 border border-asphalt-2 my-8 font-mono text-xs">
          <div className="w-14 h-14 bg-asphalt-2 rounded-full border border-steel/30 flex items-center justify-center mx-auto text-steel">
            <Heart className="w-7 h-7 text-steel" />
          </div>
          <div className="space-y-1">
            <h3 className="display-font text-xl font-bold uppercase text-off-white">
              Your Wishlist is Empty
            </h3>
            <p className="text-steel font-light">
              Tap the heart icon on any product to save it to your favorites list.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase px-6 py-3 tracking-wider transition-all transform -skew-x-6 shadow"
          >
            <span className="transform skew-x-6 flex items-center gap-2">
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favProducts.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} isFav={true} />
              
              {/* Quick Remove Overlay button */}
              <button
                onClick={() => handleRemoveFav(product.id)}
                className="absolute bottom-3 right-3 bg-asphalt-2 hover:bg-ignition-red text-steel hover:text-asphalt p-2 border border-steel/30 transition-colors z-20"
                title="Remove from favorites"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
