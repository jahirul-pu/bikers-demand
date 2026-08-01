"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, Edit3, Check, X } from "lucide-react";

export interface DBAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  city: string;
  division: string;
  isDefault?: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<DBAddress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [label, setLabel] = useState("Home");
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [division, setDivision] = useState("Dhaka Division");

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bikers_demand_addresses");
      if (saved) {
        setAddresses(JSON.parse(saved));
      } else {
        // Pre-fill user details if available
        const savedUser = localStorage.getItem("bikers_demand_user");
        if (savedUser) {
          const u = JSON.parse(savedUser);
          const initialAddr: DBAddress = {
            id: "addr-1",
            label: "Home Address",
            recipientName: u.name || "Rider",
            phone: u.phone || u.phoneOrEmail || "017xxxxxxxx",
            streetAddress: "House 42, Road 11, Block D, Banani",
            city: "Dhaka",
            division: "Dhaka Division",
            isDefault: true,
          };
          setAddresses([initialAddr]);
          localStorage.setItem("bikers_demand_addresses", JSON.stringify([initialAddr]));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveToStorage = (list: DBAddress[]) => {
    setAddresses(list);
    try {
      localStorage.setItem("bikers_demand_addresses", JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setLabel("Home");
    setRecipientName("");
    setPhone("");
    setStreetAddress("");
    setCity("Dhaka");
    setDivision("Dhaka Division");
    setEditingId(null);
    setShowForm(false);
  };

  const handleStartEdit = (addr: DBAddress) => {
    setEditingId(addr.id);
    setLabel(addr.label);
    setRecipientName(addr.recipientName);
    setPhone(addr.phone);
    setStreetAddress(addr.streetAddress);
    setCity(addr.city);
    setDivision(addr.division);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Update existing address
      const updated = addresses.map((a) =>
        a.id === editingId
          ? {
              ...a,
              label,
              recipientName,
              phone,
              streetAddress,
              city,
              division,
            }
          : a
      );
      saveToStorage(updated);
    } else {
      // Create new address
      const newAddr: DBAddress = {
        id: `addr-${Date.now()}`,
        label,
        recipientName,
        phone,
        streetAddress,
        city,
        division,
        isDefault: addresses.length === 0,
      };
      saveToStorage([...addresses, newAddr]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    saveToStorage(updated);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-asphalt pb-4">
        <div>
          <span className="text-plate-yellow uppercase tracking-wider block font-bold">
            DELIVERY LOCATIONS
          </span>
          <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
            Saved Addresses
          </h1>
          <p className="text-steel text-xs font-mono mt-1">
            Manage your saved delivery locations for fast 1-click checkout.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-xs px-5 py-2.5 flex items-center gap-2 transition-colors transform -skew-x-6 self-start sm:self-auto cursor-pointer"
          >
            <div className="transform skew-x-6 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </div>
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-asphalt-2 p-6 border border-plate-yellow/40 space-y-4 font-mono text-xs animate-fade-in"
        >
          <div className="flex justify-between items-center border-b border-asphalt pb-3">
            <h3 className="font-bold text-sm uppercase text-plate-yellow flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{editingId ? "Edit Delivery Address" : "Add New Delivery Address"}</span>
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-steel hover:text-off-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-steel block font-bold">Address Label</label>
              <input
                type="text"
                required
                placeholder="e.g. Home, Garage, Office"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-asphalt border border-steel/30 p-2.5 text-off-white focus:border-plate-yellow focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-steel block font-bold">Recipient Full Name</label>
              <input
                type="text"
                required
                placeholder="Recipient name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-asphalt border border-steel/30 p-2.5 text-off-white focus:border-plate-yellow focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-steel block font-bold">Contact Phone Number</label>
              <input
                type="tel"
                required
                placeholder="017xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-asphalt border border-steel/30 p-2.5 text-off-white focus:border-plate-yellow focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-steel block font-bold">City / Area</label>
              <input
                type="text"
                required
                placeholder="e.g. Dhaka, Chittagong, Sylhet"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-asphalt border border-steel/30 p-2.5 text-off-white focus:border-plate-yellow focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-steel block font-bold">Street Address / House / Road / Area</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. House 42, Road 11, Block D, Banani"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full bg-asphalt border border-steel/30 p-2.5 text-off-white focus:border-plate-yellow focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-plate-yellow hover:bg-yellow-500 text-asphalt font-extrabold uppercase px-6 py-2.5 tracking-wider cursor-pointer transform -skew-x-6"
            >
              <span className="transform skew-x-6">
                {editingId ? "Save Address Changes" : "Save New Address"}
              </span>
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-asphalt text-steel hover:text-off-white px-4 py-2.5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Addresses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="bg-asphalt p-5 border border-asphalt-2 hover:border-steel/40 transition-all space-y-3"
          >
            <div className="flex justify-between items-center border-b border-asphalt-2 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-plate-yellow" />
                <span className="text-plate-yellow font-bold text-sm uppercase">{addr.label}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEdit(addr)}
                  className="text-steel hover:text-plate-yellow transition-colors p-1"
                  title="Edit address"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-steel hover:text-ignition-red transition-colors p-1"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-off-white font-bold">{addr.recipientName}</p>
              <p className="text-steel">{addr.streetAddress}</p>
              <p className="text-steel">{addr.city}, Bangladesh</p>
              <p className="text-steel/80 text-[11px] font-mono">Contact: {addr.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
