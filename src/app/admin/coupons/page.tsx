"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Edit2, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { DBCoupon } from "@/types/db";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<DBCoupon[]>([]);
  const [dbCategoriesList, setDbCategoriesList] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<DBCoupon | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"FLAT" | "PERCENTAGE">("FLAT");
  const [discountValue, setDiscountValue] = useState<number | "">(500);
  const [minOrder, setMinOrder] = useState<number | "">(3000);
  const [categoryTarget, setCategoryTarget] = useState<string>("ALL");
  const [isActive, setIsActive] = useState(true);

  // Confirm Modal State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadCoupons = async () => {
    try {
      const res = await fetch("/api/coupons");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCoupons(json.data);
      }
    } catch (e) {
      console.error("Error loading coupons from DB:", e);
    }
  };

  const loadDbCategories = () => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) {
          setDbCategoriesList(j.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadCoupons();
    loadDbCategories();
    window.addEventListener("category-updated", loadDbCategories);
    return () => window.removeEventListener("category-updated", loadDbCategories);
  }, []);

  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    setCode("");
    setDiscountType("FLAT");
    setDiscountValue(500);
    setMinOrder(3000);
    setCategoryTarget("ALL");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: DBCoupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.discountType as any);
    setDiscountValue(coupon.discountValue);
    setMinOrder(coupon.minOrder);
    setCategoryTarget(coupon.categoryTarget as any);
    setIsActive(coupon.isActive);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const formattedCode = code.trim().toUpperCase();
    const val = Number(discountValue) || 0;
    const minOrd = Number(minOrder) || 0;

    const payload = {
      ...(editingCoupon && { id: editingCoupon.id }),
      code: formattedCode,
      discountType,
      discountValue: val,
      minOrder: minOrd,
      categoryTarget,
      isActive,
    };

    try {
      if (editingCoupon) {
        await fetch("/api/coupons", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      console.error("API error saving coupon:", err);
    }

    setIsModalOpen(false);
    await loadCoupons();
  };

  const handleToggleActive = async (coupon: DBCoupon) => {
    const updatedStatus = !coupon.isActive;

    // Optimistically update UI
    setCoupons((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, isActive: updatedStatus } : c))
    );

    try {
      const res = await fetch("/api/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrder: coupon.minOrder,
          categoryTarget: coupon.categoryTarget,
          isActive: updatedStatus,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        // Revert on failure
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, isActive: coupon.isActive } : c))
        );
      } else {
        await loadCoupons();
      }
    } catch (e) {
      console.error("API error toggling coupon active status:", e);
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, isActive: coupon.isActive } : c))
      );
    }
  };

  const handleDeleteCoupon = async () => {
    if (!deleteConfirmId) return;
    const targetId = deleteConfirmId;

    // Optimistically update UI
    setCoupons((prev) => prev.filter((c) => c.id !== targetId));
    setDeleteConfirmId(null);

    try {
      await fetch(`/api/coupons?id=${targetId}`, {
        method: "DELETE",
      });
      await loadCoupons();
    } catch (e) {
      console.error("API error deleting coupon:", e);
      await loadCoupons();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="surface rounded-2xl p-5 sm:p-6 shadow-xs border border-asphalt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-plate-yellow animate-pulse" />
            <span className="text-xs font-mono font-bold text-plate-yellow uppercase tracking-wider">
              Discounts &amp; Promos
            </span>
          </div>
          <h1 className="display-font text-2xl sm:text-3xl font-extrabold text-off-white flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-plate-yellow" />
            <span>Coupons &amp; Campaigns</span>
          </h1>
          <p className="text-xs text-steel font-mono mt-0.5">
            Create and manage promo vouchers, percentage discounts, and minimum order limits.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="bg-ignition-red hover:bg-red-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="surface rounded-2xl border border-asphalt-2 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-asphalt/70 text-steel font-mono uppercase text-[11px] tracking-wider border-b border-asphalt-2">
              <tr>
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Min Order</th>
                <th className="py-3.5 px-4">Category Scope</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-asphalt-2">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-steel font-mono">
                    No promotional coupons created yet. Click &quot;Create Coupon&quot; to add one.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-asphalt/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-plate-yellow text-xs font-mono rounded-lg bg-plate-yellow/10 border border-dashed border-plate-yellow/40 px-2.5 py-1 inline-block">
                        {c.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {c.discountType === "FLAT" ? (
                        <span className="rounded-full bg-plate-yellow/15 text-plate-yellow border border-plate-yellow/30 px-2.5 py-0.5 text-xs font-semibold font-mono inline-block">
                          ৳{c.discountValue.toLocaleString("en-BD")} Flat Off
                        </span>
                      ) : (
                        <span className="rounded-full bg-ignition-red/15 text-ignition-red border border-ignition-red/30 px-2.5 py-0.5 text-xs font-semibold font-mono inline-block">
                          {c.discountValue}% Off
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-steel font-mono font-semibold">
                      ৳{c.minOrder.toLocaleString("en-BD")}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="rounded-md bg-asphalt border border-steel/20 px-2 py-0.5 text-[11px] text-steel font-medium">
                        {c.categoryTarget === "ALL"
                          ? "All Categories"
                          : dbCategoriesList.find((cat) => cat.slug === c.categoryTarget)?.name || c.categoryTarget}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(c)}
                        title={`Click to ${c.isActive ? "deactivate" : "activate"} coupon`}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                          c.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                        }`}
                      >
                        {c.isActive ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className="p-1.5 rounded-lg text-steel hover:text-plate-yellow hover:bg-asphalt transition-all cursor-pointer"
                          title="Edit coupon"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(c.id)}
                          className="p-1.5 rounded-lg text-steel hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Delete coupon"
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

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 text-xs">
          <div className="surface border border-asphalt-2 max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl rounded-3xl">
            <div className="flex justify-between items-center border-b border-asphalt-2 pb-3.5">
              <h3 className="display-font text-xl font-bold text-off-white">
                {editingCoupon ? "Edit Promotional Coupon" : "Create Promotional Coupon"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-steel hover:text-off-white hover:bg-asphalt transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="text-steel block text-xs font-semibold mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. BIKERS500, SUMMER20"
                  required
                  className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white font-mono uppercase text-xs focus:border-plate-yellow focus:outline-none transition-colors font-bold"
                />
              </div>

              {/* Discount Type Selector */}
              <div>
                <label className="text-steel block text-xs font-semibold mb-1.5">
                  Discount Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDiscountType("FLAT");
                      if (typeof discountValue === "number" && discountValue <= 100) {
                        setDiscountValue(500);
                      }
                    }}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      discountType === "FLAT"
                        ? "bg-plate-yellow/15 text-plate-yellow border-plate-yellow font-bold shadow-xs"
                        : "surface text-steel border-asphalt-2 hover:text-off-white"
                    }`}
                  >
                    <span>Flat Amount (৳)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDiscountType("PERCENTAGE");
                      if (typeof discountValue === "number" && discountValue > 100) {
                        setDiscountValue(15);
                      }
                    }}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      discountType === "PERCENTAGE"
                        ? "bg-ignition-red/15 text-ignition-red border-ignition-red font-bold shadow-xs"
                        : "surface text-steel border-asphalt-2 hover:text-off-white"
                    }`}
                  >
                    <span>Percentage (%)</span>
                  </button>
                </div>
              </div>

              {/* Discount Value */}
              <div>
                <label className="text-steel block text-xs font-semibold mb-1">
                  Discount Value {discountType === "FLAT" ? "(Amount in BDT ৳)" : "(Percentage %)"} *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={discountType === "PERCENTAGE" ? 100 : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder={discountType === "FLAT" ? "e.g. 500" : "e.g. 15"}
                    required
                    className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white font-mono text-xs focus:border-plate-yellow focus:outline-none font-bold transition-colors"
                  />
                  <span className="absolute right-3.5 top-2.5 font-mono text-xs text-steel font-semibold">
                    {discountType === "FLAT" ? "BDT ৳" : "% OFF"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-steel block text-xs font-semibold mb-1">
                    Minimum Order (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value === "" ? "" : Number(e.target.value))}
                    required
                    className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white font-mono text-xs focus:border-plate-yellow focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-steel block text-xs font-semibold mb-1">
                    Category Scope
                  </label>
                  <select
                    value={categoryTarget}
                    onChange={(e) => setCategoryTarget(e.target.value)}
                    className="w-full bg-asphalt border border-steel/20 rounded-xl p-2.5 text-off-white text-xs focus:border-plate-yellow focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="ALL">All Categories</option>
                    {dbCategoriesList.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-plate-yellow cursor-pointer"
                />
                <label htmlFor="isActive" className="text-off-white font-medium cursor-pointer">
                  Activate this coupon immediately for checkout
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-asphalt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="surface hover:bg-asphalt border border-asphalt-2 px-4 py-2 text-steel hover:text-off-white rounded-xl font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-ignition-red hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        title="Delete Promotional Coupon"
        message="Are you sure you want to delete this coupon? Customers will no longer be able to apply this discount code during checkout."
        confirmText="Yes, Delete Coupon"
        cancelText="Cancel"
        onConfirm={handleDeleteCoupon}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
