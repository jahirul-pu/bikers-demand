"use client";

import React, { useState } from "react";
import { X, Bike, Check, Search, ChevronRight } from "lucide-react";

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

const BIKE_DATABASE: Record<string, { model: string; variants: string[]; cc: string }[]> = {
  Yamaha: [
    { model: "FZS-Fi", variants: ["v3", "v2", "v4 Deluxe"], cc: "149cc" },
    { model: "R15", variants: ["v4", "v3", "M Edition"], cc: "155cc" },
    { model: "MT-15", variants: ["v2 BS6", "v1"], cc: "155cc" },
    { model: "FZ-X", variants: ["Standard"], cc: "149cc" },
  ],
  Honda: [
    { model: "CB Hornet", variants: ["160R ABS", "160R CBS"], cc: "162cc" },
    { model: "CBR", variants: ["150R Tricolor", "150R Repsol"], cc: "149cc" },
    { model: "XBlade", variants: ["160 Dual Disc", "160 Single Disc"], cc: "162cc" },
  ],
  Suzuki: [
    { model: "Gixxer", variants: ["155 FI ABS", "155 Carburetor"], cc: "155cc" },
    { model: "Gixxer SF", variants: ["155 FI ABS", "155 Special Edition"], cc: "155cc" },
    { model: "GSX-R150", variants: ["Keyless ABS", "Standard"], cc: "147cc" },
  ],
  Bajaj: [
    { model: "Pulsar N160", variants: ["Dual Channel ABS"], cc: "164cc" },
    { model: "Pulsar NS160", variants: ["FI ABS", "Twin Disc"], cc: "160cc" },
    { model: "Pulsar 150", variants: ["Twin Disc", "Single Disc"], cc: "149cc" },
  ],
  TVS: [
    { model: "Apache RTR 160 4V", variants: ["Special Edition ABS", "FI ABS"], cc: "159cc" },
    { model: "Apache RTR 160 2V", variants: ["ABS", "Single Disc"], cc: "159cc" },
    { model: "Raider 125", variants: ["Disc"], cc: "124cc" },
  ],
};

export default function BikeSelectorModal({
  isOpen,
  onClose,
  onSelectBike,
  currentBike,
}: BikeSelectorModalProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("Yamaha");
  const [selectedModelObj, setSelectedModelObj] = useState<{ model: string; variants: string[]; cc: string } | null>(
    BIKE_DATABASE.Yamaha[0]
  );
  const [selectedVariant, setSelectedVariant] = useState<string>("v3");
  const [searchQuery, setSearchQuery] = useState<string>("");

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
              1. Choose Brand / Make
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {Object.keys(BIKE_DATABASE).map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandChange(brand)}
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
              2. Choose Model ({selectedBrand})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BIKE_DATABASE[selectedBrand]?.map((item) => {
                const isSelected = selectedModelObj?.model === item.model;
                return (
                  <button
                    key={item.model}
                    onClick={() => {
                      setSelectedModelObj(item);
                      setSelectedVariant(item.variants[0] || "");
                    }}
                    className={`p-3 text-left border flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-asphalt border-ignition-red text-off-white"
                        : "bg-asphalt/60 border-asphalt-2 text-steel hover:border-steel/30 hover:text-off-white"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-off-white">{item.model}</div>
                      <div className="text-[11px] font-mono text-steel">{item.cc} Engine</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-ignition-red" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Select Variant / Generation */}
          {selectedModelObj && selectedModelObj.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
                3. Choose Variant / Generation
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedModelObj.variants.map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`py-1.5 px-4 text-xs font-mono transition-all border ${
                      selectedVariant === variant
                        ? "bg-ignition-red text-asphalt font-bold border-ignition-red"
                        : "bg-asphalt border-asphalt-2 text-steel hover:border-steel/40 hover:text-off-white"
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Summary Card */}
          <div className="bg-asphalt p-4 border border-plate-yellow/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-steel uppercase">SELECTED BIKE:</span>
              <div className="font-mono text-sm font-extrabold text-plate-yellow">
                {selectedBrand} {selectedModelObj?.model} {selectedVariant} ({selectedModelObj?.cc})
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-mono">✓ Ready to Filter</span>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-asphalt p-4 border-t border-asphalt-2 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-xs text-steel hover:text-off-white font-mono uppercase"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-ignition-red hover:bg-red-600 text-asphalt font-bold uppercase text-xs px-6 py-2.5 tracking-wider transition-colors transform -skew-x-6"
          >
            <span className="transform skew-x-6 block">Apply Compatibility Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
