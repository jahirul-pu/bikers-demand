"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-mono">
      <div className="bg-asphalt-2 border border-ignition-red/60 max-w-md w-full p-6 space-y-5 shadow-2xl relative transform transition-all">
        {/* Header Tag & Close */}
        <div className="flex items-center justify-between border-b border-asphalt pb-3">
          <div className="inline-flex items-center gap-2 bg-ignition-red text-asphalt px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider transform -skew-x-6">
            <div className="transform skew-x-6 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-asphalt stroke-[2.5]" />
              <span>WARNING</span>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="text-steel hover:text-off-white p-1 rounded transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="display-font text-2xl font-extrabold uppercase text-off-white tracking-wide">
            {title}
          </h3>
          <p className="text-xs text-steel-light leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs text-steel hover:text-off-white bg-asphalt border border-steel/30 transition-colors font-mono cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-xs px-6 py-2.5 tracking-wider transition-all transform -skew-x-6 cursor-pointer shadow-lg shadow-ignition-red/20"
          >
            <span className="transform skew-x-6 block">{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
