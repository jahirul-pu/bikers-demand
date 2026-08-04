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
    <div className="space-y-6 font-mono text-xs">
      {/* Top Header */}
      <div className="bg-asphalt p-4 border border-asphalt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-plate-yellow uppercase tracking-wider block font-bold text-[10px]">
            DISCOUNTS & PROMOS
          </span>
          <h1 className="display-font text-2xl font-extrabold uppercase text-off-white">
            Coupon & Campaign Management
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase px-4 py-2 flex items-center gap-1.5 transform -skew-x-6 cursor-pointer text-xs shrink-0"
        >
          <div className="transform skew-x-6 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </div>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-asphalt border border-asphalt-2 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-asphalt-2 text-plate-yellow uppercase text-[11px] border-b border-asphalt-2">
              <th className="p-3">Coupon Code</th>
              <th className="p-3">Discount Type & Value</th>
              <th className="p-3">Min Order Value</th>
              <th className="p-3">Category Target</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-asphalt-2">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-steel italic">
                  No promotional coupons created yet. Click &quot;Create Coupon&quot; to add one.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-asphalt-2/50 transition-colors">
                  <td className="p-3">
                    <span className="font-bold text-plate-yellow text-sm font-mono block">
                      {c.code}
                    </span>
                  </td>

                  <td className="p-3 font-bold text-off-white">
                    {c.discountType === "FLAT" ? (
                      <span className="bg-plate-yellow/10 text-plate-yellow border border-plate-yellow/30 px-2 py-1 text-[11px] font-bold">
                        ৳{c.discountValue.toLocaleString("en-BD")} FLAT OFF
                      </span>
                    ) : (
                      <span className="bg-ignition-red/10 text-ignition-red border border-ignition-red/30 px-2 py-1 text-[11px] font-bold">
                        {c.discountValue}% PERCENTAGE OFF
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-steel font-bold">
                    ৳{c.minOrder.toLocaleString("en-BD")}
                  </td>

                  <td className="p-3">
                    <span className="bg-asphalt-2 border border-steel/30 px-2 py-0.5 text-[10px] text-steel uppercase font-mono">
                      {c.categoryTarget === "ALL"
                        ? "All Categories"
                        : dbCategoriesList.find((cat) => cat.slug === c.categoryTarget)?.name || c.categoryTarget}
                    </span>
                  </td>

                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(c)}
                      title={`Click to ${c.isActive ? "deactivate" : "activate"} coupon`}
                      className={`px-3 py-1 text-[11px] font-bold border font-mono uppercase flex items-center gap-1.5 cursor-pointer transition-all rounded-xs ${
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

                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(c)}
                      className="text-steel hover:text-plate-yellow p-1 transition-colors cursor-pointer"
                      title="Edit coupon"
                    >
                      <Edit2 className="w-4 h-4 inline" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(c.id)}
                      className="text-steel hover:text-ignition-red p-1 transition-colors cursor-pointer"
                      title="Delete coupon"
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

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-asphalt-2 border border-plate-yellow/60 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-asphalt pb-3">
              <h3 className="display-font text-xl font-extrabold uppercase text-off-white">
                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-steel hover:text-off-white text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="text-steel uppercase text-[10px] block font-bold mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. BIKERS500, SUMMER20"
                  required
                  className="w-full bg-asphalt border border-steel/30 p-2 text-off-white font-mono uppercase text-xs focus:border-plate-yellow focus:outline-none"
                />
              </div>

              {/* Discount Type Selector */}
              <div>
                <label className="text-steel uppercase text-[10px] block font-bold mb-1.5">
                  Select Discount Type *
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
                    className={`py-2 px-3 text-xs font-bold font-mono border uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      discountType === "FLAT"
                        ? "bg-plate-yellow text-asphalt border-plate-yellow font-extrabold"
                        : "bg-asphalt text-steel border-steel/30 hover:text-off-white"
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
                    className={`py-2 px-3 text-xs font-bold font-mono border uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      discountType === "PERCENTAGE"
                        ? "bg-ignition-red text-asphalt border-ignition-red font-extrabold"
                        : "bg-asphalt text-steel border-steel/30 hover:text-off-white"
                    }`}
                  >
                    <span>Percentage (%)</span>
                  </button>
                </div>
              </div>

              {/* Discount Value */}
              <div>
                <label className="text-steel uppercase text-[10px] block font-bold mb-1">
                  Discount Value {discountType === "FLAT" ? "(Amount in BDT ৳)" : "(Percentage %)"} *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={discountType === "PERCENTAGE" ? 100 : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder={discountType === "FLAT" ? "e.g. 500" : "e.g. 15 (for 15% off)"}
                    required
                    className="w-full bg-asphalt border border-steel/30 p-2.5 text-off-white font-mono text-xs focus:border-plate-yellow focus:outline-none font-bold"
                  />
                  <span className="absolute right-3 top-2.5 font-mono text-xs text-steel font-bold">
                    {discountType === "FLAT" ? "BDT ৳" : "% OFF"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-steel uppercase text-[10px] block font-bold mb-1">
                    Minimum Order Value (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value === "" ? "" : Number(e.target.value))}
                    required
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white font-mono text-xs focus:border-plate-yellow focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-steel uppercase text-[10px] block font-bold mb-1">
                    Category Scope
                  </label>
                  <select
                    value={categoryTarget}
                    onChange={(e) => setCategoryTarget(e.target.value)}
                    className="w-full bg-asphalt border border-steel/30 p-2 text-off-white font-mono text-xs focus:border-plate-yellow focus:outline-none cursor-pointer"
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

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-plate-yellow cursor-pointer"
                />
                <label htmlFor="isActive" className="text-off-white font-bold cursor-pointer">
                  Activate this coupon immediately
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-asphalt">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-asphalt border border-steel/30 text-steel hover:text-off-white font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase transform -skew-x-6 cursor-pointer"
                >
                  <div className="transform skew-x-6">Save Coupon</div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        title="DELETE PROMOTIONAL COUPON"
        message="Are you sure you want to delete this coupon? Customers will no longer be able to apply this discount code during checkout."
        confirmText="YES, DELETE COUPON"
        onConfirm={handleDeleteCoupon}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}

