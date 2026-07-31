import React from "react";
import { Truck, ShieldCheck, Smartphone } from "lucide-react";

export default function UtilityBar() {
  return (
    <div className="bg-asphalt-2 border-b border-asphalt-2 text-steel text-xs py-2 px-4">
      <div className="max-w-7xl mx-mx-auto flex flex-wrap justify-between items-center gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 overflow-x-auto py-0.5 no-scrollbar">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Truck className="w-3.5 h-3.5 text-plate-yellow" />
            <strong className="text-off-white font-medium">Nationwide Cash on Delivery</strong> (Tk 60 Dhaka / Tk 130 Outside)
          </span>
          <span className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
            <Smartphone className="w-3.5 h-3.5 text-plate-yellow" />
            Mobile Banking Support (bKash, Nagad, Rocket, BanglaQR)
          </span>
          <span className="hidden lg:flex items-center gap-1.5 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-ignition-red" />
            100% Genuine Owned Inventory — No Dropshipping
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-plate-yellow font-semibold">HOTLINE: 09612-BIKERS</span>
          <span className="text-steel">BD Marketplace</span>
        </div>
      </div>
    </div>
  );
}
