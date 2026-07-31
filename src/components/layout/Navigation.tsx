"use client";

import React from "react";
import Link from "next/link";
import { Shield, Wrench, Zap, Droplet, Shirt, Award, HelpCircle } from "lucide-react";

interface NavigationProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export default function Navigation({
  activeCategory,
  onSelectCategory,
}: NavigationProps) {
  const navItems = [
    { name: "Riding Gear", icon: Shield, id: "riding-gear", href: "/category/riding-gear" },
    { name: "Parts & Mods", icon: Wrench, id: "parts-mods", href: "/category/parts-mods" },
    { name: "Electronics", icon: Zap, id: "electronics", href: "/category/electronics" },
    { name: "Additives & Oils", icon: Droplet, id: "additives", href: "/category/additives" },
    { name: "Merchandise", icon: Shirt, id: "merchandise", href: "/category/merchandise" },
    { name: "Brands", icon: Award, id: "brands", href: "/search?brand=all" },
    { name: "Help", icon: HelpCircle, id: "help", href: "/faq" },
  ];

  return (
    <nav className="hidden md:block bg-asphalt-2 border-b border-asphalt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 lg:space-x-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`display-font uppercase text-base tracking-wider py-3 px-3 border-b-2 flex items-center gap-2 transition-all ${
                  isActive
                    ? "border-ignition-red text-ignition-red font-bold bg-asphalt/50"
                    : "border-transparent text-steel-light hover:text-off-white hover:border-steel hover:bg-asphalt/30"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-ignition-red" : "text-steel"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
