"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import BikeSelectorModal, { BikeOption } from "@/components/landing/BikeSelectorModal";
import { Award, Shield, ArrowRight, Search, CheckCircle2, Globe, Wrench, Zap, Droplet } from "lucide-react";

interface DBBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  website?: string | null;
  description?: string | null;
  country?: string | null;
  flag?: string | null;
  isFeatured: boolean;
  productCount?: number;
}

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBike, setSelectedBike] = useState<BikeOption | null>(null);
  const [isBikeModalOpen, setIsBikeModalOpen] = useState(false);

  const [dbBrands, setDbBrands] = useState<DBBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBrands = React.useCallback(() => {
    setIsLoading(true);
    fetch("/api/brands")
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) {
          setDbBrands(j.data);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadBrands();
    window.addEventListener("brand-updated", loadBrands);
    return () => window.removeEventListener("brand-updated", loadBrands);
  }, [loadBrands]);

  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) setDbCategories(j.data);
      })
      .catch(() => {});
  }, []);

  const filteredBrands = dbBrands.filter((brand) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      brand.name.toLowerCase().includes(q) ||
      (brand.country && brand.country.toLowerCase().includes(q)) ||
      (brand.description && brand.description.toLowerCase().includes(q))
    );
  });

  const bikeDisplayName = selectedBike
    ? `${selectedBike.brand} ${selectedBike.model}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      {/* Sticky Header & Nav */}
      <div className="sticky top-0 z-50">
        <Header
          onOpenBikeModal={() => setIsBikeModalOpen(true)}
          selectedBike={bikeDisplayName}
        />
        <Navigation
          activeCategory="brands"
          selectedBike={selectedBike}
          onOpenBikeModal={() => setIsBikeModalOpen(true)}
          onClearBike={() => setSelectedBike(null)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Page Hero */}
        <section className="bg-asphalt-2 border-b border-asphalt-2 py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-plate-yellow uppercase tracking-widest bg-asphalt px-3 py-1 border border-asphalt-2 mb-3">
              <Award className="w-4 h-4 text-plate-yellow" />
              <span>OFFICIAL BRAND DIRECTORY</span>
            </div>
            <h1 className="display-font text-3xl sm:text-5xl font-extrabold uppercase text-off-white tracking-wide">
              100% Genuine Motorcycle Brands
            </h1>
            <p className="text-steel text-sm sm:text-base max-w-2xl mx-auto mt-2 font-light">
              Explore authentic performance parts, ECE certified helmets, 12V electronics and synthetic fluids directly from world-class motorcycle manufacturers.
            </p>

            {/* Search & Filter Controls */}
            <div className="max-w-3xl mx-auto mt-8 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
                <input
                  type="text"
                  placeholder="Search brand name, country or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-asphalt border border-asphalt-2 text-off-white placeholder-steel text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:border-plate-yellow font-sans transition-colors"
                />
              </div>

              {dbCategories.length > 0 && (
                <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-2 text-xs font-mono uppercase whitespace-nowrap border transition-all ${
                      selectedCategory === "all"
                        ? "bg-plate-yellow text-asphalt font-bold border-plate-yellow"
                        : "bg-asphalt text-steel hover:text-off-white border-asphalt-2"
                    }`}
                  >
                    All Categories
                  </button>
                  {dbCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3 py-2 text-xs font-mono uppercase whitespace-nowrap border transition-all ${
                        selectedCategory === cat.slug
                          ? "bg-plate-yellow text-asphalt font-bold border-plate-yellow"
                          : "bg-asphalt text-steel hover:text-off-white border-asphalt-2"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Brands Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {filteredBrands.length === 0 ? (
            <div className="text-center py-16 bg-asphalt-2 border border-asphalt-2 p-8">
              <Award className="w-12 h-12 text-steel mx-auto mb-3 stroke-[1.5]" />
              <h3 className="display-font text-2xl font-bold uppercase text-off-white">No Brands Found</h3>
              <p className="text-steel text-sm mt-1">Try adjusting your search criteria or category filter.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 bg-plate-yellow text-asphalt px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-plate-yellow/90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/shop?brand=${encodeURIComponent(brand.name)}`}
                  className="group relative bg-asphalt-2 border border-steel/20 hover:border-plate-yellow p-5 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 shadow-lg overflow-hidden min-h-[240px]"
                >
                  {/* Background Image Overlay */}
                  {brand.logoUrl && (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity duration-500"
                      style={{ backgroundImage: `url(${brand.logoUrl})` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/90 to-asphalt/50" />

                  {/* Header: Flag & Country */}
                  <div className="relative z-10 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 bg-asphalt/90 px-2 py-0.5 border border-steel/20 text-xs">
                        <span>{brand.flag || "🌐"}</span>
                        <span className="font-mono text-steel text-[11px]">{brand.country || "Global Brand"}</span>
                      </div>
                      {brand.isFeatured && (
                        <span className="text-[10px] font-mono font-bold uppercase bg-plate-yellow/20 text-plate-yellow px-2 py-0.5 border border-plate-yellow/40">
                          Partner Brand
                        </span>
                      )}
                    </div>

                    {/* Brand Name & Description */}
                    <div>
                      <h2 className="display-font text-2xl font-extrabold uppercase text-off-white group-hover:text-plate-yellow transition-colors flex items-center justify-between">
                        <span>{brand.name}</span>
                        <ArrowRight className="w-5 h-5 text-steel group-hover:text-plate-yellow group-hover:translate-x-1 transition-all shrink-0 ml-1" />
                      </h2>
                      <p className="text-xs text-steel mt-2 font-light leading-relaxed line-clamp-3">
                        {brand.description || `Genuine ${brand.name} products available with full manufacturer warranty.`}
                      </p>
                    </div>
                  </div>

                  {/* Footer: Product Count & Action */}
                  <div className="relative z-10 mt-6 pt-3 border-t border-steel/20 flex items-center justify-between text-xs font-mono">
                    <span className="text-steel">
                      <span className="text-plate-yellow font-bold">{brand.productCount || 0}</span> products listed
                    </span>
                    <span className="text-plate-yellow font-bold group-hover:underline">
                      Shop Brand →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <BikeSelectorModal
        isOpen={isBikeModalOpen}
        onClose={() => setIsBikeModalOpen(false)}
        onSelectBike={(bike) => {
          setSelectedBike(bike);
          setIsBikeModalOpen(false);
        }}
        currentBike={selectedBike}
      />
    </div>
  );
}
