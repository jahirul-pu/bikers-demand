"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Truck, Clock, CheckCircle, ChevronRight, Eye } from "lucide-react";
import { LocalStorageDB, DBOrder } from "@/lib/localStorageDB";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<DBOrder[]>([]);

  useEffect(() => {
    LocalStorageDB.init();
    setOrders(LocalStorageDB.getOrders());
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLACED":
        return <span className="bg-asphalt text-plate-yellow border border-plate-yellow/40 px-2 py-0.5 text-[10px] font-mono font-bold">PLACED</span>;
      case "CONFIRMED":
        return <span className="bg-blue-950 text-blue-400 border border-blue-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">CONFIRMED</span>;
      case "PACKED":
        return <span className="bg-purple-950 text-purple-400 border border-purple-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">PACKED</span>;
      case "SHIPPED":
        return <span className="bg-amber-950 text-amber-400 border border-amber-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">SHIPPED</span>;
      case "DELIVERED":
        return <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">DELIVERED</span>;
      default:
        return <span className="bg-asphalt text-steel px-2 py-0.5 text-[10px] font-mono">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-asphalt pb-4">
        <span className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
          CUSTOMER ORDERS
        </span>
        <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
          Order History & Tracking
        </h1>
        <p className="text-steel text-xs font-mono mt-1">
          Live tracking for your active order status pipeline (placed → confirmed → packed → shipped → delivered).
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4 font-mono text-xs">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-asphalt p-5 border border-asphalt-2 hover:border-steel/40 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-asphalt-2 pb-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-plate-yellow text-sm">
                    {order.orderNumber}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="text-[11px] text-steel mt-0.5">
                  Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-BD") : "2026-08-01"} • {order.itemsCount || 1} Items
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-extrabold text-off-white">
                  Tk {(order.totalAmount || 0).toLocaleString("en-BD")}
                </div>
                <div className="text-[10px] text-steel uppercase">
                  Payment: Cash on Delivery (COD)
                </div>
              </div>
            </div>

            {/* Pipeline Step Visual */}
            <div className="grid grid-cols-5 gap-1 py-2 text-center text-[10px]">
              {["CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"].map((step, idx) => {
                const pipelineOrder = ["CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];
                const currentIdx = pipelineOrder.indexOf(order.status);
                const isPassed = idx <= currentIdx;
                return (
                  <div key={step} className="space-y-1">
                    <div
                      className={`h-1.5 rounded-full ${
                        isPassed ? "bg-plate-yellow" : "bg-asphalt-2"
                      }`}
                    />
                    <span className={isPassed ? "text-off-white font-bold" : "text-steel/50"}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-steel">Customer: {order.customerName || "Rider"}</span>
              <Link
                href={`/account/orders/${order.id}`}
                className="bg-asphalt-2 hover:bg-asphalt border border-steel/30 text-off-white px-4 py-2 flex items-center gap-1.5 font-bold uppercase transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-plate-yellow" />
                <span>View Details & Claim</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
