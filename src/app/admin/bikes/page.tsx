"use client";

import React, { useState, useEffect } from "react";
import { Bike, Plus, Edit, Check, Trash2 } from "lucide-react";
import { DBBike } from "@/types/db";
import ConfirmModal from "@/components/common/ConfirmModal";

const DEFAULT_BRANDS = [
  "Yamaha",
  "Honda",
  "Suzuki",
  "Bajaj",
  "TVS",
  "Hero",
  "KTM",
  "Royal Enfield",
  "Kawasaki",
  "Lifan",
  "Aprilia",
  "Speeder",
  "CFMoto",
  "Benelli",
];

export default function AdminBikesPage() {
  const [bikes, setBikes] = useState<DBBike[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchBikes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bikes");
      const json = await res.json();
      if (json.success && Array.isArray(json.list)) {
        setBikes(json.list);
      }
    } catch (e) {
      console.error("Error fetching bikes from DB:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [brand, setBrand] = useState("Yamaha");
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [customBrandInput, setCustomBrandInput] = useState("");
  const [model, setModel] = useState("");

  // Dynamic brand list combining defaults + existing bike brands
  const allBrands = Array.from(
    new Set([...DEFAULT_BRANDS, ...bikes.map((b) => b.brand)])
  ).sort();

  const handleAddBike = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalBrand = isCustomBrand ? customBrandInput.trim() : brand;

    if (!finalBrand) {
      alert("Please provide a valid brand name.");
      return;
    }

    if (!model.trim()) {
      alert("Please provide a valid model name.");
      return;
    }

    try {
      const res = await fetch("/api/bikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: finalBrand, model: model.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchBikes();
      }
    } catch (err) {
      console.error("API error adding bike:", err);
    }

    setShowAddForm(false);
    setModel("");
    setBrand(finalBrand);
    setIsCustomBrand(false);
    setCustomBrandInput("");
  };

  // Edit State
  const [editingBike, setEditingBike] = useState<DBBike | null>(null);
  const [editBrand, setEditBrand] = useState("");
  const [editIsCustomBrand, setEditIsCustomBrand] = useState(false);
  const [editCustomBrandInput, setEditCustomBrandInput] = useState("");
  const [editModel, setEditModel] = useState("");

  const handleStartEdit = (bike: DBBike) => {
    setEditingBike(bike);
    setEditModel(bike.model);
    if (allBrands.includes(bike.brand)) {
      setEditBrand(bike.brand);
      setEditIsCustomBrand(false);
      setEditCustomBrandInput("");
    } else {
      setEditBrand(bike.brand);
      setEditIsCustomBrand(true);
      setEditCustomBrandInput(bike.brand);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBike) return;

    const finalBrand = editIsCustomBrand ? editCustomBrandInput.trim() : editBrand;

    if (!finalBrand) {
      alert("Please provide a valid brand name.");
      return;
    }

    if (!editModel.trim()) {
      alert("Please provide a valid model name.");
      return;
    }

    try {
      await fetch("/api/bikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: finalBrand, model: editModel.trim() }),
      });
      await fetchBikes();
    } catch (err) {
      console.error("API error updating bike:", err);
    }

    setEditingBike(null);
  };

  const handleConfirmDeleteBike = async () => {
    if (!deleteTarget) return;

    const id = deleteTarget.id;
    setDeleteTarget(null);

    try {
      await fetch(`/api/bikes?id=${id}`, {
        method: "DELETE",
      });
      await fetchBikes();
    } catch (err) {
      console.error("API error deleting bike:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="surface rounded-2xl p-5 sm:p-6 shadow-xs border border-asphalt-2 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-plate-yellow animate-pulse" />
            <span className="text-xs font-mono font-bold text-plate-yellow uppercase tracking-wider">
              Motorcycle Registry
            </span>
          </div>
          <h1 className="display-font text-2xl sm:text-3xl font-extrabold text-off-white flex items-center gap-2.5">
            <Bike className="w-6 h-6 text-plate-yellow" />
            <span>Bike Registry &amp; Compatibility Matrix</span>
          </h1>
          <p className="text-xs text-steel font-mono mt-0.5">
            Manage motorcycle models independently so new models can be linked to parts without code updates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-ignition-red hover:bg-red-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bike Model</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddBike} className="surface rounded-2xl p-5 sm:p-6 border border-plate-yellow/30 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-asphalt-2 pb-2.5">
            <Plus className="w-4 h-4 text-plate-yellow" />
            <h3 className="font-bold text-off-white text-sm">
              Add New Motorcycle Model
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-steel block text-xs font-semibold mb-1">
                Motorcycle Brand
              </label>
              {!isCustomBrand ? (
                <select
                  value={brand}
                  onChange={(e) => {
                    if (e.target.value === "__ADD_NEW_BRAND__") {
                      setIsCustomBrand(true);
                      setCustomBrandInput("");
                    } else {
                      setBrand(e.target.value);
                    }
                  }}
                  className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-xs text-off-white focus:border-plate-yellow focus:outline-none transition-colors cursor-pointer"
                >
                  {allBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                  <option value="__ADD_NEW_BRAND__" className="font-bold text-plate-yellow">
                    + Add New Brand...
                  </option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter Brand (e.g. Royal Enfield)"
                    value={customBrandInput}
                    onChange={(e) => setCustomBrandInput(e.target.value)}
                    className="w-full bg-asphalt border border-plate-yellow rounded-xl p-2.5 text-xs text-off-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomBrand(false);
                      setCustomBrandInput("");
                    }}
                    className="px-3 py-2.5 text-steel hover:text-off-white text-xs bg-asphalt border border-steel/20 rounded-xl shrink-0 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-steel block text-xs font-semibold mb-1">
                Model &amp; Variant Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hunter 350 / R15 v4 / FZS v3"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-xs text-off-white focus:border-plate-yellow focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-plate-yellow hover:bg-yellow-400 text-asphalt font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all shadow-xs"
            >
              Save Bike to Registry
            </button>
          </div>
        </form>
      )}

      {/* Registry Table */}
      <div className="surface rounded-2xl border border-asphalt-2 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-asphalt/70 text-steel font-mono uppercase text-[11px] tracking-wider border-b border-asphalt-2">
              <tr>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Model &amp; Variant</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-asphalt-2 font-mono">
              {bikes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-steel font-mono">
                    No motorcycle models registered. Click &quot;Add Bike Model&quot; to begin.
                  </td>
                </tr>
              ) : (
                bikes.map((b) => (
                  <tr key={b.id} className="hover:bg-asphalt/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="rounded-lg bg-plate-yellow/15 border border-plate-yellow/30 px-2.5 py-1 text-xs text-plate-yellow font-bold inline-block">
                        {b.brand}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-off-white text-sm">
                      {b.model}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleStartEdit(b)}
                          className="p-1.5 rounded-lg text-steel hover:text-plate-yellow hover:bg-asphalt transition-all cursor-pointer"
                          title="Edit Bike"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: b.id, name: `${b.brand} ${b.model}` })}
                          className="p-1.5 rounded-lg text-steel hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Delete Bike"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Bike Modal */}
      {editingBike && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 text-xs">
          <div className="surface border border-asphalt-2 max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl rounded-3xl">
            <div className="flex items-center justify-between border-b border-asphalt-2 pb-3.5">
              <h3 className="display-font text-xl font-bold text-off-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-plate-yellow" />
                <span>Edit Motorcycle Model</span>
              </h3>
              <button
                onClick={() => setEditingBike(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-steel hover:text-off-white hover:bg-asphalt transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-steel block text-xs font-semibold mb-1">
                    Brand
                  </label>
                  {!editIsCustomBrand ? (
                    <select
                      value={editBrand}
                      onChange={(e) => {
                        if (e.target.value === "__ADD_NEW_BRAND__") {
                          setEditIsCustomBrand(true);
                          setEditCustomBrandInput("");
                        } else {
                          setEditBrand(e.target.value);
                        }
                      }}
                      className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-xs text-off-white focus:border-plate-yellow focus:outline-none transition-colors cursor-pointer"
                    >
                      {allBrands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                      <option value="__ADD_NEW_BRAND__" className="font-bold text-plate-yellow">
                        + Add New Brand...
                      </option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Enter Brand (e.g. Royal Enfield)"
                        value={editCustomBrandInput}
                        onChange={(e) => setEditCustomBrandInput(e.target.value)}
                        className="w-full bg-asphalt border border-plate-yellow rounded-xl p-2.5 text-xs text-off-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditIsCustomBrand(false);
                          setEditCustomBrandInput("");
                        }}
                        className="px-3 py-2.5 text-steel hover:text-off-white text-xs bg-asphalt border border-steel/20 rounded-xl shrink-0 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-steel block text-xs font-semibold mb-1">
                    Model &amp; Variant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editModel}
                    onChange={(e) => setEditModel(e.target.value)}
                    className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-xs text-off-white focus:border-plate-yellow focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-asphalt-2">
                <button
                  type="button"
                  onClick={() => setEditingBike(null)}
                  className="surface hover:bg-asphalt border border-asphalt-2 px-4 py-2 text-steel hover:text-off-white rounded-xl font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-plate-yellow hover:bg-yellow-400 text-asphalt font-bold text-xs px-5 py-2 rounded-xl cursor-pointer transition-all shadow-xs"
                >
                  Update Bike
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branded Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Bike Model"
        message={`Are you sure you want to delete "${deleteTarget?.name}" from the motorcycle compatibility registry?`}
        confirmText="Yes, Delete Model"
        cancelText="Cancel"
        onConfirm={handleConfirmDeleteBike}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
