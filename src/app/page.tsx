"use client";

import React, { useState } from "react";
import UtilityBar from "@/components/layout/UtilityBar";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import BikeSelectionStrip from "@/components/landing/BikeSelectionStrip";
import HeroSection from "@/components/landing/HeroSection";
import CategoryGrid from "@/components/landing/CategoryGrid";
import CompatibleProducts from "@/components/landing/CompatibleProducts";
import RidingGearSection from "@/components/landing/RidingGearSection";
import TrustSection from "@/components/landing/TrustSection";
import Footer from "@/components/layout/Footer";
import BikeSelectorModal, { BikeOption } from "@/components/landing/BikeSelectorModal";
import { Product } from "@/components/landing/ProductCard";

export default function Home() {
  // Bike state management
  const [selectedBike, setSelectedBike] = useState<BikeOption | null>({
    brand: "Yamaha",
    model: "FZS-Fi",
    variant: "v3",
    cc: "149cc",
  });
  const [isBikeModalOpen, setIsBikeModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [favCount, setFavCount] = useState(1);
  const [activeCategory, setActiveCategory] = useState("riding-gear");

  const bikeDisplayName = selectedBike
    ? `${selectedBike.brand} ${selectedBike.model} ${selectedBike.variant || ""}`.trim()
    : null;

  const handleAddToCart = (product: Product) => {
    setCartCount((prev) => prev + 1);
  };

  const handleToggleFav = (product: Product) => {
    setFavCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      {/* 1. Utility Bar */}
      <UtilityBar />

      {/* 2. Header */}
      <Header
        onOpenBikeModal={() => setIsBikeModalOpen(true)}
        selectedBike={bikeDisplayName}
        cartCount={cartCount}
        favCount={favCount}
      />

      {/* 3. Navigation */}
      <Navigation
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* 4. Bike Selection Strip */}
      <BikeSelectionStrip
        selectedBike={selectedBike}
        onOpenBikeModal={() => setIsBikeModalOpen(true)}
        onClearBike={() => setSelectedBike(null)}
      />

      {/* Main Landing Content */}
      <main className="flex-grow">
        {/* 5. Hero Section */}
        <HeroSection
          onOpenBikeModal={() => setIsBikeModalOpen(true)}
          onBrowseGear={() => {
            const el = document.getElementById("category-grid");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* 6. Category Grid */}
        <CategoryGrid
          onSelectCategory={(cat) => setActiveCategory(cat)}
        />

        {/* 7. Compatible Products */}
        <CompatibleProducts
          selectedBike={selectedBike}
          onOpenBikeModal={() => setIsBikeModalOpen(true)}
          onAddToCart={handleAddToCart}
          onToggleFav={handleToggleFav}
        />

        {/* 8. Riding Gear */}
        <RidingGearSection
          onAddToCart={handleAddToCart}
          onToggleFav={handleToggleFav}
        />

        {/* 9. Trust Section */}
        <TrustSection />
      </main>

      {/* 10. Footer */}
      <Footer />

      {/* Interactive Bike Selector Modal */}
      <BikeSelectorModal
        isOpen={isBikeModalOpen}
        onClose={() => setIsBikeModalOpen(false)}
        onSelectBike={(bike) => setSelectedBike(bike)}
        currentBike={selectedBike}
      />
    </div>
  );
}
