"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Package, AlertCircle, ShieldCheck } from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params.id as string) || "";

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`);
        const json = await res.json();

        if (json.success && json.data) {
          setOrder(json.data);
        } else {
          setError(json.error || "Order not found or access denied.");
        }
      } catch (e) {
        console.error("Error loading order:", e);
        setError("Failed to load order details. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3 font-mono text-xs text-steel">
        <Loader2 className="w-8 h-8 animate-spin text-plate-yellow" />
        <span>Loading order details...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6 font-mono text-xs">
        <Link href="/account/orders" className="text-steel hover:text-off-white flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order History</span>
        </Link>
        <div className="bg-ignition-red/10 border border-ignition-red/40 p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-ignition-red mx-auto" />
          <h2 className="text-off-white font-bold text-sm">Unable to View Order</h2>
          <p className="text-steel">{error || "Order not found."}</p>
          <div className="pt-2">
            <Link
              href="/login"
              className="bg-plate-yellow text-asphalt px-4 py-2 font-bold uppercase hover:bg-yellow-400 transition-colors inline-block"
            >
              Log In to View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pipeline = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
  const currentIdx = pipeline.indexOf(order.status === "PACKED" ? "CONFIRMED" : order.status);

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
          <p className="text-steel text-xs">
            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-BD", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }) : "N/A"}
          </p>
        </div>

        <div className="bg-asphalt border border-plate-yellow/40 px-3 py-1.5 text-plate-yellow font-bold uppercase self-start sm:self-auto">
          Status: {order.status}
        </div>
      </div>

      {/* Tracking Pipeline Visual */}
      <div className="bg-asphalt-2 p-5 border border-asphalt-2 space-y-3">
        <h3 className="font-bold text-off-white uppercase">Live Delivery Pipeline</h3>
        <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
          {pipeline.map((step, idx) => {
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

      {/* Delivery Address & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-asphalt-2 p-4 border border-asphalt-2 space-y-2">
          <h4 className="font-bold text-plate-yellow uppercase text-xs">Delivery Address</h4>
          <div className="text-off-white space-y-0.5">
            <p>{order.address?.line1 || "N/A"}</p>
            {order.address?.line2 && <p>{order.address.line2}</p>}
            <p>{order.address?.city || "Dhaka"}</p>
            <p className="text-steel">Phone: {order.address?.phone || "N/A"}</p>
          </div>
        </div>

        <div className="bg-asphalt-2 p-4 border border-asphalt-2 space-y-2">
          <h4 className="font-bold text-plate-yellow uppercase text-xs">Payment & Totals</h4>
          <div className="space-y-1 text-off-white">
            <div className="flex justify-between">
              <span className="text-steel">Payment Method:</span>
              <span className="font-bold">{order.paymentMethod || "COD"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-steel">Subtotal:</span>
              <span>৳{(order.subtotal || 0).toLocaleString("en-BD")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-steel">Delivery Charge:</span>
              <span>৳{(order.deliveryCharge || 0).toLocaleString("en-BD")}</span>
            </div>
            <div className="flex justify-between border-t border-asphalt pt-1 text-sm font-extrabold text-plate-yellow">
              <span>Total:</span>
              <span>৳{(order.total || 0).toLocaleString("en-BD")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Breakdown */}
      <div className="space-y-3">
        <h3 className="font-bold text-off-white uppercase">Order Items</h3>
        {Array.isArray(order.items) && order.items.map((item: any) => (
          <div key={item.id} className="bg-asphalt p-4 border border-asphalt-2 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-plate-yellow font-bold">{item.product?.brand || "Brand"}</span>
                <h4 className="text-off-white font-semibold text-sm">{item.product?.name || "Product"}</h4>
                {item.size && (
                  <div className="text-[10px] text-plate-yellow font-bold uppercase flex items-center gap-1 my-0.5">
                    <span>Size:</span>
                    <span className="bg-asphalt-2 px-1.5 py-0.5 border border-plate-yellow/40 rounded-xs">{item.size}</span>
                  </div>
                )}
                <div className="text-steel text-[11px]">
                  Qty: {item.quantity} × ৳{(item.unitPrice || 0).toLocaleString("en-BD")}
                </div>
              </div>
              <div className="font-bold text-off-white">
                ৳{((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString("en-BD")}
              </div>
            </div>

            <div className="text-[10px] text-steel border-t border-asphalt-2 pt-1 flex items-center justify-between">
              <span>{item.product?.returnPolicyNote || "Parts & Mods non-returnable if opened unless verified wrong/counterfeit item."}</span>
              <span className="text-plate-yellow/80 font-mono">SKU: {item.product?.sku || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
