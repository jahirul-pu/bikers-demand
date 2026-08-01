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

  const [selectedBike, setSelectedBike] = useState<BikeOption | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bd_selected_bike");
      if (saved) {
        setSelectedBike(JSON.parse(saved));
      }
    } catch {
      // silent fallback
    }
  }, []);
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
  // Category-specific filter states
  const [selectedSubtype, setSelectedSubtype] = useState<string>("all");
  const [selectedCert, setSelectedCert] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [selectedViscosity, setSelectedViscosity] = useState<string>("all");
  const [selectedFitment, setSelectedFitment] = useState<string>("all");
  const [selectedSpec, setSelectedSpec] = useState<string>("all");

  // Reset category specific filters when category slug changes
  useEffect(() => {
    setSelectedSubtype("all");
    setSelectedCert("all");
    setSelectedSize("all");
    setSelectedViscosity("all");
    setSelectedFitment("all");
    setSelectedSpec("all");
    setSelectedBrand("all");
    setInStockOnly(false);
  }, [slug]);

  // Dynamically extract all custom admin specifications across loaded products
  const availableCustomSpecs = React.useMemo(() => {
    const set = new Set<string>();
    products.forEach((p: any) => {
      if (Array.isArray(p.specifications)) {
        p.specifications.forEach((spec: string) => spec && set.add(spec.trim()));
      }
    });
    return Array.from(set);
  }, [products]);

  // Filter products based on active category-specific filters
  const filteredProducts = products.filter((p: any) => {
    if (inStockOnly && p.stockStatus === "out-of-stock") return false;
    if (selectedBrand !== "all" && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
    if (selectedSubtype !== "all" && !p.name.toLowerCase().includes(selectedSubtype.toLowerCase())) return false;
    if (selectedCert !== "all" && p.certification && !p.certification.toLowerCase().includes(selectedCert.toLowerCase())) return false;
    if (selectedSize !== "all" && Array.isArray(p.sizes) && !p.sizes.includes(selectedSize)) return false;
    if (selectedViscosity !== "all" && !p.name.toLowerCase().includes(selectedViscosity.toLowerCase()) && !p.description?.toLowerCase().includes(selectedViscosity.toLowerCase())) return false;
    if (selectedFitment === "universal" && !p.isUniversal) return false;
    if (selectedFitment === "model-specific" && p.isUniversal) return false;
    if (selectedSpec !== "all" && Array.isArray(p.specifications) && !p.specifications.includes(selectedSpec)) return false;
    return true;
  });

  const resetAllFilters = () => {
    setSelectedBrand("all");
    setInStockOnly(false);
    setSelectedSubtype("all");
    setSelectedCert("all");
    setSelectedSize("all");
    setSelectedViscosity("all");
    setSelectedFitment("all");
    setSelectedSpec("all");
  };

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
          {/* Sidebar Filters - DYNAMIC CATEGORY WISE */}
          <aside className="space-y-6 bg-asphalt-2 p-5 border border-asphalt-2 h-fit">
            <div className="flex items-center justify-between border-b border-asphalt pb-3">
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-off-white uppercase">
                <SlidersHorizontal className="w-4 h-4 text-plate-yellow" />
                <span>{currentCategoryInfo.title.split(" ")[0]} Filters</span>
              </div>
              <button
                onClick={resetAllFilters}
                className="text-[11px] text-steel hover:text-ignition-red underline font-mono"
              >
                Reset All
              </button>
            </div>

            {/* CATEGORY SPECIFIC FILTER SECTION 1: Subtype / Product Type */}
            {slug === "helmets" && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    Helmet Type
                  </label>
                  <div className="space-y-1 text-xs text-steel-light font-mono">
                    {[
                      { id: "all", label: "All Helmet Types" },
                      { id: "full face", label: "Full Face" },
                      { id: "modular", label: "Modular / Flip-Up" },
                      { id: "off-road", label: "Off-Road / MX" },
                      { id: "visor", label: "Replacement Visors" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedSubtype(opt.id)}
                        className={`w-full text-left px-2 py-1 transition-colors ${
                          selectedSubtype === opt.id
                            ? "bg-plate-yellow text-asphalt font-bold"
                            : "hover:bg-asphalt hover:text-off-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-asphalt">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    Safety Certification
                  </label>
                  <select
                    value={selectedCert}
                    onChange={(e) => setSelectedCert(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 text-off-white text-xs p-2.5 focus:border-ignition-red focus:outline-none font-mono"
                  >
                    <option value="all">All Certifications</option>
                    <option value="ECE 2206">ECE 22.06 Certified</option>
                    <option value="DOT">DOT Approved</option>
                  </select>
                </div>

                {/* Helmet Size Filter */}
                <div className="space-y-2 pt-2 border-t border-asphalt">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    Helmet Size
                  </label>
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {["all", "S", "M", "L", "XL", "XXL"].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-2.5 py-1 text-xs border transition-colors ${
                          selectedSize === sz
                            ? "bg-ignition-red text-asphalt font-extrabold border-ignition-red"
                            : "bg-asphalt text-steel hover:text-off-white border-steel/30"
                        }`}
                      >
                        {sz === "all" ? "ALL SIZES" : sz}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {slug === "riding-gear" && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    Gear Item Type
                  </label>
                  <div className="space-y-1 text-xs text-steel-light font-mono">
                    {[
                      { id: "all", label: "All Gear Items" },
                      { id: "jacket", label: "Armored Jackets" },
                      { id: "glove", label: "Racing Gloves" },
                      { id: "boot", label: "Riding Boots" },
                      { id: "rain", label: "Rain Suits" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedSubtype(opt.id)}
                        className={`w-full text-left px-2 py-1 transition-colors ${
                          selectedSubtype === opt.id
                            ? "bg-plate-yellow text-asphalt font-bold"
                            : "hover:bg-asphalt hover:text-off-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ECE / Safety Certification on Riding Gear */}
                <div className="space-y-2 pt-2 border-t border-asphalt">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    Safety Rating / Armor Level
                  </label>
                  <select
                    value={selectedCert}
                    onChange={(e) => setSelectedCert(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 text-off-white text-xs p-2.5 focus:border-ignition-red focus:outline-none font-mono"
                  >
                    <option value="all">All Armor / Ratings</option>
                    <option value="CE Level 2">CE Level 2 Armor</option>
                    <option value="CE Level 1">CE Level 1 Armor</option>
                    <option value="ECE 2206">ECE 22.06 Certified</option>
                    <option value="DOT">DOT Approved</option>
                  </select>
                </div>

                {/* Riding Gear Size Filter */}
                <div className="space-y-2 pt-2 border-t border-asphalt">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    Gear Size
                  </label>
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {["all", "S", "M", "L", "XL", "XXL"].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-2.5 py-1 text-xs border transition-colors ${
                          selectedSize === sz
                            ? "bg-ignition-red text-asphalt font-extrabold border-ignition-red"
                            : "bg-asphalt text-steel hover:text-off-white border-steel/30"
                        }`}
                      >
                        {sz === "all" ? "ALL SIZES" : sz}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {slug === "parts-mods" && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    Part Sub-System
                  </label>
                  <div className="space-y-1 text-xs text-steel-light font-mono">
                    {[
                      { id: "all", label: "All Parts & Mods" },
                      { id: "exhaust", label: "Exhaust Systems" },
                      { id: "chain", label: "Chains & Sprockets" },
                      { id: "lever", label: "CNC Levers" },
                      { id: "brake", label: "Brake Pads & Discs" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedSubtype(opt.id)}
                        className={`w-full text-left px-2 py-1 transition-colors ${
                          selectedSubtype === opt.id
                            ? "bg-plate-yellow text-asphalt font-bold"
                            : "hover:bg-asphalt hover:text-off-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-asphalt">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    Fitment Requirement
                  </label>
                  <select
                    value={selectedFitment}
                    onChange={(e) => setSelectedFitment(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 text-off-white text-xs p-2.5 focus:border-ignition-red focus:outline-none font-mono"
                  >
                    <option value="all">All Fitments</option>
                    <option value="model-specific">Model Specific Only</option>
                    <option value="universal">Universal Parts Only</option>
                  </select>
                </div>
              </>
            )}

            {slug === "electronics" && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    Device Type
                  </label>
                  <div className="space-y-1 text-xs text-steel-light font-mono">
                    {[
                      { id: "all", label: "All Electronics" },
                      { id: "fog", label: "LED Fog Lights" },
                      { id: "phone", label: "Phone Mounts" },
                      { id: "horn", label: "High Volume Horns" },
                      { id: "gps", label: "GPS Trackers" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedSubtype(opt.id)}
                        className={`w-full text-left px-2 py-1 transition-colors ${
                          selectedSubtype === opt.id
                            ? "bg-plate-yellow text-asphalt font-bold"
                            : "hover:bg-asphalt hover:text-off-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {slug === "additives" && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    Fluid Category
                  </label>
                  <div className="space-y-1 text-xs text-steel-light font-mono">
                    {[
                      { id: "all", label: "All Maintenance Fluids" },
                      { id: "oil", label: "4T Synthetic Engine Oils" },
                      { id: "lube", label: "Chain Lube & Cleaners" },
                      { id: "coolant", label: "Radiator Coolants" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedSubtype(opt.id)}
                        className={`w-full text-left px-2 py-1 transition-colors ${
                          selectedSubtype === opt.id
                            ? "bg-plate-yellow text-asphalt font-bold"
                            : "hover:bg-asphalt hover:text-off-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-asphalt">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    Oil Viscosity
                  </label>
                  <select
                    value={selectedViscosity}
                    onChange={(e) => setSelectedViscosity(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 text-off-white text-xs p-2.5 focus:border-ignition-red focus:outline-none font-mono"
                  >
                    <option value="all">All Viscosities</option>
                    <option value="10W-40">10W-40</option>
                    <option value="10W-30">10W-30</option>
                    <option value="20W-50">20W-50</option>
                  </select>
                </div>
              </>
            )}

            {/* COMMON FILTER: Brand */}
            <div className="space-y-2 pt-2 border-t border-asphalt">
              <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-asphalt border border-steel/30 text-off-white text-xs p-2.5 focus:border-ignition-red focus:outline-none font-mono"
              >
                <option value="all">All Brands</option>
                {slug === "helmets" && (
                  <>
                    <option value="MT Helmets">MT Helmets</option>
                    <option value="KYT">KYT</option>
                    <option value="HJC">HJC</option>
                    <option value="Axor">Axor</option>
                  </>
                )}
                {slug === "parts-mods" && (
                  <>
                    <option value="Akrapovič Replica">Akrapovič Replica</option>
                    <option value="DID Japan">DID Japan</option>
                    <option value="Racing Boy (RCB)">Racing Boy (RCB)</option>
                    <option value="Brembo">Brembo</option>
                  </>
                )}
                {slug === "electronics" && (
                  <>
                    <option value="Future Eye">Future Eye</option>
                    <option value="Baseus">Baseus</option>
                    <option value="TrackSolid">TrackSolid</option>
                  </>
                )}
                {slug === "additives" && (
                  <>
                    <option value="Motul">Motul</option>
                    <option value="Liqui Moly">Liqui Moly</option>
                    <option value="Yamalube">Yamalube</option>
                  </>
                )}
                {slug === "riding-gear" && (
                  <>
                    <option value="Alpinestars">Alpinestars</option>
                    <option value="Komine">Komine</option>
                    <option value="Taichi">Taichi</option>
                  </>
                )}
              </select>
            </div>

            {/* DYNAMIC FILTER: Admin Custom Specifications */}
            {availableCustomSpecs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-asphalt">
                <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                  Product Features &amp; Specs
                </label>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  <button
                    onClick={() => setSelectedSpec("all")}
                    className={`px-2 py-1 text-[11px] border transition-colors ${
                      selectedSpec === "all"
                        ? "bg-plate-yellow text-asphalt font-bold border-plate-yellow"
                        : "bg-asphalt text-steel hover:text-off-white border-steel/30"
                    }`}
                  >
                    ALL SPECS
                  </button>
                  {availableCustomSpecs.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => setSelectedSpec(spec)}
                      className={`px-2 py-1 text-[11px] border transition-colors ${
                        selectedSpec === spec
                          ? "bg-plate-yellow text-asphalt font-bold border-plate-yellow"
                          : "bg-asphalt text-steel hover:text-off-white border-steel/30"
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* COMMON FILTER: Availability */}
            <div className="space-y-2 pt-2 border-t border-asphalt">
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

            <div className="pt-4 border-t border-asphalt text-[11px] text-steel font-mono space-y-1">
              <div>✓ Owned Inventory</div>
              <div>✓ Flat Tk 60/130 Delivery</div>
              <div>✓ Cash on Delivery Available</div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center text-xs font-mono text-steel">
              <span>Showing {filteredProducts.length} Products</span>
              <span>Sorted by Newest</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-steel font-mono animate-pulse">
                Loading genuine products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-asphalt-2 border border-asphalt-2 p-12 text-center space-y-3">
                <p className="text-steel font-mono text-sm">No products found matching active filter criteria.</p>
                <button
                  onClick={resetAllFilters}
                  className="bg-plate-yellow text-asphalt px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider hover:bg-plate-yellow/90 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
