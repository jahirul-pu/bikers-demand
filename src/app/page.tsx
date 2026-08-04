"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import CategoryGrid from "@/components/landing/CategoryGrid";
import CompatibleProducts from "@/components/landing/CompatibleProducts";
import RidingGearSection from "@/components/landing/RidingGearSection";
import TrustSection from "@/components/landing/TrustSection";
import Footer from "@/components/layout/Footer";
import BikeSelectorModal, { BikeOption } from "@/components/landing/BikeSelectorModal";
import { Product } from "@/components/landing/ProductCard";

export default function Home() {
  const [selectedBike, setSelectedBike] = useState<BikeOption | null>(null);
  const [isBikeModalOpen, setIsBikeModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Read primary bike from saved guest selection or garage key
  const loadPrimaryBike = () => {
    try {
      const user = localStorage.getItem("bikers_demand_user");
      const loggedIn = !!user;
      setIsLoggedIn(loggedIn);

      const saved = localStorage.getItem("bd_selected_bike");
      if (saved) {
        setSelectedBike(JSON.parse(saved));
      } else {
        setSelectedBike(null);
      }

      // Sync cart & fav counts
      const cart = JSON.parse(localStorage.getItem("bikers_demand_cart") || "[]");
      const favs = JSON.parse(localStorage.getItem("bikers_demand_favs") || "[]");
      setCartCount(Array.isArray(cart) ? cart.reduce((s: number, i: {quantity?: number}) => s + (i.quantity ?? 1), 0) : 0);
      setFavCount(Array.isArray(favs) ? favs.length : 0);
    } catch {
      // silent fail
    }
  };

  useEffect(() => {
    loadPrimaryBike();
    window.addEventListener("storage", loadPrimaryBike);
    window.addEventListener("focus", loadPrimaryBike);
    return () => {
      window.removeEventListener("storage", loadPrimaryBike);
      window.removeEventListener("focus", loadPrimaryBike);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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


      {/* Sticky Header + Nav block */}
      <div className="sticky top-0 z-50">
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
          selectedBike={selectedBike}
          onOpenBikeModal={() => setIsBikeModalOpen(true)}
          onClearBike={() => {
            setSelectedBike(null);
            // Remove saved bike selection
            try {
              localStorage.removeItem("bd_selected_bike");
            } catch { /* silent */ }
          }}
        />
      </div>

      {/* Main Landing Content */}
      <main className="flex-grow">
        {/* 5. Hero Section */}
        <HeroSection
          onOpenBikeModal={() => setIsBikeModalOpen(true)}
          selectedBike={selectedBike}
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
        onSelectBike={(bike) => {
          setSelectedBike(bike);

          // Persist selected bike for both logged-in and guest users
          try {
            localStorage.setItem("bd_selected_bike", JSON.stringify(bike));
            window.dispatchEvent(new Event("storage"));
          } catch { /* silent */ }

          setIsBikeModalOpen(false);
        }}
        currentBike={selectedBike}
      />
    </div>
  );
}
