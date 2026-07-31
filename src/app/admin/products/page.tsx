"use client";

import React, { useState } from "react";
import { Package, Plus, Edit, AlertTriangle, ShieldCheck, Check } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([
    {
      id: "prod-1",
      sku: "PARTS-EXH-001",
      name: "Performance Slip-On Racing Exhaust (Black Coated)",
      brand: "Akrapovič Replica",
      price: 6500,
      stockQty: 14,
      category: "Parts & Mods",
      certification: "NONE",
      warranty: "No Warranty",
      returnNote: "No return if opened",
    },
    {
      id: "prod-3",
      sku: "PARTS-LVR-003",
      name: "Adjustable 6-Stage CNC Billet Aluminum Brake & Clutch Levers",
      brand: "Racing Boy (RCB)",
      price: 2200,
      stockQty: 3,
      category: "Parts & Mods",
      certification: "NONE",
      warranty: "No Warranty",
      returnNote: "No return if opened",
    },
    {
      id: "prod-5",
      sku: "GEAR-HLM-005",
      name: "MT Thunder 4 SV Full Face Helmet (Matt Black)",
      brand: "MT Helmets",
      price: 9800,
      stockQty: 9,
      category: "Riding Gear",
      certification: "ECE 22.06 / DOT",
      warranty: "1 Year Warranty",
      returnNote: "7-day standard return",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSku, setNewSku] = useState("");
  const [newName, setNewName] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newStockQty, setNewStockQty] = useState(10);
  const [newCategory, setNewCategory] = useState("Riding Gear");
  const [newCertification, setNewCertification] = useState("DOT"); // Required field validation per PRD 3.4
  const [newWarranty, setNewWarranty] = useState("No Warranty");

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      id: `prod-${Date.now()}`,
      sku: newSku || `SKU-${Date.now()}`,
      name: newName,
      brand: newBrand,
      price: Number(newPrice),
      stockQty: Number(newStockQty),
      category: newCategory,
      certification: newCategory === "Riding Gear" ? newCertification : "NONE",
      warranty: newWarranty,
      returnNote: newCategory === "Parts & Mods" ? "No return if opened" : "7-day return",
    };
    setProducts([...products, newProduct]);
    setShowAddModal(false);
    setNewName("");
    setNewBrand("");
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-asphalt pb-4">
        <div>
          <span className="text-plate-yellow uppercase tracking-wider block">CATALOG & INVENTORY</span>
          <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
            Product Inventory Management
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-xs px-5 py-2.5 flex items-center gap-2 transition-colors transform -skew-x-6 self-start sm:self-auto"
        >
          <div className="transform skew-x-6 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add New Product SKU</span>
          </div>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-asphalt border border-asphalt-2 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-asphalt-2 text-plate-yellow uppercase text-[11px] border-b border-asphalt-2">
              <th className="p-3">SKU / Brand</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Certification</th>
              <th className="p-3">Stock Qty</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-asphalt-2">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-asphalt-2/50 transition-colors">
                <td className="p-3 font-bold text-off-white">
                  <div>{p.sku}</div>
                  <div className="text-[10px] text-plate-yellow">{p.brand}</div>
                </td>
                <td className="p-3 text-off-white max-w-xs truncate">{p.name}</td>
                <td className="p-3 text-steel">{p.category}</td>
                <td className="p-3">
                  {p.certification !== "NONE" ? (
                    <span className="bg-ignition-red text-asphalt font-extrabold px-2 py-0.5 text-[10px]">
                      {p.certification}
                    </span>
                  ) : (
                    <span className="text-steel/50">N/A</span>
                  )}
                </td>
                <td className="p-3 font-bold">
                  {p.stockQty <= 5 ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {p.stockQty} (Low)
                    </span>
                  ) : (
                    <span className="text-emerald-400">{p.stockQty}</span>
                  )}
                </td>
                <td className="p-3 text-off-white font-bold">Tk {p.price.toLocaleString("en-BD")}</td>
                <td className="p-3">
                  <button className="text-steel hover:text-off-white p-1">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-asphalt/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-asphalt-2 border border-steel/40 p-6 max-w-lg w-full space-y-4">
            <h3 className="display-font text-xl font-bold uppercase text-off-white">
              Create New Owned Inventory SKU
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-steel block">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HJC RPHA 11 Helmet"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 p-2 text-off-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-steel block">Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="HJC"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white"
                  />
                </div>
                <div>
                  <label className="text-steel block">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="GEAR-HLM-009"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-steel block">Price (BDT)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white"
                  />
                </div>
                <div>
                  <label className="text-steel block">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newStockQty}
                    onChange={(e) => setNewStockQty(Number(e.target.value))}
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white"
                  />
                </div>
                <div>
                  <label className="text-steel block">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white"
                  >
                    <option value="Riding Gear">Riding Gear</option>
                    <option value="Parts & Mods">Parts & Mods</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Merchandise">Merchandise</option>
                  </select>
                </div>
              </div>

              {/* Mandatory Helmet Certification validation per PRD 3.4 */}
              {newCategory === "Riding Gear" && (
                <div className="p-3 bg-asphalt border border-ignition-red/40 space-y-1">
                  <label className="text-ignition-red font-bold block">
                    Helmet Certification (Mandatory Catalog Field per PRD 3.4)
                  </label>
                  <select
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    className="w-full bg-asphalt-2 border border-steel/30 p-2 text-off-white"
                  >
                    <option value="DOT">DOT (US Standard)</option>
                    <option value="ECE 22.06">ECE 22.06 (EU Standard)</option>
                    <option value="DOT / ECE">DOT + ECE Dual Certified</option>
                  </select>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-steel uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase px-6 py-2"
                >
                  Save Product SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
