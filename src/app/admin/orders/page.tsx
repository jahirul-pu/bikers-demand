"use client";

import React, { useState } from "react";
import { ShoppingBag, Check, Phone, Truck, Clock, ArrowRight } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: "ord-101",
      orderNumber: "BD-2026-4155",
      customer: "Tanvir Ahmed",
      phone: "01712345678",
      itemsCount: 2,
      total: 9510,
      deliveryZone: "Inside Dhaka (Tk 60)",
      paymentMethod: "COD",
      paymentStatus: "UNPAID",
      status: "PACKED",
      confirmationCall: "CONFIRMED_VIA_PHONE",
      date: "2026-07-31",
    },
    {
      id: "ord-102",
      orderNumber: "BD-2026-8492",
      customer: "Jahirul Islam",
      phone: "01819000000",
      itemsCount: 1,
      total: 3510,
      deliveryZone: "Outside Dhaka (Tk 130)",
      paymentMethod: "COD",
      paymentStatus: "UNPAID",
      status: "PLACED",
      confirmationCall: "PENDING_CALL",
      date: "2026-07-31",
    },
  ]);

  const pipeline = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

  const handleAdvanceStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const currentIdx = pipeline.indexOf(o.status);
          const nextStatus = pipeline[currentIdx + 1] || o.status;
          return { ...o, status: nextStatus };
        }
        return o;
      })
    );
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="border-b border-asphalt pb-4">
        <span className="text-plate-yellow uppercase tracking-wider block">FULFILLMENT PIPELINE</span>
        <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
          Order Management Pipeline
        </h1>
        <p className="text-steel text-xs mt-1">
          Status progression: PLACED → CONFIRMED → PACKED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-asphalt p-5 border border-asphalt-2 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-asphalt-2 pb-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-plate-yellow text-sm">
                    {o.orderNumber}
                  </span>
                  <span className="bg-asphalt-2 border border-steel/30 text-off-white px-2 py-0.5 font-bold text-[10px]">
                    {o.status}
                  </span>
                  {o.confirmationCall === "PENDING_CALL" && (
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] px-2 py-0.5">
                      ⚠️ Needs Confirmation Call
                    </span>
                  )}
                </div>
                <div className="text-steel text-[11px] mt-0.5">
                  Customer: <strong className="text-off-white">{o.customer}</strong> ({o.phone}) • {o.deliveryZone}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-off-white">Tk {o.total.toLocaleString("en-BD")}</div>
                <div className="text-[10px] text-steel">Payment: {o.paymentMethod} ({o.paymentStatus})</div>
              </div>
            </div>

            {/* Pipeline Visual Bar */}
            <div className="grid grid-cols-6 gap-1 py-1 text-center text-[9px]">
              {pipeline.map((step, idx) => {
                const currentIdx = pipeline.indexOf(o.status);
                const active = idx <= currentIdx;
                return (
                  <div key={step} className="space-y-1">
                    <div className={`h-1.5 rounded-full ${active ? "bg-plate-yellow" : "bg-asphalt-2"}`} />
                    <span className={active ? "text-off-white font-bold" : "text-steel/40"}>{step}</span>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-steel">Date: {o.date}</span>
              <button
                onClick={() => handleAdvanceStatus(o.id)}
                className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase px-4 py-2 flex items-center gap-1.5 transform -skew-x-6"
              >
                <div className="transform skew-x-6 flex items-center gap-1">
                  <span>Advance Status</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
