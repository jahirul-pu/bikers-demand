"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, CheckCircle, ShieldAlert, Check } from "lucide-react";
import AuthPromptModal from "@/components/auth/AuthPromptModal";

export interface Product {
  id: string;
  name: string;
  brand: string;
  slug?: string;
  category: "helmets" | "riding-gear" | "parts-mods" | "electronics" | "additives" | "merchandise" | string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  fitBadge?: string;
  isUniversal?: boolean;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  stockQty: number;
  certification?: string; // DOT / ECE 22.06
  warranty?: string; // e.g. "No Warranty" or "6 Months"
  sizes?: string[];
  returnPolicyNote?: string;
}

interface ProductCardProps {
  product: Product;
  selectedBikeName?: string | null;
  onAddToCart?: (product: Product) => void;
  onToggleFav?: (product: Product) => void;
  isFav?: boolean;
}

export default function ProductCard({
  product,
  selectedBikeName,
  onAddToCart,
  onToggleFav,
  isFav = false,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [fav, setFav] = useState(isFav);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const productSlug = product.slug || product.id;

  // Check if favorited in localStorage
  React.useEffect(() => {
    try {
      const existing = localStorage.getItem("bikers_demand_favs");
      if (existing) {
        const favArr: Product[] = JSON.parse(existing);
        if (favArr.some((p) => p.id === product.id)) {
          setFav(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [product.id]);

  const handleAdd = () => {
    setAdded(true);
    try {
      const existing = localStorage.getItem("bikers_demand_cart");
      let cartArr = [];
      if (existing) {
        cartArr = JSON.parse(existing);
      }
      const existingIndex = cartArr.findIndex((i: any) => i.productId === product.id || i.id === product.id);
      if (existingIndex >= 0) {
        cartArr[existingIndex].quantity += 1;
      } else {
        cartArr.push({
          id: `cart-${Date.now()}`,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: 1,
          size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : null,
          imageUrl: product.imageUrl,
          categorySlug: product.category,
        });
      }
      localStorage.setItem("bikers_demand_cart", JSON.stringify(cartArr));
      window.dispatchEvent(new CustomEvent("cart-updated"));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to save cart item to storage:", e);
    }
    onAddToCart?.(product);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleFav = () => {
    try {
      const user = localStorage.getItem("bikers_demand_user");
      if (!user) {
        // Open Auth Prompt Modal per user directive
        setShowAuthModal(true);
        return;
      }

      const nextFav = !fav;
      setFav(nextFav);
      const existing = localStorage.getItem("bikers_demand_favs");
      let favArr: Product[] = [];
      if (existing) {
        favArr = JSON.parse(existing);
      }
      if (nextFav) {
        if (!favArr.some((p) => p.id === product.id)) {
          favArr.push(product);
        }
      } else {
        favArr = favArr.filter((p) => p.id !== product.id);
      }
      localStorage.setItem("bikers_demand_favs", JSON.stringify(favArr));
      window.dispatchEvent(new CustomEvent("wishlist-updated"));
      window.dispatchEvent(new Event("storage"));
      onToggleFav?.(product);
    } catch (e) {
      console.error("Failed to update favorites in localStorage:", e);
    }
  };

  // Determine fit display
  const fitsCurrentBike =
    selectedBikeName && product.fitBadge?.toLowerCase().includes(selectedBikeName.toLowerCase());

  return (
    <div className="group relative bg-asphalt-2 border border-asphalt-2 rounded-2xl hover:border-steel/40 hover:shadow-xl hover:shadow-black/5 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Media & Badges Overlay */}
      <Link href={`/product/${productSlug}`} className="relative aspect-square bg-asphalt p-4 flex items-center justify-center overflow-hidden block">
        {/* Placeholder / Image */}
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Fit Badge Pill */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.isUniversal ? (
            <span className="bg-asphalt-2/90 backdrop-blur text-steel-light border border-asphalt-2 text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide shadow-sm">
              Universal Fit
            </span>
          ) : (
            <span className="bg-plate-yellow text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <CheckCircle className="w-3 h-3" />
              <span>{fitsCurrentBike ? `Fits ${selectedBikeName}` : product.fitBadge || "Model Specific"}</span>
            </span>
          )}

          {/* Helmet Certification Badge */}
          {product.certification && (
            <span className="bg-ignition-red text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {product.certification}
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleFav();
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-colors z-10 shadow-sm ${
            fav
              ? "bg-ignition-red text-white"
              : "bg-asphalt-2/90 backdrop-blur text-steel hover:text-ignition-red"
          }`}
          aria-label="Add to favorites"
        >
          <Heart className={`w-4 h-4 ${fav ? "fill-white" : ""}`} />
        </button>

        {/* Stock Overlay if out of stock */}
        {product.stockStatus === "out-of-stock" && (
          <div className="absolute inset-0 bg-asphalt/80 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-asphalt-2 border border-asphalt-2 text-steel rounded-full text-xs px-4 py-1.5 tracking-wide font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Information Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-steel mb-1.5">
            <span className="text-plate-yellow font-semibold">{product.brand}</span>
            <span className="text-[10px] capitalize text-steel bg-asphalt px-2 py-0.5 rounded-full">{product.category.replace("-", " ")}</span>
          </div>

          {/* Title Link */}
          <Link href={`/product/${productSlug}`}>
            <h4 className="text-sm font-semibold text-off-white group-hover:text-ignition-red transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h4>
          </Link>
        </div>

        {/* Metadata: Stock Indicator & Warranty */}
        <div className="space-y-1 pt-2 border-t border-asphalt/80 text-[11px] font-mono">
          <div className="flex items-center justify-between">
            <span className="text-steel">Stock:</span>
            {product.stockStatus === "out-of-stock" || product.stockQty <= 0 ? (
              <span className="text-red-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Out of Stock
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                In Stock ({product.stockQty})
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-steel">Warranty:</span>
            <span className={product.warranty && product.warranty !== "No Warranty" ? "text-emerald-400 font-medium" : "text-steel"}>
              {product.warranty || "No Warranty"}
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-steel">Tk </span>
            <span className="display-font text-xl font-extrabold text-off-white">
              {product.price.toLocaleString("en-BD")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xs text-steel line-through ml-1.5">
                  Tk {product.originalPrice.toLocaleString("en-BD")}
                </span>
                <span className="ml-1.5 text-[10px] font-bold bg-ignition-red text-white px-1.5 py-0.5 rounded-full">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stockStatus === "out-of-stock"}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
              added
                ? "bg-emerald-500 text-white"
                : product.stockStatus === "out-of-stock"
                ? "bg-asphalt border border-asphalt-2 text-steel cursor-not-allowed"
                : "bg-ignition-red hover:bg-red-600 text-white shadow-sm shadow-ignition-red/30"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Rider Authentication Required"
        subtitle="Please sign in or create a rider account to save items to your favorites wishlist."
      />
    </div>
  );
}
