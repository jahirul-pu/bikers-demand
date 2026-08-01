"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Lock, Check, LogOut, Trash2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load active user session from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("bikers_demand_user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.name) setName(u.name);
        if (u.phone || u.phoneOrEmail) setPhone(u.phone || u.phoneOrEmail);
        if (u.email) setEmail(u.email);
      }
    } catch (e) {
      console.error("Error loading user settings from storage:", e);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const existingUser = localStorage.getItem("bikers_demand_user");
      const u = existingUser ? JSON.parse(existingUser) : {};
      const updatedUser = {
        ...u,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      };
      localStorage.setItem("bikers_demand_user", JSON.stringify(updatedUser));
      
      // Dispatch storage event so Header and AccountLayout update in real-time
      window.dispatchEvent(new Event("storage"));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Error saving user settings:", err);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("bikers_demand_user");
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error(e);
    }
    router.push("/login");
  };

  const handleDeleteAccount = () => {
    try {
      localStorage.removeItem("bikers_demand_user");
      localStorage.removeItem("bikers_demand_favs");
      localStorage.removeItem("bikers_demand_cart");
      localStorage.removeItem("bd_db_garage");
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error(e);
    }
    router.push("/");
  };

  return (
    <div className="space-y-8 font-mono text-xs max-w-2xl">
      <div className="border-b border-asphalt pb-4">
        <span className="text-plate-yellow uppercase tracking-wider block font-bold">
          ACCOUNT MANAGEMENT
        </span>
        <h1 className="display-font text-3xl font-extrabold uppercase text-off-white">
          Account Settings & Security
        </h1>
        <p className="text-steel mt-1">
          Update your profile details, contact info, or sign out of your session.
        </p>
      </div>

      {/* Save Settings Form */}
      <form onSubmit={handleSave} className="bg-asphalt-2 p-6 border border-asphalt-2 space-y-4">
        <h3 className="text-off-white font-bold text-sm uppercase flex items-center gap-2 border-b border-asphalt pb-3">
          <User className="w-4 h-4 text-plate-yellow" />
          <span>Rider Profile Information</span>
        </h3>

        <div className="space-y-1">
          <label className="text-steel block font-bold">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full bg-asphalt border border-steel/30 p-3 text-off-white focus:border-plate-yellow focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-steel block font-bold">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="017xxxxxxxx"
              className="w-full bg-asphalt border border-steel/30 p-3 text-off-white focus:border-plate-yellow focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-steel block font-bold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rider@example.com"
              className="w-full bg-asphalt border border-steel/30 p-3 text-off-white focus:border-plate-yellow focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className={`py-3.5 px-6 font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all transform -skew-x-6 cursor-pointer shadow-lg ${
            saved
              ? "bg-emerald-500 text-asphalt"
              : "bg-plate-yellow hover:bg-yellow-500 text-asphalt"
          }`}
        >
          <div className="transform skew-x-6 flex items-center gap-2">
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? "CHANGES SAVED LOCALLY" : "SAVE PROFILE CHANGES"}</span>
          </div>
        </button>
      </form>

      {/* Session Actions & Danger Zone */}
      <div className="space-y-4">
        {/* Sign Out Card */}
        <div className="bg-asphalt-2 p-6 border border-asphalt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-off-white font-bold text-sm uppercase flex items-center gap-2">
              <LogOut className="w-4 h-4 text-plate-yellow" />
              <span>Sign Out of Account</span>
            </h4>
            <p className="text-steel text-xs font-light">
              Log out of your current session on this device. Your garage and saved wishlist items remain saved.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-asphalt hover:bg-asphalt/80 border border-steel/30 text-off-white font-bold uppercase px-5 py-3 text-xs tracking-wider flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-plate-yellow" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Delete Account Danger Zone */}
        <div className="bg-asphalt-2 p-6 border border-ignition-red/40 space-y-4">
          <div className="space-y-1">
            <h4 className="text-ignition-red font-bold text-sm uppercase flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-ignition-red" />
              <span>Delete Rider Account (Danger Zone)</span>
            </h4>
            <p className="text-steel text-xs font-light">
              Permanently erase your rider account, stored garage motorcycles, saved addresses, and active wishlist.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-ignition-red/20 hover:bg-ignition-red text-ignition-red hover:text-asphalt border border-ignition-red font-extrabold uppercase px-5 py-2.5 text-xs tracking-wider transition-all cursor-pointer"
            >
              Delete Account...
            </button>
          ) : (
            <div className="p-4 bg-asphalt border border-ignition-red space-y-3">
              <div className="flex items-center gap-2 text-ignition-red font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Are you sure? This action cannot be undone.</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase px-4 py-2 text-xs"
                >
                  Yes, Permanently Delete My Account
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-asphalt-2 text-steel hover:text-off-white px-4 py-2 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
