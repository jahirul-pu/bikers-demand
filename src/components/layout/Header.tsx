"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu, X, Bike } from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";
import ThemeToggle from "@/components/layout/ThemeToggle";

interface SearchProductResult {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  stockStatus: string;
  images: string[];
  category?: { name: string; slug: string };
}

export interface HeaderProps {
  onOpenBikeModal?: () => void;
  selectedBike?: string | null;
  cartCount?: number;
  favCount?: number;
  isAdmin?: boolean;
}

export default function Header({
  onOpenBikeModal,
  selectedBike,
  cartCount,
  favCount,
  isAdmin = false,
}: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProductResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  const [liveCartCount, setLiveCartCount] = useState<number>(cartCount ?? 0);
  const [liveFavCount, setLiveFavCount] = useState<number>(favCount ?? 0);
  const [userName, setUserName] = useState<string | null>(null);

  // Instant Search API fetch with debouncing
  React.useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSearchResults(json.data.slice(0, 5));
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Instant search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close instant search dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close instant search on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Sync badge counts and user session from localStorage
  React.useEffect(() => {
    const syncSession = () => {
      try {
        const savedUser = localStorage.getItem("bikers_demand_user");
        if (savedUser) {
          const u = JSON.parse(savedUser);
          if (u.name && !/^\d+$/.test(u.name)) {
            setUserName(u.name); // Display real name
          } else if (u.email) {
            setUserName(u.email.split("@")[0]);
          } else {
            setUserName("Rider");
          }
        } else {
          setUserName(null);
        }

        const savedCart = localStorage.getItem("bikers_demand_cart");
        if (savedCart) {
          const arr = JSON.parse(savedCart);
          if (Array.isArray(arr)) {
            const totalQty = arr.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
            setLiveCartCount(totalQty);
          }
        } else if (cartCount !== undefined) {
          setLiveCartCount(cartCount);
        }

        const savedFavs = localStorage.getItem("bikers_demand_favs");
        if (savedFavs) {
          const arr = JSON.parse(savedFavs);
          if (Array.isArray(arr)) {
            setLiveFavCount(arr.length);
          }
        } else if (favCount !== undefined) {
          setLiveFavCount(favCount);
        }
      } catch (e) {
        console.error(e);
      }
    };

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("focus", syncSession);
    window.addEventListener("cart-updated", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("focus", syncSession);
      window.removeEventListener("cart-updated", syncSession);
    };
  }, [cartCount, favCount, isCartOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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

        {/* Search Bar with Instant Results Overlay (Hidden in Admin mode) */}
        {!isAdmin && (
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl mx-4 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search helmets, exhausts, brake pads, oils..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-asphalt-2 border border-asphalt-2 focus:border-plate-yellow rounded-none py-2 pl-4 pr-10 text-sm text-off-white placeholder-steel focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 px-3 bg-asphalt-2 text-steel hover:text-ignition-red flex items-center justify-center transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Instant Search Results Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 z-50 bg-asphalt-2 border border-asphalt-2 shadow-2xl mt-1 overflow-hidden">
                <div className="p-2 border-b border-asphalt flex justify-between items-center bg-asphalt/60">
                  <span className="text-[10px] font-mono text-steel uppercase tracking-widest">
                    {isSearching ? "Searching catalog..." : `Instant Results (${searchResults.length})`}
                  </span>
                  <span className="text-[9px] font-mono text-steel">Esc to close</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-steel">
                    No direct product matches for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div className="divide-y divide-asphalt/50">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.slug}`}
                        onClick={() => setShowDropdown(false)}
                        className="p-2.5 flex items-center gap-3 hover:bg-asphalt/80 transition-colors group"
                      >
                        {item.images && item.images[0] && (
                          <div className="w-10 h-10 bg-asphalt border border-asphalt-2 shrink-0 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-mono uppercase bg-asphalt px-1 text-plate-yellow border border-asphalt-2">
                              {item.brand}
                            </span>
                            {item.category?.name && (
                              <span className="text-[9px] font-mono text-steel uppercase">
                                • {item.category.name}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-off-white group-hover:text-ignition-red truncate">
                            {item.name}
                          </h4>
                        </div>
                        <div className="text-right font-mono text-xs font-bold text-off-white shrink-0">
                          ৳{item.price.toLocaleString()}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* View All Results Action */}
                <button
                  onClick={handleSearch}
                  className="w-full bg-asphalt border-t border-asphalt-2 p-2.5 text-center text-xs font-mono text-plate-yellow hover:text-off-white hover:bg-asphalt-2 transition-colors font-bold uppercase"
                >
                  View all results for &quot;{searchQuery}&quot; →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right Action Icons: Account, Favorites, Cart */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href={userName ? "/account/garage" : "/login"}
            className="flex items-center gap-1.5 text-steel hover:text-off-white transition-colors p-1"
            title={userName ? `Signed in as ${userName}` : "Account Login / Garage"}
          >
            <User className={`w-5 h-5 ${userName ? "text-plate-yellow" : ""}`} />
            <span className={`hidden lg:inline text-xs font-medium truncate max-w-[110px] ${userName ? "text-plate-yellow font-bold uppercase" : ""}`}>
              {userName ? userName : "Account"}
            </span>
          </Link>

          {!isAdmin && (
            <Link
              href="/account/wishlist"
              className="relative text-steel hover:text-off-white transition-colors p-1"
              title="Favorites"
            >
              <Heart className="w-5 h-5" />
              {liveFavCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-asphalt-2 border border-asphalt text-steel-light text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {liveFavCount}
                </span>
              )}
            </Link>
          )}

          <ThemeToggle />

          {!isAdmin && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-ignition-red text-asphalt px-3 py-1.5 flex items-center gap-2 font-semibold text-xs tracking-wider uppercase hover:bg-red-600 transition-colors transform -skew-x-6 cursor-pointer"
              title="Open Cart"
            >
              <div className="transform skew-x-6 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {liveCartCount > 0 && (
                  <span className="bg-asphalt text-off-white px-1.5 py-0.5 text-[10px] font-mono">
                    {liveCartCount}
                  </span>
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar Row (Hidden in Admin mode) */}
      {!isAdmin && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search parts, gear, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-asphalt-2 border border-asphalt-2 focus:border-plate-yellow py-2 pl-4 pr-10 text-sm text-off-white placeholder-steel focus:outline-none"
            />
            <button className="absolute right-0 top-0 bottom-0 px-3 text-steel">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
