"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ProductCard, { Product } from "@/components/landing/ProductCard";
import BikeSelectorModal, { BikeOption } from "@/components/landing/BikeSelectorModal";
import {
  CheckCircle,
  ShieldCheck,
  RotateCcw,
  Truck,
  ShoppingBag,
  Heart,
  ChevronRight,
  ShieldAlert,
  Check,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params.slug as string) || "performance-slip-on-racing-exhaust-black";

  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [selectedBike, setSelectedBike] = useState<BikeOption | null>({
    brand: "Yamaha",
    model: "FZS-Fi",
    variant: "v3",
  });
  const [isBikeModalOpen, setIsBikeModalOpen] = useState(false);

  useEffect(() => {
    fetchProductDetail();
  }, [slug]);

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${slug}`);
      const json = await res.json();
      if (json.success && json.data) {
        setProductData(json.data);
      }
    } catch (err) {
      console.error("Error fetching product detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    setAdded(true);
    setCartCount((prev) => prev + quantity);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const bikeDisplayName = selectedBike
    ? `${selectedBike.brand} ${selectedBike.model} ${selectedBike.variant || ""}`
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-asphalt text-off-white flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center font-mono text-steel">
          Loading product specifications...
        </div>
        <Footer />
      </div>
    );
  }

  const p = productData?.product || {
    name: "Performance Slip-On Racing Exhaust (Black Coated)",
    brand: "Akrapovič Replica",
    price: 6500,
    comparePrice: 7200,
    stockQty: 14,
    description:
      "High-flow stainless steel racing exhaust muffler designed for 150-160cc street bikes. Enhances exhaust note, reduces weight, and decreases backpressure.",
    category: { slug: "parts-mods", name: "Parts & Mods" },
    certification: "NONE",
    warrantyFlag: false,
    warrantyDuration: "No Warranty",
    returnPolicyNote:
      "Parts & Mods items are non-returnable once packaging is opened/torn.",
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80"],
    compatibilities: [
      { bikeModel: { brand: "Yamaha", model: "FZS-Fi", variant: "v3" } },
      { bikeModel: { brand: "Yamaha", model: "FZS-Fi", variant: "v2" } },
      { bikeModel: { brand: "Honda", model: "CB Hornet", variant: "160R ABS" } },
      { bikeModel: { brand: "TVS", model: "Apache RTR 160 4V", variant: "Special Edition" } },
    ],
  };

  const isPartsMods = p.category?.slug === "parts-mods";

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header
        onOpenBikeModal={() => setIsBikeModalOpen(true)}
        selectedBike={bikeDisplayName}
        cartCount={cartCount}
      />
      <Navigation activeCategory={p.category?.slug} />

      {/* Breadcrumb Navigation */}
      <div className="bg-asphalt-2 border-b border-asphalt-2 py-3 px-4 text-xs font-mono text-steel">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <a href="/" className="hover:text-off-white">Home</a>
          <ChevronRight className="w-3 h-3 text-steel" />
          <a href={`/category/${p.category?.slug}`} className="hover:text-off-white capitalize">
            {p.category?.name || "Category"}
          </a>
          <ChevronRight className="w-3 h-3 text-steel" />
          <span className="text-plate-yellow truncate max-w-md">{p.name}</span>
        </div>
      </div>

      {/* Product Detail Main */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-asphalt-2 border border-steel/20 aspect-square flex items-center justify-center p-6 relative overflow-hidden">
              <img
                src={p.images[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80"}
                alt={p.name}
                className="w-full h-full object-contain"
              />

              {/* Helmet Certification Badge per PRD 3.4 */}
              {p.certification && p.certification !== "NONE" && (
                <div className="absolute top-4 left-4 bg-ignition-red text-asphalt text-xs font-mono font-extrabold px-3 py-1 uppercase tracking-wider shadow-lg">
                  CERTIFIED: {p.certification.replace("_", " ")}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Specification & Purchase Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Brand & Stock Pill */}
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-plate-yellow uppercase font-bold tracking-widest text-sm">
                {p.brand}
              </span>
              <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1">
                ✓ Owned Inventory: In Stock ({p.stockQty || 14} available)
              </span>
            </div>

            {/* Product Title */}
            <h1 className="display-font text-3xl sm:text-4xl font-extrabold uppercase text-off-white tracking-wide leading-tight">
              {p.name}
            </h1>

            {/* Pricing Box */}
            <div className="bg-asphalt-2 p-4 border border-asphalt-2 flex items-baseline gap-4">
              <div>
                <span className="text-xs font-mono text-steel">Display Price (VAT Inclusive): </span>
                <span className="display-font text-3xl font-extrabold text-off-white ml-2">
                  Tk {p.price.toLocaleString("en-BD")}
                </span>
              </div>
              {p.comparePrice && (
                <span className="text-sm text-steel line-through font-mono">
                  Tk {p.comparePrice.toLocaleString("en-BD")}
                </span>
              )}
            </div>

            {/* Specific Compatibility Accordion (PRD Section 3.3) */}
            <div className="bg-asphalt-2 p-4 border border-plate-yellow/40 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-plate-yellow uppercase">
                <CheckCircle className="w-4 h-4 text-plate-yellow" />
                <span>Confirmed Bike Compatibility List:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.compatibilities && p.compatibilities.length > 0 ? (
                  p.compatibilities.map((c: any, idx: number) => (
                    <span
                      key={idx}
                      className="bg-asphalt border border-steel/30 text-off-white text-xs font-mono px-2.5 py-1"
                    >
                      Fits {c.bikeModel.brand} {c.bikeModel.model} {c.bikeModel.variant || ""}
                    </span>
                  ))
                ) : (
                  <span className="bg-asphalt border border-steel/30 text-steel-light text-xs font-mono px-2.5 py-1">
                    Universal Fit for All Motorcycle Models
                  </span>
                )}
              </div>
            </div>

            {/* Size Selector for Riding Gear */}
            {p.category?.slug === "riding-gear" && (
              <div className="space-y-2">
                <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                  Select Size (Riding Gear):
                </label>
                <div className="flex gap-2">
                  {["S", "M", "L", "XL", "2XL"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-11 h-11 text-xs font-mono font-bold border transition-all ${
                        selectedSize === sz
                          ? "bg-ignition-red text-asphalt border-ignition-red font-extrabold"
                          : "bg-asphalt border-steel/30 text-steel hover:text-off-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-steel uppercase tracking-wider block">
                Quantity:
              </label>
              <div className="flex items-center gap-3">
                <div className="flex border border-steel/30 bg-asphalt">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-steel hover:text-off-white font-mono"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-mono font-bold text-off-white flex items-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-steel hover:text-off-white font-mono"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 uppercase font-extrabold text-sm tracking-wider flex items-center justify-center gap-2 transition-all transform -skew-x-6 ${
                  added
                    ? "bg-emerald-500 text-asphalt"
                    : "bg-ignition-red hover:bg-red-600 text-asphalt"
                }`}
              >
                <div className="transform skew-x-6 flex items-center gap-2">
                  {added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                  <span>{added ? "Added to Cart" : "Add to Cart"}</span>
                </div>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-plate-yellow hover:bg-yellow-500 text-asphalt font-extrabold uppercase text-sm py-4 tracking-wider transition-all transform -skew-x-6"
              >
                <span className="transform skew-x-6 block">Buy Now (COD)</span>
              </button>
            </div>

            {/* Mandatory Policy Notices (PRD Sections 4.5 & 4.6) */}
            <div className="space-y-3 pt-4 border-t border-asphalt-2 text-xs font-mono">
              {/* Return Policy Notice Box */}
              <div className="bg-asphalt p-3 border-l-2 border-plate-yellow flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-plate-yellow shrink-0 mt-0.5" />
                <div>
                  <strong className="text-off-white block mb-0.5 uppercase">
                    Return Policy Notice:
                  </strong>
                  <span className="text-steel">
                    {isPartsMods
                      ? "Parts & Mods items are not eligible for return once the packaging/seal is opened or torn. Wrong/counterfeit items are eligible for photographic evidence replacement."
                      : "Standard 7-day return policy for unopened items in original packaging."}
                  </span>
                </div>
              </div>

              {/* Warranty Notice */}
              <div className="bg-asphalt p-3 border-l-2 border-steel flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-steel-light shrink-0 mt-0.5" />
                <div>
                  <strong className="text-off-white block mb-0.5 uppercase">Warranty Coverage:</strong>
                  <span className="text-steel font-semibold">
                    {p.warrantyDuration || "No Warranty"}
                  </span>
                </div>
              </div>

              {/* Delivery rates */}
              <div className="bg-asphalt p-3 border-l-2 border-blue-500 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-steel">
                  Nationwide Delivery: <strong className="text-off-white">Tk 60 Inside Dhaka</strong> | <strong className="text-off-white">Tk 130 Outside Dhaka</strong> (Pathao Logistics)
                </span>
              </div>
            </div>

            {/* Product Description */}
            <div className="pt-4 border-t border-asphalt-2 space-y-2">
              <h3 className="display-font text-xl font-bold uppercase text-off-white">
                Technical Description & Overview
              </h3>
              <p className="text-steel text-sm leading-relaxed font-light">{p.description}</p>
            </div>
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
