"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bike, Plus, Trash2, CheckCircle2, ArrowRight, Shield } from "lucide-react";

export default function GaragePage() {
  const [garageBikes, setGarageBikes] = useState([
    {
      id: "gb-1",
      brand: "Yamaha",
      model: "FZS-Fi",
      variant: "v3",
      cc: 149,
      nickname: "My Daily FZ",
      isPrimary: true,
    },
    {
      id: "gb-2",
      brand: "Honda",
      model: "CB Hornet",
      variant: "160R ABS",
      cc: 162,
      nickname: "Weekend Hornet",
      isPrimary: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newBrand, setNewBrand] = useState("Yamaha");
  const [newModel, setNewModel] = useState("R15");
  const [newVariant, setNewVariant] = useState("v4");
  const [nickname, setNickname] = useState("");

  const handleAddBike = (e: React.FormEvent) => {
    e.preventDefault();
    const newBike = {
      id: `gb-${Date.now()}`,
      brand: newBrand,
      model: newModel,
      variant: newVariant,
      cc: 155,
      nickname: nickname || `${newBrand} ${newModel}`,
      isPrimary: false,
    };
    setGarageBikes([...garageBikes, newBike]);
    setShowAddForm(false);
    setNickname("");
  };

  const handleSetPrimary = (id: string) => {
    setGarageBikes((prev) =>
      prev.map((b) => ({ ...b, isPrimary: b.id === id }))
    );
  };

  const handleRemoveBike = (id: string) => {
    setGarageBikes((prev) => prev.filter((b) => b.id !== id));
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
              <label className="text-steel">Variant / Gen</label>
              <input
                type="text"
                required
                value={newVariant}
                onChange={(e) => setNewVariant(e.target.value)}
                className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-steel">Custom Nickname (Optional)</label>
            <input
              type="text"
              placeholder="e.g. My Red Beast"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
            />
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
        {garageBikes.map((bike) => (
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
                {bike.brand} • {bike.model} {bike.variant}
              </div>

              {bike.isPrimary ? (
                <span className="bg-plate-yellow/20 text-plate-yellow text-[10px] font-mono font-bold px-2 py-0.5 border border-plate-yellow/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-plate-yellow" />
                  PRIMARY BIKE
                </span>
              ) : (
                <button
                  onClick={() => handleSetPrimary(bike.id)}
                  className="text-[10px] font-mono text-steel hover:text-off-white underline"
                >
                  Set Primary
                </button>
              )}
            </div>

            <div>
              <h3 className="font-mono text-base font-bold text-off-white">
                {bike.nickname}
              </h3>
              <p className="text-xs text-steel font-mono">
                {bike.brand} {bike.model} {bike.variant} ({bike.cc}cc Engine)
              </p>
            </div>

            <div className="pt-3 border-t border-asphalt flex justify-between items-center text-xs font-mono">
              <Link
                href="/account/compatible"
                className="text-plate-yellow hover:underline flex items-center gap-1"
              >
                <span>Browse Compatible Parts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => handleRemoveBike(bike.id)}
                className="text-steel hover:text-ignition-red transition-colors p-1"
                title="Remove bike"
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
