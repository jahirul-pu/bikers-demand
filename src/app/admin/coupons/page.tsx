"use client";

import React, { useState } from "react";
import { Tag, Plus } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons] = useState([
    { id: "cp-1", code: "BIKERS500", discount: "Tk 500 Flat Off", minOrder: 5000, isActive: true },
    { id: "cp-2", code: "HELMET10", discount: "10% Off Helmets", minOrder: 8000, isActive: true },
  ]);

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="border-b border-asphalt pb-4">
        <span className="text-plate-yellow uppercase tracking-wider block">DISCOUNTS & PROMOS</span>
        <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
          Coupon & Campaign Management
        </h1>
      </div>

      <div className="bg-asphalt border border-asphalt-2 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-asphalt-2 text-plate-yellow uppercase text-[11px] border-b border-asphalt-2">
              <th className="p-3">Coupon Code</th>
              <th className="p-3">Discount Value</th>
              <th className="p-3">Min Order</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-asphalt-2">
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="p-3 font-bold text-plate-yellow">{c.code}</td>
                <td className="p-3 text-off-white">{c.discount}</td>
                <td className="p-3 text-steel">Tk {c.minOrder.toLocaleString("en-BD")}</td>
                <td className="p-3 text-emerald-400 font-bold">Active</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
