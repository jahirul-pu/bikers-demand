"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X, Bike } from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";

interface HeaderProps {
  onOpenBikeModal?: () => void;
  selectedBike?: string | null;
  cartCount?: number;
  favCount?: number;
}

export default function Header({
  onOpenBikeModal,
  selectedBike,
  cartCount = 2,
  favCount = 1,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="bg-asphalt border-b border-asphalt-2 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Menu Button & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-steel hover:text-off-white p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-ignition-red flex items-center justify-center rounded transform -skew-x-12 group-hover:bg-red-600 transition-colors">
              <Bike className="w-6 h-6 text-asphalt transform skew-x-12 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="display-font text-2xl font-extrabold tracking-wider leading-none text-off-white group-hover:text-ignition-red transition-colors">
                BIKERS<span className="text-ignition-red group-hover:text-off-white transition-colors">DEMAND</span>
              </span>
              <span className="text-[9px] font-mono text-steel tracking-widest uppercase">
                Motorcycle Parts & Gear
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search helmets, exhausts, brake pads, oils..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-asphalt-2 border border-asphalt-2 focus:border-ignition-red rounded-none py-2 pl-4 pr-10 text-sm text-off-white placeholder-steel focus:outline-none transition-colors"
            />
            <button
              type="button"
              className="absolute right-0 top-0 bottom-0 px-3 bg-asphalt-2 text-steel hover:text-ignition-red flex items-center justify-center transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Action Icons: Account, Favorites, Cart */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Quick Bike Select Pill */}
          <button
            onClick={onOpenBikeModal}
            className="hidden sm:flex items-center gap-2 bg-asphalt-2 border border-asphalt-2 hover:border-plate-yellow px-3 py-1.5 text-xs transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-plate-yellow animate-pulse" />
            <span className="font-mono text-steel-light">
              {selectedBike ? selectedBike : "Select Bike"}
            </span>
          </button>

          <Link
            href="/account/garage"
            className="flex items-center gap-1 text-steel hover:text-off-white transition-colors p-1"
            title="Account"
          >
            <User className="w-5 h-5" />
            <span className="hidden lg:inline text-xs font-medium">Account</span>
          </Link>

          <Link
            href="/account/wishlist"
            className="relative text-steel hover:text-off-white transition-colors p-1"
            title="Favorites"
          >
            <Heart className="w-5 h-5" />
            {favCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-asphalt-2 border border-asphalt text-steel-light text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {favCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-ignition-red text-asphalt px-3 py-1.5 flex items-center gap-2 font-semibold text-xs tracking-wider uppercase hover:bg-red-600 transition-colors transform -skew-x-6 cursor-pointer"
            title="Open Cart"
          >
            <div className="transform skew-x-6 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-asphalt text-off-white px-1.5 py-0.5 text-[10px] font-mono">
                  {cartCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search parts, gear, model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-asphalt-2 border border-asphalt-2 focus:border-ignition-red py-2 pl-4 pr-10 text-sm text-off-white placeholder-steel focus:outline-none"
          />
          <button className="absolute right-0 top-0 bottom-0 px-3 text-steel">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-asphalt-2 bg-asphalt-2 px-4 py-3 space-y-2">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBikeModal?.();
            }}
            className="w-full text-left bg-asphalt border border-plate-yellow p-2.5 text-xs flex items-center justify-between"
          >
            <span className="font-mono text-plate-yellow font-bold">
              {selectedBike ? `BIKE: ${selectedBike}` : "GARAGE: + ADD YOUR BIKE"}
            </span>
            <span className="text-steel">Change →</span>
          </button>
          <div className="grid grid-cols-2 gap-2 text-sm pt-2">
            <a href="#riding-gear" className="p-2 hover:bg-asphalt text-off-white font-medium">
              Riding Gear
            </a>
            <a href="#parts-mods" className="p-2 hover:bg-asphalt text-off-white font-medium">
              Parts & Mods
            </a>
            <a href="#electronics" className="p-2 hover:bg-asphalt text-off-white font-medium">
              Electronics
            </a>
            <a href="#merchandise" className="p-2 hover:bg-asphalt text-off-white font-medium">
              Merchandise
            </a>
            <a href="#brands" className="p-2 hover:bg-asphalt text-steel">
              Brands
            </a>
            <a href="#help" className="p-2 hover:bg-asphalt text-steel">
              Help / Contact
            </a>
          </div>
        </div>
      )}

      {/* Slide-over Right Cart Popup */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
