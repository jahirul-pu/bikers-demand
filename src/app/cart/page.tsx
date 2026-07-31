"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Tag,
  AlertCircle,
} from "lucide-react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size?: string | null;
  imageUrl: string;
  categorySlug?: string;
}

export default function CartPage() {
  const router = useRouter();

  // Initial cart items (with fallback mock items if empty)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "cart-1",
      productId: "prod-1",
      name: "Performance Slip-On Racing Exhaust (Black Coated)",
      brand: "Akrapovič Replica",
      price: 6500,
      originalPrice: 7200,
      quantity: 1,
      size: null,
      imageUrl:
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
      categorySlug: "parts-mods",
    },
    {
      id: "cart-2",
      productId: "prod-4",
      name: "Dual Lens High Power LED Fog Lights with Bracket & Relay Wire",
      brand: "Future Eye",
      price: 2950,
      quantity: 1,
      size: null,
      imageUrl:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop&q=80",
      categorySlug: "electronics",
    },
  ]);

  // Shipping & Coupon States
  const [isInsideDhaka, setIsInsideDhaka] = useState<boolean>(true);
  const [couponInput, setCouponInput] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Sync with localStorage on client load
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("bikers_demand_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
        }
      }
    } catch (e) {
      console.error("Error reading cart from localStorage:", e);
    }
  }, []);

  // Save to localStorage when cart items change
  const saveCartToStorage = (newItems: CartItem[]) => {
    setCartItems(newItems);
    try {
      localStorage.setItem("bikers_demand_cart", JSON.stringify(newItems));
    } catch (e) {
      console.error("Error saving cart to localStorage:", e);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCartToStorage(updated);
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();

    if (!code) return;

    if (code === "BIKERS500") {
      setAppliedCoupon({ code: "BIKERS500", discountAmount: 500 });
      setCouponInput("");
    } else if (code === "RIDER10") {
      const discount = Math.round(subtotal * 0.1);
      setAppliedCoupon({ code: "RIDER10", discountAmount: discount });
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code. Try 'BIKERS500' for Tk 500 off.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryCharge = isInsideDhaka ? 60 : 130;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - discountAmount);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      {/* Header */}
      <Header cartCount={totalItemCount} />
      <Navigation />

      {/* Cart Page Title Banner */}
      <section className="bg-asphalt-2 border-b border-asphalt-2 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-steel font-mono mb-1">
              <Link href="/" className="hover:text-off-white">
                Home
              </Link>
              <span>/</span>
              <span className="text-plate-yellow">Cart</span>
            </div>
            <h1 className="display-font text-4xl font-extrabold uppercase text-off-white tracking-wide">
              Shopping Cart ({totalItemCount} Items)
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-steel">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Genuine Owned Inventory • Dhaka Fulfillment</span>
          </div>
        </div>
      </section>

      {/* Main Cart Body */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {cartItems.length === 0 ? (
          <div className="bg-asphalt-2 p-12 text-center space-y-5 border border-asphalt-2 max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 bg-asphalt rounded-full border border-steel/30 flex items-center justify-center mx-auto text-steel">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="display-font text-2xl font-bold uppercase text-off-white">
                Your Shopping Cart is Empty
              </h2>
              <p className="text-steel text-sm font-light">
                Browse our catalog of helmets, exhausts, LED lights, and model-specific mods.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-xs px-8 py-3.5 tracking-wider transition-all transform -skew-x-6 shadow-lg"
            >
              <div className="transform skew-x-6 flex items-center gap-2">
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Header Bar */}
              <div className="flex justify-between items-center text-xs font-mono text-steel border-b border-asphalt-2 pb-3">
                <span>ITEM DETAILS</span>
                <button
                  onClick={handleClearCart}
                  className="hover:text-ignition-red transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {/* Items Card List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-asphalt-2 p-4 sm:p-5 border border-asphalt-2 hover:border-steel/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    {/* Media & Specs */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-20 h-20 bg-asphalt p-2 border border-steel/20 shrink-0 flex items-center justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-plate-yellow font-bold uppercase tracking-wider">
                          {item.brand}
                        </span>
                        <h3 className="text-sm font-semibold text-off-white line-clamp-2 leading-snug">
                          {item.name}
                        </h3>

                        {item.size && (
                          <span className="inline-block bg-asphalt text-steel text-[10px] font-mono px-2 py-0.5 border border-steel/20">
                            Size: {item.size}
                          </span>
                        )}

                        <div className="text-xs font-mono text-steel pt-1">
                          Unit Price:{" "}
                          <strong className="text-off-white">
                            Tk {item.price.toLocaleString("en-BD")}
                          </strong>
                          {item.originalPrice && (
                            <span className="line-through text-steel/60 ml-2">
                              Tk {item.originalPrice.toLocaleString("en-BD")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Controls & Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-asphalt">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-steel/30 bg-asphalt">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="px-3 py-1.5 text-steel hover:text-off-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1.5 text-xs font-mono font-bold text-off-white border-x border-steel/20">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="px-3 py-1.5 text-steel hover:text-off-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for Item */}
                      <div className="text-right font-mono min-w-[90px]">
                        <span className="text-[10px] text-steel block">Total</span>
                        <span className="text-sm font-extrabold text-plate-yellow display-font">
                          Tk {(item.price * item.quantity).toLocaleString("en-BD")}
                        </span>
                      </div>

                      {/* Trash Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-steel hover:text-ignition-red p-2 transition-colors rounded hover:bg-asphalt"
                        title="Remove item from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Policy Banners below cart items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-mono">
                <div className="bg-asphalt p-4 border border-asphalt-2 flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-plate-yellow shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-off-white block uppercase">
                      Parts Return Policy:
                    </strong>
                    <span className="text-steel text-[11px]">
                      Parts & Mods non-returnable once opened. Wrong item / copy claims covered by unboxing video proof.
                    </span>
                  </div>
                </div>

                <div className="bg-asphalt p-4 border border-asphalt-2 flex items-start gap-3">
                  <Truck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-off-white block uppercase">
                      Pathao Logistics:
                    </strong>
                    <span className="text-steel text-[11px]">
                      Flat Tk 60 Dhaka / Tk 130 Outside. COD confirmation call triggered upon order.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-asphalt-2 p-6 border border-steel/30 space-y-6 sticky top-24">
                <h2 className="display-font text-2xl font-extrabold uppercase text-off-white border-b border-asphalt pb-3">
                  Order Summary
                </h2>

                {/* Delivery Zone Selector (PRD Section 4.4) */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    1. Choose Delivery Zone (Bangladesh):
                  </label>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setIsInsideDhaka(true)}
                      className={`p-3 text-left border transition-all ${
                        isInsideDhaka
                          ? "bg-asphalt border-plate-yellow text-plate-yellow font-extrabold shadow"
                          : "bg-asphalt/50 border-asphalt-2 text-steel hover:text-off-white"
                      }`}
                    >
                      <div className="font-bold">Inside Dhaka</div>
                      <div className="text-[10px] text-steel">Tk 60 Charge</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsInsideDhaka(false)}
                      className={`p-3 text-left border transition-all ${
                        !isInsideDhaka
                          ? "bg-asphalt border-plate-yellow text-plate-yellow font-extrabold shadow"
                          : "bg-asphalt/50 border-asphalt-2 text-steel hover:text-off-white"
                      }`}
                    >
                      <div className="font-bold">Outside Dhaka</div>
                      <div className="text-[10px] text-steel">Tk 130 Charge</div>
                    </button>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="space-y-2 pt-2 border-t border-asphalt">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    2. Coupon / Promo Code:
                  </label>

                  {appliedCoupon ? (
                    <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Tag className="w-4 h-4" />
                        <span>
                          Code: <strong>{appliedCoupon.code}</strong> (-Tk{" "}
                          {appliedCoupon.discountAmount})
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-steel hover:text-ignition-red text-[11px] underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. BIKERS500"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="bg-asphalt border border-steel/30 text-xs px-3 py-2 text-off-white focus:outline-none focus:border-ignition-red flex-1 font-mono uppercase"
                        />
                        <button
                          type="submit"
                          className="bg-asphalt hover:bg-asphalt/80 border border-steel/30 text-off-white px-4 py-2 text-xs font-mono uppercase font-bold transition-colors"
                        >
                          Apply
                        </button>
                      </div>

                      {couponError && (
                        <div className="text-[11px] font-mono text-ignition-red flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{couponError}</span>
                        </div>
                      )}
                    </form>
                  )}
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-2.5 text-xs font-mono pt-4 border-t border-asphalt">
                  <div className="flex justify-between text-steel">
                    <span>Items Subtotal:</span>
                    <span className="text-off-white font-bold">
                      Tk {subtotal.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div className="flex justify-between text-steel">
                    <span>Delivery Charge ({isInsideDhaka ? "Dhaka" : "Outside"}):</span>
                    <span className="text-off-white font-bold">
                      Tk {deliveryCharge}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Discount ({appliedCoupon.code}):</span>
                      <span className="font-bold">
                        - Tk {appliedCoupon.discountAmount.toLocaleString("en-BD")}
                      </span>
                    </div>
                  )}

                  <div className="text-[10px] text-steel pt-1">
                    * Display pricing is VAT-inclusive per Bangladesh tax norms.
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-off-white pt-3 border-t border-asphalt items-baseline">
                    <span>Grand Total:</span>
                    <span className="text-plate-yellow display-font text-3xl font-extrabold">
                      Tk {grandTotal.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>

                {/* Proceed to Checkout CTA */}
                <Link
                  href={`/checkout?dhaka=${isInsideDhaka ? "true" : "false"}`}
                  className="w-full bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-sm py-4 text-center tracking-wider block transition-all transform -skew-x-6 shadow-xl shadow-ignition-red/20 group"
                >
                  <span className="transform skew-x-6 flex items-center justify-center gap-2">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                {/* Trust & Payment Icons */}
                <div className="pt-2 border-t border-asphalt/80 space-y-2 text-center">
                  <span className="text-[10px] font-mono text-steel uppercase block">
                    Accepted Payment Methods:
                  </span>
                  <div className="flex justify-center flex-wrap gap-1.5 text-[10px] font-mono">
                    <span className="bg-asphalt px-2 py-1 text-plate-yellow border border-asphalt">
                      COD (Primary)
                    </span>
                    <span className="bg-asphalt px-2 py-1 text-pink-400 border border-asphalt">
                      bKash
                    </span>
                    <span className="bg-asphalt px-2 py-1 text-orange-400 border border-asphalt">
                      Nagad
                    </span>
                    <span className="bg-asphalt px-2 py-1 text-purple-400 border border-asphalt">
                      Rocket
                    </span>
                    <span className="bg-asphalt px-2 py-1 text-emerald-400 border border-asphalt">
                      BanglaQR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
