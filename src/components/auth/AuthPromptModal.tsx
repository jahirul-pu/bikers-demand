"use client";

import React from "react";
import Link from "next/link";
import { X, Lock, User, Bike, ArrowRight } from "lucide-react";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function AuthPromptModal({
  isOpen,
  onClose,
  title = "Authentication Required",
  subtitle = "Sign in or create a rider account to add items to your favorites wishlist.",
}: AuthPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-mono text-xs animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-asphalt/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Centered Modal Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-asphalt-2 border border-asphalt-2 rounded-3xl p-6 sm:p-8 max-w-md w-full text-off-white shadow-2xl space-y-6 transition-all animate-scale-up">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-steel hover:text-off-white hover:bg-asphalt transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-2 pt-2">
            <div className="w-14 h-14 bg-plate-yellow/20 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 text-plate-yellow" />
            </div>

            <span className="text-plate-yellow font-semibold tracking-widest text-[10px] uppercase block">
              Rider Authentication
            </span>

            <h2 className="display-font text-2xl font-extrabold text-off-white">
              {title}
            </h2>

            <p className="text-steel text-xs font-light leading-relaxed max-w-xs mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2 font-semibold">
            <Link
              href="/login"
              onClick={onClose}
              className="w-full bg-ignition-red hover:bg-red-600 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-ignition-red/25 text-center"
            >
              <User className="w-4 h-4" />
              <span>Sign In to Account</span>
            </Link>

            <Link
              href="/register"
              onClick={onClose}
              className="w-full bg-asphalt hover:bg-asphalt/80 border border-asphalt-2 text-off-white py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-center"
            >
              <Bike className="w-4 h-4 text-plate-yellow" />
              <span>Create Rider Account</span>
            </Link>

            <button
              onClick={onClose}
              className="w-full text-center text-steel hover:text-off-white text-[11px] pt-1"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
