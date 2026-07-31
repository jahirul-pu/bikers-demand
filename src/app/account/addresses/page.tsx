"use client";

import React, { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";

export default function AddressesPage() {
  const [addresses] = useState([
    {
      id: "addr-1",
      label: "Home Address",
      line1: "House 42, Road 11, Block D, Banani",
      city: "Dhaka",
      isInsideDhaka: true,
      phone: "01800000000",
    },
  ]);

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="border-b border-asphalt pb-4">
        <span className="text-plate-yellow uppercase tracking-wider block">DELIVERY PLACES</span>
        <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
          Saved Addresses
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-asphalt p-5 border border-asphalt-2 space-y-2">
            <div className="flex justify-between items-center text-plate-yellow font-bold">
              <span>{addr.label}</span>
              <span className="text-[10px] text-steel">
                {addr.isInsideDhaka ? "Inside Dhaka (Tk 60)" : "Outside Dhaka (Tk 130)"}
              </span>
            </div>
            <p className="text-off-white">{addr.line1}</p>
            <p className="text-steel">{addr.city}, Bangladesh</p>
            <p className="text-steel">Phone: {addr.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
