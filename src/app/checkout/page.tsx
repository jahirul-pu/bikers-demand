"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PaymentLogos from "@/components/ui/PaymentLogos";
import { CheckCircle2, Truck, ShieldCheck, ArrowRight, Smartphone, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [isInsideDhaka, setIsInsideDhaka] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock items from cart
  const cartItems = [
    {
      productId: "prod-1",
      name: "Performance Slip-On Racing Exhaust (Black Coated)",
      brand: "Akrapovič Replica",
      price: 6500,
      quantity: 1,
    },
    {
      productId: "prod-4",
      name: "Dual Lens High Power LED Fog Lights with Bracket & Relay Wire",
      brand: "Future Eye",
      price: 2950,
      quantity: 1,
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = isInsideDhaka ? 60 : 130;
  const total = subtotal + deliveryCharge;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !addressLine) {
      setError("Please provide a valid phone number and delivery address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName || "Guest Rider",
          phone,
          email,
          addressLine,
          city,
          isInsideDhaka,
          paymentMethod,
          items: cartItems,
          notes,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setOrderConfirmed(json.data);
      } else {
        setError(json.error || "Failed to process checkout. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Network error submitting order. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Render Order Confirmation View
  if (orderConfirmed) {
    return (
      <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
        <Header />
        <Navigation />

        <main className="flex-grow max-w-3xl mx-auto px-4 py-16 w-full text-center space-y-6">
          <div className="w-16 h-16 bg-plate-yellow text-asphalt rounded-full flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block">
              ORDER CONFIRMED
            </span>
            <h1 className="display-font text-4xl font-extrabold uppercase text-off-white">
              Thank You For Your Order!
            </h1>
            <p className="text-steel text-sm max-w-md mx-auto">
              Your order has been logged into our Dhaka fulfillment pipeline. An order confirmation call/SMS will follow shortly.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-asphalt-2 p-6 border border-plate-yellow/40 text-left font-mono space-y-4">
            <div className="flex justify-between border-b border-asphalt pb-3 text-xs">
              <span className="text-steel">ORDER NUMBER:</span>
              <strong className="text-plate-yellow font-extrabold">{orderConfirmed.orderNumber}</strong>
            </div>

            <div className="flex justify-between border-b border-asphalt pb-3 text-xs">
              <span className="text-steel">PAYMENT METHOD:</span>
              <span className="text-off-white font-bold">{paymentMethod} (Cash on Delivery)</span>
            </div>

            <div className="flex justify-between border-b border-asphalt pb-3 text-xs">
              <span className="text-steel">DELIVERY CHARGE:</span>
              <span className="text-off-white font-bold">Tk {orderConfirmed.deliveryCharge}</span>
            </div>

            <div className="flex justify-between text-sm font-bold pt-2">
              <span className="text-steel">TOTAL AMOUNT TO PAY ON DELIVERY:</span>
              <span className="text-plate-yellow display-font text-xl">
                Tk {orderConfirmed.total.toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="bg-asphalt border border-steel/30 hover:border-off-white text-off-white text-xs font-mono uppercase px-6 py-3"
            >
              Return to Storefront
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

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="display-font text-4xl font-extrabold uppercase text-off-white mb-8 border-b border-asphalt-2 pb-4">
          Checkout (Guest Checkout Supported)
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Customer Info & Address Form */}
          <div className="lg:col-span-7 space-y-6">
            {error && (
              <div className="bg-red-950/80 border border-ignition-red p-4 text-xs font-mono text-off-white flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-ignition-red shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Customer Details */}
            <div className="bg-asphalt-2 p-6 border border-asphalt-2 space-y-4">
              <h2 className="display-font text-xl font-bold uppercase text-off-white border-b border-asphalt pb-3">
                1. Customer & Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-steel block">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 px-3 py-2 text-off-white focus:outline-none focus:border-ignition-red"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-steel block">Phone Number (Mandatory for COD)</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 px-3 py-2 text-off-white focus:outline-none focus:border-ignition-red font-bold"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-steel block">Email Address (Optional for invoice)</label>
                  <input
                    type="email"
                    placeholder="tanvir@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 px-3 py-2 text-off-white focus:outline-none focus:border-ignition-red"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address & Zone */}
            <div className="bg-asphalt-2 p-6 border border-asphalt-2 space-y-4">
              <h2 className="display-font text-xl font-bold uppercase text-off-white border-b border-asphalt pb-3">
                2. Shipping Address & Delivery Zone
              </h2>
              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-steel block">Full Delivery Address</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="House/Holding no, Road, Area, Landmark"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-3 text-off-white focus:outline-none focus:border-ignition-red"
                  />
                </div>

                {/* Delivery Zone Selection */}
                <div className="space-y-2">
                  <label className="text-plate-yellow uppercase font-bold block">
                    Select Delivery Zone:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsInsideDhaka(true)}
                      className={`p-3 text-left border font-mono transition-all ${
                        isInsideDhaka
                          ? "bg-asphalt border-plate-yellow text-plate-yellow font-extrabold"
                          : "bg-asphalt/60 border-asphalt-2 text-steel"
                      }`}
                    >
                      <div className="text-sm font-bold">Inside Dhaka</div>
                      <div className="text-[11px] text-steel">Tk 60 Delivery Charge</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsInsideDhaka(false)}
                      className={`p-3 text-left border font-mono transition-all ${
                        !isInsideDhaka
                          ? "bg-asphalt border-plate-yellow text-plate-yellow font-extrabold"
                          : "bg-asphalt/60 border-asphalt-2 text-steel"
                      }`}
                    >
                      <div className="text-sm font-bold">Outside Dhaka</div>
                      <div className="text-[11px] text-steel">Tk 130 Delivery Charge</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-asphalt-2 p-6 border border-asphalt-2 space-y-4">
              <h2 className="display-font text-xl font-bold uppercase text-off-white border-b border-asphalt pb-3">
                3. Payment Method
              </h2>
              <div className="space-y-3 font-mono text-xs">
                {/* COD Option */}
                <label className="flex items-start gap-3 p-4 border border-plate-yellow bg-asphalt cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-ignition-red"
                  />
                  <div>
                    <strong className="text-plate-yellow font-bold text-sm block">
                      Cash on Delivery (COD) — Primary
                    </strong>
                    <span className="text-steel text-[11px]">
                      Pay cash directly to Pathao logistics rider upon physical inspection of sealed parcel.
                    </span>
                  </div>
                </label>

                {/* Mobile Banking Badges */}
                <div className="p-4 border border-steel/20 bg-asphalt/50 space-y-2">
                  <span className="text-steel text-[11px] block font-bold">
                    Accepted Mobile & Digital Gateways:
                  </span>
                  <PaymentLogos />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Breakdown & Place Order CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-asphalt-2 p-6 border border-steel/30 space-y-6">
              <h2 className="display-font text-xl font-extrabold uppercase text-off-white border-b border-asphalt pb-3">
                Order Review
              </h2>

              {/* Items List */}
              <div className="space-y-3">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-mono py-1 border-b border-asphalt/80">
                    <div>
                      <span className="text-off-white font-medium block">{item.name}</span>
                      <span className="text-steel text-[11px]">
                        Qty: {item.quantity} × Tk {item.price.toLocaleString("en-BD")}
                      </span>
                    </div>
                    <span className="text-off-white font-bold">
                      Tk {(item.price * item.quantity).toLocaleString("en-BD")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs font-mono pt-3 border-t border-asphalt">
                <div className="flex justify-between text-steel">
                  <span>Subtotal:</span>
                  <span className="text-off-white">Tk {subtotal.toLocaleString("en-BD")}</span>
                </div>
                <div className="flex justify-between text-steel">
                  <span>Delivery Charge:</span>
                  <span className="text-off-white">Tk {deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-off-white pt-2 border-t border-asphalt">
                  <span>Total Amount:</span>
                  <span className="text-plate-yellow display-font text-2xl">
                    Tk {total.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-sm py-4 tracking-wider flex items-center justify-center gap-2 transition-all transform -skew-x-6 shadow-xl"
              >
                <div className="transform skew-x-6 flex items-center gap-2">
                  <span>{loading ? "Processing Order..." : "Confirm & Place Order"}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <div className="text-[11px] font-mono text-steel text-center">
                🔒 Safe & trusted Cash on Delivery experience.
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
