"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
  Package,
  Bike,
  Tag,
  Clock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    activeOrders: 0,
    totalOrders: 0,
    lowStockCount: 0,
    totalProducts: 0,
    totalBikes: 0,
  });
  const [lowStockItems, setLowStockItems] = useState<{ id: string; name: string; stockQty: number; sku: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ordersRes, productsRes, bikesRes] = await Promise.all([
          fetch("/api/admin/orders").then((r) => r.json()).catch(() => ({})),
          fetch("/api/products").then((r) => r.json()).catch(() => ({})),
          fetch("/api/bikes").then((r) => r.json()).catch(() => ({})),
        ]);

        let revenue = 0;
        let activeOrders = 0;
        let totalOrders = 0;
        if (ordersRes.success && Array.isArray(ordersRes.data)) {
          totalOrders = ordersRes.data.length;
          ordersRes.data.forEach((o: any) => {
            const total = Number(o.total || o.totalAmount || 0);
            revenue += total;
            if (o.status === "PLACED" || o.status === "CONFIRMED" || o.status === "PACKED") {
              activeOrders += 1;
            }
          });
        }

        let lowStockList: any[] = [];
        let totalProducts = 0;
        if (productsRes.success && Array.isArray(productsRes.data)) {
          totalProducts = productsRes.data.length;
          productsRes.data.forEach((p: any) => {
            const qty = p.stockQty ?? 0;
            if (qty <= 3) {
              lowStockList.push({
                id: p.id,
                name: p.name,
                stockQty: qty,
                sku: p.sku || `SKU-${p.id.slice(0, 6)}`,
              });
            }
          });
        }

        let totalBikes = 0;
        if (bikesRes.success && Array.isArray(bikesRes.list)) {
          totalBikes = bikesRes.list.length;
        }

        setStats({
          revenue,
          activeOrders,
          totalOrders,
          lowStockCount: lowStockList.length,
          totalProducts,
          totalBikes,
        });
        setLowStockItems(lowStockList.slice(0, 5));
      } catch (err) {
        console.error("Failed to load admin dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const metricCards = [
    {
      label: "Total Sales",
      value: `৳${stats.revenue.toLocaleString()}`,
      subtext: `${stats.totalOrders} total orders placed`,
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Active Pipeline",
      value: `${stats.activeOrders} Orders`,
      subtext: "Needs fulfillment or shipping",
      icon: ShoppingBag,
      color: "text-plate-yellow",
      bg: "bg-plate-yellow/10 border-plate-yellow/20",
    },
    {
      label: "Low Stock Alert",
      value: `${stats.lowStockCount} SKUs`,
      subtext: "Inventory at or below 3 units",
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Active Catalog",
      value: `${stats.totalProducts} Products`,
      subtext: `Across ${stats.totalBikes} bike models`,
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="border-b border-asphalt-2 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-ignition-red animate-pulse" />
            <span className="text-xs font-mono font-bold text-plate-yellow uppercase tracking-wider">
              Overview
            </span>
          </div>
          <h1 className="display-font text-2xl sm:text-3xl font-extrabold text-off-white">
            Admin Dashboard
          </h1>
          <p className="text-xs text-steel mt-0.5">
            Real-time catalog metrics, inventory health, and order fulfillment status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className="bg-ignition-red hover:bg-red-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manage Products</span>
          </Link>
          <Link
            href="/admin/orders"
            className="surface hover:bg-asphalt text-off-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-sm border border-asphalt-2 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-plate-yellow" />
            <span>Live Orders</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="surface rounded-2xl p-5 space-y-3 hover:border-steel/40 transition-all shadow-xs"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-steel">{m.label}</span>
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${m.bg}`}>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
              </div>
              <div>
                <div className="display-font text-2xl sm:text-3xl font-extrabold text-off-white">
                  {m.value}
                </div>
                <div className="text-[11px] text-steel font-mono mt-1">{m.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action & Inventory Alert Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Low Stock Alert Box per PRD 4.2 */}
        <div className="lg:col-span-7 rounded-2xl border border-plate-yellow/30 bg-plate-yellow/5 p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-plate-yellow/15 border border-plate-yellow/30 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-plate-yellow" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-off-white">
                  Low Stock Inventory Alerts
                </h3>
                <p className="text-[11px] text-steel">
                  Owned inventory threshold warning (≤ 3 units)
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-plate-yellow/20 text-plate-yellow border border-plate-yellow/30">
              {stats.lowStockCount} items
            </span>
          </div>

          <div className="divide-y divide-plate-yellow/15 pt-1">
            {lowStockItems.length === 0 ? (
              <div className="py-4 text-xs text-steel flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All product inventory levels are healthy (greater than 3 units).</span>
              </div>
            ) : (
              lowStockItems.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-off-white truncate">{item.name}</p>
                    <p className="text-[11px] font-mono text-steel">{item.sku}</p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.stockQty} left
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-plate-yellow/15">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-plate-yellow hover:text-amber-300 transition-colors"
            >
              <span>Restock in Product Management</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Shortcuts & Operations */}
        <div className="lg:col-span-5 surface rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="border-b border-asphalt-2 pb-3">
            <h3 className="text-sm font-bold text-off-white">Quick Operations</h3>
            <p className="text-[11px] text-steel">Frequently accessed administrative workflows</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <Link
              href="/admin/products"
              className="flex items-center justify-between p-3 rounded-xl bg-asphalt/60 hover:bg-asphalt border border-asphalt-2 transition-all hover:border-steel/40 text-xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-ignition-red/10 border border-ignition-red/20 flex items-center justify-center text-ignition-red">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-off-white group-hover:text-ignition-red transition-colors">
                    Add or Edit Products
                  </div>
                  <div className="text-[11px] text-steel">Update prices, stock, specs, or images</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-steel group-hover:text-off-white transition-colors" />
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center justify-between p-3 rounded-xl bg-asphalt/60 hover:bg-asphalt border border-asphalt-2 transition-all hover:border-steel/40 text-xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-plate-yellow/10 border border-plate-yellow/20 flex items-center justify-center text-plate-yellow">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-off-white group-hover:text-plate-yellow transition-colors">
                    Kanban Orders Pipeline
                  </div>
                  <div className="text-[11px] text-steel">Move orders from Placed to Delivered</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-steel group-hover:text-off-white transition-colors" />
            </Link>

            <Link
              href="/admin/bikes"
              className="flex items-center justify-between p-3 rounded-xl bg-asphalt/60 hover:bg-asphalt border border-asphalt-2 transition-all hover:border-steel/40 text-xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Bike className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-off-white group-hover:text-blue-400 transition-colors">
                    Bike Registry Matrix
                  </div>
                  <div className="text-[11px] text-steel">Manage motorcycle models & variants</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-steel group-hover:text-off-white transition-colors" />
            </Link>

            <Link
              href="/admin/coupons"
              className="flex items-center justify-between p-3 rounded-xl bg-asphalt/60 hover:bg-asphalt border border-asphalt-2 transition-all hover:border-steel/40 text-xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-off-white group-hover:text-emerald-400 transition-colors">
                    Discount Coupons
                  </div>
                  <div className="text-[11px] text-steel">Create flat or percentage discount codes</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-steel group-hover:text-off-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
