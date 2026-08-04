"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ShoppingBag, Phone, MapPin, CheckCircle2, Clock, Search, X, FileText, Printer } from "lucide-react";
import { DBOrder } from "@/types/db";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped = json.data.map((o: any) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customer: o.user?.name || o.address?.name || o.customerName || "Rider Customer",
          phone: o.user?.phone || o.address?.phone || o.phone || "01700000000",
          address: o.address?.line1
            ? `${o.address.line1}, ${o.address.city || ""}`
            : o.address || o.city || "House 12, Road 5, Mirpur, Dhaka",
          itemsCount: o.items?.length || o.itemsCount || 1,
          subtotal: Number(o.subtotal || o.items?.reduce((acc: number, item: any) => acc + (item.unitPrice || item.price || 0) * (item.quantity || 1), 0) || o.total || 0),
          deliveryCharge: Number(o.deliveryCharge ?? (o.address?.includes("Outside") ? 130 : 60)),
          couponCode: o.couponCode || o.notes?.match(/Coupon:\s*([A-Z0-9]+)/)?.[1] || null,
          discountAmount: Number(o.discountAmount || 0),
          total: Number(o.total ?? o.totalAmount ?? 0),
          paymentMethod: o.paymentMethod || "COD",
          paymentStatus: o.paymentStatus || "UNPAID",
          status: o.status === "PACKED" ? "CONFIRMED" : o.status || "PLACED",
          confirmationCall: o.status === "PLACED" ? "PENDING_CALL" : "CONFIRMED_VIA_PHONE",
          date: o.createdAt ? new Date(o.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          items: o.items?.map((i: any) => ({
            name: i.product?.name || i.name || "Motorcycle Accessory",
            brand: i.product?.brand || i.brand || "Bikers Demand",
            price: i.unitPrice || i.price || 0,
            quantity: i.quantity || 1,
            size: i.size || null,
            warranty: i.product?.warrantyDuration || (i.product?.warrantyFlag ? "1 Year Warranty" : "No Warranty"),
          })),
        }));
        setOrders(mapped);
      }
    } catch (e) {
      console.error("API error fetching orders:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders by orderNumber, customer name, phone, or address
  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      (o.orderNumber && String(o.orderNumber).toLowerCase().includes(query)) ||
      (o.customer && String(o.customer).toLowerCase().includes(query)) ||
      (o.phone && String(o.phone).toLowerCase().includes(query)) ||
      (o.address && String(o.address).toLowerCase().includes(query))
    );
  });

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
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, status: newStatus }),
      });
      await loadOrders();
    } catch (e) {
      console.error("Error updating order status:", e);
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
    <div className="font-mono text-xs">
      {/* Background Admin Order Fulfillment Board */}
      <div className="no-print space-y-4">
        {/* Top Header & Search Bar */}
        <div className="bg-asphalt p-3.5 border border-asphalt-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-plate-yellow uppercase tracking-wider font-bold text-[10px] block">
              ORDER FULFILLMENT BOARD
            </span>
            <h1 className="display-font text-xl font-extrabold uppercase text-off-white">
              Kanban Status Pipeline
            </h1>
          </div>

          {/* Order Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-steel absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, phone, customer name, address..."
              className="w-full bg-asphalt-2 border border-steel/30 pl-9 pr-8 py-2 text-off-white text-xs font-mono focus:border-plate-yellow focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-steel hover:text-off-white text-xs p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-steel text-[11px] shrink-0 font-mono">
            Showing: <strong className="text-off-white">{filteredOrders.length}</strong> / {orders.length} Orders
          </div>
        </div>

        {/* 4-Column Pipeline Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-start">
          {columns.map((col) => {
            const colOrders = filteredOrders.filter((o) => o.status === col.key);
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

                        {/* Badges & Invoice Button */}
                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-asphalt-2/50">
                          <span className="bg-asphalt-2 border border-steel/30 text-[9px] text-steel px-1.5 py-0.5 font-mono">
                            {o.paymentMethod} ({o.paymentStatus})
                          </span>

                          <button
                            onClick={() => setViewingOrder(o)}
                            className="text-plate-yellow hover:text-yellow-400 hover:underline flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                            title="View order details and print invoice"
                          >
                            <FileText className="w-3 h-3 text-plate-yellow" />
                            <span>Invoice</span>
                          </button>
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

      {/* Printable Invoice Modal */}
      {viewingOrder && (
        <div id="printable-invoice-modal" className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div id="printable-invoice" className="bg-asphalt-2 border border-plate-yellow/60 max-w-2xl w-full p-6 space-y-5 shadow-2xl text-xs font-mono max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-asphalt pb-3">
              <div>
                <span className="text-[10px] text-plate-yellow uppercase tracking-widest block font-bold">
                  BIKERS DEMAND — OFFICIAL INVOICE
                </span>
                <h2 className="display-font text-2xl font-extrabold text-off-white uppercase">
                  ORDER #{viewingOrder.orderNumber || viewingOrder.id}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold text-xs uppercase px-4 py-2 flex items-center gap-1.5 transform -skew-x-6 cursor-pointer"
                >
                  <div className="transform skew-x-6 flex items-center gap-1.5">
                    <Printer className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </div>
                </button>

                <button
                  onClick={() => setViewingOrder(null)}
                  className="text-steel hover:text-off-white p-1 text-sm font-mono cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Customer & Order Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 bg-asphalt p-4 border border-asphalt-2">
              <div className="space-y-1">
                <span className="text-steel block text-[10px] uppercase font-bold">CUSTOMER & SHIPPING</span>
                <div className="text-off-white font-bold text-sm">{viewingOrder.customer}</div>
                <div className="text-steel">Phone: {viewingOrder.phone}</div>
                <div className="text-steel-light leading-relaxed mt-1">
                  Address: {viewingOrder.address}
                </div>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-steel block text-[10px] uppercase font-bold">ORDER LOGISTICS</span>
                <div>Date Placed: <strong className="text-off-white">{viewingOrder.date}</strong></div>
                <div>Status: <strong className="text-plate-yellow uppercase">{viewingOrder.status}</strong></div>
                <div>Payment: <strong className="text-off-white">{viewingOrder.paymentMethod} ({viewingOrder.paymentStatus})</strong></div>
              </div>
            </div>

            {/* Item Breakdown */}
            <div className="space-y-2">
              <span className="text-steel font-bold uppercase text-[10px]">ORDERED ITEMS BREAKDOWN</span>
              <div className="border border-asphalt-2 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-asphalt text-steel font-mono uppercase border-b border-asphalt-2">
                    <tr>
                      <th className="p-2.5">Item Name</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit Price</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-asphalt-2 font-mono">
                    {viewingOrder.items && viewingOrder.items.length > 0 ? (
                      viewingOrder.items.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-asphalt/50">
                          <td className="p-2.5 font-bold text-off-white">
                            {item.brand && (
                              <span className="text-[10px] text-plate-yellow font-bold uppercase block tracking-wider mb-0.5">
                                {item.brand}
                              </span>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span>{item.name}</span>
                              {item.size && (
                                <span className="bg-asphalt-2 border border-plate-yellow/40 text-plate-yellow text-[10px] px-1.5 py-0.5 font-mono uppercase inline-block">
                                  Size: {item.size}
                                </span>
                              )}
                            </div>
                            {item.warranty && item.warranty !== "No Warranty" && (
                              <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1 font-normal">
                                <span>🛡 Warranty: {item.warranty}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-2.5 text-center font-bold">{item.quantity || 1}</td>
                          <td className="p-2.5 text-right text-steel">৳{(item.price || 0).toLocaleString("en-BD")}</td>
                          <td className="p-2.5 text-right font-bold text-off-white">
                            ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-BD")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-2.5 font-bold text-off-white">Motorcycle Accessories & Parts</td>
                        <td className="p-2.5 text-center font-bold">{viewingOrder.itemsCount || 1}</td>
                        <td className="p-2.5 text-right text-steel">
                          ৳{Number(viewingOrder.subtotal || viewingOrder.total || 0).toLocaleString("en-BD")}
                        </td>
                        <td className="p-2.5 text-right font-bold text-off-white">
                          ৳{Number(viewingOrder.subtotal || viewingOrder.total || 0).toLocaleString("en-BD")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Calculation Footer */}
            <div className="bg-asphalt p-4 border border-asphalt-2 text-xs space-y-2">
              <div className="space-y-1 font-mono text-steel text-[11px] border-b border-asphalt-2 pb-2.5">
                <div className="flex justify-between items-center">
                  <span>Subtotal (Items):</span>
                  <strong className="text-off-white">৳{Number(viewingOrder.subtotal || viewingOrder.total || 0).toLocaleString("en-BD")}</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span>Delivery Charge ({viewingOrder.address?.includes("Outside") ? "Outside Dhaka" : "Inside Dhaka"}):</span>
                  <strong className="text-off-white">+ ৳{Number(viewingOrder.deliveryCharge || (viewingOrder.address?.includes("Outside") ? 130 : 60)).toLocaleString("en-BD")}</strong>
                </div>

                {viewingOrder.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-400 font-bold">
                    <span>Coupon Discount {viewingOrder.couponCode ? `(${viewingOrder.couponCode})` : ""}:</span>
                    <span>- ৳{Number(viewingOrder.discountAmount).toLocaleString("en-BD")}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-1 font-mono">
                <span className="text-steel font-bold text-xs uppercase">FINAL AMOUNT DUE:</span>
                <span className="text-lg font-extrabold text-plate-yellow">
                  ৳{Number(viewingOrder.total || 0).toLocaleString("en-BD")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
