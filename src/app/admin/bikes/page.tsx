"use client";

import React, { useState, useEffect } from "react";
import { Bike, Plus, Edit, Check, Trash2 } from "lucide-react";
import { LocalStorageDB, DBBike } from "@/lib/localStorageDB";

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

  const fetchBikes = async () => {
    try {
      const res = await fetch("/api/bikes");
      const json = await res.json();
      if (json.success && Array.isArray(json.list) && json.list.length > 0) {
        setBikes(json.list);
        LocalStorageDB.saveBikes(json.list);
        return;
      }
    } catch (e) {
      console.warn("Error fetching bikes from DB, using localStorage:", e);
    } finally {
      setIsLoading(false);
    }
    // Fallback
    LocalStorageDB.init();
    setBikes(LocalStorageDB.getBikes());
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

    const newBikeLocal: DBBike = {
      id: `b-${Date.now()}`,
      brand: finalBrand,
      model: model.trim(),
      slug: `${finalBrand}-${model.trim()}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };

    // Instant local state update
    LocalStorageDB.addBike(newBikeLocal);
    setBikes((prev) => [newBikeLocal, ...prev]);

    // Send to Supabase DB via API
    try {
      const res = await fetch("/api/bikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: finalBrand, model: model.trim() }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        fetchBikes();
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

    const updatedData = {
      brand: finalBrand,
      model: editModel.trim(),
      slug: `${finalBrand}-${editModel.trim()}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };

    // Instant local state update
    LocalStorageDB.updateBike(editingBike.id, updatedData);
    setBikes((prev) =>
      prev.map((b) => (b.id === editingBike.id ? { ...b, ...updatedData } : b))
    );

    // Send to Supabase DB via API
    try {
      await fetch(`/api/bikes/${editingBike.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: finalBrand, model: editModel.trim() }),
      });
      fetchBikes();
    } catch (err) {
      console.error("API error updating bike:", err);
    }

    setEditingBike(null);
  };

  const handleDeleteBike = async (id: string) => {
    // Instant local state update
    LocalStorageDB.deleteBike(id);
    setBikes((prev) => prev.filter((b) => b.id !== id));

    // Delete in Supabase DB via API
    try {
      await fetch(`/api/bikes/${id}`, {
        method: "DELETE",
      });
      fetchBikes();
    } catch (err) {
      console.error("API error deleting bike:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-asphalt-2 p-6 border border-asphalt-2">
        <div>
          <span className="text-plate-yellow uppercase tracking-wider block font-bold font-mono text-xs mb-1">
            MOTORCYCLE REGISTRY
          </span>
          <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
            Bike Registry & Compatibility Matrix
          </h1>
          <p className="text-steel text-xs font-mono mt-1">
            Manage bike models independently of products so new models can be added without a dev release.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-xs px-6 py-3 flex items-center gap-2 transition-colors transform -skew-x-6 self-start sm:self-auto cursor-pointer shadow-md"
        >
          <div className="transform skew-x-6 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Bike Model</span>
          </div>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddBike} className="bg-asphalt-2 p-6 border border-plate-yellow/40 space-y-5">
          <h3 className="font-bold text-plate-yellow uppercase text-sm font-mono">
            Add New Motorcycle Model
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-steel block text-xs font-mono mb-1.5 font-bold uppercase">
                Brand
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
                  className="w-full bg-asphalt border border-steel/30 p-3 text-sm text-off-white focus:border-ignition-red focus:outline-none cursor-pointer"
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
                    className="w-full bg-asphalt border border-plate-yellow p-3 text-sm text-off-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomBrand(false);
                      setCustomBrandInput("");
                    }}
                    className="px-3 py-3 text-steel hover:text-off-white text-xs bg-asphalt border border-steel/30 shrink-0 cursor-pointer font-mono"
                    title="Back to dropdown"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-steel block text-xs font-mono mb-1.5 font-bold uppercase">
                Model Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hunter 350 / R15 v4 / FZS v3"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-asphalt border border-steel/30 p-3 text-sm text-off-white focus:border-ignition-red focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-plate-yellow hover:bg-yellow-500 text-asphalt font-extrabold uppercase text-xs px-8 py-3 cursor-pointer transition-colors font-mono tracking-wider"
          >
            Save Bike to Registry
          </button>
        </form>
      )}

      {/* Registry Table */}
      <div className="bg-asphalt-2 border border-asphalt-2 overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="bg-asphalt text-plate-yellow uppercase text-[11px] border-b border-asphalt-2">
              <th className="p-3.5">Brand</th>
              <th className="p-3.5">Model</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-asphalt-2">
            {bikes.map((b) => (
              <tr key={b.id} className="hover:bg-asphalt/50 transition-colors">
                <td className="p-3.5 font-bold text-plate-yellow text-sm">{b.brand}</td>
                <td className="p-3.5 font-bold text-off-white text-sm">{b.model}</td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleStartEdit(b)}
                      className="text-steel hover:text-plate-yellow p-1.5 transition-colors cursor-pointer"
                      title="Edit Bike"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBike(b.id)}
                      className="text-steel hover:text-ignition-red p-1.5 transition-colors cursor-pointer"
                      title="Delete Bike"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Bike Modal */}
      {editingBike && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-asphalt-2 border border-plate-yellow/60 max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-asphalt pb-3">
              <h3 className="font-bold text-plate-yellow uppercase text-sm font-mono flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Motorcycle Model
              </h3>
              <button
                onClick={() => setEditingBike(null)}
                className="text-steel hover:text-off-white text-xs font-mono cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="text-steel block text-xs font-mono mb-1.5 font-bold uppercase">
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
                      className="w-full bg-asphalt border border-steel/30 p-3 text-sm text-off-white focus:border-ignition-red focus:outline-none cursor-pointer font-mono"
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
                        className="w-full bg-asphalt border border-plate-yellow p-3 text-sm text-off-white focus:outline-none font-mono"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditIsCustomBrand(false);
                          setEditCustomBrandInput("");
                        }}
                        className="px-3 py-3 text-steel hover:text-off-white text-xs bg-asphalt border border-steel/30 shrink-0 cursor-pointer font-mono"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-steel block text-xs font-mono mb-1.5 font-bold uppercase">
                    Model Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editModel}
                    onChange={(e) => setEditModel(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-3 text-sm text-off-white focus:border-ignition-red focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBike(null)}
                  className="px-5 py-2.5 text-xs font-mono text-steel hover:text-off-white bg-asphalt border border-steel/30 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-mono bg-plate-yellow hover:bg-yellow-500 text-asphalt font-bold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Update Bike
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
