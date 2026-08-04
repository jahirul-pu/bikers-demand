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

import { CATEGORY_SPECS, getCategorySpec } from "@/lib/categorySpecs";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  // Product state — starts null, populated from DB
  const [product, setProduct] = useState<{
    id: string;
    sku: string;
    name: string;
    slug: string;
    brand: string;
    category: string;
    categorySlug: string;
    price: number;
    originalPrice: number | null;
    stockQty: number;
    stockStatus: string;
    certification: string;
    warranty: string;
    returnNote: string;
    description: string;
    rawSpecs: Record<string, any>;
    specs: { key: string; value: string }[];
    compatibleBikes: string[];
    images: string[];
    sizes: string[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "compatibility" | "policy">("compatibility");

  // Fetch product from API
  useEffect(() => {
    if (!slug) return;
    async function fetchProduct() {
      try {
        setLoading(true);
        setNotFound(false);
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) {
          console.error(`Product API returned ${res.status} for slug: ${slug}`);
          setNotFound(true);
          return;
        }
        const json = await res.json();
        if (json.success && json.data?.product) {
          const d = json.data.product;
          const compatBikes = d.compatibilities?.map(
            (c: any) => `${c.bikeModel.brand} ${c.bikeModel.model}${c.bikeModel.variant ? ` ${c.bikeModel.variant}` : ""} (${c.bikeModel.cc}cc)`
          ) || [];

          const catSlug = d.category?.slug || "riding-gear";
          const catSpecConfig = getCategorySpec(catSlug);
          const dbSpecs: Record<string, any> = d.specs || {};

          // Build dynamic specs list
          const formattedSpecs: { key: string; value: string }[] = [
            { key: "SKU Code", value: d.sku },
            { key: "Brand", value: d.brand },
            { key: "Category", value: d.category?.name || "General" },
          ];

          if (d.subCategory) {
            formattedSpecs.push({ key: "Subcategory", value: d.subCategory });
          }

          if (catSpecConfig) {
            catSpecConfig.fields.forEach((f) => {
              if (dbSpecs[f.key] !== undefined && dbSpecs[f.key] !== null && dbSpecs[f.key] !== "") {
                const val = Array.isArray(dbSpecs[f.key]) ? dbSpecs[f.key].join(", ") : String(dbSpecs[f.key]);
                formattedSpecs.push({ key: f.label, value: val });
              }
            });
          }

          // Add any remaining unmapped specs
          Object.entries(dbSpecs).forEach(([k, v]) => {
            if (!catSpecConfig?.fields.some((f) => f.key === k) && v) {
              const val = Array.isArray(v) ? v.join(", ") : String(v);
              const label = k.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
              formattedSpecs.push({ key: label, value: val });
            }
          });

          // Resolve sizes from sizes array or specs.sizes
          const resolvedSizes =
            Array.isArray(dbSpecs.sizes) && dbSpecs.sizes.length > 0
              ? dbSpecs.sizes
              : d.sizes?.length > 0
              ? d.sizes
              : (catSlug === "riding-gear" || catSlug === "helmets")
              ? ["M", "L", "XL"]
              : [];

          setProduct({
            id: d.id,
            sku: d.sku,
            name: d.name,
            slug: d.slug,
            brand: d.brand,
            category: d.category?.name || "General",
            categorySlug: catSlug,
            price: d.price,
            originalPrice: d.comparePrice,
            stockQty: d.stockQty,
            stockStatus: d.stockStatus === "OUT_OF_STOCK" ? "out-of-stock" : d.stockStatus === "LOW_STOCK" ? "low-stock" : "in-stock",
            certification: d.certification || "NONE",
            warranty: d.warrantyDuration || (d.warrantyFlag ? "6 Months Warranty" : "No Warranty"),
            returnNote: d.returnPolicyNote || (catSlug === "parts-mods" ? "Parts & Mods items are non-returnable once opened." : "7-day return policy applies."),
            description: d.description || "",
            rawSpecs: dbSpecs,
            specs: formattedSpecs,
            compatibleBikes: compatBikes.length > 0 ? compatBikes : (d.isUniversal ? ["Universal — Fits all bikes"] : []),
            images: d.images?.length > 0 ? d.images : [
              "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80"
            ],
            sizes: resolvedSizes,
          });

          if (resolvedSizes.length > 0) {
            setSelectedSize(resolvedSizes[0]);
          }
        } else {
          setNotFound(true);
        }
      } catch (e) {
        console.error("Error fetching product:", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
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
      window.dispatchEvent(new CustomEvent("cart-updated"));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Error saving cart to storage:", e);
    }
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-asphalt text-off-white font-mono text-xs">
        <Header />
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-plate-yellow border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-steel text-sm">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-asphalt text-off-white font-mono text-xs">
        <Header />
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="display-font text-4xl font-extrabold text-plate-yellow uppercase">Product Not Found</h1>
            <p className="text-steel text-sm">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/shop" className="inline-block bg-ignition-red text-asphalt font-bold uppercase text-xs px-6 py-3 hover:bg-red-600 transition-colors">
              Browse All Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

              {/* Category Spec Highlights / Pills */}
              {product.rawSpecs && Object.keys(product.rawSpecs).length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Object.entries(product.rawSpecs).map(([key, val]) => {
                    if (!val || key === "sizes") return null;
                    const displayVal = Array.isArray(val) ? val.join(", ") : String(val);
                    return (
                      <span
                        key={key}
                        className="bg-asphalt-2 border border-steel/30 text-plate-yellow text-[10px] font-bold font-mono px-2 py-0.5 uppercase flex items-center gap-1"
                      >
                        <span className="text-steel font-normal">{key}:</span> {displayVal}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <span className="display-font text-3xl font-extrabold text-plate-yellow">
                  Tk {product.price.toLocaleString("en-BD")}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-steel line-through text-base">
                    Tk {product.originalPrice.toLocaleString("en-BD")}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="bg-ignition-red text-asphalt font-extrabold text-[10px] px-2 py-0.5 uppercase">
                    SAVE TK {(product.originalPrice - product.price).toLocaleString("en-BD")}
                  </span>
                )}
              </div>
            </div>

            {/* Stock & Warranty Badges */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-asphalt-2 border border-asphalt-2">
              <div className="space-y-0.5">
                <span className="text-steel text-[10px] uppercase block">Stock Status:</span>
                {product.stockStatus === "out-of-stock" || product.stockQty <= 0 ? (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Out of Stock
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    In Stock ({product.stockQty} Available)
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                <span className="text-steel text-[10px] uppercase block">Warranty Coverage:</span>
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

            {/* Policy Bullet Cards */}
            <div className="space-y-2 pt-4 border-t border-asphalt-2 text-[11px]">
              <div className="bg-asphalt-2 p-3 border border-asphalt-2 flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-plate-yellow shrink-0 mt-0.5" />
                <div>
                  <strong className="text-off-white block uppercase">Return Policy Rule:</strong>
                  <span className="text-steel">
                    Parts & Mods items are non-returnable once opened. Unboxing photo/video evidence replacement for wrong or copy items.
                  </span>
                </div>
              </div>

              <div className="bg-asphalt-2 p-3 border border-asphalt-2 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-off-white block uppercase">Pathao Courier Shipping:</strong>
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
