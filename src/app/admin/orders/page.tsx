"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ShoppingBag, Phone, MapPin, CheckCircle2, Clock } from "lucide-react";
import { LocalStorageDB, DBOrder } from "@/lib/localStorageDB";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    LocalStorageDB.init();
    const local = LocalStorageDB.getOrders();

    let apiOrders: any[] = [];
    try {
      const res = await fetch("/api/admin/orders");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        apiOrders = json.data.map((o: any) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customer: o.user?.name || o.address?.name || o.customerName || "Rider Customer",
          phone: o.user?.phone || o.address?.phone || o.phone || "01700000000",
          address: o.address?.line1
            ? `${o.address.line1}, ${o.address.city || ""}`
            : o.address || o.city || "House 12, Road 5, Mirpur, Dhaka",
          itemsCount: o.items?.length || o.itemsCount || 1,
          total: Number(o.total ?? o.totalAmount ?? 0),
          paymentMethod: o.paymentMethod || "COD",
          paymentStatus: o.paymentStatus || "UNPAID",
          status: o.status === "PACKED" ? "CONFIRMED" : o.status || "PLACED",
          confirmationCall: o.status === "PLACED" ? "PENDING_CALL" : "CONFIRMED_VIA_PHONE",
          date: o.createdAt ? new Date(o.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        }));
      }
    } catch (e) {
      console.warn("API error fetching orders, using localStorageDB:", e);
    }

    const localMapped = (local || []).map((o: any) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.customerName || o.customer || "Rider Customer",
      phone: o.phone || "01700000000",
      address: o.address
        ? `${o.address}${o.city && !o.address.includes(o.city) ? `, ${o.city}` : ""}`
        : (o.city || "House 12, Road 5, Mirpur, Dhaka"),
      itemsCount: Number(o.itemsCount || o.items?.length || 1),
      total: Number(o.totalAmount ?? o.total ?? o.grandTotal ?? 0),
      paymentMethod: o.paymentMethod || "COD",
      paymentStatus: o.paymentStatus || "UNPAID",
      status: o.status === "PACKED" ? "CONFIRMED" : (o.status as string) || "PLACED",
      confirmationCall: (o.status as string) === "PLACED" ? "PENDING_CALL" : "CONFIRMED_VIA_PHONE",
      date: o.createdAt ? new Date(o.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    }));

    // Merge both API and local orders, prioritizing exact orderNumber match
    const mergedMap = new Map<string, any>();
    for (const o of apiOrders) {
      if (o.orderNumber) mergedMap.set(o.orderNumber, o);
    }
    for (const o of localMapped) {
      if (o.orderNumber) {
        const existing = mergedMap.get(o.orderNumber) || {};
        mergedMap.set(o.orderNumber, { ...existing, ...o });
      }
    }

    setOrders(Array.from(mergedMap.values()));
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener("storage", loadOrders);
    const interval = setInterval(loadOrders, 3000);
    return () => {
      window.removeEventListener("storage", loadOrders);
      clearInterval(interval);
    };
  }, []);

  const columns = [
    {
      key: "PLACED",
      title: "Placed",
      topBorder: "border-t-plate-yellow text-plate-yellow",
      badgeClass: "bg-plate-yellow/20 text-plate-yellow border-plate-yellow/40",
    },
    {
      key: "CONFIRMED",
      title: "Confirmed",
      topBorder: "border-t-blue-500 text-blue-400",
      badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    },
    {
      key: "SHIPPED",
      title: "Shipped",
      topBorder: "border-t-purple-500 text-purple-400",
      badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    },
    {
      key: "DELIVERED",
      title: "Delivered",
      topBorder: "border-t-emerald-500 text-emerald-400",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    },
  ];

  const handleSetStatus = async (id: string, newStatus: string) => {
    LocalStorageDB.updateOrderStatus(id, newStatus as any);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, status: newStatus }),
      });
    } catch (e) {
      console.warn("API error updating order status:", e);
    }
  };

  const handleAdvanceStatus = async (id: string) => {
    const pipeline = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
    const targetOrder = orders.find((o) => o.id === id);
    if (!targetOrder) return;
    const currentIdx = pipeline.indexOf(targetOrder.status);
    const nextStatus = pipeline[currentIdx + 1] || targetOrder.status;

    await handleSetStatus(id, nextStatus);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Top Header */}
      <div className="bg-asphalt p-3.5 border border-asphalt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-plate-yellow uppercase tracking-wider font-bold text-[10px] block">
            ORDER FULFILLMENT BOARD
          </span>
          <h1 className="display-font text-xl font-extrabold uppercase text-off-white">
            Kanban Status Pipeline
          </h1>
        </div>

        <div className="text-steel text-[11px]">
          Total Active Orders: <strong className="text-off-white">{orders.length}</strong>
        </div>
      </div>

      {/* 4-Column Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-start">
        {columns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);
          return (
            <div
              key={col.key}
              className={`bg-asphalt-2 border border-asphalt-2 border-t-4 ${col.topBorder} p-3 space-y-3 min-h-[500px] flex flex-col`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-asphalt pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-off-white">
                    {col.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${col.badgeClass}`}>
                    {colOrders.length}
                  </span>
                </div>
                <span className="text-[9px] text-steel uppercase font-mono">{col.key}</span>
              </div>

              {/* Column Orders List */}
              <div className="space-y-2.5 flex-grow">
                {colOrders.length === 0 ? (
                  <div className="border border-dashed border-asphalt p-4 text-center text-steel/60 text-[10px] italic mt-4">
                    No orders in {col.title} stage
                  </div>
                ) : (
                  colOrders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-asphalt p-3 border border-asphalt-2 hover:border-steel/40 transition-all space-y-2 relative group"
                    >
                      {/* Order Number & Price */}
                      <div className="flex justify-between items-start border-b border-asphalt-2 pb-1.5">
                        <div>
                          <span className="font-bold text-plate-yellow text-xs font-mono">
                            {o.orderNumber || `BD-${String(o.id).slice(-6)}`}
                          </span>
                          <div className="text-[10px] text-steel">{o.date}</div>
                        </div>

                        <div className="text-right">
                          <div className="font-extrabold text-off-white text-xs">
                            ৳{Number(o.total || 0).toLocaleString("en-BD")}
                          </div>
                          <div className="text-[9px] text-steel font-mono">
                            {o.itemsCount || 1} {o.itemsCount === 1 ? "Item" : "Items"}
                          </div>
                        </div>
                      </div>

                      {/* Customer Info & Address */}
                      <div className="space-y-1 text-[10px]">
                        <div className="text-off-white font-semibold truncate">{o.customer || "Rider Customer"}</div>
                        <div className="text-steel truncate flex items-center gap-1">
                          <Phone className="w-3 h-3 text-steel/70 shrink-0" />
                          <span>{o.phone || "N/A"}</span>
                        </div>
                        <div className="text-steel-light leading-snug flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-plate-yellow shrink-0 mt-0.5" />
                          <span className="break-words font-mono text-[10px]">{o.address || "House 12, Road 5, Mirpur, Dhaka"}</span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="bg-asphalt-2 border border-steel/30 text-[9px] text-steel px-1.5 py-0.5">
                          {o.paymentMethod} ({o.paymentStatus})
                        </span>
                        {o.confirmationCall === "PENDING_CALL" && (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] px-1.5 py-0.5 font-bold">
                            ⚠️ Call Pending
                          </span>
                        )}
                      </div>

                      {/* Controls Footer */}
                      <div className="pt-2 border-t border-asphalt-2/70 flex flex-wrap items-center justify-between gap-1 text-[10px]">
                        <select
                          value={o.status}
                          onChange={(e) => handleSetStatus(o.id, e.target.value)}
                          className="bg-asphalt-2 border border-steel/30 py-1 px-1.5 text-off-white font-bold text-[10px] cursor-pointer focus:outline-none w-auto min-w-[105px] flex-1 tracking-wider"
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>

                        {col.key !== "DELIVERED" && (
                          <button
                            onClick={() => handleAdvanceStatus(o.id)}
                            className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold text-[10px] uppercase px-2 py-1 flex items-center gap-1 transform -skew-x-6 cursor-pointer shrink-0"
                            title="Move to next stage"
                          >
                            <div className="transform skew-x-6 flex items-center gap-0.5">
                              <span>Next</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
