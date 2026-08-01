"use client";

import React, { useState } from "react";
import { ShieldAlert, Check, X, ExternalLink, Video } from "lucide-react";

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState([
    {
      id: "clm-1",
      orderNumber: "BD-2026-4155",
      customer: "Tanvir Ahmed",
      phone: "01712345678",
      claimType: "WRONG_ITEM",
      item: "Performance Slip-On Racing Exhaust",
      evidenceUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
      status: "PENDING_REVIEW",
      date: "2026-07-31",
      notes: "Customer states received exhaust has different inlet diameter.",
    },
  ]);

  const handleAction = (id: string, newStatus: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="border-b border-asphalt pb-4">
        <span className="text-plate-yellow uppercase tracking-wider block font-bold">
          REPLACEMENT CLAIMS
        </span>
        <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
          Evidence Claims Queue
        </h1>
        <p className="text-steel text-xs mt-1">
          Review customer unboxing video & photo evidence for wrong item or counterfeit claims.
        </p>
      </div>

      <div className="space-y-4">
        {claims.map((c) => (
          <div key={c.id} className="bg-asphalt p-5 border border-asphalt-2 space-y-4">
            <div className="flex justify-between items-start border-b border-asphalt-2 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-plate-yellow text-sm">
                    Order #{c.orderNumber}
                  </span>
                  <span className="bg-ignition-red text-asphalt font-extrabold px-2 py-0.5 text-[10px]">
                    {c.claimType.replace("_", " ")}
                  </span>
                </div>
                <div className="text-steel text-[11px] mt-1">
                  Customer: <strong className="text-off-white">{c.customer}</strong> ({c.phone}) • Filed on {c.date}
                </div>
              </div>

              <div className="text-right">
                <span className="bg-asphalt-2 border border-steel/30 text-off-white px-2 py-1 font-bold text-[10px]">
                  STATUS: {c.status}
                </span>
              </div>
            </div>

            {/* Claimed Item & Evidence Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-asphalt-2 p-4 border border-asphalt-2">
              <div className="space-y-1">
                <span className="text-steel text-[10px] uppercase">Claimed Product Item:</span>
                <div className="font-bold text-off-white">{c.item}</div>
                <div className="text-steel text-[11px]">Customer Note: "{c.notes}"</div>
              </div>

              <div className="space-y-2">
                <span className="text-steel text-[10px] uppercase">Uploaded Evidence File:</span>
                <a
                  href={c.evidenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-asphalt border border-plate-yellow/40 hover:border-plate-yellow text-plate-yellow p-2.5 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2 font-bold">
                    <Video className="w-4 h-4 text-plate-yellow" />
                    Inspect Video Evidence File
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Admin Action Buttons */}
            {c.status === "PENDING_REVIEW" ? (
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => handleAction(c.id, "REJECTED")}
                  className="bg-asphalt border border-steel/40 text-steel hover:text-off-white px-4 py-2 uppercase font-bold"
                >
                  Reject Claim
                </button>
                <button
                  onClick={() => handleAction(c.id, "APPROVED_REPLACEMENT_ISSUED")}
                  className="bg-emerald-500 hover:bg-emerald-600 text-asphalt font-extrabold uppercase px-6 py-2 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Issue Replacement</span>
                </button>
              </div>
            ) : (
              <div className="text-right text-emerald-400 font-bold">
                ✓ Decision Logged: {c.status}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
