"use client";

import React, { useState, useEffect } from "react";
import ProductCard, { Product } from "@/components/landing/ProductCard";
import { Bike, CheckCircle2, Wrench, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CompatiblePartsPage() {
  const [primaryBike, setPrimaryBike] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let bikeName = "";
    try {
      const saved = localStorage.getItem("bd_selected_bike");
      if (saved) {
        const parsed = JSON.parse(saved);
        bikeName = `${parsed.brand} ${parsed.model} ${parsed.variant || ""}`.trim();
        setPrimaryBike(bikeName);
      }
    } catch {}

    const fetchCompatible = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // Filter products compatible with this bike or universal
          const matched = json.data
            .filter((p: any) => {
              if (p.isUniversal) return true;
              if (!bikeName) return true;
              if (Array.isArray(p.compatibilities) && p.compatibilities.length > 0) {
                return p.compatibilities.some((c: any) => {
                  const b = c.bikeModel;
                  if (!b) return false;
                  const name = `${b.brand} ${b.model}`.toLowerCase();
                  return bikeName.toLowerCase().includes(b.brand.toLowerCase());
                });
              }
              return false;
            })
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              brand: p.brand,
              slug: p.slug,
              category: p.category?.slug || "parts-mods",
              price: p.price,
              originalPrice: p.comparePrice,
              imageUrl: p.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
              fitBadge: p.isUniversal ? "Universal Fit" : bikeName ? `Fits ${bikeName}` : "Verified Fit",
              stockStatus: p.stockStatus === "IN_STOCK" ? "in-stock" : p.stockStatus === "LOW_STOCK" ? "low-stock" : "out-of-stock",
              stockQty: p.stockQty ?? 0,
              warranty: p.warrantyDuration || undefined,
            }));
          setProducts(matched);
        }
      } catch (err) {
        console.error("Error fetching compatible products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompatible();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-asphalt pb-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-plate-yellow">
          <CheckCircle2 className="w-4 h-4 text-plate-yellow" />
          <span className="uppercase font-bold">MY GARAGE FIT FILTER ACTIVE</span>
        </div>
        <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
          Compatible Parts & Mods
        </h1>
        <p className="text-steel text-xs font-mono">
          Showing verified accessories, performance mods, and electronics tailored for:{" "}
          <strong className="text-plate-yellow font-extrabold">{primaryBike || "All Motorcycles"}</strong>
        </p>
      </div>

      {loading && (
        <div className="py-16 flex flex-col items-center justify-center space-y-2 text-steel font-mono text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-plate-yellow" />
          <span>Scanning compatibility matrix...</span>
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {products.length === 0 && (
            <div className="col-span-full bg-asphalt-2 p-10 border border-asphalt-2 text-center space-y-3 font-mono text-xs text-steel">
              <Wrench className="w-10 h-10 mx-auto text-steel/60" />
              <p>No compatible parts found for your selected motorcycle yet.</p>
              <Link href="/shop" className="text-plate-yellow underline inline-block">
                Browse Full Catalog
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
