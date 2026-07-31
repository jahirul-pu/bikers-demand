"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard, { Product } from "@/components/landing/ProductCard";
import { Heart, Trash2, ArrowRight, User, Lock, Bike, Check } from "lucide-react";

export default function WishlistPage() {
  // Check auth state (Simulated login state; default false to prompt login unless authenticated)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favProducts, setFavProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const user = localStorage.getItem("bikers_demand_user");
      if (user) {
        setIsLoggedIn(true);
      }
      const saved = localStorage.getItem("bikers_demand_favs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFavProducts(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRemoveFav = (id: string) => {
    const updated = favProducts.filter((p) => p.id !== id);
    setFavProducts(updated);
    try {
      localStorage.setItem("bikers_demand_favs", JSON.stringify(updated));
    } catch (e) {
      console.error("Error updating favorites:", e);
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

  // If not logged in, display Authentication Prompt Banner per user directive
  if (!isLoggedIn) {
    return (
      <div className="bg-asphalt-2 p-8 sm:p-12 border border-steel/30 space-y-6 max-w-xl mx-auto text-center font-mono text-xs shadow-2xl my-8">
        <div className="w-14 h-14 bg-plate-yellow/20 border border-plate-yellow text-plate-yellow rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7 text-plate-yellow" />
        </div>

        <div className="space-y-2">
          <span className="text-plate-yellow font-bold uppercase tracking-widest text-[10px] block">
            RIDER AUTHENTICATION REQUIRED
          </span>
          <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
            Sign In to View Wishlist
          </h1>
          <p className="text-steel text-xs font-light leading-relaxed max-w-md mx-auto">
            Saving favorite accessories and managing your motorcycle garage requires an active rider account.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-bold uppercase">
          <Link
            href="/login"
            className="bg-ignition-red hover:bg-red-600 text-asphalt py-3.5 tracking-wider flex items-center justify-center gap-2 transform -skew-x-6 transition-all shadow-lg"
          >
            <span className="transform skew-x-6 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </span>
          </Link>

          <Link
            href="/register"
            className="bg-asphalt hover:bg-asphalt-2 border border-steel/30 text-off-white py-3.5 tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Bike className="w-4 h-4 text-plate-yellow" />
            <span>Create Rider Account</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-asphalt pb-4">
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

      {/* Wishlist Items Grid or Empty View */}
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
