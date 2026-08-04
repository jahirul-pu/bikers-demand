"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { CartItem } from "@/components/cart/CartDrawer";
import { DBCoupon } from "@/types/db";
import {
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const dhakaParam = searchParams ? searchParams.get("dhaka") : null;

  const [isInsideDhaka, setIsInsideDhaka] = useState<boolean>(
    dhakaParam === "false" ? false : true
  );

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Dhaka");

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<React.ReactNode | null>(null);

  // Checkout submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

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
      console.error("Error reading cart from storage:", e);
    }
  }, []);

  const CATEGORY_MAP: Record<string, { label: string; href: string }> = {
    "helmets": { label: "Helmets", href: "/category/helmets" },
    "parts-mods": { label: "Parts & Mods", href: "/category/parts-mods" },
    "electronics": { label: "Electronics", href: "/category/electronics" },
    "additives": { label: "Additives & Oils", href: "/category/additives" },
    "riding-gear": { label: "Riding Gear", href: "/category/riding-gear" },
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponError(null);
    const code = couponInput.trim().toUpperCase();

    let availableCoupons: DBCoupon[] = [];
    try {
      const res = await fetch("/api/coupons");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        availableCoupons = json.data;
      }
    } catch (err) {
      console.error("API error fetching coupons:", err);
    }

    const targetCoupon = availableCoupons.find((c) => c.code.toUpperCase() === code);

    if (!targetCoupon || !targetCoupon.isActive) {
      setCouponError(`Invalid or expired coupon code '${code}'.`);
      return;
    }

    const hasCategoryTarget = targetCoupon.categoryTarget !== "ALL";
    const categoryMeta = hasCategoryTarget ? CATEGORY_MAP[targetCoupon.categoryTarget] : null;

    let eligibleItems: any[] = [];
    if (hasCategoryTarget) {
      eligibleItems = cartItems.filter((item: any) => item.category === targetCoupon.categoryTarget);
    } else {
      eligibleItems = cartItems;
    }
    const eligibleSubtotal = eligibleItems.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);

    // Case 1: Category targeted, but cart has NO items from that category
    if (hasCategoryTarget && eligibleItems.length === 0) {
      const catLink = categoryMeta ? (
        <Link href={categoryMeta.href} className="underline text-plate-yellow font-bold hover:text-yellow-400">
          {categoryMeta.label}
        </Link>
      ) : targetCoupon.categoryTarget;

      if (targetCoupon.minOrder > 0) {
        setCouponError(
          <span>
            Coupon <strong>&apos;{code}&apos;</strong> requires a minimum spend of ৳{targetCoupon.minOrder.toLocaleString("en-BD")} on {catLink} items.
          </span>
        );
      } else {
        setCouponError(
          <span>
            Coupon <strong>&apos;{code}&apos;</strong> is only valid for {catLink} products.
          </span>
        );
      }
      return;
    }

    // Case 2: Cart has category items (or ALL), but minimum order spend is not met
    if (targetCoupon.minOrder > 0 && eligibleSubtotal < targetCoupon.minOrder) {
      if (hasCategoryTarget) {
        const catLink = categoryMeta ? (
          <Link href={categoryMeta.href} className="underline text-plate-yellow font-bold hover:text-yellow-400">
            {categoryMeta.label}
          </Link>
        ) : targetCoupon.categoryTarget;

        setCouponError(
          <span>
            Coupon <strong>&apos;{code}&apos;</strong> requires a minimum spend of ৳{targetCoupon.minOrder.toLocaleString("en-BD")} on {catLink} items. (Current eligible subtotal: ৳{eligibleSubtotal.toLocaleString("en-BD")}).
          </span>
        );
      } else {
        setCouponError(
          <span>
            Coupon <strong>&apos;{code}&apos;</strong> requires a minimum order subtotal of ৳{targetCoupon.minOrder.toLocaleString("en-BD")}. (Current subtotal: ৳{subtotal.toLocaleString("en-BD")}).
          </span>
        );
      }
      return;
    }

    // Calculate Discount
    let discount = 0;
    if (targetCoupon.discountType === "FLAT") {
      discount = targetCoupon.discountValue;
    } else {
      discount = Math.round(eligibleSubtotal * (targetCoupon.discountValue / 100));
    }

    setAppliedCoupon({ code: targetCoupon.code, discountAmount: discount });
    setCouponInput("");
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("bikers_demand_cart", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("cart-updated"));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("bikers_demand_cart", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("cart-updated"));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryCharge = isInsideDhaka ? 60 : 130;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - discountAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      customerName,
      phone,
      email,
      addressLine,
      city: isInsideDhaka ? "Dhaka" : city,
      isInsideDhaka,
      paymentMethod: "COD",
      couponCode: appliedCoupon?.code || null,
      discountAmount,
      deliveryCharge,
      items: cartItems,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!json.success || !json.data) {
        alert(json.error || "Failed to place order in database.");
        return;
      }

      const confirmedData = {
        orderNumber: json.data.orderNumber,
        total: json.data.total || grandTotal,
        deliveryCharge: json.data.deliveryCharge || deliveryCharge,
        paymentMethod: "COD",
        message: "Order placed successfully in database.",
      };

      setOrderConfirmed(confirmedData);
      localStorage.removeItem("bikers_demand_cart");
      window.dispatchEvent(new CustomEvent("cart-updated"));
      window.dispatchEvent(new Event("storage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
        <Header />
        <Navigation />

        <main className="flex-grow max-w-3xl mx-auto px-4 py-16 text-center space-y-6 w-full">
          <div className="w-16 h-16 bg-plate-yellow rounded-full flex items-center justify-center text-asphalt mx-auto font-bold text-2xl shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-asphalt" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block font-bold">
              ORDER CONFIRMED
            </span>
            <h1 className="display-font text-4xl sm:text-5xl font-extrabold uppercase text-off-white tracking-wide">
              THANK YOU FOR YOUR ORDER!
            </h1>
            <p className="text-steel text-xs font-mono max-w-md mx-auto">
              Your order has been logged into our Dhaka fulfillment pipeline. An order confirmation call/SMS will follow shortly.
            </p>
          </div>

          <div className="bg-asphalt-2 p-6 border border-plate-yellow/40 space-y-4 font-mono text-xs text-left max-w-xl mx-auto">
            <div className="flex justify-between border-b border-asphalt pb-2">
              <span className="text-steel">ORDER NUMBER:</span>
              <span className="text-plate-yellow font-extrabold">{orderConfirmed.orderNumber}</span>
            </div>

            <div className="flex justify-between border-b border-asphalt pb-2">
              <span className="text-steel">PAYMENT METHOD:</span>
              <span className="text-off-white font-bold">COD (Cash on Delivery)</span>
            </div>

            <div className="flex justify-between border-b border-asphalt pb-2">
              <span className="text-steel">DELIVERY CHARGE:</span>
              <span className="text-off-white font-bold">Tk {orderConfirmed.deliveryCharge}</span>
            </div>

            <div className="flex justify-between items-baseline pt-2">
              <span className="text-steel font-bold uppercase">TOTAL AMOUNT TO PAY ON DELIVERY:</span>
              <span className="text-plate-yellow display-font text-2xl font-extrabold">
                Tk {orderConfirmed.total.toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-block bg-asphalt hover:bg-asphalt-2 border border-steel/40 text-off-white px-8 py-3 text-xs font-mono uppercase font-bold tracking-wider"
            >
              RETURN TO STOREFRONT
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />

      <section className="bg-asphalt-2 border-b border-asphalt-2 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-steel font-mono mb-1">
              <Link href="/" className="hover:text-off-white">Home</Link>
              <span>/</span>
              <span className="text-plate-yellow">Checkout</span>
            </div>
            <h1 className="display-font text-4xl font-extrabold uppercase text-off-white tracking-wide">
              Checkout & Delivery Details
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-steel">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cash on Delivery (COD) Available Nationwide</span>
          </div>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6 font-mono text-xs">
            <div className="bg-asphalt-2 p-6 border border-asphalt-2 space-y-5">
              <h2 className="display-font text-2xl font-extrabold uppercase text-off-white border-b border-asphalt pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-ignition-red" />
                <span>1. Shipping & Contact Information</span>
              </h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-steel block font-bold">
                    Full Name <span className="text-ignition-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-3 text-off-white focus:outline-none focus:border-ignition-red"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-steel block font-bold">
                      Phone Number (For Confirmation Call) <span className="text-ignition-red">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017xxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-asphalt border border-steel/30 p-3 text-off-white focus:outline-none focus:border-ignition-red"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-steel block font-bold">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="tanvir@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-asphalt border border-steel/30 p-3 text-off-white focus:outline-none focus:border-ignition-red"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-steel block font-bold">
                    Delivery Street Address <span className="text-ignition-red">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="House/Holding #, Road #, Area, District"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-3 text-off-white focus:outline-none focus:border-ignition-red resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-asphalt-2 p-6 border border-asphalt-2 space-y-4">
              <h2 className="display-font text-2xl font-extrabold uppercase text-off-white border-b border-asphalt pb-3">
                2. Select Payment Method
              </h2>

              <div className="bg-asphalt p-4 border border-plate-yellow/40 space-y-2">
                <div className="flex items-center gap-3">
                  <input type="radio" checked readOnly className="accent-plate-yellow w-4 h-4" />
                  <div>
                    <span className="font-extrabold text-plate-yellow text-sm block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-steel text-[11px]">
                      Inspect package seal upon delivery and pay cash to courier rider.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 font-mono text-xs">
            <div className="bg-asphalt-2 p-6 border border-steel/30 space-y-6 sticky top-24">
              <h2 className="display-font text-2xl font-extrabold uppercase text-off-white border-b border-asphalt pb-3 flex items-center justify-between">
                <span>Order Items ({cartItems.length})</span>
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-asphalt p-3 border border-asphalt-2 flex items-center justify-between gap-3">
                    <div className="w-12 h-12 bg-asphalt-2 p-1 border border-steel/20 shrink-0 flex items-center justify-center">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div>
                        <span className="text-[10px] text-plate-yellow font-bold uppercase block leading-none">{item.brand}</span>
                        <h4 className="text-xs font-semibold text-off-white line-clamp-1">{item.name}</h4>
                        {item.size && (
                          <div className="text-[10px] text-plate-yellow font-bold uppercase flex items-center gap-1">
                            <span>Size:</span>
                            <span className="bg-asphalt-2 px-1.5 py-0.5 border border-plate-yellow/40 rounded-xs">{item.size}</span>
                          </div>
                        )}
                        <div className="text-[10px] text-steel">Tk {item.price.toLocaleString("en-BD")} each</div>
                      </div>

                      {/* Interactive Quantity Control Stepper */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center border border-steel/30 bg-asphalt-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-5 h-5 flex items-center justify-center text-steel hover:text-off-white hover:bg-asphalt text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <span className="w-6 text-center font-bold text-off-white text-xs">
                            {item.quantity}
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-steel hover:text-off-white hover:bg-asphalt text-xs font-bold cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-steel hover:text-ignition-red transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="font-bold text-off-white display-font text-sm shrink-0 text-right">
                      Tk {(item.price * item.quantity).toLocaleString("en-BD")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-asphalt">
                <label className="text-xs text-plate-yellow uppercase font-bold block">
                  Delivery Zone:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInsideDhaka(true)}
                    className={`p-2.5 text-left border ${
                      isInsideDhaka
                        ? "bg-asphalt border-plate-yellow text-plate-yellow font-bold"
                        : "bg-asphalt/50 border-asphalt-2 text-steel"
                    }`}
                  >
                    <div>Inside Dhaka</div>
                    <div className="text-[10px] text-steel">Tk 60 Fee</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInsideDhaka(false)}
                    className={`p-2.5 text-left border ${
                      !isInsideDhaka
                        ? "bg-asphalt border-plate-yellow text-plate-yellow font-bold"
                        : "bg-asphalt/50 border-asphalt-2 text-steel"
                    }`}
                  >
                    <div>Outside Dhaka</div>
                    <div className="text-[10px] text-steel">Tk 130 Fee</div>
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-asphalt">
                <label className="text-xs text-plate-yellow uppercase font-bold block">
                  Promo Coupon Code:
                </label>
                {appliedCoupon ? (
                  <div className="bg-emerald-100 border border-emerald-300 p-2.5 flex items-center justify-between text-xs text-emerald-800">
                    <span>Applied: <strong>{appliedCoupon.code}</strong> (-Tk {appliedCoupon.discountAmount})</span>
                    <button type="button" onClick={() => setAppliedCoupon(null)} className="text-steel hover:text-ignition-red underline text-[10px]">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="BIKERS500"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="bg-asphalt border border-steel/30 px-3 py-2 text-off-white text-xs flex-1 uppercase"
                    />
                    <button type="button" onClick={handleApplyCoupon} className="bg-asphalt border border-steel/30 text-off-white px-4 py-2 font-bold uppercase text-xs">
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <div className="text-ignition-red text-[10px]">{couponError}</div>}
              </div>

              <div className="space-y-2 pt-4 border-t border-asphalt">
                <div className="flex justify-between text-steel">
                  <span>Subtotal:</span>
                  <span className="text-off-white font-bold">Tk {subtotal.toLocaleString("en-BD")}</span>
                </div>
                <div className="flex justify-between text-steel">
                  <span>Delivery Charge:</span>
                  <span className="text-off-white font-bold">Tk {deliveryCharge}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount:</span>
                    <span className="font-bold">- Tk {appliedCoupon.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-off-white pt-3 border-t border-asphalt items-baseline">
                  <span>Grand Total:</span>
                  <span className="text-plate-yellow display-font text-3xl font-extrabold">
                    Tk {grandTotal.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-sm py-4 text-center tracking-wider block transition-all transform -skew-x-6 shadow-xl cursor-pointer"
              >
                <span className="transform skew-x-6 flex items-center justify-center gap-2">
                  <span>{isSubmitting ? "PLACING ORDER..." : "CONFIRM & PLACE COD ORDER"}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="bg-asphalt min-h-screen text-off-white p-8">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
