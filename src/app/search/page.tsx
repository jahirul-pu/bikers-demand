"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ProductCard, { Product } from "@/components/landing/ProductCard";
import BikeSelectorModal, { BikeOption } from "@/components/landing/BikeSelectorModal";
import { Search } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBike, setSelectedBike] = useState<BikeOption | null>({
    brand: "Yamaha",
    model: "FZS-Fi",
    variant: "v3",
  });
  const [isBikeModalOpen, setIsBikeModalOpen] = useState(false);

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.success && json.data) {
        const mapped: Product[] = json.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category?.slug || "parts-mods",
          price: p.price,
          originalPrice: p.comparePrice,
          imageUrl: p.images[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
          fitBadge: p.isUniversal ? "Universal Fit" : "Model Specific",
          isUniversal: p.isUniversal,
          stockStatus: p.stockQty > 0 ? "in-stock" : "out-of-stock",
          stockQty: p.stockQty,
          warranty: p.warrantyFlag ? "Warrantied" : "No Warranty",
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.error("Search error:", err);
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
      />
      <Navigation />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div className="border-b border-asphalt-2 pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block mb-1">
              SEARCH RESULTS
            </span>
            <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
              Query: "{query}"
            </h1>
          </div>
          <span className="text-xs font-mono text-steel">Found {products.length} Products</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-steel font-mono animate-pulse">
            Searching genuine inventory...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-asphalt-2 p-12 text-center space-y-3 border border-asphalt-2 my-8">
            <Search className="w-10 h-10 text-steel mx-auto" />
            <div className="text-plate-yellow font-mono text-sm uppercase">NO PRODUCTS MATCHING "{query}"</div>
            <p className="text-steel text-xs">Try searching for helmets, exhausts, LED lights, or chain sets.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} selectedBikeName={bikeDisplayName} />
            ))}
          </div>
        )}
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="bg-asphalt min-h-screen text-off-white p-8">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
