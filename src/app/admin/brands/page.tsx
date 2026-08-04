"use client";

import React, { useState, useEffect } from "react";
import { Award, Plus, Edit2, Trash2, Globe, Search, ArrowUp, ArrowDown, ExternalLink, Check, Star, Upload } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal";

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  website?: string | null;
  description?: string | null;
  country?: string | null;
  flag?: string | null;
  isFeatured: boolean;
  sortOrder: number;
  productCount?: number;
}

const FLAG_PRESETS = [
  { country: "Italy", flag: "🇮🇹" },
  { country: "Japan", flag: "🇯🇵" },
  { country: "Spain", flag: "🇪🇸" },
  { country: "Slovenia", flag: "🇸🇮" },
  { country: "Germany", flag: "🇩🇪" },
  { country: "USA", flag: "🇺🇸" },
  { country: "UK", flag: "🇬🇧" },
  { country: "France", flag: "🇫🇷" },
  { country: "Taiwan", flag: "🇹🇼" },
  { country: "Malaysia", flag: "🇲🇾" },
  { country: "South Korea", flag: "🇰🇷" },
  { country: "Bangladesh", flag: "🇧🇩" },
  { country: "India", flag: "🇮🇳" },
  { country: "Thailand", flag: "🇹🇭" },
  { country: "Global", flag: "🌐" },
];

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formLogoUrl, setFormLogoUrl] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const [formFlag, setFormFlag] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/brands");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBrands(json.data);
      }
    } catch (err) {
      console.error("Error fetching brands:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      b.name.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      (b.country && b.country.toLowerCase().includes(q))
    );
  });

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setFormName("");
    setFormSlug("");
    setFormLogoUrl("");
    setFormWebsite("");
    setFormCountry("");
    setFormFlag("");
    setFormDescription("");
    setFormIsFeatured(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (b: BrandItem) => {
    setEditingBrand(b);
    setFormName(b.name);
    setFormSlug(b.slug);
    setFormLogoUrl(b.logoUrl || "");
    setFormWebsite(b.website || "");
    setFormCountry(b.country || "");
    setFormFlag(b.flag || "");
    setFormDescription(b.description || "");
    setFormIsFeatured(b.isFeatured);
    setShowModal(true);
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
          setFormLogoUrl(json.url);
        } else {
          alert("File upload failed: " + (json.error || "Unknown error"));
        }
      } catch (err: any) {
        alert("Upload error: " + err.message);
      }
    }
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Brand name is required.");
      return;
    }

    const payload = {
      ...(editingBrand && { id: editingBrand.id }),
      name: formName.trim(),
      slug: formSlug.trim(),
      logoUrl: formLogoUrl.trim(),
      website: formWebsite.trim(),
      country: formCountry.trim(),
      flag: formFlag.trim(),
      description: formDescription.trim(),
      isFeatured: formIsFeatured,
    };

    try {
      const res = await fetch("/api/admin/brands", {
        method: editingBrand ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert("Error saving brand: " + (json.error || "Unknown error"));
        return;
      }

      await fetchBrands();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("brand-updated"));
      }
      setShowModal(false);
    } catch (err: any) {
      alert("Failed to save brand: " + err.message);
    }
  };

  const handleMoveBrand = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= brands.length) return;

    const listToReorder = [...brands];
    const temp = listToReorder[index];
    listToReorder[index] = listToReorder[targetIndex];
    listToReorder[targetIndex] = temp;

    const itemsPayload = listToReorder.map((item, idx) => ({
      id: item.id,
      sortOrder: idx,
    }));

    try {
      const res = await fetch("/api/admin/brands", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", items: itemsPayload }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchBrands();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("brand-updated"));
        }
      }
    } catch (err) {
      console.error("Failed to reorder brands:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/brands?id=${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert("Error deleting brand: " + (json.error || "Unknown error"));
        return;
      }
      await fetchBrands();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("brand-updated"));
      }
    } catch (err: any) {
      alert("Failed to delete brand: " + err.message);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-asphalt-2 p-6 border border-asphalt-2">
        <div>
          <h1 className="display-font text-2xl font-extrabold text-off-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-6 h-6 text-plate-yellow" />
            Official Brands & Manufacturers Directory
          </h1>
          <p className="text-xs text-steel font-mono mt-1">
            Manage official partner brands, logos, countries of origin, and product associations.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 flex items-center gap-2 transform -skew-x-6 cursor-pointer shadow-md transition-colors"
        >
          <div className="transform skew-x-6 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add Partner Brand</span>
          </div>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-asphalt-2 p-4 border border-asphalt-2 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-steel absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search brands by name, country, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-asphalt border border-steel/30 pl-9 pr-3 py-2 text-xs text-off-white font-mono placeholder-steel/60 focus:border-plate-yellow transition-colors"
          />
        </div>
        <div className="text-xs font-mono text-steel">
          Total Brands: <span className="text-plate-yellow font-bold">{brands.length}</span>
        </div>
      </div>

      {/* Brand List Grid */}
      {isLoading ? (
        <div className="p-8 text-center text-steel font-mono text-xs bg-asphalt-2 border border-asphalt-2">
          Loading brands directory...
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="p-8 text-center text-steel font-mono text-xs bg-asphalt-2 border border-asphalt-2">
          No brands found matching your search. Click &quot;Add Partner Brand&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {filteredBrands.map((b, idx) => (
            <div key={b.id} className="bg-asphalt-2 border border-steel/30 p-4 space-y-3 relative group hover:border-plate-yellow/60 transition-colors shadow-md">
              {/* Header: Logo, Name, Country */}
              <div className="flex items-start justify-between gap-3 border-b border-steel/20 pb-3">
                <div className="flex items-center gap-3">
                  {b.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.logoUrl}
                      alt={b.name}
                      className="w-12 h-12 object-cover bg-asphalt border border-steel/30 p-1 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-asphalt border border-steel/30 flex items-center justify-center text-steel font-bold text-lg shrink-0">
                      {b.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-off-white uppercase tracking-wider">{b.name}</h3>
                      {b.isFeatured && (
                        <span className="bg-plate-yellow/20 text-plate-yellow border border-plate-yellow/40 px-1.5 py-0.2 text-[9px] font-bold uppercase flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-plate-yellow" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-steel mt-0.5">
                      {b.flag && <span>{b.flag}</span>}
                      <span>{b.country || "Global Brand"}</span>
                      <span>•</span>
                      <span className="text-plate-yellow font-bold">{b.productCount || 0} products</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveBrand(idx, "up")}
                    className="text-steel hover:text-off-white disabled:opacity-20 p-1 transition-colors cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === brands.length - 1}
                    onClick={() => handleMoveBrand(idx, "down")}
                    className="text-steel hover:text-off-white disabled:opacity-20 p-1 transition-colors cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(b)}
                    className="text-steel hover:text-plate-yellow p-1 transition-colors cursor-pointer"
                    title="Edit Brand"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: b.id, name: b.name })}
                    className="text-red-400 hover:text-red-300 p-1 transition-colors cursor-pointer"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-steel leading-relaxed line-clamp-2">
                {b.description || "No description provided."}
              </p>

              {/* Footer: Slug & Website */}
              <div className="flex items-center justify-between text-[10px] text-steel/80 pt-1">
                <span className="font-mono bg-asphalt border border-steel/20 px-2 py-0.5 text-plate-yellow">
                  slug: /{b.slug}
                </span>
                {b.website && (
                  <a
                    href={b.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-plate-yellow hover:underline flex items-center gap-1"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-mono text-xs animate-fade-in">
          <div className="bg-asphalt-2 border border-plate-yellow/60 max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-steel/20 pb-3">
              <h2 className="text-base font-extrabold text-off-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-5 h-5 text-plate-yellow" />
                <span>{editingBrand ? "Edit Brand Details" : "Add Partner Brand"}</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-steel hover:text-off-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-steel block font-bold mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alpinestars"
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (!editingBrand) {
                        setFormSlug(
                          e.target.value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, "-")
                        );
                      }
                    }}
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white focus:border-plate-yellow"
                  />
                </div>

                <div>
                  <label className="text-steel block font-bold mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. alpinestars"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white focus:border-plate-yellow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-steel block font-bold mb-1">Country of Origin</label>
                  <input
                    type="text"
                    placeholder="e.g. Italy"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white focus:border-plate-yellow"
                  />
                </div>

                <div>
                  <label className="text-steel block font-bold mb-1">Country Flag Emoji</label>
                  <input
                    type="text"
                    placeholder="e.g. 🇮🇹"
                    value={formFlag}
                    onChange={(e) => setFormFlag(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white focus:border-plate-yellow"
                  />
                </div>
              </div>

              {/* Quick Country & Flag Selector */}
              <div>
                <label className="text-steel block text-[11px] font-bold mb-1">Quick Select Country & Flag:</label>
                <div className="flex flex-wrap gap-1">
                  {FLAG_PRESETS.map((fp) => (
                    <button
                      key={fp.country}
                      type="button"
                      onClick={() => {
                        setFormCountry(fp.country);
                        setFormFlag(fp.flag);
                      }}
                      className="bg-asphalt border border-steel/30 hover:border-plate-yellow px-2 py-1 text-xs text-off-white flex items-center gap-1 cursor-pointer transition-colors"
                      title={`Set ${fp.country} ${fp.flag}`}
                    >
                      <span>{fp.flag}</span>
                      <span className="text-[10px] text-steel">{fp.country}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-steel block font-bold mb-1">Official Website URL</label>
                <input
                  type="url"
                  placeholder="https://www.alpinestars.com"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 p-2 text-off-white focus:border-plate-yellow"
                />
              </div>

              {/* Logo URL & File Upload */}
              <div>
                <label className="text-steel block font-bold mb-1">Brand Logo Image URL</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formLogoUrl}
                    onChange={(e) => setFormLogoUrl(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white focus:border-plate-yellow"
                  />
                  <label className="bg-asphalt border border-steel/30 hover:border-plate-yellow px-3 py-2 text-plate-yellow cursor-pointer flex items-center gap-1 shrink-0 font-bold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-steel block font-bold mb-1">Brand Description</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe the brand's history, specialties, and certifications..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 p-2 text-off-white focus:border-plate-yellow"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formIsFeatured"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-plate-yellow"
                />
                <label htmlFor="formIsFeatured" className="text-off-white font-bold cursor-pointer">
                  Feature as Highlighted Partner Brand on Frontend
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-steel/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-asphalt border border-steel/30 px-4 py-2 text-steel hover:text-off-white uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-plate-yellow text-asphalt font-extrabold px-5 py-2 uppercase hover:bg-yellow-400 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingBrand ? "Update Brand" : "Create Brand"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={!!deleteTarget}
          title="Delete Partner Brand?"
          message={`Are you sure you want to delete "${deleteTarget.name}"? Products linked to this brand name will remain intact.`}
          confirmText="Delete Brand"
          cancelText="Keep Brand"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
