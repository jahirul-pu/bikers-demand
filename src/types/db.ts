/**
 * Bikers Demand — Core Data Models & Types
 * Shared TypeScript interfaces for products, bikes, orders, coupons, and claims.
 */

export interface DBProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: "helmets" | "parts" | "accessories" | "parts-mods" | "electronics" | "additives" | "riding-gear";
  price: number;
  originalPrice?: number;
  imageUrl: string;
  fitBadge?: string;
  isUniversal?: boolean;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  stockQty: number;
  certification?: string;
  warranty?: string;
  description?: string;
  sizes?: string[];
  specifications?: string[];
}

export interface DBBike {
  id: string;
  brand: string;
  model: string;
  yearStart?: number;
  yearEnd?: number;
  displacementCc?: number;
  slug: string;
}

export interface DBOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  status: "PLACED" | "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  subtotal?: number;
  deliveryCharge?: number;
  couponCode?: string;
  discountAmount?: number;
  totalAmount: number;
  itemsCount: number;
  createdAt: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface DBCoupon {
  id: string;
  code: string;
  discountType: "FLAT" | "PERCENTAGE";
  discountValue: number;
  minOrder: number;
  categoryTarget: "ALL" | "helmets" | "parts-mods" | "electronics" | "additives" | "riding-gear";
  isActive: boolean;
  createdAt: string;
}

export interface DBClaim {
  id: string;
  claimNumber: string;
  orderId: string;
  customerName: string;
  type: "WRONG_ITEM" | "COUNTERFEIT" | "DAMAGED";
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason: string;
  evidenceFiles: string[];
  createdAt: string;
}
