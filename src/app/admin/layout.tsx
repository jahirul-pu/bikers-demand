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

    { label: "Coupons & Discounts", href: "/admin/coupons", icon: Tag },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <div className="no-print">
        <Header />
      </div>

      {/* Admin Top Bar */}
      <div className="bg-asphalt-2 border-b border-asphalt-2 py-2.5 px-3 font-mono text-xs text-steel no-print">
        <div className="max-w-[1700px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-ignition-red" />
            <span className="text-off-white font-bold uppercase">Bikers Demand Admin Control Panel</span>
          </div>
          <span className="text-plate-yellow">Role: ADMIN</span>
        </div>
      </div>

      <main className="flex-grow max-w-[1700px] mx-auto px-2 sm:px-3 lg:px-4 py-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
          {/* Admin Sidebar Navigation */}
          <aside className="lg:col-span-2 space-y-3 no-print">
            <div className="bg-asphalt-2 p-3 border border-asphalt-2">
              <h3 className="font-mono text-xs text-plate-yellow font-bold uppercase border-b border-asphalt pb-2 mb-2">
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
                      className={`flex items-center gap-2 py-2 px-2.5 border-l-2 transition-all text-[11px] ${
                        isActive
                          ? "bg-asphalt border-ignition-red text-off-white font-bold"
                          : "border-transparent text-steel hover:text-off-white hover:bg-asphalt/50"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-ignition-red" : "text-steel"}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Admin Content View */}
          <div className="lg:col-span-10 bg-asphalt-2 p-3 sm:p-4 border border-asphalt-2">
            {children}
          </div>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}
