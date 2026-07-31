import React from "react";

// Official bKash Logo (bKash Pink #E2136E + Official Origami Bird & Wordmark)
export function BkashLogo({ className = "h-7" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center bg-white px-2.5 py-1 rounded border border-gray-200 shadow-xs ${className}`}>
      <svg className="h-5 w-auto" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Origami Bird Icon */}
        <path d="M35 5L10 22L24 28L35 5Z" fill="#E2136E" />
        <path d="M35 5L24 28L37 32L35 5Z" fill="#B30F55" />
        <path d="M35 5L37 32L45 15L35 5Z" fill="#E2136E" />
        <path d="M24 28L15 45L37 32L24 28Z" fill="#E2136E" />
        {/* bKash Wordmark */}
        <text x="52" y="32" fontFamily="sans-serif" fontWeight="900" fontSize="24" fill="#E2136E" letterSpacing="-0.5">
          bKash
        </text>
      </svg>
    </div>
  );
}

// Official Nagad Logo (Nagad Orange #F7921E & Flame Red #D12027)
export function NagadLogo({ className = "h-7" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center bg-white px-2.5 py-1 rounded border border-gray-200 shadow-xs ${className}`}>
      <svg className="h-5 w-auto" viewBox="0 0 150 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Nagad Swirl Motif */}
        <path d="M12 25C12 16.7 18.7 10 27 10C35.3 10 42 16.7 42 25C42 33.3 35.3 40 27 40C22 40 12 34 12 25Z" fill="#F7921E" />
        <path d="M20 25C20 21.1 23.1 18 27 18C30.9 18 34 21.1 34 25C34 28.9 30.9 32 27 32C24 32 20 29 20 25Z" fill="#D12027" />
        {/* Nagad English Wordmark */}
        <text x="48" y="33" fontFamily="sans-serif" fontWeight="800" fontSize="22" fill="#F7921E">
          nagad
        </text>
      </svg>
    </div>
  );
}

// Official Dutch-Bangla Rocket Logo (Rocket Purple #8C3494)
export function RocketLogo({ className = "h-7" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center bg-[#8C3494] px-3 py-1 rounded border border-[#712778] shadow-xs ${className}`}>
      <svg className="h-5 w-auto" viewBox="0 0 140 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Rocket Icon */}
        <path d="M18 8C18 8 10 14 10 22C10 26 13 29 18 29C23 29 26 26 26 22C26 14 18 8 18 8Z" fill="#FFFFFF" />
        <path d="M14 31C12 34 10 38 10 38H26C26 38 24 34 22 31H14Z" fill="#FFC20E" />
        {/* Rocket Text */}
        <text x="34" y="28" fontFamily="sans-serif" fontWeight="800" fontSize="20" fill="#FFFFFF" fontStyle="italic">
          rocket
        </text>
      </svg>
    </div>
  );
}

// Official Cash on Delivery (COD) Badge
export function CodLogo({ className = "h-7" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center bg-[#E8B93A] text-[#15171A] px-3 py-1 rounded border border-[#15171A] font-mono font-extrabold text-xs shadow-xs ${className}`}>
      <svg className="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V8h16v10zm-6-5c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
      </svg>
      <span>CASH ON DELIVERY</span>
    </div>
  );
}

// Official BanglaQR Logo (Bangladesh Bank National Standard Green #00A651)
export function BanglaQrLogo({ className = "h-7" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center bg-white px-2.5 py-1 rounded border border-gray-200 shadow-xs ${className}`}>
      <svg className="h-5 w-auto" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Green Outer Ring */}
        <rect x="5" y="8" width="34" height="34" rx="4" fill="#00A651" />
        {/* Red Center Spot */}
        <circle cx="22" cy="25" r="7" fill="#ED1C24" />
        {/* QR Pattern elements */}
        <rect x="10" y="13" width="6" height="6" fill="#FFFFFF" />
        <rect x="28" y="13" width="6" height="6" fill="#FFFFFF" />
        <rect x="10" y="31" width="6" height="6" fill="#FFFFFF" />
        {/* BanglaQR Typography */}
        <text x="46" y="31" fontFamily="sans-serif" fontWeight="900" fontSize="19" fill="#00A651">
          বাংলা<tspan fill="#ED1C24">QR</tspan>
        </text>
      </svg>
    </div>
  );
}

export default function PaymentLogos() {
  return (
    <div className="flex flex-wrap gap-2.5 items-center my-1">
      <CodLogo />
      <BkashLogo />
      <NagadLogo />
      <RocketLogo />
      <BanglaQrLogo />
    </div>
  );
}
