/**
 * Bikers Demand — Core Data Models & Types
 * Shared TypeScript interfaces for products, bikes, orders, and coupons.
 */

export interface DBProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subCategory?: string;
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
  specs?: Record<string, any>;
  bikeModelIds?: string[];
  specifications?: string[];
}

export interface DBBike {
  id: string;
  brand: string;
  model: string;
  variant?: string | null;
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
  paymentMethod?: string;
  paymentStatus?: "UNPAID" | "PAID";
  itemsCount: number;
  createdAt: string;
  items?: any[];
}

export interface DBCoupon {
  id: string;
  code: string;
  discountType: "FLAT" | "PERCENT" | "PERCENTAGE";
  discountValue: number;
  minOrder: number;
  categoryTarget: string;
  isActive: boolean;
}
