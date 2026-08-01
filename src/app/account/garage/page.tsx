"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bike, Plus, Trash2, CheckCircle2, ArrowRight, Shield } from "lucide-react";
import { LocalStorageDB, DBBike } from "@/lib/localStorageDB";

export default function GaragePage() {
  const [garageBikes, setGarageBikes] = useState<DBBike[]>([]);

  useEffect(() => {
    LocalStorageDB.init();
    setGarageBikes(LocalStorageDB.getUserGarage());
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newBrand, setNewBrand] = useState("Yamaha");
  const [newModel, setNewModel] = useState("R15 v4");
  const [displacementCc, setDisplacementCc] = useState(155);

  const handleAddBike = (e: React.FormEvent) => {
    e.preventDefault();
    const newBike: DBBike = {
      id: `gb-${Date.now()}`,
      brand: newBrand,
      model: newModel,
      displacementCc: Number(displacementCc),
      yearStart: 2021,
      yearEnd: 2026,
      slug: `${newBrand}-${newModel}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    const updated = [newBike, ...garageBikes];
    setGarageBikes(updated);
    LocalStorageDB.saveUserGarage(updated);
    setShowAddForm(false);
  };

  const handleRemoveBike = (id: string) => {
    const updated = garageBikes.filter((b) => b.id !== id);
    setGarageBikes(updated);
    LocalStorageDB.saveUserGarage(updated);
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
            Save your bikes once. Instant 1-click compatibility filtering across the platform.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-xs px-5 py-2.5 tracking-wider flex items-center gap-2 transition-colors transform -skew-x-6 self-start sm:self-auto"
        >
          <div className="transform skew-x-6 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Cancel" : "Add Bike to Garage"}</span>
          </div>
        </button>
      </div>

      {/* Add Bike Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddBike}
          className="bg-asphalt p-5 border border-plate-yellow/40 space-y-4 font-mono text-xs"
        >
          <h3 className="font-bold text-plate-yellow uppercase">Add New Motorcycle</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-steel">Make / Brand</label>
              <select
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
              >
                <option value="Yamaha">Yamaha</option>
                <option value="Honda">Honda</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Bajaj">Bajaj</option>
                <option value="TVS">TVS</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-steel">Model</label>
              <input
                type="text"
                required
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-steel">Engine CC</label>
              <input
                type="number"
                required
                value={displacementCc}
                onChange={(e) => setDisplacementCc(Number(e.target.value))}
                className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-plate-yellow hover:bg-yellow-500 text-asphalt font-extrabold uppercase px-6 py-2 text-xs tracking-wider"
          >
            Save Bike to Garage
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
              ) : null}
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
              <Link
                href={`/account/compatible`}
                className="text-plate-yellow hover:underline font-bold flex items-center gap-1"
              >
                <span>View Compatible Parts →</span>
              </Link>

              <button
                onClick={() => handleRemoveBike(bike.id)}
                className="text-steel hover:text-ignition-red transition-colors p-1"
                title="Remove bike from garage"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
