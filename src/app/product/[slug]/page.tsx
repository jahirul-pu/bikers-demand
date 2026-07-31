"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import TrustSection from "@/components/landing/TrustSection";
import ProductCard, { Product } from "@/components/landing/ProductCard";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Truck,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  Share2,
  Check,
  Bike,
  Award,
  ArrowRight,
  Shield,
  Clock,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "performance-slip-on-racing-exhaust-black";

  // Product state with comprehensive mockup data matching PRD
  const [product, setProduct] = useState({
    id: "prod-1",
    sku: "PARTS-EXH-001",
    name: "Performance Slip-On Racing Exhaust (Black Coated Stainless Steel)",
    slug: "performance-slip-on-racing-exhaust-black",
    brand: "Akrapovič Replica",
    category: "Parts & Mods",
    categorySlug: "parts-mods",
    price: 6500,
    originalPrice: 7200,
    stockQty: 14,
    stockStatus: "in-stock",
    certification: "NONE", // DOT / ECE for helmets
    warranty: "No Warranty", // PRD 4.6 explicit term
    returnNote: "Parts & Mods items are non-returnable once opened or unsealed.",
    description:
      "High-flow stainless steel racing exhaust muffler engineered for 150-160cc motorcycle engines. Delivers deep bass exhaust notes, lightweight weight reduction (-2.4 kg vs OEM exhaust), and improved high-RPM exhaust gas clearance.",
    specs: [
      { key: "Material", value: "304 Stainless Steel with Heat-Resistant Matte Black Coating" },
      { key: "Inlet Diameter", value: "51mm Universal Slip-On Joint" },
      { key: "Weight", value: "1.8 kg" },
      { key: "DB Killer Included", value: "Yes (Removable Baffle Insert)" },
      { key: "Mounting Bracket", value: "Included with Mounting Springs" },
    ],
    compatibleBikes: [
      "Yamaha FZS-Fi v2 / v3 (149cc)",
      "Yamaha R15 v3 / v4 (155cc)",
      "Yamaha MT-15 v1 / v2 (155cc)",
      "Honda CB Hornet 160R (162cc)",
      "Honda XBlade 160 (162cc)",
      "Suzuki Gixxer 155 FI ABS",
      "Bajaj Pulsar N160 / NS160",
      "TVS Apache RTR 160 4V",
    ],
    images: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: [] as string[],
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "compatibility" | "policy">("compatibility");

  // Fetch product from API if slug changes
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setProduct({
            id: d.id,
            sku: d.sku,
            name: d.name,
            slug: d.slug,
            brand: d.brand,
            category: d.category?.name || "Parts & Mods",
            categorySlug: d.category?.slug || "parts-mods",
            price: d.price,
            originalPrice: d.comparePrice,
            stockQty: d.stockQty,
            stockStatus: d.stockStatus === "OUT_OF_STOCK" ? "out-of-stock" : "in-stock",
            certification: d.certification || "NONE",
            warranty: d.warrantyDuration || (d.warrantyFlag ? "6 Months Warranty" : "No Warranty"),
            returnNote: d.category?.slug === "parts-mods" ? "Parts & Mods non-returnable once opened" : "7-day return policy",
            description: d.description,
            specs: [
              { key: "SKU Code", value: d.sku },
              { key: "Brand", value: d.brand },
              { key: "Category", value: d.category?.name || "General" },
            ],
            compatibleBikes: [
              "Yamaha FZS-Fi v3",
              "Yamaha R15 v4",
              "Honda CB Hornet 160R",
              "Suzuki Gixxer 155",
              "Bajaj Pulsar N160",
            ],
            images: d.images?.length > 0 ? d.images : [
              "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80"
            ],
            sizes: d.category?.slug === "riding-gear" ? ["S", "M", "L", "XL", "XXL"] : [],
          });
        }
      } catch (e) {
        console.warn("Using product detail mockup fallback:", e);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    try {
      const existing = localStorage.getItem("bikers_demand_cart");
      let cartArr = [];
      if (existing) {
        cartArr = JSON.parse(existing);
      }
      const existingIndex = cartArr.findIndex((i: any) => i.productId === product.id || i.id === product.id);
      if (existingIndex >= 0) {
        cartArr[existingIndex].quantity += quantity;
      } else {
        cartArr.push({
          id: `cart-${Date.now()}`,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: quantity,
          size: selectedSize,
          imageUrl: product.images[0],
          categorySlug: product.categorySlug,
        });
      }
      localStorage.setItem("bikers_demand_cart", JSON.stringify(cartArr));
    } catch (e) {
      console.error("Error saving cart to storage:", e);
    }
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white font-mono text-xs">
      <Header />
      <Navigation />

      {/* Breadcrumb Bar */}
      <div className="bg-asphalt-2 border-b border-asphalt-2 py-3 px-4 text-steel">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
          <Link href="/" className="hover:text-off-white">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.categorySlug}`} className="hover:text-off-white capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-plate-yellow truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Layout */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Image */}
            <div className="relative aspect-square bg-asphalt-2 border border-steel/30 p-6 flex items-center justify-center overflow-hidden group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="bg-plate-yellow text-asphalt text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider flex items-center gap-1 shadow">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Model Specific Part</span>
                </span>

                {product.certification !== "NONE" && (
                  <span className="bg-ignition-red text-asphalt text-[11px] font-extrabold px-2.5 py-1 uppercase tracking-wider">
                    {product.certification} Certified
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 bg-asphalt-2 p-1 border transition-all cursor-pointer ${
                      selectedImage === idx
                        ? "border-plate-yellow scale-105"
                        : "border-asphalt-2 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Purchase Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-plate-yellow font-bold uppercase tracking-widest text-sm">
                  {product.brand}
                </span>
                <span className="text-steel">SKU: {product.sku}</span>
              </div>

              <h1 className="display-font text-3xl sm:text-4xl font-extrabold uppercase text-off-white tracking-wide leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <span className="display-font text-3xl font-extrabold text-plate-yellow">
                  Tk {product.price.toLocaleString("en-BD")}
                </span>
                {product.originalPrice && (
                  <span className="text-steel line-through text-base">
                    Tk {product.originalPrice.toLocaleString("en-BD")}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-ignition-red text-asphalt font-extrabold text-[10px] px-2 py-0.5 uppercase">
                    SAVE TK {(product.originalPrice - product.price).toLocaleString("en-BD")}
                  </span>
                )}
              </div>
            </div>

            {/* Stock & Warranty Badges */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-asphalt-2 border border-asphalt-2">
              <div className="space-y-0.5">
                <span className="text-steel text-[10px] uppercase block">Owned Stock Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  In Stock ({product.stockQty} Units in Dhaka Hub)
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-steel text-[10px] uppercase block">Warranty Coverage (PRD 4.6):</span>
                <span className="text-off-white font-bold">{product.warranty}</span>
              </div>
            </div>

            {/* Size Selector for Riding Gear */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-plate-yellow font-bold uppercase block">Select Size:</label>
                <div className="flex gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 border font-bold ${
                        selectedSize === s
                          ? "bg-plate-yellow text-asphalt border-plate-yellow"
                          : "bg-asphalt text-steel hover:text-off-white border-steel/30"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Cart Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-steel/30 bg-asphalt-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-steel hover:text-off-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-bold text-off-white text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-steel hover:text-off-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setIsFav(!isFav)}
                  className={`p-3 border transition-colors ${
                    isFav
                      ? "bg-ignition-red text-asphalt border-ignition-red"
                      : "bg-asphalt-2 border-steel/30 text-steel hover:text-off-white"
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFav ? "fill-asphalt" : ""}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`py-4 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transform -skew-x-6 transition-all shadow-lg ${
                    addedToCart
                      ? "bg-emerald-500 text-asphalt"
                      : "bg-asphalt-2 hover:bg-asphalt border border-plate-yellow text-plate-yellow"
                  }`}
                >
                  <div className="transform skew-x-6 flex items-center gap-2">
                    {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    <span>{addedToCart ? "ADDED TO CART" : "ADD TO CART"}</span>
                  </div>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-ignition-red hover:bg-red-600 text-asphalt py-4 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transform -skew-x-6 transition-colors shadow-xl"
                >
                  <div className="transform skew-x-6 flex items-center gap-2">
                    <span>BUY NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>

            {/* Policy Bullet Cards per PRD 4.4 & 4.5 */}
            <div className="space-y-2 pt-4 border-t border-asphalt-2 text-[11px]">
              <div className="bg-asphalt-2 p-3 border border-asphalt-2 flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-plate-yellow shrink-0 mt-0.5" />
                <div>
                  <strong className="text-off-white block uppercase">Return Policy Rule (PRD 4.5):</strong>
                  <span className="text-steel">
                    Parts & Mods items are non-returnable once opened. Unboxing photo/video evidence replacement for wrong or copy items.
                  </span>
                </div>
              </div>

              <div className="bg-asphalt-2 p-3 border border-asphalt-2 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-off-white block uppercase">Pathao Courier Shipping (PRD 4.4):</strong>
                  <span className="text-steel">
                    Tk 60 inside Dhaka metro / Tk 130 rest of Bangladesh. COD confirmation call triggered upon order.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specs, Compatibility Matrix, Policy */}
        <div className="bg-asphalt-2 p-6 sm:p-8 border border-asphalt-2 space-y-6">
          <div className="flex border-b border-asphalt space-x-6 text-sm font-bold uppercase">
            <button
              onClick={() => setActiveTab("compatibility")}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "compatibility"
                  ? "border-plate-yellow text-plate-yellow"
                  : "border-transparent text-steel hover:text-off-white"
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Confirmed Bike Compatibility</span>
            </button>

            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "specs"
                  ? "border-plate-yellow text-plate-yellow"
                  : "border-transparent text-steel hover:text-off-white"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Technical Specifications</span>
            </button>

            <button
              onClick={() => setActiveTab("policy")}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "policy"
                  ? "border-plate-yellow text-plate-yellow"
                  : "border-transparent text-steel hover:text-off-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Warranty & Policy Details</span>
            </button>
          </div>

          {/* Tab 1: Compatibility */}
          {activeTab === "compatibility" && (
            <div className="space-y-4">
              <p className="text-steel text-xs">
                This item has been verified by Bikers Demand technical team to fit the following motorcycle models:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {product.compatibleBikes.map((bike, idx) => (
                  <div key={idx} className="bg-asphalt p-3 border border-plate-yellow/30 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-plate-yellow shrink-0" />
                    <span className="text-off-white font-bold text-xs">{bike}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === "specs" && (
            <div className="space-y-3">
              <p className="text-steel text-xs leading-relaxed">{product.description}</p>
              <div className="bg-asphalt p-4 border border-asphalt-2 space-y-2">
                {product.specs.map((s, idx) => (
                  <div key={idx} className="flex justify-between border-b border-asphalt-2 pb-1.5 text-xs">
                    <span className="text-steel">{s.key}:</span>
                    <span className="text-off-white font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Policy */}
          {activeTab === "policy" && (
            <div className="space-y-3 text-xs leading-relaxed text-steel">
              <p>
                <strong className="text-off-white">Parts Return Policy:</strong> Per Section 4.5 of our store terms, Parts & Mods items are non-returnable once opened. If the wrong item or counterfeit item is delivered, replacement is processed upon unboxing video submission.
              </p>
              <p>
                <strong className="text-off-white">Warranty Term:</strong> {product.warranty}.
              </p>
            </div>
          )}
        </div>

        <TrustSection />
      </main>

      <Footer />
    </div>
  );
}
