"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  LayoutDashboard,
  Package,
  Bike,
  ShoppingBag,
  ShieldAlert,
  Tag,
  BarChart2,
  Lock,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const adminNav = [
    { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products & Inventory", href: "/admin/products", icon: Package },
    { label: "Bike Registry Matrix", href: "/admin/bikes", icon: Bike },
    { label: "Orders & Pipeline", href: "/admin/orders", icon: ShoppingBag },
    { label: "Evidence Claims Queue", href: "/admin/claims", icon: ShieldAlert },
    { label: "Coupons & Discounts", href: "/admin/coupons", icon: Tag },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />

      {/* Admin Top Bar */}
      <div className="bg-asphalt-2 border-b border-asphalt-2 py-3 px-4 font-mono text-xs text-steel">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-ignition-red" />
            <span className="text-off-white font-bold uppercase">Bikers Demand Admin Control Panel</span>
          </div>
          <span className="text-plate-yellow">Role: ADMIN</span>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Admin Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-asphalt-2 p-5 border border-asphalt-2">
              <h3 className="font-mono text-xs text-plate-yellow font-bold uppercase border-b border-asphalt pb-3 mb-3">
                MANAGEMENT MENU
              </h3>

              <nav className="space-y-1 font-mono text-xs">
                {adminNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 py-2.5 px-3 border-l-2 transition-all ${
                        isActive
                          ? "bg-asphalt border-ignition-red text-off-white font-bold"
                          : "border-transparent text-steel hover:text-off-white hover:bg-asphalt/50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-ignition-red" : "text-steel"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Admin Content View */}
          <div className="lg:col-span-9 bg-asphalt-2 p-6 border border-asphalt-2">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
