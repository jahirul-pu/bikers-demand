"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bike, Plus, Trash2, CheckCircle2, ArrowRight, Shield, Loader2 } from "lucide-react";
import { DBBike } from "@/types/db";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function GaragePage() {
  const [garageBikes, setGarageBikes] = useState<any[]>([]);
  const [registeredBikes, setRegisteredBikes] = useState<DBBike[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGarage = async () => {
    try {
      const res = await fetch("/api/user/garage");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped = json.data.map((ub: any) => ({
          id: ub.id,
          bikeModelId: ub.bikeModelId,
          brand: ub.bikeModel?.brand || "Brand",
          model: ub.bikeModel?.model || "Model",
          variant: ub.bikeModel?.variant || undefined,
          displacementCc: ub.bikeModel?.cc || 150,
          isPrimary: Boolean(ub.isPrimary),
          nickname: ub.nickname,
        }));
        setGarageBikes(mapped);

        // Sync primary to localStorage for quick compatibility header
        const primary = mapped.find((b: any) => b.isPrimary) || mapped[0];
        if (primary) {
          localStorage.setItem(
            "bd_selected_bike",
            JSON.stringify({ brand: primary.brand, model: primary.model, variant: primary.variant })
          );
          window.dispatchEvent(new Event("storage"));
        }
      }
    } catch (e) {
      console.error("API error loading garage bikes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGarage();

    const loadRegistry = async () => {
      try {
        const res = await fetch("/api/bikes");
        const json = await res.json();
        const list = Array.isArray(json.list) ? json.list : (Array.isArray(json.data) ? json.data : []);
        if (list.length > 0) {
          setRegisteredBikes(list);
          setNewBrand(list[0].brand);
          setNewModel(list[0].model);
          setDisplacementCc(list[0].displacementCc || 150);
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

  const handleAddBike = async (e: React.FormEvent) => {
    e.preventDefault();
    const selected = registeredBikes.find((b) => b.brand === newBrand && b.model === newModel);
    if (!selected) return;

    try {
      const res = await fetch("/api/user/garage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bikeModelId: selected.id,
          isPrimary: garageBikes.length === 0,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await loadGarage();
        setShowAddForm(false);
      } else {
        alert(json.error || "Failed to add bike to garage.");
      }
    } catch (err) {
      console.error("Error adding bike:", err);
    }
  };

  const handleSetPrimary = async (bikeModelId: string) => {
    try {
      const res = await fetch("/api/user/garage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bikeModelId,
          isPrimary: true,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await loadGarage();
      }
    } catch (err) {
      console.error("Error setting primary bike:", err);
    }
  };

  const handleConfirmRemoveBike = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/user/garage?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        await loadGarage();
      }
    } catch (err) {
      console.error("Error removing bike:", err);
    } finally {
      setDeleteTarget(null);
    }
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
          className="bg-ignition-red hover:bg-red-600 text-off-white font-extrabold uppercase text-xs px-5 py-2.5 flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bike to Garage</span>
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
                    {b.model} {b.variant ? `(${b.variant})` : ""}
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
            className="bg-plate-yellow hover:bg-yellow-500 text-asphalt font-extrabold uppercase px-6 py-2.5 text-xs tracking-wider cursor-pointer"
          >
            Save Registered Bike to Garage
          </button>
        </form>
      )}

      {loading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-2 text-steel font-mono text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-plate-yellow" />
          <span>Loading garage bikes...</span>
        </div>
      )}

      {/* Garage Bikes Cards Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {garageBikes.map((bike, idx) => (
            <div
              key={bike.id}
              className={`p-5 border transition-all space-y-4 ${
                bike.isPrimary
                  ? "bg-asphalt border-plate-yellow"
                  : "bg-asphalt/60 border-asphalt-2"
              }`}
            >
              <div className="flex justify-between items-start">
                {/* Number Plate Visual */}
                <div className="bg-plate-yellow text-asphalt px-3 py-1 border border-asphalt font-mono font-extrabold text-xs">
                  {bike.brand} • {bike.model}
                </div>

                {bike.isPrimary ? (
                  <span className="bg-plate-yellow/20 text-plate-yellow text-[10px] font-mono font-bold px-2 py-0.5 border border-plate-yellow/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-plate-yellow" />
                    PRIMARY BIKE
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetPrimary(bike.bikeModelId)}
                    className="bg-asphalt-2 hover:bg-asphalt border border-steel/30 text-steel hover:text-plate-yellow text-[10px] font-mono px-2 py-0.5 font-bold uppercase transition-colors cursor-pointer"
                  >
                    Set as Primary
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="display-font text-xl font-bold uppercase text-off-white">
                  {bike.brand} {bike.model} {bike.variant ? `(${bike.variant})` : ""}
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

          {garageBikes.length === 0 && (
            <div className="col-span-full bg-asphalt-2 p-8 border border-asphalt-2 text-center space-y-3 font-mono text-xs text-steel">
              <Bike className="w-10 h-10 mx-auto text-steel/60" />
              <p>No bikes saved in your garage yet. Click &quot;Add Bike to Garage&quot; above to select your motorcycle.</p>
            </div>
          )}
        </div>
      )}

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
