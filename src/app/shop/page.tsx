"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ProductCard, { Product } from "@/components/landing/ProductCard";
import BikeSelectorModal, { BikeOption } from "@/components/landing/BikeSelectorModal";
import { LocalStorageDB, DBProduct } from "@/lib/localStorageDB";
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Bike,
  LayoutGrid,
  List,
  ArrowUpDown,
  Tag,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

// ─── Filter types ────────────────────────────────────────────────────────────
type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc";
type StockFilter = "all" | "in-stock" | "low-stock";

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "riding-gear", label: "Riding Gear" },
  { id: "parts-mods", label: "Parts & Mods" },
  { id: "electronics", label: "Electronics" },
  { id: "additives", label: "Additives & Oils" },
  { id: "merchandise", label: "Merchandise" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc", label: "Name A–Z" },
];

// ─── Collapsible filter section wrapper ─────────────────────────────────────
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-asphalt pb-4 mb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-xs font-mono font-bold text-plate-yellow uppercase tracking-wider mb-3"
      >
        <span>{title}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && children}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ShopPage() {
  // Bike state
  const [selectedBike, setSelectedBike] = useState<BikeOption | null>(null);
  const [isBikeModalOpen, setIsBikeModalOpen] = useState(false);

  // Products
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(20000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [bikeCompatOnly, setBikeCompatOnly] = useState(false);
  const [universalOnly, setUniversalOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // UI
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load products + session from localStorage
  useEffect(() => {
    LocalStorageDB.init();

    // Products
    const dbProds = LocalStorageDB.getProducts();
    const mapped: Product[] = dbProds.map((p: DBProduct) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      slug: p.slug,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      imageUrl: p.imageUrl,
      fitBadge: p.fitBadge,
      isUniversal: p.isUniversal ?? true,
      stockStatus: p.stockStatus,
      stockQty: p.stockQty,
      certification: p.certification,
      warranty: p.warranty,
    }));
    setAllProducts(mapped);

    // Cart count
    try {
      const cart = JSON.parse(localStorage.getItem("bikers_demand_cart") || "[]");
      const qty = cart.reduce((s: number, i: any) => s + (i.quantity || 1), 0);
      setCartCount(qty);
    } catch {}

    // Garage / primary bike
    const garage = LocalStorageDB.getUserGarage();
    if (garage.length > 0) {
      const primary = garage[0];
      setSelectedBike({ brand: primary.brand, model: primary.model });
    }
  }, []);

  // Available brands derived from products
  const availableBrands = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.brand))).sort(),
    [allProducts]
  );

  // Price bounds derived from products
  const priceBounds = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 20000 };
    const prices = allProducts.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [allProducts]);

  // Filtered + sorted products
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    // Price range
    list = list.filter((p) => p.price >= priceMin && p.price <= priceMax);

    // Brands
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    // Stock
    if (stockFilter !== "all") {
      list = list.filter((p) => p.stockStatus === stockFilter);
    }

    // Bike compat (only filter if a bike is selected and toggle is on)
    if (bikeCompatOnly && selectedBike) {
      const bikeName = `${selectedBike.brand} ${selectedBike.model}`.toLowerCase();
      list = list.filter(
        (p) =>
          p.isUniversal ||
          (p.fitBadge && p.fitBadge.toLowerCase().includes(bikeName))
      );
    }

    // Universal only
    if (universalOnly) {
      list = list.filter((p) => p.isUniversal);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break; // newest = original order
    }

    return list;
  }, [
    allProducts,
    searchQuery,
    category,
    priceMin,
    priceMax,
    selectedBrands,
    stockFilter,
    bikeCompatOnly,
    universalOnly,
    sortBy,
    selectedBike,
  ]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setCategory("all");
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
    setSelectedBrands([]);
    setStockFilter("all");
    setBikeCompatOnly(false);
    setUniversalOnly(false);
    setSortBy("newest");
  }, [priceBounds]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category !== "all") count++;
    if (priceMin > priceBounds.min || priceMax < priceBounds.max) count++;
    if (selectedBrands.length > 0) count++;
    if (stockFilter !== "all") count++;
    if (bikeCompatOnly) count++;
    if (universalOnly) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [category, priceMin, priceMax, priceBounds, selectedBrands, stockFilter, bikeCompatOnly, universalOnly, searchQuery]);

  const bikeDisplayName = selectedBike
    ? `${selectedBike.brand} ${selectedBike.model}${selectedBike.variant ? ` ${selectedBike.variant}` : ""}`
    : null;

  // Sidebar JSX (shared between desktop and mobile drawer)
  const SidebarContent = (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-asphalt">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-plate-yellow" />
          <span className="font-mono font-bold text-sm text-off-white uppercase tracking-wider">
            Filters
          </span>
          {activeFilterCount > 0 && (
            <span className="bg-ignition-red text-asphalt text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-[11px] text-steel hover:text-ignition-red font-mono flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Search */}
      <FilterSection title="Search">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-asphalt border border-steel/30 focus:border-ignition-red text-off-white text-xs px-3 py-2 pr-8 font-mono focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-steel hover:text-off-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`w-full text-left text-xs px-2.5 py-2 font-mono transition-colors flex items-center justify-between group ${
                category === cat.id
                  ? "bg-ignition-red/20 text-ignition-red border-l-2 border-ignition-red pl-2"
                  : "text-steel-light hover:text-off-white hover:bg-asphalt/60"
              }`}
            >
              <span>{cat.label}</span>
              {category === cat.id && <CheckCircle2 className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-steel-light">
            <span>Tk {priceMin.toLocaleString("en-BD")}</span>
            <span>Tk {priceMax.toLocaleString("en-BD")}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono text-steel">
              <span className="w-6">Min</span>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={priceMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v < priceMax) setPriceMin(v);
                }}
                className="flex-1 accent-plate-yellow"
              />
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-steel">
              <span className="w-6">Max</span>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={priceMax}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v > priceMin) setPriceMax(v);
                }}
                className="flex-1 accent-ignition-red"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(Math.max(priceBounds.min, Number(e.target.value)))}
              className="bg-asphalt border border-steel/30 text-off-white text-xs px-2 py-1.5 font-mono focus:outline-none focus:border-plate-yellow w-full"
              placeholder="Min"
            />
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(Math.min(priceBounds.max, Number(e.target.value)))}
              className="bg-asphalt border border-steel/30 text-off-white text-xs px-2 py-1.5 font-mono focus:outline-none focus:border-plate-yellow w-full"
              placeholder="Max"
            />
          </div>
        </div>
      </FilterSection>

      {/* Bike Compatibility */}
      <FilterSection title="Bike Compatibility">
        <div className="space-y-2.5">
          {selectedBike ? (
            <div className="bg-plate-yellow/10 border border-plate-yellow/30 p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bike className="w-3.5 h-3.5 text-plate-yellow" />
                <span className="text-xs font-mono font-bold text-plate-yellow">
                  {bikeDisplayName}
                </span>
              </div>
              <button
                onClick={() => setIsBikeModalOpen(true)}
                className="text-[10px] text-steel hover:text-off-white font-mono"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsBikeModalOpen(true)}
              className="w-full border border-dashed border-steel/40 hover:border-plate-yellow text-steel hover:text-plate-yellow text-xs py-2 px-3 font-mono flex items-center gap-2 transition-colors"
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Select Your Bike</span>
            </button>
          )}

          <label className="flex items-center gap-2 text-xs text-steel-light cursor-pointer hover:text-off-white group">
            <input
              type="checkbox"
              checked={bikeCompatOnly}
              onChange={(e) => setBikeCompatOnly(e.target.checked)}
              disabled={!selectedBike}
              className="accent-plate-yellow disabled:opacity-40"
            />
            <span className={!selectedBike ? "opacity-40" : ""}>
              Compatible with my bike only
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs text-steel-light cursor-pointer hover:text-off-white">
            <input
              type="checkbox"
              checked={universalOnly}
              onChange={(e) => setUniversalOnly(e.target.checked)}
              className="accent-plate-yellow"
            />
            <span>Universal fit only</span>
          </label>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {availableBrands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 text-xs text-steel-light cursor-pointer hover:text-off-white group"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="accent-ignition-red"
              />
              <span className="flex-1">{brand}</span>
              <span className="text-[10px] text-steel font-mono">
                ({allProducts.filter((p) => p.brand === brand).length})
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" defaultOpen={false}>
        <div className="space-y-1.5">
          {[
            { value: "all", label: "All Products" },
            { value: "in-stock", label: "In Stock" },
            { value: "low-stock", label: "Low Stock" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-xs text-steel-light cursor-pointer hover:text-off-white"
            >
              <input
                type="radio"
                name="stock"
                checked={stockFilter === opt.value}
                onChange={() => setStockFilter(opt.value as StockFilter)}
                className="accent-ignition-red"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Trust badges */}
      <div className="pt-2 text-[10px] text-steel font-mono space-y-1 border-t border-asphalt">
        <div className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Owned Inventory</div>
        <div className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Flat Tk 60 / 130 Delivery</div>
        <div className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Cash on Delivery Available</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      {/* Sticky header + nav */}
      <div className="sticky top-0 z-50">
        <Header
          onOpenBikeModal={() => setIsBikeModalOpen(true)}
          selectedBike={bikeDisplayName}
          cartCount={cartCount}
        />
        <Navigation
          selectedBike={selectedBike}
          onOpenBikeModal={() => setIsBikeModalOpen(true)}
          onClearBike={() => setSelectedBike(null)}
        />
      </div>

      {/* Page title banner */}
      <div className="bg-asphalt-2 border-b border-asphalt-2 py-8 px-4">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-steel font-mono mb-2">
            <a href="/" className="hover:text-off-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-plate-yellow">Browse All Gear</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="display-font text-4xl md:text-5xl font-extrabold uppercase text-off-white tracking-wide leading-none">
                Browse All <span className="text-ignition-red">Gear</span>
              </h1>
              <p className="text-steel text-sm mt-2 max-w-xl">
                Explore our full owned inventory — helmets, exhausts, electronics, additives & more.
                Filter by bike compatibility, price, brand and category.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-steel">
                <span className="text-plate-yellow font-bold text-base">{filteredProducts.length}</span> products
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ── Desktop Sidebar ─────────────────────────────── */}
          <aside
            className={`hidden lg:block shrink-0 transition-all duration-300 ${
              sidebarOpen ? "w-64 xl:w-72" : "w-0 overflow-hidden"
            }`}
          >
            <div className="sticky top-[130px] bg-asphalt-2 border border-asphalt-2 p-5">
              {SidebarContent}
            </div>
          </aside>

          {/* ── Product Area ────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-asphalt">
              {/* Toggle sidebar (desktop) */}
              <button
                onClick={() => setSidebarOpen((o) => !o)}
                className="hidden lg:flex items-center gap-1.5 text-xs text-steel hover:text-off-white border border-steel/30 hover:border-steel px-3 py-2 transition-colors font-mono"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {sidebarOpen ? "Hide Filters" : "Show Filters"}
                {activeFilterCount > 0 && !sidebarOpen && (
                  <span className="bg-ignition-red text-asphalt text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Mobile filter button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden flex items-center gap-1.5 text-xs text-steel hover:text-off-white border border-steel/30 px-3 py-2 font-mono"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-ignition-red text-asphalt text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Active filter chips */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {category !== "all" && (
                  <span className="flex items-center gap-1 bg-asphalt border border-ignition-red/50 text-ignition-red text-[11px] font-mono px-2 py-1">
                    <Tag className="w-2.5 h-2.5" />
                    {CATEGORIES.find((c) => c.id === category)?.label}
                    <button onClick={() => setCategory("all")} className="ml-1 hover:text-off-white"><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {selectedBrands.map((b) => (
                  <span key={b} className="flex items-center gap-1 bg-asphalt border border-steel/40 text-steel-light text-[11px] font-mono px-2 py-1">
                    {b}
                    <button onClick={() => toggleBrand(b)} className="ml-1 hover:text-off-white"><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
                {bikeCompatOnly && selectedBike && (
                  <span className="flex items-center gap-1 bg-asphalt border border-plate-yellow/50 text-plate-yellow text-[11px] font-mono px-2 py-1">
                    <Bike className="w-2.5 h-2.5" />
                    {bikeDisplayName}
                    <button onClick={() => setBikeCompatOnly(false)} className="ml-1 hover:text-off-white"><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {/* Sort */}
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-steel" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-asphalt border border-steel/30 text-off-white text-xs px-2 py-2 font-mono focus:outline-none focus:border-plate-yellow cursor-pointer"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* View mode */}
                <div className="flex border border-steel/30">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${viewMode === "grid" ? "bg-asphalt-2 text-plate-yellow" : "text-steel hover:text-off-white"}`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${viewMode === "list" ? "bg-asphalt-2 text-plate-yellow" : "text-steel hover:text-off-white"}`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product count */}
            <p className="text-xs font-mono text-steel mb-4">
              Showing <span className="text-off-white font-bold">{filteredProducts.length}</span> of{" "}
              <span className="text-off-white">{allProducts.length}</span> products
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="ml-3 text-ignition-red hover:underline">
                  Clear all filters
                </button>
              )}
            </p>

            {/* Grid or List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-asphalt-2 border border-asphalt-2 py-20 text-center space-y-4">
                <div className="text-4xl">🔍</div>
                <div className="text-plate-yellow font-mono text-sm uppercase tracking-widest">
                  No Products Found
                </div>
                <p className="text-steel text-xs max-w-sm mx-auto">
                  Try adjusting your filters or clearing bike compatibility restrictions.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-2 bg-ignition-red text-asphalt px-6 py-2 text-xs font-bold uppercase tracking-wide hover:bg-red-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    selectedBikeName={bikeDisplayName}
                    onAddToCart={() => setCartCount((c) => c + 1)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-asphalt-2 border border-asphalt-2 hover:border-steel/40 transition-all flex gap-4 p-4"
                  >
                    <a href={`/product/${product.slug || product.id}`} className="shrink-0 w-24 h-24 bg-asphalt flex items-center justify-center overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </a>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-plate-yellow text-xs font-mono font-semibold uppercase">{product.brand}</span>
                          {product.isUniversal ? (
                            <span className="text-[10px] font-mono text-steel border border-steel/30 px-1.5 py-0.5">UNIVERSAL</span>
                          ) : (
                            <span className="text-[10px] font-mono text-asphalt bg-plate-yellow px-1.5 py-0.5 font-bold">MODEL SPECIFIC</span>
                          )}
                          {product.stockStatus === "in-stock" && (
                            <span className="text-[10px] font-mono text-emerald-400">● In Stock</span>
                          )}
                          {product.stockStatus === "low-stock" && (
                            <span className="text-[10px] font-mono text-plate-yellow">● Low Stock</span>
                          )}
                        </div>
                        <a href={`/product/${product.slug || product.id}`}>
                          <h3 className="text-sm font-semibold text-off-white hover:text-ignition-red transition-colors line-clamp-2">{product.name}</h3>
                        </a>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="text-xs font-mono text-steel">Tk </span>
                          <span className="display-font text-lg font-extrabold text-off-white">
                            {product.price.toLocaleString("en-BD")}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-steel line-through ml-2">
                              Tk {product.originalPrice.toLocaleString("en-BD")}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            try {
                              const cart = JSON.parse(localStorage.getItem("bikers_demand_cart") || "[]");
                              const idx = cart.findIndex((i: any) => i.productId === product.id);
                              if (idx >= 0) {
                                cart[idx].quantity += 1;
                              } else {
                                cart.push({ id: `cart-${Date.now()}`, productId: product.id, name: product.name, brand: product.brand, price: product.price, quantity: 1, imageUrl: product.imageUrl });
                              }
                              localStorage.setItem("bikers_demand_cart", JSON.stringify(cart));
                              setCartCount((c) => c + 1);
                            } catch {}
                          }}
                          disabled={product.stockStatus === "out-of-stock"}
                          className="bg-ignition-red hover:bg-red-600 text-asphalt text-xs font-bold uppercase px-4 py-2 transition-colors transform -skew-x-6 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <span className="transform skew-x-6 inline-block">Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile sidebar drawer overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-80 bg-asphalt-2 border-r border-asphalt h-full overflow-y-auto p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono font-bold text-sm text-off-white uppercase tracking-wider">Filters</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-steel hover:text-off-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {SidebarContent}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="mt-6 w-full bg-ignition-red text-asphalt py-3 font-bold uppercase text-sm tracking-wide hover:bg-red-600 transition-colors"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}

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
