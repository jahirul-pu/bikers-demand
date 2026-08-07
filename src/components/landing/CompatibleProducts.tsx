import React, { useState, useEffect } from "react";
import ProductCard, { Product } from "./ProductCard";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

interface CompatibleProductsProps {
  selectedBike: {
    brand: string;
    model: string;
    variant?: string;
  } | null;
  onOpenBikeModal: () => void;
  onAddToCart?: (product: Product) => void;
  onToggleFav?: (product: Product) => void;
}

export default function CompatibleProducts({
  selectedBike,
  onOpenBikeModal,
  onAddToCart,
  onToggleFav,
}: CompatibleProductsProps) {
  const bikeName = selectedBike
    ? `${selectedBike.brand} ${selectedBike.model} ${selectedBike.variant || ""}`.trim()
    : null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products?category=parts-mods&fields=minimal");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped: Product[] = json.data.slice(0, 4).map((p: any) => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            slug: p.slug,
            category: p.category?.slug || "parts-mods",
            price: p.price,
            originalPrice: p.comparePrice,
            imageUrl: p.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
            fitBadge: p.isUniversal ? "Universal Fit" : bikeName ? `Fits ${bikeName}` : "Select Bike to Check Fit",
            isUniversal: p.isUniversal ?? false,
            stockStatus: p.stockStatus === "IN_STOCK" ? "in-stock" : p.stockStatus === "LOW_STOCK" ? "low-stock" : "out-of-stock",
            stockQty: p.stockQty ?? 0,
            certification: p.certification !== "NONE" ? p.certification : undefined,
            warranty: p.warrantyDuration || undefined,
            returnPolicyNote: p.returnPolicyNote || undefined,
          }));
          setProducts(mapped);
        }
      } catch (e) {
        console.error("Error loading compatible products:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [bikeName]);

  return (
    <section id="parts-mods" className="py-16 bg-asphalt-2/60 border-b border-asphalt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-plate-yellow" />
              <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest">
                VERIFIED BIKE COMPATIBILITY
              </span>
            </div>
            <h2 className="display-font text-3xl sm:text-4xl font-extrabold uppercase text-off-white tracking-wide">
              Compatible Parts & Mods
            </h2>
            <p className="text-steel text-sm mt-1">
              {bikeName ? (
                <>
                  Currently showing parts matching:{" "}
                  <strong className="text-plate-yellow font-mono">{bikeName}</strong>
                </>
              ) : (
                <>
                  Showing popular parts &amp; mods.{" "}
                  <span className="text-plate-yellow font-medium">Select your bike</span> to filter by exact fitment.
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBikeModal}
              className="text-xs font-mono text-plate-yellow hover:text-off-white underline underline-offset-4 transition-colors font-bold uppercase tracking-wider"
            >
              {bikeName ? "Change Bike Model" : "+ Select My Bike"}
            </button>
            <a
              href="#all-parts"
              className="bg-asphalt hover:bg-asphalt/80 border border-steel/30 text-off-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-1 transition-colors"
            >
              <span>View All Parts</span>
              <ArrowRight className="w-3.5 h-3.5 text-ignition-red" />
            </a>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-plate-yellow animate-spin" />
            <span className="ml-2 text-steel text-sm">Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-steel text-sm">
            No compatible parts found yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selectedBikeName={bikeName || undefined}
                onAddToCart={onAddToCart}
                onToggleFav={onToggleFav}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
