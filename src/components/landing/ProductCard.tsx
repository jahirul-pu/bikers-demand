"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, CheckCircle, ShieldAlert, Check } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  brand: string;
  slug?: string;
  category: "riding-gear" | "parts-mods" | "electronics" | "merchandise" | "additives";
  price: number;
  originalPrice?: number;
  imageUrl: string;
  fitBadge?: string;
  isUniversal?: boolean;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  stockQty: number;
  certification?: string; // DOT / ECE 22.06
  warranty?: string; // e.g. "No Warranty" or "6 Months"
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
          size: null,
          imageUrl: product.imageUrl,
          categorySlug: product.category,
        });
      }
      localStorage.setItem("bikers_demand_cart", JSON.stringify(cartArr));
    } catch (e) {
      console.error("Failed to save cart item to storage:", e);
    }
    onAddToCart?.(product);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleFav = () => {
    const nextFav = !fav;
    setFav(nextFav);
    try {
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
    } catch (e) {
      console.error("Failed to update favorites in localStorage:", e);
    }
    onToggleFav?.(product);
  };

  // Determine fit display
  const fitsCurrentBike =
    selectedBikeName && product.fitBadge?.toLowerCase().includes(selectedBikeName.toLowerCase());

  return (
    <div className="group relative bg-asphalt-2 border border-asphalt-2 hover:border-steel/40 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Media & Badges Overlay */}
      <Link href={`/product/${productSlug}`} className="relative aspect-square bg-asphalt p-4 flex items-center justify-center overflow-hidden block">
        {/* Placeholder / Image */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Fit Badge Pill */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isUniversal ? (
            <span className="bg-asphalt/90 text-steel-light border border-steel/30 text-[10px] font-mono px-2 py-0.5 uppercase tracking-wide">
              UNIVERSAL FIT
            </span>
          ) : (
            <span className="bg-plate-yellow text-asphalt text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wide flex items-center gap-1 shadow-sm">
              <CheckCircle className="w-3 h-3 fill-asphalt text-plate-yellow" />
              <span>{fitsCurrentBike ? `FITS ${selectedBikeName}` : product.fitBadge || "MODEL SPECIFIC"}</span>
            </span>
          )}

          {/* Helmet Certification Badge */}
          {product.certification && (
            <span className="bg-ignition-red text-asphalt text-[10px] font-mono font-extrabold px-2 py-0.5 uppercase tracking-wide">
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
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors z-10 ${
            fav
              ? "bg-ignition-red text-asphalt"
              : "bg-asphalt/70 text-steel hover:text-off-white hover:bg-asphalt"
          }`}
          aria-label="Add to favorites"
        >
          <Heart className={`w-4 h-4 ${fav ? "fill-asphalt" : ""}`} />
        </button>

        {/* Stock Overlay if out of stock */}
        {product.stockStatus === "out-of-stock" && (
          <div className="absolute inset-0 bg-asphalt/80 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-asphalt border border-steel text-steel text-xs font-mono px-3 py-1 uppercase tracking-widest font-bold">
              OUT OF STOCK
            </span>
          </div>
        )}
      </Link>

      {/* Product Information Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs font-mono text-steel mb-1">
            <span className="uppercase text-plate-yellow/90 font-semibold">{product.brand}</span>
            <span className="text-[10px] capitalize text-steel">{product.category.replace("-", " ")}</span>
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
            {product.stockStatus === "in-stock" && (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                In Stock ({product.stockQty})
              </span>
            )}
            {product.stockStatus === "low-stock" && (
              <span className="text-plate-yellow flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-plate-yellow animate-ping" />
                Low Stock ({product.stockQty})
              </span>
            )}
            {product.stockStatus === "out-of-stock" && (
              <span className="text-steel flex items-center gap-1">
                Out of Stock
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
            {product.originalPrice && (
              <span className="text-xs text-steel line-through ml-1.5">
                Tk {product.originalPrice.toLocaleString("en-BD")}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stockStatus === "out-of-stock"}
            className={`px-3 py-2 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all transform -skew-x-6 ${
              added
                ? "bg-emerald-500 text-asphalt"
                : product.stockStatus === "out-of-stock"
                ? "bg-asphalt border border-steel/20 text-steel cursor-not-allowed"
                : "bg-ignition-red hover:bg-red-600 text-asphalt"
            }`}
          >
            <div className="transform skew-x-6 flex items-center gap-1">
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
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
