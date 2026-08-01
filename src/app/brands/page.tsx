"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import BikeSelectorModal, { BikeOption } from "@/components/landing/BikeSelectorModal";
import { Award, Shield, ArrowRight, Search, CheckCircle2, Globe, Wrench, Zap, Droplet } from "lucide-react";

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  country: string;
  flag: string;
  category: string;
  description: string;
  productCount: number;
  featuredProduct: string;
  badge: string;
  logoColor: string;
  borderColor: string;
  image: string;
}

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBike, setSelectedBike] = useState<BikeOption | null>(null);
  const [isBikeModalOpen, setIsBikeModalOpen] = useState(false);

  const brands: BrandItem[] = [
    {
      id: "mt-helmets",
      name: "MT Helmets",
      slug: "mt-helmets",
      country: "Spain",
      flag: "🇪🇸",
      category: "Helmets",
      description: "European ECE 22.06 & DOT certified full-face, modular and adventure helmets.",
      productCount: 18,
      featuredProduct: "Thunder 4 SV Matt Black",
      badge: "ECE 22.06 Certified",
      logoColor: "text-ignition-red",
      borderColor: "hover:border-ignition-red",
      image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "did-japan",
      name: "DID Japan",
      slug: "did-japan",
      country: "Japan",
      flag: "🇯🇵",
      category: "Parts & Mods",
      description: "JIS certified heavy duty O-Ring & X-Ring drive chains and hardened steel sprockets.",
      productCount: 24,
      featuredProduct: "428H 132L Gold O-Ring Chain",
      badge: "Japanese Precision",
      logoColor: "text-plate-yellow",
      borderColor: "hover:border-plate-yellow",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "akrapovic",
      name: "Akrapovič Replica",
      slug: "akrapovic",
      country: "Slovenia",
      flag: "🇸🇮",
      category: "Parts & Mods",
      description: "High-flow stainless steel & carbon-tipped racing exhaust slip-on mufflers.",
      productCount: 14,
      featuredProduct: "Slip-On Racing Exhaust",
      badge: "Performance Sound",
      logoColor: "text-red-400",
      borderColor: "hover:border-red-500",
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "future-eye",
      name: "Future Eye",
      slug: "future-eye",
      country: "Taiwan",
      flag: "🇹🇼",
      category: "Electronics",
      description: "IP67 waterproof 40W dual beam LED fog light pods and wiring relay harnesses.",
      productCount: 12,
      featuredProduct: "Dual Lens High Power LED Fog Light",
      badge: "12V Plug & Play",
      logoColor: "text-blue-400",
      borderColor: "hover:border-blue-500",
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "racing-boy",
      name: "Racing Boy (RCB)",
      slug: "racing-boy",
      country: "Malaysia",
      flag: "🇲🇾",
      category: "Parts & Mods",
      description: "CNC billet aluminum 6-stage adjustable clutch/brake levers, rearsets and master cylinders.",
      productCount: 32,
      featuredProduct: "6-Stage Adjustable Billet Levers",
      badge: "CNC Machined",
      logoColor: "text-amber-400",
      borderColor: "hover:border-amber-500",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "motul",
      name: "Motul",
      slug: "motul",
      country: "France",
      flag: "🇫🇷",
      category: "Additives & Oils",
      description: "100% full synthetic 300V Factory Line & 7100 ESTER 4T motorcycle engine lubricants.",
      productCount: 16,
      featuredProduct: "7100 10W-40 4T Synthetic Oil",
      badge: "Ester Technology",
      logoColor: "text-purple-400",
      borderColor: "hover:border-purple-500",
      image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "brembo",
      name: "Brembo",
      slug: "brembo",
      country: "Italy",
      flag: "🇮🇹",
      category: "Parts & Mods",
      description: "High-friction sintered ceramic brake pads and floating stainless steel disc rotors.",
      productCount: 20,
      featuredProduct: "Sintered Road Brake Pads",
      badge: "Track Proven",
      logoColor: "text-red-500",
      borderColor: "hover:border-red-600",
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "kn-filters",
      name: "K&N Engineering",
      slug: "kn-filters",
      country: "USA",
      flag: "🇺🇸",
      category: "Parts & Mods",
      description: "High-flow washable cotton gauze air filters for increased horsepower & torque.",
      productCount: 10,
      featuredProduct: "High-Flow Washable Air Filter",
      badge: "Million Mile Warranty",
      logoColor: "text-emerald-400",
      borderColor: "hover:border-emerald-500",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600",
    },
  ];

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "Helmets", label: "Helmets" },
    { id: "Parts & Mods", label: "Parts & Mods" },
    { id: "Electronics", label: "Electronics" },
    { id: "Additives & Oils", label: "Additives & Oils" },
  ];

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-2 text-xs font-mono uppercase whitespace-nowrap border transition-all ${
                      selectedCategory === cat.id
                        ? "bg-plate-yellow text-asphalt font-bold border-plate-yellow"
                        : "bg-asphalt text-steel hover:text-off-white border-asphalt-2"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
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
                  href={`/search?brand=${encodeURIComponent(brand.name)}`}
                  className={`group relative bg-asphalt-2 border border-asphalt-2 ${brand.borderColor} p-4 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 shadow-lg overflow-hidden min-h-[260px]`}
                >
                  {/* Background Image Overlay */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 opacity-25 group-hover:opacity-40"
                    style={{ backgroundImage: `url(${brand.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/90 to-asphalt/40 group-hover:via-asphalt/75 transition-colors" />

                  {/* Header: Flag & Badge */}
                  <div className="relative z-10 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 bg-asphalt/90 px-2 py-0.5 border border-asphalt-2 text-xs">
                        <span>{brand.flag}</span>
                        <span className="font-mono text-steel text-[11px]">{brand.country}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-asphalt/90 text-steel px-2 py-0.5 border border-steel/20">
                        {brand.badge}
                      </span>
                    </div>

                    {/* Brand Name & Category */}
                    <div>
                      <h2 className="display-font text-2xl font-extrabold uppercase text-off-white group-hover:text-plate-yellow transition-colors flex items-center justify-between">
                        <span>{brand.name}</span>
                        <ArrowRight className="w-5 h-5 text-steel group-hover:text-plate-yellow group-hover:translate-x-1 transition-all shrink-0 ml-1" />
                      </h2>
                      <span className="text-xs font-mono text-steel uppercase tracking-wider block mt-0.5">
                        {brand.category}
                      </span>
                      <p className="text-xs text-steel mt-2 font-light leading-relaxed line-clamp-2">
                        {brand.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer: Featured Item & Count */}
                  <div className="relative z-10 mt-6 pt-3 border-t border-asphalt-2 space-y-2">
                    <div className="text-[11px] text-steel">
                      <span className="text-steel-light font-medium">Featured:</span>{" "}
                      <span className="text-off-white">{brand.featuredProduct}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono text-plate-yellow font-bold">
                      <span>View Products →</span>
                    </div>
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
