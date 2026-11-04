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
      <div className="surface rounded-2xl p-5 sm:p-6 shadow-xs border border-asphalt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-plate-yellow animate-pulse" />
            <span className="text-xs font-mono font-bold text-plate-yellow uppercase tracking-wider">
              Brand Directory
            </span>
          </div>
          <h1 className="display-font text-2xl sm:text-3xl font-extrabold text-off-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-plate-yellow" />
            <span>Brands &amp; Manufacturers</span>
          </h1>
          <p className="text-xs text-steel mt-0.5 font-mono">
            Manage official partner brands, manufacturer logos, countries of origin, and catalog links.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="bg-ignition-red hover:bg-red-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Partner Brand</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="surface rounded-2xl p-4 border border-asphalt-2 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-steel absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search brands by name, country, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-asphalt border border-steel/20 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-off-white placeholder-steel/50 focus:border-plate-yellow focus:outline-none transition-colors"
          />
        </div>
        <div className="text-xs font-mono text-steel">
          Total Brands: <span className="text-plate-yellow font-bold">{brands.length}</span>
        </div>
      </div>

      {/* Brand List Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-steel font-mono text-xs">
          Loading brands directory...
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="surface rounded-2xl p-12 text-center text-steel font-mono text-xs border border-asphalt-2">
          No brands found matching your search. Click &quot;Add Partner Brand&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {filteredBrands.map((b, idx) => (
            <div key={b.id} className="surface rounded-2xl border border-asphalt-2 p-5 space-y-3.5 relative group hover:border-steel/40 transition-all shadow-xs">
              {/* Header: Logo, Name, Country */}
              <div className="flex items-start justify-between gap-3 border-b border-asphalt-2 pb-3">
                <div className="flex items-center gap-3">
                  {b.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.logoUrl}
                      alt={b.name}
                      className="w-12 h-12 object-contain rounded-xl bg-asphalt border border-asphalt-2 p-1.5 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-asphalt border border-asphalt-2 flex items-center justify-center text-steel font-bold text-lg shrink-0">
                      {b.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-off-white">{b.name}</h3>
                      {b.isFeatured && (
                        <span className="rounded-full bg-plate-yellow/15 text-plate-yellow border border-plate-yellow/30 px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-plate-yellow" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-steel mt-0.5">
                      {b.flag && <span>{b.flag}</span>}
                      <span>{b.country || "Global"}</span>
                      <span>•</span>
                      <span className="text-plate-yellow font-mono font-medium">{b.productCount || 0} items</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveBrand(idx, "up")}
                    className="p-1 rounded-md text-steel hover:text-off-white disabled:opacity-20 transition-colors cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === brands.length - 1}
                    onClick={() => handleMoveBrand(idx, "down")}
                    className="p-1 rounded-md text-steel hover:text-off-white disabled:opacity-20 transition-colors cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(b)}
                    className="p-1 rounded-md text-steel hover:text-plate-yellow transition-colors cursor-pointer"
                    title="Edit Brand"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: b.id, name: b.name })}
                    className="p-1 rounded-md text-steel hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-steel leading-relaxed line-clamp-2">
                {b.description || "No description provided."}
              </p>

              {/* Footer: Slug & Website */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-asphalt-2">
                <span className="font-mono rounded-full bg-asphalt border border-steel/20 px-2.5 py-0.5 text-[11px] text-plate-yellow">
                  /{b.slug}
                </span>
                {b.website && (
                  <a
                    href={b.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-plate-yellow hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 text-xs animate-fade-in">
          <div className="surface border border-asphalt-2 max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl rounded-3xl relative">
            <div className="flex items-center justify-between border-b border-asphalt-2 pb-3.5">
              <h2 className="display-font text-xl font-bold text-off-white flex items-center gap-2">
                <Award className="w-5 h-5 text-plate-yellow" />
                <span>{editingBrand ? "Edit Brand Details" : "Add Partner Brand"}</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-steel hover:text-off-white hover:bg-asphalt transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-steel block font-semibold mb-1">Brand Name *</label>
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
                    className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-steel block font-semibold mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. alpinestars"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white font-mono focus:border-plate-yellow focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-steel block font-semibold mb-1">Country of Origin</label>
                  <input
                    type="text"
                    placeholder="e.g. Italy"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-steel block font-semibold mb-1">Country Flag Emoji</label>
                  <input
                    type="text"
                    placeholder="e.g. 🇮🇹"
                    value={formFlag}
                    onChange={(e) => setFormFlag(e.target.value)}
                    className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Quick Country & Flag Selector */}
              <div>
                <label className="text-steel block text-xs font-semibold mb-1.5">Quick Select Country &amp; Flag:</label>
                <div className="flex flex-wrap gap-1.5">
                  {FLAG_PRESETS.map((fp) => (
                    <button
                      key={fp.country}
                      type="button"
                      onClick={() => {
                        setFormCountry(fp.country);
                        setFormFlag(fp.flag);
                      }}
                      className="bg-asphalt border border-steel/20 hover:border-plate-yellow rounded-lg px-2.5 py-1 text-xs text-off-white flex items-center gap-1.5 cursor-pointer transition-colors"
                      title={`Set ${fp.country} ${fp.flag}`}
                    >
                      <span>{fp.flag}</span>
                      <span className="text-[11px] text-steel">{fp.country}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-steel block font-semibold mb-1">Official Website URL</label>
                <input
                  type="url"
                  placeholder="https://www.alpinestars.com"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none transition-colors"
                />
              </div>

              {/* Logo URL & File Upload */}
              <div>
                <label className="text-steel block font-semibold mb-1">Brand Logo Image URL</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formLogoUrl}
                    onChange={(e) => setFormLogoUrl(e.target.value)}
                    className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none transition-colors"
                  />
                  <label className="bg-asphalt border border-steel/20 hover:border-plate-yellow rounded-xl px-3.5 py-2.5 text-plate-yellow cursor-pointer flex items-center gap-1.5 shrink-0 font-semibold transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-steel block font-semibold mb-1">Brand Description</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe the brand's history, specialties, and certifications..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formIsFeatured"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-plate-yellow cursor-pointer"
                />
                <label htmlFor="formIsFeatured" className="text-off-white font-medium cursor-pointer">
                  Feature as Highlighted Partner Brand on Frontend
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-asphalt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="surface hover:bg-asphalt border border-asphalt-2 px-4 py-2 text-steel hover:text-off-white rounded-xl font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-ignition-red hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
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
