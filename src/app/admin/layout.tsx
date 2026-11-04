"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import {
  LayoutDashboard,
  Package,
  Bike,
  ShoppingBag,
  Tag,
  FolderTree,
  Award,
  LogOut,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    router.replace("/admin/login");
    router.refresh();
  };

  // The login screen renders on its own, without the admin chrome.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const adminNav = [
    { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products & Inventory", href: "/admin/products", icon: Package },
    { label: "Category Manager", href: "/admin/categories", icon: FolderTree },
    { label: "Brand Directory", href: "/admin/brands", icon: Award },
    { label: "Bike Registry Matrix", href: "/admin/bikes", icon: Bike },
    { label: "Orders & Pipeline", href: "/admin/orders", icon: ShoppingBag },
    { label: "Coupons & Discounts", href: "/admin/coupons", icon: Tag },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white selection:bg-ignition-red/20 selection:text-off-white">
      <div className="no-print">
        <Header isAdmin={true} />
      </div>

      {/* Admin Top Bar */}
      <div className="bg-asphalt-2/90 backdrop-blur-md border-b border-asphalt-2 py-2.5 px-4 text-xs no-print sticky top-0 z-40">
        <div className="max-w-[1700px] mx-auto flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-ignition-red/10 border border-ignition-red/25 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-ignition-red" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-off-white font-bold tracking-tight text-sm">
                Bikers Demand
              </span>
              <span className="text-steel text-xs hidden sm:inline">•</span>
              <span className="text-steel text-xs hidden sm:inline">Admin Workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/"
              className="text-steel hover:text-off-white transition-colors text-xs font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-asphalt/60"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3 text-steel" />
            </Link>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-plate-yellow/10 border border-plate-yellow/30 text-plate-yellow">
              <span className="w-1.5 h-1.5 rounded-full bg-plate-yellow animate-pulse" />
              ADMIN
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-steel hover:text-ignition-red text-xs font-medium px-2.5 py-1 rounded-lg hover:bg-ignition-red/10 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-[1700px] mx-auto px-3 sm:px-4 lg:px-6 py-5 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Admin Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-3 no-print">
            <div className="surface rounded-2xl p-3 sm:p-4 shadow-sm sticky top-16">
              <div className="px-3 py-2 mb-2 border-b border-asphalt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-steel tracking-wider uppercase">
                  Management
                </span>
                <span className="text-[10px] text-steel font-mono">v0.2</span>
              </div>

              <nav className="space-y-1">
                {adminNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 py-2.5 px-3.5 rounded-xl transition-all text-xs font-medium ${
                        isActive
                          ? "bg-ignition-red/10 text-ignition-red font-semibold border border-ignition-red/25 shadow-xs"
                          : "text-steel hover:text-off-white hover:bg-asphalt/50 border border-transparent"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-ignition-red" : "text-steel"}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Admin Content View */}
          <div className="lg:col-span-9 surface rounded-2xl p-4 sm:p-6 shadow-sm min-h-[600px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
