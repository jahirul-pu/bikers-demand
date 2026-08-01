"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Bike, ShoppingBag, MapPin, Heart, Settings, Wrench, ShieldAlert } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userData, setUserData] = React.useState({
    name: "Rider Account",
    phone: "017xxxxxxxx",
    initials: "RA",
  });

  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem("bikers_demand_user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const nameVal = u.name && !/^\d+$/.test(u.name) ? u.name : "Rider Account";
        const phoneVal = u.phone || u.phoneOrEmail || "017xxxxxxxx";
        const initialsVal = nameVal
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "RA";

        setUserData({
          name: nameVal,
          phone: phoneVal,
          initials: initialsVal,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const navItems = [
    { label: "My Garage", href: "/account/garage", icon: Bike },
    { label: "Compatible Parts", href: "/account/compatible", icon: Wrench },
    { label: "Order History", href: "/account/orders", icon: ShoppingBag },
    { label: "Favorites", href: "/account/wishlist", icon: Heart },
    { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
    { label: "Account Settings", href: "/account/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white">
      <Header />
      <Navigation />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Account Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-asphalt-2 p-5 border border-asphalt-2">
              <div className="flex items-center gap-3 border-b border-asphalt pb-4 mb-4">
                <div className="w-10 h-10 bg-plate-yellow text-asphalt rounded flex items-center justify-center font-bold font-mono">
                  {userData.initials}
                </div>
                <div>
                  <h3 className="font-bold text-off-white text-sm">{userData.name}</h3>
                  <p className="text-xs text-steel font-mono">{userData.phone}</p>
                </div>
              </div>

              <nav className="space-y-1 font-mono text-xs">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 py-2.5 px-3 border-l-2 transition-all ${
                        isActive
                          ? "bg-asphalt border-plate-yellow text-plate-yellow font-bold"
                          : "border-transparent text-steel hover:text-off-white hover:bg-asphalt/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick Compatibility Badge */}
            <div className="bg-asphalt-2 p-4 border border-plate-yellow/30 text-xs font-mono space-y-2">
              <div className="text-plate-yellow font-bold uppercase flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-plate-yellow" />
                <span>MY GARAGE BIKE:</span>
              </div>
              <p className="text-off-white font-semibold">Yamaha FZS-Fi v3 (149cc)</p>
              <div className="text-[10px] text-steel">
                All parts in Compatible View filtered for your saved machine.
              </div>
            </div>
          </aside>

          {/* Account Content Area */}
          <div className="lg:col-span-9 bg-asphalt-2 p-6 border border-asphalt-2">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
