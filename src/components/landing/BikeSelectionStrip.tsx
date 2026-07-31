import React from "react";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";

interface BikeSelectionStripProps {
  selectedBike: {
    brand: string;
    model: string;
    variant?: string;
    year?: string;
  } | null;
  onOpenBikeModal: () => void;
  onClearBike: () => void;
}

export default function BikeSelectionStrip({
  selectedBike,
  onOpenBikeModal,
  onClearBike,
}: BikeSelectionStripProps) {
  if (!selectedBike) return null;

  const bikeDisplayName = `${selectedBike.brand} ${selectedBike.model} ${
    selectedBike.variant || ""
  }`.trim();

  return (
    <div className="bg-asphalt-2/95 border-b border-plate-yellow/30 py-3 px-4 shadow-lg transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Number Plate + Compatibility Message */}
        <div className="flex items-center gap-4">
          {/* Styled Motorcycle Plate */}
          <div className="bg-plate-yellow text-asphalt px-3 py-1 border-2 border-asphalt flex flex-col items-center justify-center font-mono font-extrabold shadow-md transform -skew-x-3">
            <span className="text-[9px] uppercase tracking-widest text-asphalt/80 border-b border-asphalt/20 pb-0.5 leading-none">
              BIKERS DEMAND • BD
            </span>
            <span className="text-xs uppercase tracking-wider leading-tight text-asphalt pt-0.5">
              {selectedBike.brand} • {selectedBike.model}
            </span>
          </div>

          {/* Compatibility Message */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-plate-yellow font-medium text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 fill-plate-yellow text-asphalt shrink-0" />
              <span>COMPATIBILITY FILTER ACTIVE</span>
            </div>
            <p className="text-xs text-steel">
              Showing parts, mods & electronics matching{" "}
              <strong className="text-off-white font-semibold">{bikeDisplayName}</strong>
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onOpenBikeModal}
            className="flex items-center gap-1.5 bg-asphalt hover:bg-asphalt/80 border border-steel/40 text-off-white px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-plate-yellow" />
            <span>Change Bike</span>
          </button>
          <button
            onClick={onClearBike}
            className="p-1.5 text-steel hover:text-ignition-red transition-colors"
            title="Clear bike filter"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
