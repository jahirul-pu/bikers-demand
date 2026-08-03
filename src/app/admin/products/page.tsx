"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Edit, AlertTriangle, ShieldCheck, Check, Trash2 } from "lucide-react";
import { LocalStorageDB, DBProduct } from "@/lib/localStorageDB";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: DBProduct[] = json.data.map((p: any) => ({
          id: p.id,
          sku: p.sku || `SKU-${p.id}`,
          name: p.name,
          slug: p.slug,
          brand: p.brand,
          category: (p.category?.slug as any) || "riding-gear",
          price: p.price,
          originalPrice: p.comparePrice,
          imageUrl: p.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=60",
          stockStatus: p.stockStatus === "IN_STOCK" ? "in-stock" : "out-of-stock",
          stockQty: p.stockQty ?? 10,
          certification: p.certification !== "NONE" ? p.certification : "Standard",
          warranty: p.warrantyDuration || "1 Year Warranty",
          description: p.description,
        }));
        setProducts(mapped);
        LocalStorageDB.saveProducts(mapped);
        return;
      }
    } catch (e) {
      console.warn("Error fetching products from DB, falling back to localStorage:", e);
    } finally {
      setIsLoading(false);
    }

    LocalStorageDB.init();
    setProducts(LocalStorageDB.getProducts());
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSku, setNewSku] = useState("");
  const [newName, setNewName] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newStockQty, setNewStockQty] = useState(10);
  const [newCategory, setNewCategory] = useState<DBProduct["category"]>("riding-gear");
  const [newCertification, setNewCertification] = useState("ECE 22.06 / DOT");
  const [newWarranty, setNewWarranty] = useState("1 Year Warranty");
  const [newSizes, setNewSizes] = useState<string[]>(["M", "L", "XL"]);
  const [newCustomSpecs, setNewCustomSpecs] = useState("");
  const [imageSourceMode, setImageSourceMode] = useState<"url" | "file">("url");
  const [imageUrl, setImageUrl] = useState("");

  const toggleSize = (size: string) => {
    setNewSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (json.success && json.url) {
          setImageUrl(json.url);
        } else {
          alert("File upload failed: " + (json.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("File upload error");
      }
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newBrand || !newSku) {
      alert("Please fill in all required fields.");
      return;
    }

    const newProdPayload = {
      name: newName,
      brand: newBrand,
      sku: newSku,
      price: newPrice,
      stockQty: newStockQty,
      category: newCategory,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=60",
      certification: newCertification,
      warranty: newWarranty,
      stockStatus: newStockQty > 5 ? "in-stock" : newStockQty > 0 ? "low-stock" : "out-of-stock",
      fitBadge: "Universal Fit",
      isUniversal: true,
      description: newCustomSpecs || `Genuine ${newBrand} motorcycle accessory. Certified for quality and performance.`,
    };

    // Instant local state update
    LocalStorageDB.addProduct(newProdPayload as any);
    setProducts(LocalStorageDB.getProducts());

    // Send to Supabase DB via API
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProdPayload),
      });
      const json = await res.json();
      if (json.success && json.data) {
        fetchProducts();
      }
    } catch (err) {
      console.error("API error creating product:", err);
    }

    setShowAddModal(false);
    // Reset form
    setNewName("");
    setNewSku("");
    setNewBrand("");
    setNewPrice(0);
    setImageUrl("");
  };

  const handleConfirmDeleteProduct = () => {
    if (!deleteTarget) return;
    LocalStorageDB.deleteProduct(deleteTarget.id);
    setProducts(LocalStorageDB.getProducts());
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-asphalt-2 p-6 border border-asphalt-2">
        <div>
          <h1 className="display-font text-2xl font-extrabold text-off-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-6 h-6 text-plate-yellow" />
            Product & Inventory Management
          </h1>
          <p className="text-xs text-steel font-mono">
            {products.length} skus active in local inventory
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 flex items-center gap-2 transform -skew-x-6 cursor-pointer"
        >
          <div className="transform skew-x-6 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </div>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-asphalt-2 border border-asphalt-2 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-asphalt text-steel font-mono uppercase border-b border-asphalt-2">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">SKU / Brand</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Certification</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-asphalt-2">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-asphalt/50">
                <td className="p-3 font-semibold text-off-white flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-10 h-10 object-cover bg-asphalt border border-asphalt-2 shrink-0"
                  />
                  <span>{product.name}</span>
                </td>
                <td className="p-3 font-mono text-steel">
                  <div>{product.sku}</div>
                  <div className="text-[10px] text-plate-yellow">{product.brand}</div>
                </td>
                <td className="p-3 font-mono uppercase text-steel">{product.category}</td>
                <td className="p-3 font-mono text-off-white font-bold">
                  ৳{product.price.toLocaleString()}
                </td>
                <td className="p-3 font-mono">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      product.stockQty > 5
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : product.stockQty > 0
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {product.stockQty} in stock
                  </span>
                </td>
                <td className="p-3 font-mono text-steel">
                  {product.certification || "Standard"}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                    className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-asphalt-2 border border-asphalt-2 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="display-font text-xl font-bold text-off-white uppercase border-b border-steel/20 pb-2">
              Add New Product SKU
            </h2>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-steel block">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HJC RPHA 11 Helmet - Venom Edition"
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
                    onChange={(e) => setNewCategory(e.target.value as DBProduct["category"])}
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white"
                  >
                    <option value="riding-gear">Riding Gear & Helmets</option>
                    <option value="parts-mods">Parts & Mods</option>
                    <option value="electronics">Electronics</option>
                    <option value="merchandise">Merchandise</option>
                    <option value="additives">Additives & Oils</option>
                  </select>
                </div>
              </div>

              {/* Riding Gear Certification */}
              {newCategory === "riding-gear" && (
                <>
                  <div className="p-3 bg-asphalt border border-ignition-red/40 space-y-1">
                    <label className="text-ignition-red font-bold block">
                      Certification / Safety Rating (Auto-Appears in Filter)
                    </label>
                    <select
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      className="w-full bg-asphalt-2 border border-steel/30 p-2 text-off-white"
                    >
                      <option value="ECE 22.06">ECE 22.06 (EU Standard)</option>
                      <option value="DOT">DOT (US Standard)</option>
                      <option value="ECE / DOT">ECE + DOT Dual Certified</option>
                      <option value="CE Level 2">CE Level 2 Armor Rating</option>
                      <option value="CE Level 1">CE Level 1 Armor Rating</option>
                    </select>
                  </div>

                  {/* Helmet & Gear Available Sizes */}
                  <div className="p-3 bg-asphalt border border-steel/30 space-y-1.5">
                    <label className="text-plate-yellow font-bold block">
                      Available Sizes (Auto-Appears in Filter)
                    </label>
                    <div className="flex gap-3">
                      {["S", "M", "L", "XL", "XXL"].map((sz) => (
                        <label key={sz} className="flex items-center gap-1 text-off-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newSizes.includes(sz)}
                            onChange={() => toggleSize(sz)}
                            className="accent-ignition-red"
                          />
                          <span>{sz}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Custom Product Specifications (Auto-Appears in Filter) */}
              <div className="space-y-1">
                <label className="text-plate-yellow font-bold block">
                  Product Specifications / Filter Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pinlock Visor, ESTER 10W-40, Double D-Ring, Waterproof IP67"
                  value={newCustomSpecs}
                  onChange={(e) => setNewCustomSpecs(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 p-2 text-off-white placeholder-steel/60"
                />
                <span className="text-[10px] text-steel block">
                  * All specifications entered here will automatically generate interactive filter checkboxes on the store!
                </span>
              </div>

              {/* Product Image Selection: Cloud URL vs Local Storage File */}
              <div className="p-3 bg-asphalt border border-steel/30 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-plate-yellow font-bold block">
                    Product Image Source
                  </label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setImageSourceMode("url")}
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                        imageSourceMode === "url"
                          ? "bg-plate-yellow text-asphalt"
                          : "bg-asphalt-2 text-steel hover:text-off-white"
                      }`}
                    >
                      🌐 Cloud URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode("file")}
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                        imageSourceMode === "file"
                          ? "bg-plate-yellow text-asphalt"
                          : "bg-asphalt-2 text-steel hover:text-off-white"
                      }`}
                    >
                      📁 Local File
                    </button>
                  </div>
                </div>

                {imageSourceMode === "url" ? (
                  <div>
                    <input
                      type="url"
                      placeholder="Paste cloud URL (e.g. https://images.unsplash.com/... or Supabase storage link)"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-asphalt-2 border border-steel/30 p-2 text-off-white placeholder-steel/60 text-xs"
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full bg-asphalt-2 border border-steel/30 p-1.5 text-off-white text-xs file:mr-2 file:py-1 file:px-2 file:border-0 file:text-xs file:font-bold file:bg-ignition-red file:text-asphalt cursor-pointer"
                    />
                  </div>
                )}

                {/* Live Image Preview Thumbnail */}
                {imageUrl && (
                  <div className="flex items-center gap-3 pt-1 border-t border-asphalt-2">
                    <div className="w-12 h-12 bg-asphalt border border-plate-yellow overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ✓ Image preview loaded cleanly
                    </span>
                  </div>
                )}
              </div>

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
      {/* Branded Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Product SKU"
        message={`Are you sure you want to delete "${deleteTarget?.name}" from your active product inventory?`}
        confirmText="Yes, Delete SKU"
        cancelText="Cancel"
        onConfirm={handleConfirmDeleteProduct}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
