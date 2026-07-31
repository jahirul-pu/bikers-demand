"use client";

import React, { useState } from "react";
import { User, Phone, Mail, Lock, Check } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Tusher Rider");
  const [phone, setPhone] = useState("01800000000");
  const [email, setEmail] = useState("rider@bikersdemand.com");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-xs max-w-xl">
      <div className="border-b border-asphalt pb-4">
        <span className="text-plate-yellow uppercase tracking-wider block">PROFILE</span>
        <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
          Account Settings
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-1">
          <label className="text-steel block">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-asphalt border border-steel/30 p-2.5 text-off-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-steel block">Phone Number</label>
          <input
            type="tel"
            disabled
            value={phone}
            className="w-full bg-asphalt/50 border border-asphalt-2 p-2.5 text-steel cursor-not-allowed"
          />
        </div>

        <div className="space-y-1">
          <label className="text-steel block">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-asphalt border border-steel/30 p-2.5 text-off-white"
          />
        </div>

        <button
          type="submit"
          className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase px-6 py-3 tracking-wider flex items-center gap-2"
        >
          {saved ? <Check className="w-4 h-4" /> : null}
          <span>{saved ? "Changes Saved" : "Save Changes"}</span>
        </button>
      </form>
    </div>
  );
}
