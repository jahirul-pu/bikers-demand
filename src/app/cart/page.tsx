"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Trash2, ArrowRight, ShieldCheck, Truck, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const [isInsideDhaka, setIsInsideDhaka] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const [cartItems, setCartItems] = useState([
    {
      id: "c-1",
      productId: "prod-1",
      name: "Performance Slip-On Racing Exhaust (Black Coated)",
      brand: "Akrapovič Replica",
      price: 6500,
      quantity: 1,
      size: null,
      imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "c-2",
      productId: "prod-4",
      name: "Dual Lens High Power LED Fog Lights with Bracket & Relay Wire",
      brand: "Future Eye",
      price: 2950,
      quantity: 1,
      size: null,
      imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop&q=80",
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = isInsideDhaka ? 60 : 130;
  const discount = couponApplied ? 500 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - discount);

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header cartCount={cartItems.length} />
      <Navigation />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="display-font text-4xl font-extrabold uppercase text-off-white mb-8 border-b border-asphalt-2 pb-4">
          Shopping Cart ({cartItems.length} Items)
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-asphalt-2 p-12 text-center space-y-4 border border-asphalt-2 my-8">
            <ShoppingBag className="w-12 h-12 text-steel mx-auto" />
            <h2 className="display-font text-2xl font-bold uppercase text-off-white">
              Your Cart is Empty
            </h2>
            <p className="text-steel text-sm">Find genuine accessories matching your bike model.</p>
            <Link
              href="/"
              className="inline-block bg-ignition-red text-asphalt font-extrabold uppercase text-xs px-6 py-3 tracking-wider hover:bg-red-600 transition-colors transform -skew-x-6"
            >
              <span className="transform skew-x-6 block">Browse Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-asphalt-2 p-4 border border-asphalt-2 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-contain bg-asphalt p-2 border border-steel/20 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono text-plate-yellow font-bold uppercase">
                        {item.brand}
                      </span>
                      <h3 className="text-sm font-semibold text-off-white line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="text-xs font-mono text-steel">
                        Tk {item.price.toLocaleString("en-BD")}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-asphalt">
                    <div className="flex items-center border border-steel/30 bg-asphalt">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2.5 py-1 text-steel hover:text-off-white font-mono"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-mono font-bold text-off-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2.5 py-1 text-steel hover:text-off-white font-mono"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right font-mono text-sm font-bold text-off-white">
                      Tk {(item.price * item.quantity).toLocaleString("en-BD")}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-steel hover:text-ignition-red p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-between items-center text-xs font-mono">
                <Link href="/" className="text-steel hover:text-plate-yellow">
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary & Delivery Zone Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-asphalt-2 p-6 border border-steel/30 space-y-6">
                <h2 className="display-font text-xl font-extrabold uppercase text-off-white border-b border-asphalt pb-3">
                  Order Summary
                </h2>

                {/* Delivery Zone Selector (PRD Section 4.4) */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                    Delivery Zone (Bangladesh):
                  </label>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <button
                      onClick={() => setIsInsideDhaka(true)}
                      className={`p-2.5 text-center border transition-all ${
                        isInsideDhaka
                          ? "bg-plate-yellow text-asphalt font-extrabold border-plate-yellow"
                          : "bg-asphalt text-steel hover:border-steel/40"
                      }`}
                    >
                      Inside Dhaka (Tk 60)
                    </button>
                    <button
                      onClick={() => setIsInsideDhaka(false)}
                      className={`p-2.5 text-center border transition-all ${
                        !isInsideDhaka
                          ? "bg-plate-yellow text-asphalt font-extrabold border-plate-yellow"
                          : "bg-asphalt text-steel hover:border-steel/40"
                      }`}
                    >
                      Outside Dhaka (Tk 130)
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs font-mono pt-3 border-t border-asphalt">
                  <div className="flex justify-between text-steel">
                    <span>Subtotal:</span>
                    <span className="text-off-white font-bold">
                      Tk {subtotal.toLocaleString("en-BD")}
                    </span>
                  </div>
                  <div className="flex justify-between text-steel">
                    <span>Delivery Charge:</span>
                    <span className="text-off-white font-bold">
                      Tk {deliveryCharge}
                    </span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Discount:</span>
                      <span className="font-bold">- Tk 500</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-extrabold text-off-white pt-3 border-t border-asphalt">
                    <span>Grand Total:</span>
                    <span className="text-plate-yellow display-font text-2xl">
                      Tk {grandTotal.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-asphalt border border-steel/30 text-xs px-3 py-2 text-off-white focus:outline-none focus:border-ignition-red flex-1 font-mono uppercase"
                    />
                    <button
                      onClick={() => {
                        if (couponCode.toUpperCase() === "BIKERS500") {
                          setCouponApplied(true);
                        }
                      }}
                      className="bg-asphalt hover:bg-asphalt/80 border border-steel/30 text-off-white px-3 py-2 text-xs font-mono uppercase"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <div className="text-[11px] font-mono text-emerald-400">
                      ✓ Promo code BIKERS500 applied!
                    </div>
                  )}
                </div>

                {/* Proceed to Checkout CTA */}
                <Link
                  href={`/checkout?dhaka=${isInsideDhaka ? "true" : "false"}`}
                  className="w-full bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-sm py-4 text-center tracking-wider block transition-colors transform -skew-x-6 shadow-lg"
                >
                  <span className="transform skew-x-6 flex items-center justify-center gap-2">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <div className="text-[11px] font-mono text-steel text-center">
                  Cash on Delivery (COD) supported nationwide.
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
