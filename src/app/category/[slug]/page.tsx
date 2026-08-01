"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ProductCard, { Product } from "@/components/landing/ProductCard";
import BikeSelectorModal, { BikeOption } from "@/components/landing/BikeSelectorModal";
import { Filter, SlidersHorizontal, ArrowLeft, Bike } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const slug = (params.slug as string) || "riding-gear";

  const [selectedBike, setSelectedBike] = useState<BikeOption | null>({
    brand: "Yamaha",
    model: "FZS-Fi",
    variant: "v3",
  });
  const [isBikeModalOpen, setIsBikeModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [cartCount, setCartCount] = useState(2);

  const categoryTitles: Record<string, { title: string; desc: string }> = {
    helmets: {
      title: "Helmets & Visors",
      desc: "ECE 22.06 & DOT certified full face, modular, dual-sport helmets & replacement visors.",
    },
    "riding-gear": {
      title: "Riding Gear & Protection",
      desc: "CE Level 1 & Level 2 armored jackets, racing gloves, riding boots & rain suits.",
    },
    "parts-mods": {
      title: "Parts & Mods",
      desc: "Model-specific exhausts, CNC levers, chain & sprocket kits, brake pads & body fairings.",
    },
    electronics: {
      title: "Electronics & Accessories",
      desc: "High power LED fog lights, phone mounts, horns, GPS trackers, and battery chargers.",
    },
    additives: {
      title: "Additives & Engine Oils",
      desc: "100% full synthetic 4T engine oils, coolants, chain lube sprays & fuel additives.",
    },
  };

  const currentCategoryInfo = categoryTitles[slug] || {
    title: slug.replace("-", " ").toUpperCase(),
    desc: "Browse our owned inventory of genuine motorcycle accessories.",
  };

  useEffect(() => {
    fetchProducts();
  }, [slug, selectedBrand, inStockOnly]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?category=${slug}`;
      if (selectedBrand !== "all") {
        url += `&brand=${encodeURIComponent(selectedBrand)}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        // Transform DB products to component props
        const mapped: Product[] = json.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: slug,
          price: p.price,
          originalPrice: p.comparePrice,
          imageUrl: p.images[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
          fitBadge: p.isUniversal ? "Universal Fit" : "Fits Selected Bike",
          isUniversal: p.isUniversal,
          stockStatus: p.stockQty > 5 ? "in-stock" : p.stockQty > 0 ? "low-stock" : "out-of-stock",
          stockQty: p.stockQty,
          certification: p.certification !== "NONE" ? p.certification.replace("_", " ") : undefined,
          warranty: p.warrantyFlag ? p.warrantyDuration || "Warrantied" : "No Warranty",
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const bikeDisplayName = selectedBike
    ? `${selectedBike.brand} ${selectedBike.model} ${selectedBike.variant || ""}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header
        onOpenBikeModal={() => setIsBikeModalOpen(true)}
        selectedBike={bikeDisplayName}
        cartCount={cartCount}
      />
      <Navigation activeCategory={slug} />

      {/* Category Header */}
      <div className="bg-asphalt-2 border-b border-asphalt-2 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-steel font-mono mb-2">
              <a href="/" className="hover:text-off-white">Home</a>
              <span>/</span>
              <span className="text-plate-yellow capitalize">{slug.replace("-", " ")}</span>
            </div>
            <h1 className="display-font text-4xl font-extrabold uppercase text-off-white tracking-wide">
              {currentCategoryInfo.title}
            </h1>
            <p className="text-steel text-sm max-w-xl mt-1">{currentCategoryInfo.desc}</p>
          </div>

          {/* Bike Selector Quick Action */}
          <button
            onClick={() => setIsBikeModalOpen(true)}
            className="bg-asphalt border border-plate-yellow/40 hover:border-plate-yellow p-3 flex items-center gap-3 transition-colors"
          >
            <Bike className="w-5 h-5 text-plate-yellow" />
            <div className="text-left font-mono">
              <div className="text-[10px] text-steel uppercase">ACTIVE BIKE FILTER:</div>
              <div className="text-xs font-bold text-plate-yellow">
                {bikeDisplayName || "Select Your Bike"}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Browse Body */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-6 bg-asphalt-2 p-5 border border-asphalt-2 h-fit">
            <div className="flex items-center justify-between border-b border-asphalt pb-3">
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-off-white uppercase">
                <SlidersHorizontal className="w-4 h-4 text-plate-yellow" />
                <span>Filters</span>
              </div>
              <button
                onClick={() => {
                  setSelectedBrand("all");
                  setInStockOnly(false);
                }}
                className="text-[11px] text-steel hover:text-ignition-red underline font-mono"
              >
                Reset
              </button>
            </div>

            {/* Filter by Stock */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                Availability
              </label>
              <label className="flex items-center gap-2 text-xs text-steel-light cursor-pointer hover:text-off-white">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-ignition-red"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Filter by Brand */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-asphalt border border-steel/30 text-off-white text-xs p-2.5 focus:border-ignition-red focus:outline-none font-mono"
              >
                <option value="all">All Brands</option>
                <option value="MT Helmets">MT Helmets</option>
                <option value="Komine">Komine</option>
                <option value="Akrapovič Replica">Akrapovič Replica</option>
                <option value="DID Japan">DID Japan</option>
                <option value="Racing Boy (RCB)">Racing Boy (RCB)</option>
                <option value="Future Eye">Future Eye</option>
              </select>
            </div>

            <div className="pt-4 border-t border-asphalt text-[11px] text-steel font-mono space-y-1">
              <div>✓ Owned Inventory</div>
              <div>✓ Flat Tk 60/130 Delivery</div>
              <div>✓ Cash on Delivery Available</div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center text-xs font-mono text-steel">
              <span>Showing {products.length} Products</span>
              <span>Sorted by Newest</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-steel font-mono animate-pulse">
                Loading genuine products...
              </div>
            ) : products.length === 0 ? (
              <div className="bg-asphalt-2 p-12 text-center space-y-3 border border-asphalt-2">
                <div className="text-plate-yellow font-mono text-sm uppercase">NO MATCHING PRODUCTS FOUND</div>
                <p className="text-steel text-xs">Try clearing your filters or selecting a different motorcycle model.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    selectedBikeName={bikeDisplayName}
                    onAddToCart={() => setCartCount((c) => c + 1)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <BikeSelectorModal
        isOpen={isBikeModalOpen}
        onClose={() => setIsBikeModalOpen(false)}
        onSelectBike={(b) => setSelectedBike(b)}
        currentBike={selectedBike}
      />
    </div>
  );
}
