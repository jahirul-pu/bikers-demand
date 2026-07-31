"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Wrench, Settings, ArrowLeft, Home, Bike } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-asphalt text-off-white font-mono">
      <Header />
      <Navigation />

      <main className="flex-grow flex items-center justify-center max-w-4xl mx-auto px-4 py-16 text-center w-full">
        <div className="bg-asphalt-2 p-8 sm:p-12 border border-steel/30 space-y-6 max-w-2xl w-full shadow-2xl relative overflow-hidden">
          
          {/* Animated Gear & Wrench Visual */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            {/* Spinning Outer Gear */}
            <Settings className="w-24 h-24 text-asphalt-2 stroke-[1.5] animate-spin-slow absolute text-steel/20" />
            <Wrench className="w-14 h-14 text-ignition-red absolute transform -rotate-45" />
            <Bike className="w-8 h-8 text-plate-yellow absolute bottom-1 right-1" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-plate-yellow uppercase tracking-widest block font-bold">
              ERROR 404 • PIT STOP
            </span>
            <h1 className="display-font text-4xl sm:text-5xl font-extrabold uppercase text-off-white tracking-wide">
              Page Not Found
            </h1>
            <p className="text-steel text-xs leading-relaxed max-w-md mx-auto">
              You've taken a wrong turn into an unbuilt track segment or removed product page. Our mechanics are working on this area.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4 text-xs font-bold uppercase">
            <Link
              href="/"
              className="bg-ignition-red hover:bg-red-600 text-asphalt px-6 py-3 tracking-wider flex items-center justify-center gap-2 transform -skew-x-6 transition-colors shadow-lg"
            >
              <div className="transform skew-x-6 flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>Return to Storefront</span>
              </div>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="bg-asphalt hover:bg-asphalt-2 border border-steel/30 text-off-white px-6 py-3 tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
