"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Truck, Clock, CheckCircle, ChevronRight, Eye, AlertCircle, ShoppingBag, Loader2 } from "lucide-react";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchLiveOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        if (res.status === 401) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setOrders(json.data);
        }
      } catch (e) {
        console.error("API error loading user orders:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLACED":
        return <span className="bg-asphalt text-plate-yellow border border-plate-yellow/40 px-2 py-0.5 text-[10px] font-mono font-bold">PLACED</span>;
      case "CONFIRMED":
        return <span className="bg-blue-900/40 text-blue-300 border border-blue-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">CONFIRMED</span>;
      case "PACKED":
        return <span className="bg-purple-900/40 text-purple-300 border border-purple-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">PACKED</span>;
      case "SHIPPED":
        return <span className="bg-amber-900/40 text-amber-300 border border-amber-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">SHIPPED</span>;
      case "DELIVERED":
        return <span className="bg-emerald-900/40 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">DELIVERED</span>;
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
          Live tracking for your active order status pipeline (placed → confirmed → shipped → delivered).
        </p>
      </div>

      {loading && (
        <div className="py-16 flex flex-col items-center justify-center space-y-2 text-steel font-mono text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-plate-yellow" />
          <span>Loading orders...</span>
        </div>
      )}

      {!loading && unauthorized && (
        <div className="bg-asphalt-2 border border-asphalt-2 p-8 text-center space-y-3 font-mono text-xs">
          <AlertCircle className="w-8 h-8 text-plate-yellow mx-auto" />
          <h2 className="text-off-white font-bold text-sm">Please Log In</h2>
          <p className="text-steel">Log in to view your saved orders and track delivery statuses.</p>
          <div className="pt-2">
            <Link
              href="/login"
              className="bg-plate-yellow text-asphalt px-5 py-2 font-bold uppercase hover:bg-yellow-400 transition-colors inline-block"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}

      {!loading && !unauthorized && orders.length === 0 && (
        <div className="bg-asphalt-2 border border-asphalt-2 p-10 text-center space-y-3 font-mono text-xs">
          <ShoppingBag className="w-10 h-10 text-steel mx-auto stroke-1" />
          <h2 className="text-off-white font-bold text-sm">No Orders Found</h2>
          <p className="text-steel">You haven&apos;t placed any orders with this account yet.</p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="bg-ignition-red text-white px-5 py-2 font-bold uppercase hover:bg-red-700 transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      )}

      {/* Orders List */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4 font-mono text-xs">
          {orders.map((order) => {
            const itemCount = Array.isArray(order.items)
              ? order.items.reduce((s: number, i: any) => s + (i.quantity || 1), 0)
              : 1;

            return (
              <div
                key={order.id}
                className="bg-asphalt-2 p-5 border border-asphalt-2 hover:border-steel/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-asphalt pb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-plate-yellow text-sm">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-[11px] text-steel mt-0.5">
                      Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-BD") : "N/A"} • {itemCount} Item(s)
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-off-white">
                      ৳{(order.total || 0).toLocaleString("en-BD")}
                    </div>
                    <div className="text-[10px] text-steel uppercase">
                      Payment: {order.paymentMethod || "COD"}
                    </div>
                  </div>
                </div>

                {/* 4-Stage Pipeline Step Visual */}
                <div className="grid grid-cols-4 gap-2 py-2 text-center text-[10px]">
                  {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"].map((step, idx) => {
                    const pipelineOrder = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
                    const currentIdx = pipelineOrder.indexOf(order.status === "PACKED" ? "CONFIRMED" : order.status);
                    const isPassed = idx <= currentIdx;
                    return (
                      <div key={step} className="space-y-1.5">
                        <div
                          className={`h-2 rounded-full transition-colors ${
                            isPassed ? "bg-plate-yellow" : "bg-asphalt"
                          }`}
                        />
                        <span className={isPassed ? "text-off-white font-bold tracking-wider" : "text-steel/50"}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-steel">
                    Delivery to: {order.address?.city || "Dhaka"}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="bg-asphalt hover:bg-asphalt-2 border border-steel/30 text-off-white px-4 py-2 flex items-center gap-1.5 font-bold uppercase transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-plate-yellow" />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
