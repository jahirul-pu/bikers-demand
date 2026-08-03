"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Upload,
  ArrowLeft,
  Check,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params.id as string) || "ord-101";

  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimType, setClaimType] = useState<"WRONG_ITEM" | "COUNTERFEIT">("WRONG_ITEM");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  const order = {
    orderNumber: "BD-2026-4155",
    date: "2026-07-31",
    status: "PACKED",
    paymentMethod: "COD",
    paymentStatus: "UNPAID",
    subtotal: 9450,
    deliveryCharge: 60,
    total: 9510,
    address: {
      line1: "House 12, Road 5, Mirpur",
      city: "Dhaka",
      phone: "01712345678",
    },
    items: [
      {
        id: "oi-1",
        name: "Performance Slip-On Racing Exhaust (Black Coated)",
        brand: "Akrapovič Replica",
        price: 6500,
        quantity: 1,
        returnNote: "Parts & Mods non-returnable if opened unless verified wrong/counterfeit item.",
      },
      {
        id: "oi-2",
        name: "Dual Lens High Power LED Fog Lights with Bracket & Relay Wire",
        brand: "Future Eye",
        price: 2950,
        quantity: 1,
        returnNote: "Standard return terms apply.",
      },
    ],
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitted(true);
    setTimeout(() => {
      setShowClaimForm(false);
      setClaimSubmitted(false);
      alert("Replacement claim submitted with photo/video evidence. Claims team will review within 2 business days.");
    }, 1500);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Back button */}
      <Link href="/account/orders" className="text-steel hover:text-off-white flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Order History</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-asphalt pb-4">
        <div>
          <div className="text-plate-yellow font-extrabold text-lg">
            ORDER #{order.orderNumber}
          </div>
          <p className="text-steel text-xs">Placed on {order.date}</p>
        </div>

        <div className="bg-asphalt border border-plate-yellow/40 px-3 py-1.5 text-plate-yellow font-bold uppercase self-start sm:self-auto">
          Status: {order.status}
        </div>
      </div>

      {/* Tracking Pipeline Visual */}
      <div className="bg-asphalt-2 p-5 border border-asphalt-2 space-y-3">
        <h3 className="font-bold text-off-white uppercase">Live Delivery Pipeline</h3>
        <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
          {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"].map((step, idx) => {
            const pipeline = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
            const currentIdx = pipeline.indexOf(order.status === "PACKED" ? "CONFIRMED" : order.status);
            const active = idx <= currentIdx;
            return (
              <div key={step} className="space-y-1.5">
                <div
                  className={`h-2 rounded-full transition-colors ${
                    active ? "bg-plate-yellow" : "bg-asphalt"
                  }`}
                />
                <span className={active ? "text-off-white font-bold tracking-wider" : "text-steel/40"}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items Breakdown */}
      <div className="space-y-3">
        <h3 className="font-bold text-off-white uppercase">Order Items</h3>
        {order.items.map((item) => (
          <div key={item.id} className="bg-asphalt p-4 border border-asphalt-2 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-plate-yellow font-bold">{item.brand}</span>
                <h4 className="text-off-white font-semibold text-sm">{item.name}</h4>
                <div className="text-steel text-[11px]">
                  Qty: {item.quantity} × Tk {item.price.toLocaleString("en-BD")}
                </div>
              </div>
              <div className="font-bold text-off-white">
                Tk {(item.price * item.quantity).toLocaleString("en-BD")}
              </div>
            </div>

            <div className="text-[10px] text-steel border-t border-asphalt-2 pt-1">
              Note: {item.returnNote}
            </div>
          </div>
        ))}
      </div>

      {/* PRD Section 4.5 — Replacement Claim Workflow Box */}
      <div className="bg-asphalt p-5 border border-plate-yellow/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-plate-yellow font-bold">
            <ShieldAlert className="w-5 h-5 text-plate-yellow" />
            <span>Wrong Item / Counterfeit Replacement Claim</span>
          </div>

          <button
            onClick={() => setShowClaimForm(!showClaimForm)}
            className="bg-asphalt-2 hover:bg-asphalt border border-steel/30 text-off-white px-3 py-1.5 text-xs font-bold uppercase"
          >
            {showClaimForm ? "Close Form" : "File Claim"}
          </button>
        </div>

        <p className="text-steel text-[11px]">
          If packet seal is open and item is incorrect or counterfeit, upload photo/video evidence for replacement processing.
        </p>

        {showClaimForm && (
          <form onSubmit={handleClaimSubmit} className="space-y-4 pt-2 border-t border-asphalt-2">
            <div className="space-y-1">
              <label className="text-steel block">Claim Reason</label>
              <select
                value={claimType}
                onChange={(e: any) => setClaimType(e.target.value)}
                className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
              >
                <option value="WRONG_ITEM">Wrong Item Received</option>
                <option value="COUNTERFEIT">Counterfeit / Copy Product Claim</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-steel block">
                Evidence Image / Unboxing Video URL (Required)
              </label>
              <input
                type="url"
                required
                placeholder="https://s3.amazonaws.com/evidence-video.mp4"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
              />
              <span className="text-[10px] text-steel block">
                Upload clear unboxing video or high-res photos showing seal and packaging labels.
              </span>
            </div>

            <button
              type="submit"
              disabled={claimSubmitted}
              className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase px-6 py-2.5 tracking-wider flex items-center gap-2"
            >
              {claimSubmitted ? <Check className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
              <span>{claimSubmitted ? "Submitting Claim..." : "Submit Evidence Claim"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
