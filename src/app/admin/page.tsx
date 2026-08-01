"use client";

import React from "react";
import Link from "next/link";
import { DollarSign, ShoppingBag, AlertTriangle, ShieldAlert, ArrowRight, Package } from "lucide-react";

export default function AdminDashboardPage() {
  const metrics = [
    { label: "Today's Revenue", value: "Tk 48,500", icon: DollarSign, color: "text-emerald-400" },
    { label: "Active Orders", value: "12 Orders", icon: ShoppingBag, color: "text-plate-yellow" },
    { label: "Low Stock Alerts", value: "3 SKUs", icon: AlertTriangle, color: "text-amber-400" },
    { label: "Pending Claims Queue", value: "1 Claim", icon: ShieldAlert, color: "text-ignition-red" },
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="border-b border-asphalt pb-4">
        <span className="text-plate-yellow uppercase tracking-wider block">OVERVIEW</span>
        <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
          Admin Dashboard
        </h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-asphalt p-4 border border-asphalt-2 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-steel">{m.label}</span>
                <Icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div className="text-xl font-bold text-off-white display-font">{m.value}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Low Stock Alert Box per PRD 4.2 */}
        <div className="bg-asphalt p-5 border border-amber-500/40 space-y-3">
          <div className="flex justify-between items-center text-amber-400 font-bold">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Low Stock Owned Inventory Alerts
            </span>
            <span className="text-[10px] bg-amber-950 px-2 py-0.5 border border-amber-500/40">3 ITEMS</span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between text-steel border-b border-asphalt-2 pb-1">
              <span>Adjustable CNC Billet Levers</span>
              <span className="text-amber-400 font-bold">3 Qty Left</span>
            </div>
            <div className="flex justify-between text-steel border-b border-asphalt-2 pb-1">
              <span>Komine Riding Jacket (Size M)</span>
              <span className="text-amber-400 font-bold">2 Qty Left</span>
            </div>
            <div className="flex justify-between text-steel border-b border-asphalt-2 pb-1">
              <span>Scoyco Leather Gloves</span>
              <span className="text-amber-400 font-bold">2 Qty Left</span>
            </div>
          </div>

          <Link
            href="/admin/products"
            className="text-amber-400 hover:underline flex items-center gap-1 text-[11px] pt-1"
          >
            <span>Manage Inventory Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Evidence Claim Review Queue per PRD Section 4.5 */}
        <div className="bg-asphalt p-5 border border-ignition-red/40 space-y-3">
          <div className="flex justify-between items-center text-ignition-red font-bold">
            <h2 className="display-font text-lg font-extrabold uppercase text-off-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-ignition-red" />
              <span>Evidence Claim Queue</span>
            </h2>
            <span className="text-[10px] bg-red-950 px-2 py-0.5 border border-ignition-red/40">1 PENDING</span>
          </div>

          <div className="text-[11px] space-y-1">
            <div className="text-off-white font-bold">Order #BD-2026-4155 — Wrong Item Claim</div>
            <div className="text-steel">Customer uploaded video evidence for exhaust model mismatch.</div>
          </div>

          <Link
            href="/admin/claims"
            className="text-ignition-red hover:underline flex items-center gap-1 text-[11px] pt-1"
          >
            <span>Review Evidence & Approve Replacement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
