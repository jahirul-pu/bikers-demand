"use client";

import React, { useState, useEffect } from "react";
import { X, Bike, Check, Search, ChevronRight } from "lucide-react";
import { LocalStorageDB, DBBike } from "@/lib/localStorageDB";

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
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    LocalStorageDB.init();
    const bikes = LocalStorageDB.getBikes();
    setBikesList(bikes);
    if (bikes.length > 0) {
      setSelectedBrand(bikes[0].brand);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const availableBrands = Array.from(new Set(bikesList.map((b) => b.brand)));
  const filteredBikes = bikesList.filter((b) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return b.brand.toLowerCase().includes(q) || b.model.toLowerCase().includes(q);
    }
    return b.brand === selectedBrand;
  });

  if (!isOpen) return null;

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const models = BIKE_DATABASE[brand];
    if (models && models.length > 0) {
      setSelectedModelObj(models[0]);
      setSelectedVariant(models[0].variants[0] || "");
    }
  };

  const handleConfirm = () => {
    if (!selectedModelObj) return;
    onSelectBike({
      brand: selectedBrand,
      model: selectedModelObj.model,
      variant: selectedVariant,
      cc: selectedModelObj.cc,
    });
    onClose();
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
                One-click compatibility filter for parts & mods
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
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Select Brand */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
              1. Choose Registered Make / Brand
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {availableBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
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
              {filteredBikes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectBike({
                      brand: item.brand,
                      model: item.model,
                      cc: `${item.displacementCc}cc`,
                    });
                    onClose();
                  }}
                  className="p-3 text-left border border-asphalt-2 bg-asphalt/60 hover:bg-asphalt hover:border-plate-yellow text-steel hover:text-off-white flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="font-bold text-sm text-off-white">{item.model}</div>
                    <div className="text-[11px] font-mono text-steel">{item.displacementCc} cc Engine</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-plate-yellow" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-asphalt p-4 border-t border-asphalt-2 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-xs text-steel hover:text-off-white font-mono uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
