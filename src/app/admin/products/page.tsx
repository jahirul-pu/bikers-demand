"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Edit, AlertTriangle, ShieldCheck, Check, Trash2, Search, Filter } from "lucide-react";
import { DBProduct } from "@/types/db";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
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
          stockQty: p.stockQty ?? 0,
          certification: p.certification !== "NONE" ? p.certification : undefined,
          warranty: p.warrantyDuration || (p.warrantyFlag ? "1 Year Warranty" : "No Warranty"),
          sizes: p.sizes || [],
          description: p.description,
        }));
        setProducts(mapped);
      }
    } catch (e) {
      console.error("Error fetching products from DB:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [editingProduct, setEditingProduct] = useState<DBProduct | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProducts = products.filter((p) => {
    if (selectedCategoryFilter !== "all" && p.category !== selectedCategoryFilter) {
      return false;
    }
    if (stockFilter === "in-stock" && (p.stockStatus === "out-of-stock" || p.stockQty <= 0)) {
      return false;
    }
    if (stockFilter === "out-of-stock" && p.stockStatus === "in-stock" && p.stockQty > 0) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchSku) return false;
    }
    return true;
  });
  const [newSku, setNewSku] = useState("");
  const [newName, setNewName] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newComparePrice, setNewComparePrice] = useState<number | "">("");
  const [newStockQty, setNewStockQty] = useState(10);
  const [newStockStatus, setNewStockStatus] = useState<"in-stock" | "out-of-stock">("in-stock");
  const [newCategory, setNewCategory] = useState<DBProduct["category"]>("riding-gear");
  const [newCertification, setNewCertification] = useState("ECE 22.06 / DOT");
  const [newWarranty, setNewWarranty] = useState("1 Year Warranty");
  const [newSizes, setNewSizes] = useState<string[]>(["M", "L", "XL"]);
  const [newCustomSpecs, setNewCustomSpecs] = useState("");
  const [imageSourceMode, setImageSourceMode] = useState<"url" | "file">("url");
  const [imageUrl, setImageUrl] = useState("");

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setNewName("");
    setNewBrand("");
    setNewSku("");
    setNewPrice(0);
    setNewComparePrice("");
    setNewStockQty(10);
    setNewStockStatus("in-stock");
    setNewCategory("riding-gear");
    setNewCertification("ECE 22.06 / DOT");
    setNewWarranty("1 Year Warranty");
    setNewSizes(["M", "L", "XL"]);
    setNewCustomSpecs("");
    setImageUrl("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (p: DBProduct) => {
    setEditingProduct(p);
    setNewName(p.name);
    setNewBrand(p.brand);
    setNewSku(p.sku);
    setNewPrice(p.price);
    setNewComparePrice(p.originalPrice || "");
    setNewStockQty(p.stockQty);
    setNewStockStatus(p.stockStatus === "out-of-stock" || p.stockQty <= 0 ? "out-of-stock" : "in-stock");
    setNewCategory(p.category || "riding-gear");
    setNewCertification(p.certification || "ECE 22.06 / DOT");
    setNewWarranty(p.warranty || "No Warranty");
    setNewSizes(p.sizes || ["M", "L", "XL"]);
    setNewCustomSpecs(p.description || "");
    setImageUrl(p.imageUrl || "");
    setShowAddModal(true);
  };

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

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newBrand || !newSku) {
      alert("Please fill in all required fields.");
      return;
    }

    const prodPayload = {
      ...(editingProduct && { id: editingProduct.id }),
      name: newName,
      brand: newBrand,
      sku: newSku,
      price: newPrice,
      comparePrice: newComparePrice !== "" ? Number(newComparePrice) : null,
      stockQty: newStockQty,
      stockStatus: newStockStatus,
      category: newCategory,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=60",
      certification: newCertification,
      warranty: newWarranty,
      sizes: newSizes,
      description: newCustomSpecs || `Genuine ${newBrand} motorcycle accessory. Certified for quality and performance.`,
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch("/api/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prodPayload),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prodPayload),
        });
      }
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert("Failed to save product: " + (data.error || "Unknown error"));
        return;
      }
    } catch (err: any) {
      console.error("API error saving product:", err);
      alert("Network error saving product: " + err.message);
      return;
    }

    await fetchProducts();
    setShowAddModal(false);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/products?id=${deleteTarget.id}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("API error deleting product:", e);
    }

    await fetchProducts();
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
          onClick={handleOpenAddModal}
          className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 flex items-center gap-2 transform -skew-x-6 cursor-pointer"
        >
          <div className="transform skew-x-6 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </div>
        </button>
      </div>

      {/* Interactive Filter & Search Control Bar */}
      <div className="bg-asphalt-2 p-4 border border-asphalt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-steel absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Title, Brand, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-asphalt border border-steel/30 pl-9 pr-3 py-2 text-off-white placeholder-steel/60 focus:border-plate-yellow transition-colors"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-plate-yellow shrink-0" />
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full bg-asphalt border border-steel/30 p-2 text-off-white focus:border-plate-yellow transition-colors cursor-pointer"
          >
            <option value="all">Category: All ({products.length})</option>
            <option value="helmets">Helmets ({products.filter(p => p.category === "helmets").length})</option>
            <option value="riding-gear">Riding Gear ({products.filter(p => p.category === "riding-gear").length})</option>
            <option value="parts">Parts ({products.filter(p => p.category === "parts").length})</option>
            <option value="accessories">Accessories ({products.filter(p => p.category === "accessories").length})</option>
            <option value="parts-mods">Parts & Mods ({products.filter(p => p.category === "parts-mods").length})</option>
            <option value="electronics">Electronics ({products.filter(p => p.category === "electronics").length})</option>
            <option value="additives">Additives & Oils ({products.filter(p => p.category === "additives").length})</option>
          </select>
        </div>

        {/* Stock Status Filter Dropdown */}
        <div>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full bg-asphalt border border-steel/30 p-2 text-off-white focus:border-plate-yellow transition-colors cursor-pointer"
          >
            <option value="all">Stock: All Statuses</option>
            <option value="in-stock">In Stock Only</option>
            <option value="out-of-stock">Out of Stock Only</option>
          </select>
        </div>
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
              <th className="p-3">Stock Status</th>
              <th className="p-3">Warranty</th>
              <th className="p-3">Certification</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-asphalt-2">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-steel font-mono">
                  No products found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
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
                      product.stockStatus === "out-of-stock" || product.stockQty <= 0
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-green-500/10 text-green-400 border border-green-500/20"
                    }`}
                  >
                    {product.stockStatus === "out-of-stock" || product.stockQty <= 0
                      ? "Out of Stock"
                      : `In Stock (${product.stockQty})`}
                  </span>
                </td>
                <td className="p-3 font-mono text-steel">
                  {product.warranty || "No Warranty"}
                </td>
                <td className="p-3 font-mono text-steel">
                  {product.certification || "Standard"}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    className="text-steel hover:text-plate-yellow p-1 cursor-pointer mr-2 transition-colors"
                    title="Edit product"
                  >
                    <Edit className="w-4 h-4 inline" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                    className="text-red-400 hover:text-red-300 p-1 cursor-pointer transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-asphalt-2 border border-steel/40 max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl rounded-xs">
            <div className="flex items-center justify-between border-b border-steel/20 pb-3">
              <div>
                <h2 className="display-font text-2xl font-extrabold text-off-white uppercase tracking-wide">
                  {editingProduct ? "Edit Product SKU" : "Add New Product SKU"}
                </h2>
                <p className="text-steel text-xs mt-0.5">
                  Configure pricing, stock, warranty, sizes, and media for your catalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-steel hover:text-off-white p-1 text-lg font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs font-mono">
              {/* Basic Information */}
              <div className="space-y-4 bg-asphalt p-4 border border-asphalt-2">
                <h3 className="text-plate-yellow font-bold uppercase tracking-wider text-xs border-b border-asphalt-2 pb-1.5">
                  1. Basic Product Information
                </h3>
                
                <div className="space-y-1">
                  <label className="text-steel block font-bold">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LS2 FF817 Challenger II Helmet"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white text-sm focus:border-plate-yellow transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-steel block font-bold">Brand *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LS2 / MT / Akrapovič"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
                    />
                  </div>
                  <div>
                    <label className="text-steel block font-bold">SKU Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GEAR-HLM-009"
                      value={newSku}
                      onChange={(e) => setNewSku(e.target.value)}
                      className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
                    />
                  </div>
                  <div>
                    <label className="text-steel block font-bold">Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
                    >
                      <option value="helmets">Helmets</option>
                      <option value="riding-gear">Riding Gear</option>
                      <option value="parts">Parts</option>
                      <option value="accessories">Accessories</option>
                      <option value="parts-mods">Parts & Mods (Legacy)</option>
                      <option value="electronics">Electronics</option>
                      <option value="additives">Additives & Oils</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Stock Management */}
              <div className="space-y-4 bg-asphalt p-4 border border-asphalt-2">
                <h3 className="text-plate-yellow font-bold uppercase tracking-wider text-xs border-b border-asphalt-2 pb-1.5">
                  2. Pricing, Inventory & Warranty
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-steel block font-bold">Selling Price (BDT) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 9800"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-steel block font-bold">Regular Price (BDT)</label>
                    <input
                      type="number"
                      placeholder="e.g. 10500 (For Strikethrough)"
                      value={newComparePrice}
                      onChange={(e) => setNewComparePrice(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white placeholder-steel/50"
                    />
                  </div>
                  <div>
                    <label className="text-steel block font-bold">Stock Status *</label>
                    <select
                      value={newStockStatus}
                      onChange={(e) => setNewStockStatus(e.target.value as any)}
                      className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
                    >
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-steel block font-bold">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={newStockQty}
                      onChange={(e) => setNewStockQty(Number(e.target.value))}
                      className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-plate-yellow font-bold block">
                    Warranty Coverage Terms
                  </label>
                  <select
                    value={newWarranty}
                    onChange={(e) => setNewWarranty(e.target.value)}
                    className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
                  >
                    <option value="No Warranty">No Warranty</option>
                    <option value="6 Months Warranty">6 Months Warranty</option>
                    <option value="6 Months Replacement">6 Months Replacement</option>
                    <option value="1 Year Warranty">1 Year Warranty</option>
                    <option value="1 Year Manufacturer Warranty">1 Year Manufacturer Warranty</option>
                    <option value="2 Years Warranty">2 Years Warranty</option>
                    <option value="Lifetime Warranty">Lifetime Warranty</option>
                  </select>
                </div>
              </div>

              {/* Helmet & Gear Specific Options */}
              {(newCategory === "riding-gear" || newCategory === "helmets") && (
                <div className="space-y-4 bg-asphalt p-4 border border-ignition-red/40">
                  <h3 className="text-ignition-red font-bold uppercase tracking-wider text-xs border-b border-asphalt-2 pb-1.5">
                    3. Safety Rating & Size Options
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-ignition-red font-bold block">
                        Safety Certification Rating
                      </label>
                      <select
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
                      >
                        <option value="ECE 22.06">ECE 22.06 (EU Standard)</option>
                        <option value="DOT">DOT (US Standard)</option>
                        <option value="ECE / DOT">ECE + DOT Dual Certified</option>
                        <option value="CE Level 2">CE Level 2 Armor Rating</option>
                        <option value="CE Level 1">CE Level 1 Armor Rating</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-plate-yellow font-bold block">
                        Available Sizes (Auto-Displays on Store & Cart)
                      </label>
                      <div className="flex gap-4 pt-1">
                        {["S", "M", "L", "XL", "XXL"].map((sz) => (
                          <label key={sz} className="flex items-center gap-1.5 text-off-white cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={newSizes.includes(sz)}
                              onChange={() => toggleSize(sz)}
                              className="accent-ignition-red w-4 h-4"
                            />
                            <span className="font-bold text-sm">{sz}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Specifications & Tags */}
              <div className="space-y-2 bg-asphalt p-4 border border-asphalt-2">
                <label className="text-plate-yellow font-bold block">
                  Product Description & Technical Specifications
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Constructed with HPFC shell, Pinlock 120 MaxVision included, removable liner..."
                  value={newCustomSpecs}
                  onChange={(e) => setNewCustomSpecs(e.target.value)}
                  className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white placeholder-steel/50"
                />
              </div>

              {/* Product Media */}
              <div className="space-y-3 bg-asphalt p-4 border border-asphalt-2">
                <div className="flex justify-between items-center border-b border-asphalt-2 pb-1.5">
                  <label className="text-plate-yellow font-bold block">
                    Product Image & Media Source
                  </label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setImageSourceMode("url")}
                      className={`px-3 py-1 text-[10px] font-bold uppercase transition-colors ${
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
                      className={`px-3 py-1 text-[10px] font-bold uppercase transition-colors ${
                        imageSourceMode === "file"
                          ? "bg-plate-yellow text-asphalt"
                          : "bg-asphalt-2 text-steel hover:text-off-white"
                      }`}
                    >
                      📁 Local File Upload
                    </button>
                  </div>
                </div>

                {imageSourceMode === "url" ? (
                  <input
                    type="url"
                    placeholder="Paste image URL (e.g. https://images.unsplash.com/... or Supabase storage link)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-asphalt-2 border border-steel/30 p-2.5 text-off-white"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full bg-asphalt-2 border border-steel/30 p-2 text-off-white file:mr-4 file:py-1 file:px-3 file:border-0 file:bg-plate-yellow file:text-asphalt file:font-bold file:uppercase cursor-pointer"
                  />
                )}

                {imageUrl && (
                  <div className="flex items-center gap-3 pt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-14 h-14 object-contain bg-asphalt-2 p-1 border border-steel/30"
                    />
                    <span className="text-[11px] text-emerald-400 font-bold">✓ Image preview verified</span>
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-steel/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-asphalt hover:bg-asphalt-2 border border-steel/30 text-steel hover:text-off-white px-5 py-2.5 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold px-6 py-2.5 uppercase tracking-wider transition-colors cursor-pointer shadow-lg"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
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
