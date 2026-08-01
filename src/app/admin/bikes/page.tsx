"use client";

import React, { useState, useEffect } from "react";
import { Bike, Plus, Edit, Check, Trash2 } from "lucide-react";
import { LocalStorageDB, DBBike } from "@/lib/localStorageDB";

export default function AdminBikesPage() {
  const [bikes, setBikes] = useState<DBBike[]>([]);

  useEffect(() => {
    LocalStorageDB.init();
    setBikes(LocalStorageDB.getBikes());
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [brand, setBrand] = useState("Yamaha");
  const [model, setModel] = useState("");
  const [displacementCc, setDisplacementCc] = useState(150);

  const handleAddBike = (e: React.FormEvent) => {
    e.preventDefault();
    const newBike: DBBike = {
      id: `b-${Date.now()}`,
      brand,
      model,
      yearStart: 2020,
      yearEnd: 2026,
      displacementCc: Number(displacementCc),
      slug: `${brand}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    LocalStorageDB.addBike(newBike);
    setBikes(LocalStorageDB.getBikes());
    setShowAddForm(false);
    setModel("");
  };

  const handleDeleteBike = (id: string) => {
    LocalStorageDB.deleteBike(id);
    setBikes(LocalStorageDB.getBikes());
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-asphalt pb-4">
        <div>
          <span className="text-plate-yellow uppercase tracking-wider block font-bold">
            MOTORCYCLE REGISTRY
          </span>
          <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
            Bike Registry & Compatibility Matrix
          </h1>
          <p className="text-steel text-xs mt-1">
            Manage bike models independently of products so new models can be added without a dev release.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-xs px-5 py-2.5 flex items-center gap-2 transition-colors transform -skew-x-6 self-start sm:self-auto"
        >
          <div className="transform skew-x-6 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add Bike Model</span>
          </div>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddBike} className="bg-asphalt p-5 border border-plate-yellow/40 space-y-4">
          <h3 className="font-bold text-plate-yellow uppercase">Add New Motorcycle Model</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-steel block">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-asphalt-2 border border-steel/30 p-2 text-off-white"
              >
                <option value="Yamaha">Yamaha</option>
                <option value="Honda">Honda</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Bajaj">Bajaj</option>
                <option value="TVS">TVS</option>
                <option value="Hero">Hero</option>
                <option value="KTM">KTM</option>
              </select>
            </div>

            <div>
              <label className="text-steel block">Model</label>
              <input
                type="text"
                required
                placeholder="e.g. Duke 250"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-asphalt-2 border border-steel/30 p-2 text-off-white"
              />
            </div>

            <div>
              <label className="text-steel block">Engine CC</label>
              <input
                type="number"
                required
                value={displacementCc}
                onChange={(e) => setDisplacementCc(Number(e.target.value))}
                className="w-full bg-asphalt-2 border border-steel/30 p-2 text-off-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-plate-yellow hover:bg-yellow-500 text-asphalt font-extrabold uppercase px-6 py-2"
          >
            Save Bike to Registry
          </button>
        </form>
      )}

      {/* Registry Table */}
      <div className="bg-asphalt border border-asphalt-2 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-asphalt-2 text-plate-yellow uppercase text-[11px] border-b border-asphalt-2">
              <th className="p-3">Brand</th>
              <th className="p-3">Model</th>
              <th className="p-3">Engine CC</th>
              <th className="p-3">Years</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-asphalt-2">
            {bikes.map((b) => (
              <tr key={b.id} className="hover:bg-asphalt-2/50 transition-colors">
                <td className="p-3 font-bold text-plate-yellow">{b.brand}</td>
                <td className="p-3 font-bold text-off-white">{b.model}</td>
                <td className="p-3 text-steel">{b.displacementCc} cc</td>
                <td className="p-3 text-steel">{b.yearStart} – {b.yearEnd}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDeleteBike(b.id)}
                    className="text-steel hover:text-ignition-red p-1 transition-colors"
                    title="Delete Bike"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
