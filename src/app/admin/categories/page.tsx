"use client";

import React, { useState, useEffect } from "react";
import { FolderTree, Plus, Edit2, Trash2, ChevronRight, Layers, Tag, Package, Check, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal";

interface SubCategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  _count?: { products: number };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder?: number;
  children: SubCategoryItem[];
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string; name: string; slug: string; description: string; parentId: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Modal Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formParentId, setFormParentId] = useState<string>("");

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleMoveCategory = async (index: number, direction: "up" | "down", parentId: string | null = null) => {
    let listToReorder: any[] = [];

    if (!parentId) {
      listToReorder = [...categories];
    } else {
      const parent = categories.find((c) => c.id === parentId);
      if (parent && parent.children) {
        listToReorder = [...parent.children];
      }
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= listToReorder.length) return;

    // Swap items in local array
    const temp = listToReorder[index];
    listToReorder[index] = listToReorder[targetIndex];
    listToReorder[targetIndex] = temp;

    // Assign sortOrder values
    const itemsPayload = listToReorder.map((item, idx) => ({
      id: item.id,
      sortOrder: idx,
    }));

    try {
      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", items: itemsPayload }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchCategories();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("category-updated"));
        }
      }
    } catch (err) {
      console.error("Failed to reorder categories:", err);
    }
  };

  const handleOpenAddModal = (parentId: string = "") => {
    setEditingItem(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormParentId(parentId);
    setShowModal(true);
  };

  const handleOpenEditModal = (item: { id: string; name: string; slug: string; description?: string | null; parentId?: string | null }) => {
    setEditingItem({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      parentId: item.parentId || "",
    });
    setFormName(item.name);
    setFormSlug(item.slug);
    setFormDescription(item.description || "");
    setFormParentId(item.parentId || "");
    setShowModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Category name is required.");
      return;
    }

    const payload = {
      ...(editingItem && { id: editingItem.id }),
      name: formName,
      slug: formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: formDescription,
      parentId: formParentId || null,
    };

    try {
      const res = await fetch("/api/admin/categories", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        alert("Error saving category: " + (json.error || "Unknown error"));
        return;
      }

      await fetchCategories();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("category-updated"));
      }
      setShowModal(false);
    } catch (err: any) {
      alert("Failed to save category: " + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert("Error deleting category: " + (json.error || "Unknown error"));
        return;
      }
      await fetchCategories();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("category-updated"));
      }
    } catch (err: any) {
      alert("Failed to delete category: " + err.message);
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
              Category Structure
            </span>
          </div>
          <h1 className="display-font text-2xl sm:text-3xl font-extrabold text-off-white flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-plate-yellow" />
            <span>Category &amp; Subcategory Manager</span>
          </h1>
          <p className="text-xs text-steel mt-0.5 font-mono">
            Manage navigation categories and nested subcategories across store and catalog.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAddModal("")}
          className="bg-ignition-red hover:bg-red-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Main Category</span>
        </button>
      </div>

      {/* Categories Tree List */}
      {isLoading ? (
        <div className="p-12 text-center text-steel font-mono text-xs">
          Loading category hierarchy...
        </div>
      ) : categories.length === 0 ? (
        <div className="surface rounded-2xl p-12 text-center text-steel font-mono text-xs border border-asphalt-2">
          No categories found. Click &quot;Add Main Category&quot; to build your catalog taxonomy.
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {categories.map((cat, catIdx) => (
            <div key={cat.id} className="surface rounded-2xl border border-asphalt-2 overflow-hidden shadow-xs">
              {/* Parent Category Header Bar */}
              <div className="bg-asphalt/60 p-4 sm:p-5 border-b border-asphalt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-plate-yellow/10 border border-plate-yellow/30 flex items-center justify-center text-plate-yellow shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-bold text-off-white">
                        {cat.name}
                      </h2>
                      <span className="rounded-full bg-asphalt border border-plate-yellow/30 px-2.5 py-0.5 text-[11px] text-plate-yellow font-mono font-medium">
                        /{cat.slug}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-steel mt-0.5">{cat.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  {/* Reorder Category Up & Down */}
                  <button
                    disabled={catIdx === 0}
                    onClick={() => handleMoveCategory(catIdx, "up", null)}
                    className="p-1.5 rounded-lg border border-steel/20 text-steel hover:text-off-white hover:bg-asphalt disabled:opacity-30 transition-all cursor-pointer"
                    title="Move Category Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={catIdx === categories.length - 1}
                    onClick={() => handleMoveCategory(catIdx, "down", null)}
                    className="p-1.5 rounded-lg border border-steel/20 text-steel hover:text-off-white hover:bg-asphalt disabled:opacity-30 transition-all cursor-pointer"
                    title="Move Category Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenAddModal(cat.id)}
                    className="bg-plate-yellow/15 border border-plate-yellow/40 text-plate-yellow hover:bg-plate-yellow hover:text-asphalt text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Subcategory</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-1.5 rounded-lg border border-steel/20 text-steel hover:text-off-white hover:bg-asphalt transition-all cursor-pointer"
                    title="Edit Main Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                    className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subcategories List */}
              <div className="p-4 bg-asphalt/20">
                {cat.children && cat.children.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cat.children.map((sub, subIdx) => (
                      <div
                        key={sub.id}
                        className="rounded-xl bg-asphalt/60 p-3.5 border border-asphalt-2 flex items-center justify-between gap-2 hover:border-plate-yellow/40 transition-all shadow-2xs"
                      >
                        <div className="space-y-0.5 overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <ChevronRight className="w-3.5 h-3.5 text-ignition-red shrink-0" />
                            <span className="font-semibold text-off-white truncate">{sub.name}</span>
                          </div>
                          <div className="text-[11px] text-steel font-mono truncate pl-5">
                            /{sub.slug}
                          </div>
                          {sub.description && (
                            <div className="text-[11px] text-steel/80 truncate pl-5">
                              {sub.description}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Reorder Subcategory Up & Down */}
                          <button
                            disabled={subIdx === 0}
                            onClick={() => handleMoveCategory(subIdx, "up", cat.id)}
                            className="text-steel hover:text-off-white disabled:opacity-20 p-1 rounded-md transition-colors cursor-pointer"
                            title="Move Subcategory Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={subIdx === cat.children.length - 1}
                            onClick={() => handleMoveCategory(subIdx, "down", cat.id)}
                            className="text-steel hover:text-off-white disabled:opacity-20 p-1 rounded-md transition-colors cursor-pointer"
                            title="Move Subcategory Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(sub)}
                            className="text-steel hover:text-plate-yellow p-1 rounded-md transition-colors cursor-pointer"
                            title="Edit Subcategory"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: sub.id, name: sub.name })}
                            className="text-steel hover:text-red-400 p-1 rounded-md transition-colors cursor-pointer"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-steel italic p-3 border border-dashed border-asphalt-2 rounded-xl text-center">
                    No subcategories added yet under &quot;{cat.name}&quot;. Click &quot;+ Subcategory&quot; to create one.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="surface border border-asphalt-2 max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl rounded-3xl text-xs">
            <div className="flex items-center justify-between border-b border-asphalt-2 pb-3.5">
              <h2 className="display-font text-xl font-bold text-off-white">
                {editingItem
                  ? "Edit Category / Subcategory"
                  : formParentId
                  ? "Add Subcategory"
                  : "Add Main Category"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-steel hover:text-off-white hover:bg-asphalt transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              {/* Parent Category Selection */}
              <div className="space-y-1.5">
                <label className="text-steel block font-semibold">Hierarchy Level</label>
                <select
                  value={formParentId}
                  onChange={(e) => setFormParentId(e.target.value)}
                  className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">Top-Level Main Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      Subcategory under: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-steel block font-semibold">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Helmets or Modular Helmets"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!editingItem) {
                      setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white focus:border-plate-yellow focus:outline-none transition-colors"
                />
              </div>

              {/* URL Slug */}
              <div className="space-y-1.5">
                <label className="text-steel block font-semibold">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. modular-helmets"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white font-mono placeholder-steel/50 focus:border-plate-yellow focus:outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-steel block font-semibold">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Brief overview displayed on store header & category pages..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white placeholder-steel/50 focus:border-plate-yellow focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-asphalt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="surface hover:bg-asphalt border border-asphalt-2 text-steel hover:text-off-white px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-ignition-red hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {editingItem ? "Save Changes" : "Create Category"}
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
          title="Delete Category?"
          message={`Are you sure you want to delete "${deleteTarget.name}"? Products under this category will be preserved under a fallback category.`}
          confirmText="Delete Category"
          cancelText="Keep Category"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
