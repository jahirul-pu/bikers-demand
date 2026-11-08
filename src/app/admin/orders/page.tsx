"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ShoppingBag, Phone, MapPin, CheckCircle2, Clock, Search, X, FileText, Printer, Bike } from "lucide-react";
import { DBOrder } from "@/types/db";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (viewingOrder) {
      document.body.classList.add("print-invoice-active");
      return () => {
        document.body.classList.remove("print-invoice-active");
      };
    }
  }, [viewingOrder]);

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
    <div className="space-y-5">
      {/* Background Admin Order Fulfillment Board */}
      <div className="no-print space-y-4">
        {/* Top Header & Search Bar */}
        <div className="surface rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 border border-asphalt-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-plate-yellow animate-pulse" />
              <span className="text-xs font-mono font-bold text-plate-yellow uppercase tracking-wider">
                Order Fulfillment Board
              </span>
            </div>
            <h1 className="display-font text-2xl font-extrabold text-off-white">
              Kanban Status Pipeline
            </h1>
          </div>

          {/* Order Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-steel absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, phone, customer, address..."
              className="w-full bg-asphalt border border-steel/20 rounded-xl pl-9 pr-8 py-2.5 text-off-white text-xs placeholder-steel/50 focus:border-plate-yellow focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-off-white text-xs p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-steel text-xs shrink-0 font-mono">
            Showing <strong className="text-off-white font-semibold">{filteredOrders.length}</strong> of {orders.length} orders
          </div>
        </div>

        {/* 4-Column Pipeline Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colOrders = filteredOrders.filter((o) => o.status === col.key);
            return (
              <div
                key={col.key}
                className="surface rounded-2xl border border-asphalt-2 p-3.5 space-y-3 min-h-[520px] flex flex-col shadow-xs"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-asphalt-2 pb-2.5 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      col.key === "PLACED" ? "bg-plate-yellow" :
                      col.key === "CONFIRMED" ? "bg-blue-400" :
                      col.key === "SHIPPED" ? "bg-purple-400" : "bg-emerald-400"
                    }`} />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-off-white">
                      {col.title}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${col.badgeClass}`}>
                    {colOrders.length}
                  </span>
                </div>

                {/* Column Orders List */}
                <div className="space-y-3 flex-grow">
                  {colOrders.length === 0 ? (
                    <div className="border border-dashed border-asphalt-2 rounded-xl p-6 text-center text-steel/60 text-xs italic mt-3">
                      No orders in {col.title} stage
                    </div>
                  ) : (
                    colOrders.map((o) => (
                      <div
                        key={o.id}
                        className="rounded-xl bg-asphalt/60 hover:bg-asphalt border border-asphalt-2 hover:border-steel/40 p-3.5 transition-all shadow-xs space-y-2.5 relative group"
                      >
                        {/* Order Number & Price */}
                        <div className="flex justify-between items-start border-b border-asphalt-2 pb-2">
                          <div>
                            <span className="font-bold text-plate-yellow text-xs font-mono">
                              {o.orderNumber || `BD-${String(o.id).slice(-6)}`}
                            </span>
                            <div className="text-[10px] text-steel font-mono">{o.date}</div>
                          </div>

                          <div className="text-right">
                            <div className="font-extrabold text-off-white text-xs font-mono">
                              ৳{Number(o.total || 0).toLocaleString("en-BD")}
                            </div>
                            <div className="text-[10px] text-steel font-mono">
                              {o.itemsCount || 1} {o.itemsCount === 1 ? "Item" : "Items"}
                            </div>
                          </div>
                        </div>

                        {/* Customer Info & Address */}
                        <div className="space-y-1 text-xs">
                          <div className="text-off-white font-semibold truncate">{o.customer || "Rider Customer"}</div>
                          <div className="text-steel truncate flex items-center gap-1.5 text-[11px]">
                            <Phone className="w-3 h-3 text-steel/70 shrink-0" />
                            <span>{o.phone || "N/A"}</span>
                          </div>
                          <div className="text-steel leading-snug flex items-start gap-1.5 text-[11px]">
                            <MapPin className="w-3 h-3 text-plate-yellow shrink-0 mt-0.5" />
                            <span className="break-words font-mono">{o.address || "Dhaka, Bangladesh"}</span>
                          </div>
                        </div>

                        {/* Badges & Invoice Button */}
                        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-asphalt-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-mono font-medium bg-asphalt border border-steel/20 text-steel">
                            {o.paymentMethod} ({o.paymentStatus})
                          </span>

                          <button
                            onClick={() => setViewingOrder(o)}
                            className="text-plate-yellow hover:text-amber-300 px-2 py-0.5 rounded-lg hover:bg-plate-yellow/10 transition-colors flex items-center gap-1 font-semibold text-xs cursor-pointer"
                            title="View order details and print invoice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>
                        </div>

                        {/* Controls Footer */}
                        <div className="pt-2 border-t border-asphalt-2 flex items-center justify-between gap-1.5 text-xs">
                          <select
                            value={o.status}
                            onChange={(e) => handleSetStatus(o.id, e.target.value)}
                            className="bg-asphalt-2 border border-steel/25 rounded-lg py-1 px-2 text-off-white font-semibold text-xs cursor-pointer focus:border-plate-yellow focus:outline-none flex-1 tracking-wider"
                          >
                            <option value="PLACED">PLACED</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                          </select>

                          {col.key !== "DELIVERED" && (
                            <button
                              onClick={() => handleAdvanceStatus(o.id)}
                              className="bg-ignition-red hover:bg-red-600 text-white font-semibold text-xs rounded-lg px-2.5 py-1 flex items-center gap-1 transition-all shadow-xs cursor-pointer shrink-0"
                              title="Advance to next pipeline stage"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-3.5 h-3.5" />
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

      {/* Printable Invoice Modal (Portaled to document.body for A6 print isolation) */}
      {viewingOrder && isClient && createPortal(
        <div id="printable-invoice-portal">
          <div id="printable-invoice-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-3 sm:p-4 overflow-y-auto">
            {/* Action Bar (Screen Only) */}
            <div className="w-full max-w-[105mm] mb-2.5 flex items-center justify-between no-print bg-asphalt-2/90 border border-steel/20 rounded-xl px-3 py-2 backdrop-blur shadow-lg">
              <span className="text-[11px] font-mono font-semibold text-steel flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-plate-yellow animate-pulse" />
                A6 Invoice Preview (105 × 148 mm)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-ignition-red hover:bg-red-600 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  title="Print single-page A6 invoice"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>

                <button
                  onClick={() => setViewingOrder(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-steel hover:text-off-white hover:bg-asphalt transition-colors cursor-pointer text-sm"
                  title="Close Preview"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* A6 Printable Invoice Card */}
            <div
              id="printable-invoice"
              className="bg-white text-slate-900 w-full max-w-[105mm] p-3.5 shadow-2xl rounded-xl font-mono text-[8px] leading-tight space-y-2 border border-slate-200"
            >
              {/* Header: Brand Logo, Address, Contact & Tax Invoice Title */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-2">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-[#E23434] text-white flex items-center justify-center rounded-lg shrink-0">
                    <Bike className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="display-font text-base font-extrabold tracking-tight text-slate-900 leading-none">
                      BIKERS<span className="text-[#E23434]">DEMAND</span>
                    </div>
                    <div className="text-[7.5px] font-sans font-semibold tracking-wider text-slate-500 uppercase">
                      Motorcycle Parts &amp; Riding Gear
                    </div>
                    <div className="text-[7px] text-slate-600 mt-0.5 leading-tight">
                      Tejgaon I/A, Dhaka-1208, Bangladesh<br />
                      Hotline: +880 9612-BIKERS • bikersdemand.com
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-slate-900 text-white font-mono font-bold text-[7.5px] px-1.5 py-0.5 uppercase tracking-wider rounded-xs">
                    TAX INVOICE
                  </span>
                  <div className="text-[8.5px] font-bold text-slate-900 mt-1">
                    #{viewingOrder.orderNumber || (viewingOrder.id ? String(viewingOrder.id).slice(-8).toUpperCase() : "INV-001")}
                  </div>
                  <div className="text-[7px] text-slate-500">
                    Date: {viewingOrder.date}
                  </div>
                </div>
              </div>

              {/* Customer & Order Logistics Grid */}
              <div className="grid grid-cols-2 gap-2 text-[7.5px] bg-slate-50 p-2 rounded border border-slate-200">
                <div className="space-y-0.5">
                  <span className="text-[6.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    BILL &amp; SHIP TO:
                  </span>
                  <div className="font-bold text-slate-900 text-[8.5px] truncate">
                    {viewingOrder.customer}
                  </div>
                  <div className="text-slate-700">
                    Phone: <strong className="text-slate-900 font-bold">{viewingOrder.phone}</strong>
                  </div>
                  <div className="text-slate-600 leading-tight line-clamp-2">
                    {viewingOrder.address}
                  </div>
                </div>

                <div className="space-y-0.5 text-right">
                  <span className="text-[6.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    LOGISTICS &amp; STATUS:
                  </span>
                  <div className="text-slate-700">
                    Courier: <strong className="text-slate-900">Pathao Courier</strong>
                  </div>
                  <div className="text-slate-700">
                    Payment: <strong className="text-slate-900">{viewingOrder.paymentMethod} ({viewingOrder.paymentStatus})</strong>
                  </div>
                  <div className="text-slate-700">
                    Status: <strong className="text-[#E23434] uppercase font-bold">{viewingOrder.status}</strong>
                  </div>
                </div>
              </div>

              {/* Ordered Items Table */}
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left text-[7.5px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[6.5px]">
                    <tr>
                      <th className="py-1 px-1.5">Item Description</th>
                      <th className="py-1 px-1 text-center w-6">Qty</th>
                      <th className="py-1 px-1.5 text-right w-14">Rate</th>
                      <th className="py-1 px-1.5 text-right w-14">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingOrder.items && viewingOrder.items.length > 0 ? (
                      viewingOrder.items.map((item: any, idx: number) => (
                        <tr key={idx} className="text-slate-800">
                          <td className="py-1 px-1.5 leading-tight">
                            <div className="font-semibold text-slate-900">
                              {item.brand ? `${item.brand} - ` : ""}{item.name}
                            </div>
                            {item.size && (
                              <span className="text-[6.5px] text-slate-500 block">
                                Size/Variant: {item.size}
                              </span>
                            )}
                          </td>
                          <td className="py-1 px-1 text-center font-bold">{item.quantity || 1}</td>
                          <td className="py-1 px-1.5 text-right text-slate-600">
                            ৳{(item.price || 0).toLocaleString("en-BD")}
                          </td>
                          <td className="py-1 px-1.5 text-right font-bold text-slate-900">
                            ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-BD")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-slate-800">
                        <td className="py-1 px-1.5 font-medium">Motorcycle Accessories &amp; Parts</td>
                        <td className="py-1 px-1 text-center font-bold">{viewingOrder.itemsCount || 1}</td>
                        <td className="py-1 px-1.5 text-right text-slate-600">
                          ৳{Number(viewingOrder.subtotal || viewingOrder.total || 0).toLocaleString("en-BD")}
                        </td>
                        <td className="py-1 px-1.5 text-right font-bold text-slate-900">
                          ৳{Number(viewingOrder.subtotal || viewingOrder.total || 0).toLocaleString("en-BD")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals & Notes Section */}
              <div className="flex justify-between items-start gap-2 pt-0.5 text-[7.5px]">
                <div className="flex-1 space-y-0.5 text-slate-500 text-[6.5px] leading-tight pr-2">
                  <div>• Parts cannot be returned once packaging is opened.</div>
                  <div>• For support or claims: support@bikersdemand.com</div>
                  <div className="font-semibold text-slate-700">Thank you for riding with Bikers Demand!</div>
                </div>

                <div className="w-36 space-y-0.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900">
                      ৳{Number(viewingOrder.subtotal || viewingOrder.total || 0).toLocaleString("en-BD")}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold text-slate-900">
                      + ৳{Number(viewingOrder.deliveryCharge || (viewingOrder.address?.includes("Outside") ? 130 : 60)).toLocaleString("en-BD")}
                    </span>
                  </div>
                  {viewingOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount {viewingOrder.couponCode ? `(${viewingOrder.couponCode})` : ""}:</span>
                      <span>- ৳{Number(viewingOrder.discountAmount).toLocaleString("en-BD")}</span>
                    </div>
                  )}

                  {/* COD / Amount Due Highlight Box */}
                  <div className="bg-slate-900 text-white p-1 rounded flex justify-between items-center print:bg-slate-900 print:text-white mt-0.5">
                    <span className="font-bold text-[7px] uppercase tracking-wider">
                      {viewingOrder.paymentStatus === "PAID" ? "TOTAL PAID:" : "TOTAL DUE (COD):"}
                    </span>
                    <span className="display-font text-xs font-extrabold text-[#E8B93A]">
                      ৳{Number(viewingOrder.total || 0).toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Sign-off Strip */}
              <div className="pt-1.5 border-t border-dashed border-slate-300 flex justify-between items-end text-[6.5px] text-slate-400">
                <div>
                  Authorized Dispatch: __________________
                </div>
                <div className="text-right">
                  Customer Received: __________________
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
