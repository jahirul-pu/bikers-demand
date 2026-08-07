"use client";

import React, { useState, useEffect } from "react";
import { X, Bike, Check, ChevronRight } from "lucide-react";
import { DBBike } from "@/types/db";

export interface BikeOption {
  brand: string;
  model: string;
  variant?: string;
  cc?: string;
}

interface BikeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBike: (bike: BikeOption) => void;
  currentBike?: BikeOption | null;
}

export default function BikeSelectorModal({
  isOpen,
  onClose,
  onSelectBike,
  currentBike,
}: BikeSelectorModalProps) {
  const [bikesList, setBikesList] = useState<DBBike[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("Yamaha");
  const [pendingBike, setPendingBike] = useState<DBBike | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchLiveBikes = async () => {
        try {
          const res = await fetch("/api/bikes");
          const json = await res.json();
          if (json.success && Array.isArray(json.list)) {
            setBikesList(json.list);
            const initialBrand = currentBike?.brand ?? json.list[0]?.brand ?? "Yamaha";
            setSelectedBrand(initialBrand);
            if (currentBike) {
              const match = json.list.find(
                (b: DBBike) =>
                  b.brand.toLowerCase() === currentBike.brand.toLowerCase() &&
                  b.model.toLowerCase() === currentBike.model.toLowerCase()
              );
              setPendingBike(match ?? null);
            }
          }
        } catch (e) {
          console.error("API error loading bikes:", e);
        }
      };
      fetchLiveBikes();
    }
  }, [isOpen, currentBike]);

  if (!isOpen) return null;

  const availableBrands = Array.from(new Set(bikesList.map((b) => b.brand)));
  const filteredBikes = bikesList.filter((b) => b.brand === selectedBrand);

  const handleConfirm = () => {
    if (!pendingBike) return;
    onSelectBike({
      brand: pendingBike.brand,
      model: pendingBike.model,
      cc: `${pendingBike.displacementCc}cc`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-asphalt/80 backdrop-blur-sm">
      <div className="bg-asphalt-2 border border-steel/40 w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-asphalt p-4 sm:p-5 border-b border-asphalt-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-plate-yellow text-asphalt">
              <Bike className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="display-font text-xl font-extrabold uppercase text-off-white tracking-wide">
                Select Your Motorcycle
              </h3>
              <p className="text-xs text-steel font-mono">
                One-click compatibility filter for parts &amp; mods
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-steel hover:text-off-white p-1 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Step 1: Select Brand */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
              1. Choose Registered Make / Brand
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {availableBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setPendingBike(null);
                  }}
                  className={`py-2.5 px-3 text-xs font-bold font-mono uppercase transition-all border ${
                    selectedBrand === brand
                      ? "bg-plate-yellow text-asphalt border-plate-yellow font-extrabold"
                      : "bg-asphalt border-asphalt-2 text-steel-light hover:border-steel/40 hover:text-off-white"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Model */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
              2. Choose Registered Model ({selectedBrand})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredBikes.length === 0 && (
                <p className="text-steel text-xs font-mono col-span-2 py-4 text-center">
                  No models found for {selectedBrand}.
                </p>
              )}
              {filteredBikes.map((item) => {
                const isSelected = pendingBike?.id === item.id;
                const isCurrent =
                  currentBike &&
                  item.brand.toLowerCase() === currentBike.brand.toLowerCase() &&
                  item.model.toLowerCase() === currentBike.model.toLowerCase();
                return (
                  <button
                    key={item.id}
                    onClick={() => setPendingBike(item)}
                    className={`p-3 text-left border flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-plate-yellow bg-plate-yellow/10 text-off-white"
                        : "border-asphalt-2 bg-asphalt/60 hover:bg-asphalt hover:border-steel/50 text-steel hover:text-off-white"
                    }`}
                  >
                    <div>
                      <div className={`font-bold text-sm ${isSelected ? "text-plate-yellow" : "text-off-white"}`}>
                        {item.model}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {isCurrent && (
                          <span className="text-[10px] font-mono font-bold text-plate-yellow bg-plate-yellow/10 border border-plate-yellow/40 px-1.5 py-0.5 uppercase tracking-wide">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-plate-yellow shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-steel shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-asphalt p-4 border-t border-asphalt-2 flex justify-between items-center gap-3">
          <button
            onClick={onClose}
            className="text-xs text-steel hover:text-off-white font-mono uppercase transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleConfirm}
            disabled={!pendingBike}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
              pendingBike
                ? "bg-plate-yellow text-asphalt hover:bg-plate-yellow/90"
                : "bg-asphalt border border-asphalt-2 text-steel cursor-not-allowed"
            }`}
          >
            <Check className="w-4 h-4" />
            Confirm
            {pendingBike && (
              <span className="font-mono text-xs font-normal opacity-80">
                — {pendingBike.brand} {pendingBike.model}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
