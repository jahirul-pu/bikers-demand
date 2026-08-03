"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bike, Plus, Trash2, CheckCircle2, ArrowRight, Shield } from "lucide-react";
import { DBBike } from "@/types/db";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function GaragePage() {
  const [garageBikes, setGarageBikes] = useState<DBBike[]>([]);
  const [registeredBikes, setRegisteredBikes] = useState<DBBike[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const loadGarage = async () => {
      try {
        const res = await fetch("/api/user/garage");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setGarageBikes(json.data);
        }
      } catch (e) {
        console.error("API error loading garage bikes:", e);
      }
    };
    loadGarage();

    const loadRegistry = async () => {
      try {
        const res = await fetch("/api/bikes");
        const json = await res.json();
        if (json.success && Array.isArray(json.list) && json.list.length > 0) {
          setRegisteredBikes(json.list);
          if (json.list.length > 0) {
            setNewBrand(json.list[0].brand);
            setNewModel(json.list[0].model);
            setDisplacementCc(json.list[0].displacementCc || 150);
          }
          return;
        }
      } catch (e) {
        console.warn("API error fetching bikes for garage:", e);
      }
    };

    loadRegistry();
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newBrand, setNewBrand] = useState("Yamaha");
  const [newModel, setNewModel] = useState("FZS-Fi v3");
  const [displacementCc, setDisplacementCc] = useState(149);

  // Filter available brands & models from registered bikes matrix
  const availableBrands = Array.from(new Set(registeredBikes.map((b) => b.brand)));
  const availableModels = registeredBikes.filter((b) => b.brand === newBrand);

  const handleBrandChange = (brand: string) => {
    setNewBrand(brand);
    const modelsForBrand = registeredBikes.filter((b) => b.brand === brand);
    if (modelsForBrand.length > 0) {
      setNewModel(modelsForBrand[0].model);
      setDisplacementCc(modelsForBrand[0].displacementCc || 150);
    }
  };

  const handleModelChange = (modelName: string) => {
    setNewModel(modelName);
    const selected = registeredBikes.find((b) => b.brand === newBrand && b.model === modelName);
    if (selected) {
      setDisplacementCc(selected.displacementCc || 150);
    }
  };

  const handleAddBike = (e: React.FormEvent) => {
    e.preventDefault();
    const selected = registeredBikes.find((b) => b.brand === newBrand && b.model === newModel);
    const newBike: DBBike = {
      id: `gb-${Date.now()}`,
      brand: newBrand,
      model: newModel,
      displacementCc: selected ? selected.displacementCc : Number(displacementCc),
      yearStart: selected ? selected.yearStart : 2020,
      yearEnd: selected ? selected.yearEnd : 2026,
      slug: `${newBrand}-${newModel}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    const updated = [newBike, ...garageBikes];
    setGarageBikes(updated);
    localStorage.setItem("bd_selected_bike", JSON.stringify({ brand: newBrand, model: newModel }));
    window.dispatchEvent(new Event("storage"));
    setShowAddForm(false);
  };

  const handleSetPrimary = (id: string) => {
    const targetIndex = garageBikes.findIndex((b) => b.id === id);
    if (targetIndex > -1) {
      const targetBike = garageBikes[targetIndex];
      const remaining = garageBikes.filter((b) => b.id !== id);
      const updated = [targetBike, ...remaining];
      setGarageBikes(updated);
      localStorage.setItem("bd_selected_bike", JSON.stringify({ brand: targetBike.brand, model: targetBike.model }));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleConfirmRemoveBike = () => {
    if (!deleteTarget) return;
    const updated = garageBikes.filter((b) => b.id !== deleteTarget.id);
    setGarageBikes(updated);
    if (updated.length > 0) {
      localStorage.setItem("bd_selected_bike", JSON.stringify({ brand: updated[0].brand, model: updated[0].model }));
    } else {
      localStorage.removeItem("bd_selected_bike");
    }
    window.dispatchEvent(new Event("storage"));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-asphalt pb-4">
        <div>
          <span className="text-xs font-mono text-plate-yellow uppercase tracking-wider block">
            MY GARAGE
          </span>
          <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
            Saved Motorcycles
          </h1>
          <p className="text-steel text-xs font-mono mt-1">
            Save your motorcycle models from our verified Bike Registry to auto-filter compatible parts.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-xs px-5 py-2.5 flex items-center gap-2 transition-colors transform -skew-x-6 self-start sm:self-auto cursor-pointer"
        >
          <div className="transform skew-x-6 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add Bike to Garage</span>
          </div>
        </button>
      </div>

      {/* Add Bike Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddBike}
          className="bg-asphalt p-6 border border-plate-yellow/40 space-y-4 font-mono text-xs animate-fade-in"
        >
          <div className="flex justify-between items-center border-b border-asphalt-2 pb-2">
            <h3 className="font-bold uppercase text-plate-yellow flex items-center gap-2">
              <Bike className="w-4 h-4" />
              <span>Select Bike from Registered Matrix</span>
            </h3>
            <span className="text-[10px] text-steel">Only verified matrix models allowed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-steel block font-bold">Registered Brand / Make</label>
              <select
                value={newBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white focus:border-plate-yellow focus:outline-none"
              >
                {availableBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-steel block font-bold">Registered Model</label>
              <select
                value={newModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white focus:border-plate-yellow focus:outline-none"
              >
                {availableModels.map((b) => (
                  <option key={b.id} value={b.model}>
                    {b.model} ({b.displacementCc} cc)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-steel block font-bold">Engine Displacement</label>
              <input
                type="number"
                disabled
                value={displacementCc}
                className="w-full bg-asphalt-2/50 border border-steel/20 p-2.5 text-steel cursor-not-allowed font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-plate-yellow hover:bg-yellow-500 text-asphalt font-extrabold uppercase px-6 py-2.5 text-xs tracking-wider cursor-pointer transform -skew-x-6"
          >
            <span className="transform skew-x-6">Save Registered Bike to Garage</span>
          </button>
        </form>
      )}

      {/* Garage Bikes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {garageBikes.map((bike, idx) => (
          <div
            key={bike.id}
            className={`p-5 border transition-all space-y-4 ${
              idx === 0
                ? "bg-asphalt border-plate-yellow"
                : "bg-asphalt/60 border-asphalt-2"
            }`}
          >
            <div className="flex justify-between items-start">
              {/* Number Plate Visual */}
              <div className="bg-plate-yellow text-asphalt px-3 py-1 border border-asphalt font-mono font-extrabold text-xs">
                {bike.brand} • {bike.model}
              </div>

              {idx === 0 ? (
                <span className="bg-plate-yellow/20 text-plate-yellow text-[10px] font-mono font-bold px-2 py-0.5 border border-plate-yellow/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-plate-yellow" />
                  PRIMARY BIKE
                </span>
              ) : (
                <button
                  onClick={() => handleSetPrimary(bike.id)}
                  className="bg-asphalt-2 hover:bg-asphalt border border-steel/30 text-steel hover:text-plate-yellow text-[10px] font-mono px-2 py-0.5 font-bold uppercase transition-colors cursor-pointer"
                >
                  Set as Primary
                </button>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="display-font text-xl font-bold uppercase text-off-white">
                {bike.brand} {bike.model}
              </h3>
              <p className="text-xs text-steel font-mono">
                Engine Displacement: {bike.displacementCc || 150} cc
              </p>
            </div>

            <div className="pt-2 border-t border-asphalt-2/80 flex justify-between items-center text-xs font-mono">
              <span className="text-[10px] text-steel">Saved in My Garage</span>

              <button
                onClick={() => setDeleteTarget({ id: bike.id, name: `${bike.brand} ${bike.model}` })}
                className="text-steel hover:text-ignition-red transition-colors p-1 cursor-pointer flex items-center gap-1"
                title="Remove bike from garage"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase">Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Branded Remove Bike Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Remove Bike from Garage"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from your garage?`}
        confirmText="Yes, Remove"
        cancelText="Cancel"
        onConfirm={handleConfirmRemoveBike}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
