"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Package, Plus, Edit, AlertTriangle, ShieldCheck, Check, Trash2, Search, Filter } from "lucide-react";
import { DBProduct } from "@/types/db";
import ConfirmModal from "@/components/common/ConfirmModal";
import { CATEGORY_SPECS, getCategorySpec, SpecFieldDef } from "@/lib/categorySpecs";

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
          subCategory: p.subCategory || "",
          price: p.price,
          originalPrice: p.comparePrice,
          imageUrl: p.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=60",
          stockStatus: p.stockStatus === "IN_STOCK" ? "in-stock" : "out-of-stock",
          stockQty: p.stockQty ?? 0,
          certification: p.certification !== "NONE" ? p.certification : undefined,
          warranty: p.warrantyDuration || (p.warrantyFlag ? "1 Year Warranty" : "No Warranty"),
          sizes: p.sizes || [],
          specs: p.specs || {},
          isUniversal: p.isUniversal ?? true,
          bikeModelIds: p.compatibilities?.map((c: any) => c.bikeModelId) || [],
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

  const [dbCategoriesList, setDbCategoriesList] = useState<{ id: string; name: string; slug: string; children?: { id: string; name: string; slug: string }[] }[]>([]);
  const [dbBrandsList, setDbBrandsList] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [dbBikeModels, setDbBikeModels] = useState<any[]>([]);
  const [newSubCategory, setNewSubCategory] = useState("");

  const loadDbCategories = useCallback(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) {
          setDbCategoriesList(j.data);
        }
      })
      .catch(() => {});
  }, []);

  const loadDbBrands = useCallback(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) {
          setDbBrandsList(j.data);
        }
      })
      .catch(() => {});
  }, []);

  const FALLBACK_BIKES_LIST = [
    { id: "b1", brand: "Yamaha", model: "FZS-Fi", variant: "v3" },
    { id: "b2", brand: "Yamaha", model: "FZS-Fi", variant: "v2" },
    { id: "b3", brand: "Yamaha", model: "R15", variant: "v4" },
    { id: "b4", brand: "Yamaha", model: "R15", variant: "v3" },
    { id: "b5", brand: "Yamaha", model: "MT-15", variant: "v2" },
    { id: "b6", brand: "Honda", model: "CB Hornet", variant: "160R ABS" },
    { id: "b7", brand: "Honda", model: "CBR", variant: "150R" },
    { id: "b8", brand: "Honda", model: "XBlade", variant: "160" },
    { id: "b9", brand: "Suzuki", model: "Gixxer", variant: "155 FI" },
    { id: "b10", brand: "Suzuki", model: "GSX-R150", variant: "Keyless" },
    { id: "b11", brand: "Bajaj", model: "Pulsar N160", variant: "ABS" },
    { id: "b12", brand: "Bajaj", model: "Pulsar NS160", variant: "FI" },
    { id: "b13", brand: "TVS", model: "Apache RTR 160 4V", variant: "Special Edition" },
    { id: "b14", brand: "TVS", model: "Raider 125", variant: "Disc" },
  ];

  const loadDbBikes = useCallback(() => {
    fetch("/api/bikes")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          if (Array.isArray(j.list) && j.list.length > 0) {
            setDbBikeModels(j.list);
          } else if (Array.isArray(j.data?.raw)) {
            setDbBikeModels(j.data.raw);
          } else if (Array.isArray(j.data)) {
            setDbBikeModels(j.data);
          } else if (j.data && typeof j.data === "object") {
            const flattened: any[] = [];
            Object.entries(j.data).forEach(([brand, models]: [string, any]) => {
              if (Array.isArray(models)) {
                models.forEach((m: any) => {
                  if (Array.isArray(m.variants)) {
                    m.variants.forEach((v: any) => {
                      flattened.push({
                        id: v.id,
                        brand,
                        model: m.model,
                        variant: v.variant,
                      });
                    });
                  }
                });
              }
            });
            setDbBikeModels(flattened);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
    loadDbCategories();
    loadDbBrands();
    loadDbBikes();
    window.addEventListener("category-updated", loadDbCategories);
    window.addEventListener("brand-updated", loadDbBrands);
    return () => {
      window.removeEventListener("category-updated", loadDbCategories);
      window.removeEventListener("brand-updated", loadDbBrands);
    };
  }, [loadDbCategories, loadDbBrands, loadDbBikes]);

  const [editingProduct, setEditingProduct] = useState<DBProduct | null>(null);

  // Auto-sync subcategory when editingProduct or dbCategoriesList updates
  useEffect(() => {
    if (editingProduct && dbCategoriesList.length > 0) {
      const rawCat = typeof editingProduct.category === "string"
        ? editingProduct.category
        : (editingProduct as any).category?.slug || "riding-gear";

      const targetCat = dbCategoriesList.find(
        (c) => c.slug === rawCat || c.id === rawCat || c.name.toLowerCase() === rawCat.toLowerCase()
      );

      if (targetCat) {
        setNewCategory(targetCat.slug);
        if (editingProduct.subCategory) {
          const subMatch = targetCat.children?.find(
            (s) =>
              s.slug === editingProduct.subCategory ||
              s.id === editingProduct.subCategory ||
              s.name.toLowerCase() === editingProduct.subCategory?.toLowerCase() ||
              s.slug.toLowerCase() === editingProduct.subCategory?.toLowerCase()
          );
          setNewSubCategory(subMatch ? subMatch.slug : editingProduct.subCategory);
        }
      }
    }
  }, [editingProduct, dbCategoriesList]);
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
  const [newDiscountPercent, setNewDiscountPercent] = useState<number | "">("");
  const [newStockQty, setNewStockQty] = useState(10);
  const [newStockStatus, setNewStockStatus] = useState<"in-stock" | "out-of-stock">("in-stock");
  const [newCategory, setNewCategory] = useState<DBProduct["category"]>("riding-gear");
  const [newCertification, setNewCertification] = useState("");
  const [newWarranty, setNewWarranty] = useState("1 Year Warranty");
  const [newSizes, setNewSizes] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [newSpecs, setNewSpecs] = useState<Record<string, any>>({});
  const [customSpecRows, setCustomSpecRows] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [newIsUniversal, setNewIsUniversal] = useState<boolean>(true);
  const [newBikeModelIds, setNewBikeModelIds] = useState<string[]>([]);
  const [selectedCompatBrands, setSelectedCompatBrands] = useState<string[]>([]);
  const [selectedCompatModels, setSelectedCompatModels] = useState<string[]>([]);

  const activeBikeModelsList = React.useMemo(() => {
    return dbBikeModels.length > 0 ? dbBikeModels : FALLBACK_BIKES_LIST;
  }, [dbBikeModels]);

  const availableBikeBrands = React.useMemo(() => {
    const set = new Set<string>();
    activeBikeModelsList.forEach((b: any) => b.brand && set.add(b.brand));
    return Array.from(set).sort();
  }, [activeBikeModelsList]);

  const [newCustomSpecs, setNewCustomSpecs] = useState("");
  const [imageSourceMode, setImageSourceMode] = useState<"url" | "file">("url");
  const [imageUrl, setImageUrl] = useState("");

  const handlePriceChange = (priceVal: number) => {
    setNewPrice(priceVal);
    if (newComparePrice && typeof newComparePrice === "number" && newComparePrice > priceVal) {
      const pct = Math.round(((newComparePrice - priceVal) / newComparePrice) * 100);
      setNewDiscountPercent(pct > 0 ? pct : "");
    }
  };

  const handleComparePriceChange = (compVal: number | "") => {
    setNewComparePrice(compVal);
    if (compVal && typeof compVal === "number") {
      if (newDiscountPercent && typeof newDiscountPercent === "number") {
        const calculatedPrice = Math.round(compVal * (1 - newDiscountPercent / 100));
        setNewPrice(calculatedPrice);
      } else if (newPrice > 0 && compVal > newPrice) {
        const pct = Math.round(((compVal - newPrice) / compVal) * 100);
        setNewDiscountPercent(pct > 0 ? pct : "");
      }
    }
  };

  const handleDiscountPercentChange = (pctVal: number | "") => {
    setNewDiscountPercent(pctVal);
    if (pctVal !== "" && typeof pctVal === "number" && newComparePrice && typeof newComparePrice === "number") {
      const calculatedPrice = Math.round(newComparePrice * (1 - pctVal / 100));
      setNewPrice(calculatedPrice);
    }
  };

  const generateAutoSku = (catSlug?: string, brandName?: string) => {
    const catCode = (catSlug || "PRD").replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "PRD";
    const brandCode = (brandName || "GEN").replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "GEN";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${catCode}-${brandCode}-${randomNum}`;
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setNewName("");
    setNewBrand("");
    const firstCat = dbCategoriesList[0]?.slug || "riding-gear";
    setNewCategory(firstCat);
    setNewSubCategory("");
    setNewSku(generateAutoSku(firstCat, "BD"));
    setNewPrice(0);
    setNewComparePrice("");
    setNewDiscountPercent("");
    setNewStockQty(10);
    setNewStockStatus("in-stock");
    setNewCertification("");
    setNewWarranty("1 Year Warranty");
    setNewSizes([]);
    setSelectedGrades([]);
    setNewSpecs({});
    setCustomSpecRows([{ key: "", value: "" }]);
    setNewIsUniversal(true);
    setNewBikeModelIds([]);
    setSelectedCompatBrands([]);
    setSelectedCompatModels([]);
    setNewCustomSpecs("");
    setImageUrl("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (p: DBProduct) => {
    setEditingProduct(p);
    setNewName(p.name);
    setNewBrand(p.brand);
    setNewSku(p.sku || generateAutoSku(typeof p.category === "string" ? p.category : (p as any).category?.slug, p.brand));
    setNewPrice(p.price);
    setNewComparePrice(p.originalPrice || "");
    if (p.originalPrice && p.originalPrice > p.price) {
      setNewDiscountPercent(Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100));
    } else {
      setNewDiscountPercent("");
    }
    setNewStockQty(p.stockQty);
    setNewStockStatus(p.stockStatus === "out-of-stock" || p.stockQty <= 0 ? "out-of-stock" : "in-stock");

    // Robust category & subcategory slug resolution
    const catSlug = typeof p.category === "string" ? p.category : (p as any).category?.slug || "riding-gear";
    const targetCat = dbCategoriesList.find(
      (c) => c.slug === catSlug || c.id === catSlug || c.name.toLowerCase() === catSlug.toLowerCase()
    );
    const resolvedCatSlug = targetCat?.slug || catSlug;
    setNewCategory(resolvedCatSlug);

    let resolvedSubSlug = p.subCategory || "";
    if (targetCat?.children && p.subCategory) {
      const matchSub = targetCat.children.find(
        (s: any) =>
          s.slug === p.subCategory ||
          s.name.toLowerCase() === p.subCategory?.toLowerCase() ||
          s.id === p.subCategory
      );
      if (matchSub) {
        resolvedSubSlug = matchSub.slug;
      }
    }
    setNewSubCategory(resolvedSubSlug);

    setNewCertification(p.certification || "");
    setNewWarranty(p.warranty || "No Warranty");
    setNewSizes(p.sizes || []);

    if (p.specs && typeof p.specs === "object") {
      let g: string[] = [];
      if ((p.specs as any).selectedGrades) {
        try {
          g = typeof (p.specs as any).selectedGrades === "string" ? JSON.parse((p.specs as any).selectedGrades) : (p.specs as any).selectedGrades;
        } catch {
          g = String((p.specs as any).selectedGrades).split(",").map((s) => s.trim());
        }
      } else if ((p.specs as any).grades) {
        g = String((p.specs as any).grades).split(",").map((s) => s.trim());
      }
      setSelectedGrades(g);
    } else {
      setSelectedGrades([]);
    }

    setNewSpecs(p.specs || {});
    if (p.specs && typeof p.specs === "object" && Object.keys(p.specs).length > 0) {
      const rows = Object.entries(p.specs)
        .filter(([key]) => key !== "selectedGrades" && key !== "grades")
        .map(([key, value]) => ({
          key,
          value: Array.isArray(value) ? value.join(", ") : String(value || ""),
        }));
      setCustomSpecRows(rows.length > 0 ? rows : [{ key: "", value: "" }]);
    } else {
      setCustomSpecRows([{ key: "", value: "" }]);
    }
    setNewIsUniversal(p.isUniversal ?? true);
    setNewBikeModelIds(p.bikeModelIds || []);
    setSelectedCompatBrands([]);
    setSelectedCompatModels(p.bikeModelIds || []);
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

    const specsObj: Record<string, string> = {};
    customSpecRows.forEach((row) => {
      if (row.key.trim() && row.value.trim()) {
        specsObj[row.key.trim()] = row.value.trim();
      }
    });
    if (selectedGrades.length > 0) {
      specsObj["selectedGrades"] = JSON.stringify(selectedGrades);
      specsObj["grades"] = selectedGrades.join(", ");
    }

    let finalBikeModelIds: string[] = [];
    if (!newIsUniversal) {
      const set = new Set<string>();
      if (selectedCompatBrands.length > 0) {
        activeBikeModelsList.forEach((b: any) => {
          if (selectedCompatBrands.includes(b.brand)) {
            set.add(b.id);
          }
        });
      }
      selectedCompatModels.forEach((id) => set.add(id));
      finalBikeModelIds = Array.from(set);
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
      subCategory: newSubCategory,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=60",
      certification: (newCategory.includes("helmet") || newCategory.includes("gear") || newCategory.includes("wear")) ? newCertification : "",
      warranty: newWarranty,
      sizes: newSizes,
      specs: specsObj,
      isUniversal: newIsUniversal,
      bikeModelIds: newIsUniversal ? [] : finalBikeModelIds,
      description: newCustomSpecs || `Genuine ${newBrand} motorcycle product. Certified for quality and performance.`,
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
      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { success: false, error: text || res.statusText };
      }

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
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 surface rounded-2xl p-5 sm:p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-plate-yellow animate-pulse" />
            <span className="text-xs font-mono font-bold text-plate-yellow uppercase tracking-wider">
              Catalog Management
            </span>
          </div>
          <h1 className="display-font text-2xl sm:text-3xl font-extrabold text-off-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-plate-yellow" />
            <span>Products &amp; Inventory</span>
          </h1>
          <p className="text-xs text-steel mt-0.5 font-mono">
            {products.length} active SKUs in owned inventory
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="bg-ignition-red hover:bg-red-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Interactive Filter & Search Control Bar */}
      <div className="surface rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-steel absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search Title, Brand, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-asphalt border border-steel/20 rounded-xl pl-9 pr-3.5 py-2.5 text-off-white placeholder-steel/50 focus:border-plate-yellow focus:outline-none transition-colors"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full bg-asphalt border border-steel/20 rounded-xl px-3.5 py-2.5 text-off-white focus:border-plate-yellow focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">Category: All ({products.length})</option>
            {dbCategoriesList.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name} ({products.filter((p) => p.category === c.slug).length})
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Filter Dropdown */}
        <div>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full bg-asphalt border border-steel/20 rounded-xl px-3.5 py-2.5 text-off-white focus:border-plate-yellow focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">Stock: All Statuses</option>
            <option value="in-stock">In Stock Only</option>
            <option value="out-of-stock">Out of Stock Only</option>
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="surface rounded-2xl overflow-hidden shadow-xs border border-asphalt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-asphalt/70 text-steel font-mono uppercase text-[11px] tracking-wider border-b border-asphalt-2">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">SKU / Brand</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-asphalt-2">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-steel font-mono">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-asphalt/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-off-white flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-xl bg-asphalt border border-asphalt-2 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-off-white truncate max-w-xs">{product.name}</div>
                      {product.certification && (
                        <span className="inline-block text-[10px] text-emerald-400 font-mono mt-0.5">
                          🛡️ {product.certification}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-steel">
                    <div className="text-off-white font-medium">{product.sku}</div>
                    <div className="text-[11px] text-plate-yellow font-semibold">{product.brand}</div>
                  </td>
                  <td className="py-3 px-4 text-steel">
                    <div className="font-medium text-off-white">{product.category}</div>
                    {product.subCategory && (
                      <div className="text-[10px] text-steel font-mono mt-0.5">
                        › {product.subCategory}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-off-white font-bold text-sm">
                    ৳{product.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
                        product.stockStatus === "out-of-stock" || product.stockQty <= 0
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : product.stockQty <= 3
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {product.stockStatus === "out-of-stock" || product.stockQty <= 0
                        ? "Out of Stock"
                        : `In Stock (${product.stockQty})`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-1.5 rounded-lg text-steel hover:text-off-white hover:bg-asphalt transition-all cursor-pointer"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                        className="p-1.5 rounded-lg text-steel hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                        title="Delete product"
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

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="surface border border-asphalt-2 max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl rounded-3xl">
            <div className="flex items-center justify-between border-b border-asphalt-2 pb-4">
              <div>
                <h2 className="display-font text-2xl font-extrabold text-off-white">
                  {editingProduct ? "Edit Product SKU" : "Add New Product SKU"}
                </h2>
                <p className="text-steel text-xs mt-0.5">
                  Configure pricing, stock, warranty, sizes, and media for your catalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-steel hover:text-off-white hover:bg-asphalt transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              {/* Basic Information */}
              <div className="space-y-4 rounded-2xl bg-asphalt/40 p-4 sm:p-5 border border-asphalt-2">
                <h3 className="text-plate-yellow font-mono font-bold uppercase tracking-wider text-xs border-b border-asphalt-2 pb-2">
                  1. Basic Product Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-steel block font-semibold mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AGV K6 S Flash Helmet"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white font-medium focus:border-plate-yellow focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-steel block font-semibold mb-1">Brand *</label>
                    {dbBrandsList.length > 0 ? (
                      <select
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white font-medium focus:border-plate-yellow focus:outline-none cursor-pointer"
                      >
                        <option value="">-- Select Brand --</option>
                        {dbBrandsList.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        required
                        placeholder="e.g. AGV"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white font-medium focus:border-plate-yellow focus:outline-none"
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-steel block font-semibold">SKU Code *</label>
                      <button
                        type="button"
                        onClick={() => setNewSku(generateAutoSku(newCategory, newBrand))}
                        className="text-[10px] px-2 py-0.5 rounded-md border border-plate-yellow/40 bg-plate-yellow/10 text-plate-yellow hover:bg-plate-yellow hover:text-asphalt transition-colors font-mono font-bold uppercase cursor-pointer"
                        title="Click to auto-generate a fresh SKU"
                      >
                        ⚡ Auto
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HLM-MT-9301"
                      value={newSku}
                      onChange={(e) => setNewSku(e.target.value)}
                      className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white font-mono focus:border-plate-yellow focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-steel block font-semibold mb-1">Main Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => {
                        setNewCategory(e.target.value as any);
                        setNewSubCategory("");
                      }}
                      className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white font-medium focus:border-plate-yellow focus:outline-none cursor-pointer"
                    >
                      {dbCategoriesList.length > 0 ? (
                        dbCategoriesList.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))
                      ) : (
                        <option value="">-- No Categories Found (Create in Category Manager) --</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-steel block font-semibold mb-1">Subcategory</label>
                    <select
                      value={newSubCategory}
                      onChange={(e) => setNewSubCategory(e.target.value)}
                      className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none cursor-pointer"
                    >
                      <option value="">-- None / Select Subcategory --</option>
                      {(() => {
                        const currentCatObj = dbCategoriesList.find(
                          (c) =>
                            c.slug === newCategory ||
                            c.id === newCategory ||
                            c.name.toLowerCase() === (newCategory || "").toLowerCase()
                        );
                        const children = currentCatObj?.children || [];
                        const hasCurrent = children.some(
                          (s) =>
                            s.slug === newSubCategory ||
                            s.name.toLowerCase() === (newSubCategory || "").toLowerCase()
                        );

                        return (
                          <>
                            {children.map((sub) => (
                              <option key={sub.id} value={sub.slug}>
                                {sub.name}
                              </option>
                            ))}
                            {newSubCategory && !hasCurrent && (
                              <option value={newSubCategory}>{newSubCategory}</option>
                            )}
                          </>
                        );
                      })()}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Stock Management */}
              <div className="space-y-4 rounded-2xl bg-asphalt/40 p-4 sm:p-5 border border-asphalt-2">
                <h3 className="text-plate-yellow font-mono font-bold uppercase tracking-wider text-xs border-b border-asphalt-2 pb-2">
                  2. Pricing, Inventory &amp; Discount
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-steel block font-semibold mb-1">Regular Price (BDT)</label>
                    <input
                      type="number"
                      placeholder="e.g. 10500"
                      value={newComparePrice}
                      onChange={(e) => handleComparePriceChange(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white placeholder-steel/50 focus:border-plate-yellow focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-plate-yellow block font-semibold mb-1">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g. 15"
                      value={newDiscountPercent}
                      onChange={(e) => handleDiscountPercentChange(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-asphalt-2 border border-plate-yellow/40 rounded-xl p-2.5 text-plate-yellow placeholder-steel/50 font-bold focus:border-plate-yellow focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-steel block font-semibold mb-1">Selling Price (BDT) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 8925"
                      value={newPrice}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white font-bold focus:border-plate-yellow focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-steel block font-semibold mb-1">Stock Status *</label>
                    <select
                      value={newStockStatus}
                      onChange={(e) => setNewStockStatus(e.target.value as any)}
                      className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none cursor-pointer"
                    >
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-steel block font-semibold mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={newStockQty}
                      onChange={(e) => setNewStockQty(Number(e.target.value))}
                      className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-plate-yellow font-semibold block mb-1">
                    Warranty Coverage Terms
                  </label>
                  <select
                    value={newWarranty}
                    onChange={(e) => setNewWarranty(e.target.value)}
                    className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none cursor-pointer"
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

                {/* Safety Certification (Only shown for Helmets & Riding Gear) */}
                {(newCategory.includes("helmet") || newCategory.includes("gear") || newCategory.includes("wear")) && (
                  <div className="space-y-1 pt-2 border-t border-asphalt-2">
                    <label className="text-plate-yellow font-semibold block text-xs">
                      Safety Certification Rating (Helmets &amp; Riding Gear)
                    </label>
                    <select
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white text-xs font-mono focus:border-plate-yellow focus:outline-none cursor-pointer"
                    >
                      <option value="">-- None / Select Safety Certification --</option>
                      <option value="ECE 22.06">ECE 22.06 (EU Standard)</option>
                      <option value="DOT">DOT (US Standard)</option>
                      <option value="ECE 22.06 / DOT">ECE 22.06 / DOT Dual Certified</option>
                      <option value="ECE 22.05">ECE 22.05</option>
                      <option value="SNELL M2020">SNELL M2020</option>
                      <option value="CE Level 2">CE Level 2 Approved (Gear)</option>
                      <option value="CE Level 1">CE Level 1 Approved (Gear)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Universal Custom Technical Specifications & Selectable Variants */}
              <div className="space-y-4 rounded-2xl bg-asphalt/40 p-4 sm:p-5 border border-plate-yellow/30">
                <div className="flex items-center justify-between border-b border-asphalt-2 pb-2">
                  <h3 className="text-plate-yellow font-mono font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                    <Filter className="w-4 h-4 text-plate-yellow" />
                    <span>3. Product Options &amp; Specifications</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomSpecRows((prev) => [...prev, { key: "", value: "" }]);
                    }}
                    className="bg-plate-yellow/15 border border-plate-yellow/40 text-plate-yellow hover:bg-plate-yellow hover:text-asphalt px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Spec Field</span>
                  </button>
                </div>

                {/* 3A & 3B. Category-Smart Selectable Variant Options */}
                {(() => {
                  const catLower = (newCategory || "").toLowerCase();
                  const isOilCategory = catLower.includes("oil") || catLower.includes("additive") || catLower.includes("lubricant");
                  const presetChips = isOilCategory
                    ? ["1L", "1.2L", "1.5L", "4L", "800ml", "250ml"]
                    : ["S", "M", "L", "XL", "XXL"];

                  return (
                    <>
                      {/* Selectable Volume / Size Options */}
                      <div className="space-y-2 surface rounded-xl p-3.5">
                        <label className="text-plate-yellow font-semibold block text-xs flex items-center justify-between">
                          <span>{isOilCategory ? "A. Selectable Fluid Volumes / Net Capacities" : "A. Selectable Sizes / Capacities"}</span>
                          <span className="text-steel font-mono text-[10px]">Storefront Selectable Buttons</span>
                        </label>
                        <p className="text-steel text-[11px]">
                          {isOilCategory
                            ? "Select fluid volume options (e.g. 1L, 1.2L, 4L) for buyers to select on the product page."
                            : "Select size options (e.g. S, M, L, XL) for buyers to select on the product page."}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-xs">
                          {presetChips.map((opt) => {
                            const isSelected = newSizes.includes(opt);
                            return (
                              <button
                                type="button"
                                key={opt}
                                onClick={() => toggleSize(opt)}
                                className={`px-3 py-1 rounded-lg text-xs border font-medium transition-colors cursor-pointer ${
                                  isSelected
                                    ? "bg-plate-yellow text-asphalt border-plate-yellow font-bold"
                                    : "bg-asphalt border-steel/20 text-steel hover:text-off-white"
                                }`}
                              >
                                {isSelected ? `✓ ${opt}` : `+ ${opt}`}
                              </button>
                            );
                          })}
                        </div>

                        <input
                          type="text"
                          placeholder={isOilCategory ? "Add Custom Volume (e.g. 5L, 3.5L) and press Enter" : "Add Custom Size (e.g. 3XL, EU 46) and press Enter"}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (!newSizes.includes(val)) setNewSizes((prev) => [...prev, val]);
                              e.currentTarget.value = "";
                            }
                          }}
                          className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-xs text-off-white font-mono placeholder-steel/50 mt-1 focus:border-plate-yellow focus:outline-none"
                        />
                      </div>

                      {/* Selectable Viscosity / Oil Grades (Shown for Oils & Additives or when grades exist) */}
                      {(isOilCategory || selectedGrades.length > 0) && (
                        <div className="space-y-2 surface rounded-xl p-3.5">
                          <label className="text-plate-yellow font-semibold block text-xs flex items-center justify-between">
                            <span>B. Selectable Viscosity / Oil Grades (Engine Oils &amp; Fluids)</span>
                            <span className="text-steel font-mono text-[10px]">Storefront Selectable Buttons</span>
                          </label>
                          <p className="text-steel text-[11px]">
                            Select viscosity grades (e.g. 10W-30, 10W-40, 15W-50) for buyers to select on the product page.
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-xs">
                            {["10W-30", "10W-40", "15W-50", "20W-50", "10W-50", "5W-40", "75W-90"].map((grd) => {
                              const isSelected = selectedGrades.includes(grd);
                              return (
                                <button
                                  type="button"
                                  key={grd}
                                  onClick={() => {
                                    setSelectedGrades((prev) =>
                                      prev.includes(grd) ? prev.filter((g) => g !== grd) : [...prev, grd]
                                    );
                                  }}
                                  className={`px-3 py-1 rounded-lg text-xs border font-medium transition-colors cursor-pointer ${
                                    isSelected
                                      ? "bg-plate-yellow text-asphalt border-plate-yellow font-bold"
                                      : "bg-asphalt border-steel/20 text-steel hover:text-off-white"
                                  }`}
                                >
                                  {isSelected ? `✓ ${grd}` : `+ ${grd}`}
                                </button>
                              );
                            })}
                          </div>

                          <input
                            type="text"
                            placeholder="Add Custom Grade (e.g. 0W-20, 15W-40) and press Enter"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                e.preventDefault();
                                const val = e.currentTarget.value.trim();
                                if (!selectedGrades.includes(val)) setSelectedGrades((prev) => [...prev, val]);
                                e.currentTarget.value = "";
                              }
                            }}
                            className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-xs text-off-white font-mono placeholder-steel/50 mt-1 focus:border-plate-yellow focus:outline-none"
                          />
                        </div>
                      )}
                    </>
                  );
                })()}

                <p className="text-steel text-[11px] pt-1 font-semibold">
                  Additional Technical Specifications (Key-Value Pairs):
                </p>

                <div className="space-y-2">
                  {customSpecRows.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Specification Name (e.g. Shell Material)"
                        value={row.key}
                        onChange={(e) => {
                          const updated = [...customSpecRows];
                          updated[idx].key = e.target.value;
                          setCustomSpecRows(updated);
                        }}
                        className="w-1/2 bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white font-medium placeholder-steel/50 focus:border-plate-yellow focus:outline-none"
                      />
                      <span className="text-steel font-bold">:</span>
                      <input
                        type="text"
                        placeholder="Value (e.g. Carbon Composite)"
                        value={row.value}
                        onChange={(e) => {
                          const updated = [...customSpecRows];
                          updated[idx].value = e.target.value;
                          setCustomSpecRows(updated);
                        }}
                        className="w-1/2 bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-plate-yellow font-medium placeholder-steel/50 focus:border-plate-yellow focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCustomSpecRows((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="text-steel hover:text-red-400 p-2.5 rounded-xl bg-asphalt-2 border border-steel/20 cursor-pointer transition-colors"
                        title="Remove field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Bike Compatibility Matrix Selector (Universal Across All Categories) */}
                <div className="pt-4 border-t border-asphalt-2 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <label className="text-plate-yellow font-mono font-bold uppercase block text-xs">
                        4. Bike Model Compatibility Matrix
                      </label>
                      <span className="text-steel text-[11px]">
                        Choose Universal Fit, or map specific motorcycle brands &amp; models.
                      </span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/25">
                      <input
                        type="checkbox"
                        checked={newIsUniversal}
                        onChange={(e) => setNewIsUniversal(e.target.checked)}
                        className="accent-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Universal Fit (Fits All Bikes)</span>
                    </label>
                  </div>

                  {!newIsUniversal && (
                    <div className="space-y-4 surface rounded-2xl p-4 border border-asphalt-2">
                      {/* Field 1: Brand Compatibility */}
                      <div className="space-y-2">
                        <label className="text-plate-yellow font-semibold block text-xs uppercase flex items-center justify-between">
                          <span>Field 1: Brand Compatibility (Select Brands)</span>
                          <span className="text-steel font-mono text-[10px]">
                            {selectedCompatBrands.length} Brands Selected
                          </span>
                        </label>
                        <p className="text-steel text-[11px]">
                          Selecting a brand automatically includes all models under that brand.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          {availableBikeBrands.map((brandName) => {
                            const isSelected = selectedCompatBrands.includes(brandName);
                            return (
                              <label
                                key={brandName}
                                className={`flex items-center gap-2 cursor-pointer select-none rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                                  isSelected
                                    ? "bg-plate-yellow/15 border-plate-yellow text-plate-yellow"
                                    : "bg-asphalt border-steel/20 text-steel hover:text-off-white"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    setSelectedCompatBrands((prev) =>
                                      isSelected ? prev.filter((b) => b !== brandName) : [...prev, brandName]
                                    );
                                  }}
                                  className="accent-plate-yellow w-3.5 h-3.5"
                                />
                                <span>{brandName}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Field 2: Model Compatibility */}
                      <div className="space-y-2 pt-3 border-t border-asphalt-2">
                        <label className="text-plate-yellow font-semibold block text-xs uppercase flex items-center justify-between">
                          <span>Field 2: Specific Model Compatibility</span>
                          <span className="text-steel font-mono text-[10px]">
                            {selectedCompatModels.length} Models Selected
                          </span>
                        </label>
                        <p className="text-steel text-[11px]">
                          Select individual motorcycle models compatible with this item.
                        </p>
                        <div className="max-h-56 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-1">
                          {activeBikeModelsList.map((b: any) => {
                            const label = `${b.brand} ${b.model}${b.variant ? ` ${b.variant}` : ""}`;
                            const isChecked = selectedCompatModels.includes(b.id);
                            const isAutoIncludedByBrand = selectedCompatBrands.includes(b.brand);

                            return (
                              <label
                                key={b.id}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer select-none text-xs font-mono transition-all ${
                                  isChecked
                                    ? "bg-plate-yellow/15 border-plate-yellow text-plate-yellow font-bold"
                                    : isAutoIncludedByBrand
                                    ? "bg-plate-yellow/10 border-plate-yellow/30 text-plate-yellow/80"
                                    : "bg-asphalt border-steel/20 text-steel hover:text-off-white"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked || isAutoIncludedByBrand}
                                  disabled={isAutoIncludedByBrand}
                                  onChange={() => {
                                    setSelectedCompatModels((prev) =>
                                      isChecked ? prev.filter((id) => id !== b.id) : [...prev, b.id]
                                    );
                                  }}
                                  className="accent-plate-yellow w-3.5 h-3.5 cursor-pointer"
                                />
                                <span className="truncate">
                                  {label}
                                  {isAutoIncludedByBrand && !isChecked && (
                                    <span className="ml-1 text-[9px] text-plate-yellow opacity-75">(via Brand)</span>
                                  )}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 rounded-2xl bg-asphalt/40 p-4 sm:p-5 border border-asphalt-2">
                <label className="text-plate-yellow font-mono font-bold uppercase block text-xs">
                  5. Product Description &amp; Details
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Constructed with HPFC shell, Pinlock 120 MaxVision included, removable liner..."
                  value={newCustomSpecs}
                  onChange={(e) => setNewCustomSpecs(e.target.value)}
                  className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-3 text-off-white placeholder-steel/50 focus:border-plate-yellow focus:outline-none"
                />
              </div>

              {/* Product Media */}
              <div className="space-y-3 rounded-2xl bg-asphalt/40 p-4 sm:p-5 border border-asphalt-2">
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-asphalt-2 pb-2">
                  <label className="text-plate-yellow font-mono font-bold uppercase block text-xs">
                    6. Product Image &amp; Media Source
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setImageSourceMode("url")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        imageSourceMode === "url"
                          ? "bg-plate-yellow text-asphalt font-bold"
                          : "bg-asphalt-2 text-steel hover:text-off-white"
                      }`}
                    >
                      🌐 Cloud URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode("file")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        imageSourceMode === "file"
                          ? "bg-plate-yellow text-asphalt font-bold"
                          : "bg-asphalt-2 text-steel hover:text-off-white"
                      }`}
                    >
                      📁 Local Upload
                    </button>
                  </div>
                </div>

                {imageSourceMode === "url" ? (
                  <input
                    type="url"
                    placeholder="Paste image URL (e.g. https://... or Supabase storage link)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full bg-asphalt-2 border border-steel/20 rounded-xl p-2 text-off-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-plate-yellow file:text-asphalt file:font-semibold cursor-pointer"
                  />
                )}

                {imageUrl && (
                  <div className="flex items-center gap-3 pt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-16 h-16 object-contain rounded-xl bg-asphalt-2 p-1 border border-asphalt-2"
                    />
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Image preview verified
                    </span>
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-asphalt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="surface hover:bg-asphalt border border-asphalt-2 text-steel hover:text-off-white px-5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-ignition-red hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
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
