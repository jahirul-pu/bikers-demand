import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard, { Product } from "./ProductCard";
import { Shield, ArrowRight, Loader2 } from "lucide-react";

interface RidingGearSectionProps {
  onAddToCart?: (product: Product) => void;
  onToggleFav?: (product: Product) => void;
}

export default function RidingGearSection({
  onAddToCart,
  onToggleFav,
}: RidingGearSectionProps) {
  const [gearProducts, setGearProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGear = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products?category=riding-gear");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped: Product[] = json.data.slice(0, 4).map((p: any) => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            slug: p.slug,
            category: "riding-gear",
            price: p.price,
            originalPrice: p.comparePrice,
            imageUrl: p.images?.[0] || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&auto=format&fit=crop&q=80",
            isUniversal: p.isUniversal ?? true,
            stockStatus: p.stockStatus === "IN_STOCK" ? "in-stock" : p.stockStatus === "LOW_STOCK" ? "low-stock" : "out-of-stock",
            stockQty: p.stockQty ?? 0,
            certification: p.certification !== "NONE" ? p.certification : undefined,
            warranty: p.warrantyDuration || undefined,
          }));
          setGearProducts(mapped);
        }
      } catch (e) {
        console.error("Error loading riding gear:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchGear();
  }, []);

  return (
    <section id="riding-gear" className="py-16 bg-asphalt border-b border-asphalt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-ignition-red" />
              <span className="text-xs font-mono text-ignition-red uppercase tracking-widest">
                UNIVERSAL SAFETY & COMFORT
              </span>
            </div>
            <h2 className="display-font text-3xl sm:text-4xl font-extrabold uppercase text-off-white tracking-wide">
              Riding Gear & Helmets
            </h2>
            <p className="text-steel text-sm mt-1">
              Certified helmets (DOT/ECE), armored jackets, gloves and rain gear — sized for every rider.
            </p>
          </div>

          <Link
            href="/category/riding-gear"
            className="bg-asphalt-2 hover:bg-asphalt border border-steel/30 text-off-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-1 transition-colors self-start md:self-auto"
          >
            <span>Browse All Riding Gear</span>
            <ArrowRight className="w-3.5 h-3.5 text-ignition-red" />
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-ignition-red animate-spin" />
            <span className="ml-2 text-steel text-sm">Loading riding gear...</span>
          </div>
        ) : gearProducts.length === 0 ? (
          <div className="text-center py-16 text-steel text-sm">
            No riding gear products available yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gearProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
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
