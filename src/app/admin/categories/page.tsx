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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-asphalt-2 p-6 border border-asphalt-2">
        <div>
          <h1 className="display-font text-2xl font-extrabold text-off-white uppercase tracking-wider flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-plate-yellow" />
            Category & Subcategory Hierarchy Manager
          </h1>
          <p className="text-xs text-steel font-mono mt-1">
            Manage top-level navigation categories and nested subcategories across frontend & backend.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal("")}
          className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 flex items-center gap-2 transform -skew-x-6 cursor-pointer shadow-md transition-colors"
        >
          <div className="transform skew-x-6 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add Main Category</span>
          </div>
        </button>
      </div>

      {/* Categories Tree List */}
      {isLoading ? (
        <div className="p-8 text-center text-steel font-mono text-xs">
          Loading category hierarchy...
        </div>
      ) : categories.length === 0 ? (
        <div className="p-8 text-center text-steel font-mono text-xs bg-asphalt-2 border border-asphalt-2">
          No categories found. Click &quot;Add Main Category&quot; to build your hierarchy.
        </div>
      ) : (
        <div className="space-y-4 font-mono text-xs">
          {categories.map((cat, catIdx) => (
            <div key={cat.id} className="bg-asphalt-2 border border-steel/30 shadow-md">
              {/* Parent Category Header Bar */}
              <div className="bg-asphalt p-4 border-b border-steel/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-plate-yellow/10 border border-plate-yellow/40 flex items-center justify-center text-plate-yellow font-bold text-sm">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-off-white uppercase tracking-wide">
                        {cat.name}
                      </h2>
                      <span className="bg-asphalt-2 border border-steel/30 px-2 py-0.5 text-[10px] text-plate-yellow font-bold">
                        slug: /{cat.slug}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-[11px] text-steel mt-0.5">{cat.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Reorder Category Up & Down */}
                  <button
                    disabled={catIdx === 0}
                    onClick={() => handleMoveCategory(catIdx, "up", null)}
                    className="bg-asphalt-2 hover:bg-asphalt disabled:opacity-30 border border-steel/30 text-steel hover:text-off-white p-1.5 transition-colors cursor-pointer"
                    title="Move Category Left/Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={catIdx === categories.length - 1}
                    onClick={() => handleMoveCategory(catIdx, "down", null)}
                    className="bg-asphalt-2 hover:bg-asphalt disabled:opacity-30 border border-steel/30 text-steel hover:text-off-white p-1.5 transition-colors cursor-pointer"
                    title="Move Category Right/Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenAddModal(cat.id)}
                    className="bg-asphalt-2 hover:bg-asphalt border border-plate-yellow/50 text-plate-yellow hover:text-off-white text-[11px] font-bold px-3 py-1.5 uppercase flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Subcategory</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="bg-asphalt-2 hover:bg-asphalt border border-steel/30 text-steel hover:text-off-white p-1.5 transition-colors cursor-pointer"
                    title="Edit Main Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                    className="bg-asphalt-2 hover:bg-red-950/40 border border-red-500/30 text-red-400 p-1.5 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subcategories List */}
              <div className="p-4 bg-asphalt-2/50">
                {cat.children && cat.children.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cat.children.map((sub, subIdx) => (
                      <div
                        key={sub.id}
                        className="bg-asphalt p-3 border border-steel/20 flex items-center justify-between gap-2 hover:border-plate-yellow/40 transition-colors"
                      >
                        <div className="space-y-1 overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <ChevronRight className="w-3.5 h-3.5 text-ignition-red shrink-0" />
                            <span className="font-bold text-off-white truncate">{sub.name}</span>
                          </div>
                          <div className="text-[10px] text-steel font-mono truncate">
                            /{sub.slug}
                          </div>
                          {sub.description && (
                            <div className="text-[10px] text-steel/80 truncate">
                              {sub.description}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Reorder Subcategory Up & Down */}
                          <button
                            disabled={subIdx === 0}
                            onClick={() => handleMoveCategory(subIdx, "up", cat.id)}
                            className="text-steel hover:text-off-white disabled:opacity-20 p-1 transition-colors cursor-pointer"
                            title="Move Subcategory Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={subIdx === cat.children.length - 1}
                            onClick={() => handleMoveCategory(subIdx, "down", cat.id)}
                            className="text-steel hover:text-off-white disabled:opacity-20 p-1 transition-colors cursor-pointer"
                            title="Move Subcategory Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(sub)}
                            className="text-steel hover:text-plate-yellow p-1 transition-colors cursor-pointer"
                            title="Edit Subcategory"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: sub.id, name: sub.name })}
                            className="text-red-400 hover:text-red-300 p-1 transition-colors cursor-pointer"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-steel italic p-2 border border-dashed border-steel/20 text-center">
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
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-asphalt-2 border border-steel/40 max-w-lg w-full p-6 space-y-4 shadow-2xl rounded-xs font-mono text-xs">
            <div className="flex items-center justify-between border-b border-steel/20 pb-3">
              <h2 className="display-font text-xl font-bold text-off-white uppercase tracking-wider">
                {editingItem
                  ? "Edit Category / Subcategory"
                  : formParentId
                  ? "Add Subcategory"
                  : "Add Main Category"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-steel hover:text-off-white text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              {/* Parent Category Selection */}
              <div className="space-y-1">
                <label className="text-steel block font-bold">Category Level / Hierarchy</label>
                <select
                  value={formParentId}
                  onChange={(e) => setFormParentId(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 p-2.5 text-off-white"
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
              <div className="space-y-1">
                <label className="text-steel block font-bold">Category Name *</label>
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
                  className="w-full bg-asphalt border border-steel/30 p-2.5 text-off-white"
                />
              </div>

              {/* URL Slug */}
              <div className="space-y-1">
                <label className="text-steel block font-bold">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. modular-helmets"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 p-2.5 text-off-white placeholder-steel/50"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-steel block font-bold">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Brief overview displayed on store header & category pages..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-asphalt border border-steel/30 p-2.5 text-off-white placeholder-steel/50 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-steel/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-asphalt hover:bg-asphalt-2 border border-steel/30 text-steel hover:text-off-white px-4 py-2 font-bold uppercase transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold px-5 py-2 uppercase transition-colors cursor-pointer shadow-md"
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
