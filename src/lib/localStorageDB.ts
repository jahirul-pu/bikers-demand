/**
 * Bikers Demand — Unified Client LocalStorage DB Manager
 * Stores all store entities (Products, Bikes, Orders, Claims, Garage, Cart, Wishlist)
 * in localStorage so data changes persist locally across client sessions.
 */

export interface DBProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: "riding-gear" | "parts-mods" | "electronics" | "merchandise" | "additives";
  price: number;
  originalPrice?: number;
  imageUrl: string;
  fitBadge?: string;
  isUniversal?: boolean;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  stockQty: number;
  certification?: string; // DOT / ECE
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
  categoryTarget: "ALL" | "riding-gear" | "parts-mods" | "electronics" | "merchandise";
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

const STORAGE_KEYS = {
  PRODUCTS: "bd_db_products",
  BIKES: "bd_db_bikes",
  ORDERS: "bd_db_orders",
  CLAIMS: "bd_db_claims",
  GARAGE: "bd_db_garage",
  WISHLIST: "bikers_demand_favs",
  CART: "bikers_demand_cart",
  USER: "bikers_demand_user",
  COUPONS: "bd_db_coupons",
};

const INITIAL_COUPONS: DBCoupon[] = [
  {
    id: "cp-1",
    code: "BIKERS500",
    discountType: "FLAT",
    discountValue: 500,
    minOrder: 3000,
    categoryTarget: "ALL",
    isActive: true,
    createdAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "cp-2",
    code: "RIDER10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrder: 2000,
    categoryTarget: "ALL",
    isActive: true,
    createdAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "cp-3",
    code: "GEAR15",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minOrder: 4000,
    categoryTarget: "riding-gear",
    isActive: true,
    createdAt: "2026-08-01T00:00:00Z",
  },
];

// Initial Seed Dataset for Local DB if completely empty
const INITIAL_PRODUCTS: DBProduct[] = [
  {
    id: "gear-1",
    sku: "GEAR-MT-001",
    name: "MT Thunder 4 SV Full Face Helmet (Matt Black)",
    slug: "mt-thunder-4-sv-full-face-helmet-matt-black",
    brand: "MT Helmets",
    category: "riding-gear",
    price: 9800,
    originalPrice: 10500,
    imageUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&auto=format&fit=crop&q=80",
    isUniversal: true,
    stockStatus: "in-stock",
    stockQty: 9,
    certification: "ECE 22.06 / DOT",
    warranty: "1 Year Warranty",
    description: "ECE 22.06 & DOT certified full face riding helmet with drop-down sun visor.",
  },
  {
    id: "prod-1",
    sku: "PARTS-EXH-001",
    name: "Performance Slip-On Racing Exhaust (Black Coated Stainless Steel)",
    slug: "performance-slip-on-racing-exhaust-black",
    brand: "Akrapovič Replica",
    category: "parts-mods",
    price: 6500,
    originalPrice: 7200,
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
    fitBadge: "Fits Yamaha FZS-Fi v3",
    isUniversal: false,
    stockStatus: "in-stock",
    stockQty: 14,
    warranty: "No Warranty",
    description: "High flow slip-on exhaust muffler for 150-160cc street engines.",
  },
  {
    id: "elec-1",
    sku: "ELEC-FOG-001",
    name: "Dual Lens LED Fog Light Kit with Harness",
    slug: "dual-lens-led-fog-light-kit",
    brand: "Future Eye",
    category: "electronics",
    price: 2950,
    originalPrice: 3400,
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&auto=format&fit=crop&q=80",
    isUniversal: true,
    stockStatus: "in-stock",
    stockQty: 22,
    warranty: "6 Months Warranty",
    description: "High intensity dual-lens LED spot/flood fog lights for night riding.",
  },
  {
    id: "add-1",
    sku: "ADD-OIL-001",
    name: "Motul 7100 4T 10W40 100% Synthetic Engine Oil (1 Liter)",
    slug: "motul-7100-4t-10w40-synthetic-engine-oil",
    brand: "Motul",
    category: "additives",
    price: 1450,
    imageUrl: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=500&auto=format&fit=crop&q=80",
    isUniversal: true,
    stockStatus: "in-stock",
    stockQty: 40,
    warranty: "Genuine Product Guarantee",
    description: "Ester technology 100% synthetic 4-stroke engine oil for high performance motorcycles.",
  },
  {
    id: "merch-1",
    sku: "MERCH-BAG-001",
    name: "Hard Shell Aerodynamic Riding Backpack (Waterproof 30L)",
    slug: "hard-shell-aerodynamic-riding-backpack",
    brand: "Bikers Demand",
    category: "merchandise",
    price: 3800,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    isUniversal: true,
    stockStatus: "in-stock",
    stockQty: 15,
    warranty: "6 Months Warranty",
    description: "Wind-resistant carbon-fiber textured hard shell riding backpack.",
  },
];

const INITIAL_BIKES: DBBike[] = [
  { id: "bike-1", brand: "Yamaha", model: "FZS-Fi v3", yearStart: 2019, yearEnd: 2026, displacementCc: 149, slug: "yamaha-fzs-fi-v3" },
  { id: "bike-2", brand: "Yamaha", model: "R15 V4", yearStart: 2021, yearEnd: 2026, displacementCc: 155, slug: "yamaha-r15-v4" },
  { id: "bike-3", brand: "Honda", model: "CBR 150R", yearStart: 2021, yearEnd: 2026, displacementCc: 149, slug: "honda-cbr-150r" },
  { id: "bike-4", brand: "TVS", model: "Apache RTR 160 4V", yearStart: 2018, yearEnd: 2026, displacementCc: 159, slug: "tvs-apache-rtr-160-4v" },
  { id: "bike-5", brand: "Bajaj", model: "Pulsar N160", yearStart: 2022, yearEnd: 2026, displacementCc: 165, slug: "bajaj-pulsar-n160" },
];

const INITIAL_ORDERS: DBOrder[] = [];

export const LocalStorageDB = {
  // Initialize LocalStorage DB
  init() {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BIKES)) {
      localStorage.setItem(STORAGE_KEYS.BIKES, JSON.stringify(INITIAL_BIKES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
    }
  },

  // Products
  getProducts(): DBProduct[] {
    if (typeof window === "undefined") return INITIAL_PRODUCTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: DBProduct[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event("storage"));
  },

  addProduct(prod: DBProduct) {
    const list = this.getProducts();
    list.unshift(prod);
    this.saveProducts(list);
  },

  deleteProduct(id: string) {
    const list = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(list);
  },

  updateProduct(id: string, updated: Partial<DBProduct>) {
    const list = this.getProducts().map((p) =>
      p.id === id ? { ...p, ...updated } : p
    );
    this.saveProducts(list);
  },

  // Bikes
  getBikes(): DBBike[] {
    if (typeof window === "undefined") return INITIAL_BIKES;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BIKES);
      return raw ? JSON.parse(raw) : INITIAL_BIKES;
    } catch (e) {
      return INITIAL_BIKES;
    }
  },

  saveBikes(bikes: DBBike[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.BIKES, JSON.stringify(bikes));
    window.dispatchEvent(new Event("storage"));
  },

  addBike(bike: DBBike) {
    const list = this.getBikes();
    list.unshift(bike);
    this.saveBikes(list);
  },

  deleteBike(id: string) {
    const list = this.getBikes().filter((b) => b.id !== id);
    this.saveBikes(list);
  },

  updateBike(id: string, updatedFields: Partial<DBBike>) {
    const list = this.getBikes().map((b) =>
      b.id === id ? { ...b, ...updatedFields } : b
    );
    this.saveBikes(list);
  },

  // Coupons
  getCoupons(): DBCoupon[] {
    if (typeof window === "undefined") return INITIAL_COUPONS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COUPONS);
      return raw ? JSON.parse(raw) : INITIAL_COUPONS;
    } catch (e) {
      return INITIAL_COUPONS;
    }
  },

  saveCoupons(coupons: DBCoupon[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    window.dispatchEvent(new Event("storage"));
  },

  addCoupon(coupon: DBCoupon) {
    const list = this.getCoupons();
    list.unshift(coupon);
    this.saveCoupons(list);
  },

  updateCoupon(id: string, updatedFields: Partial<DBCoupon>) {
    const list = this.getCoupons().map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
    this.saveCoupons(list);
  },

  deleteCoupon(id: string) {
    const list = this.getCoupons().filter((c) => c.id !== id);
    this.saveCoupons(list);
  },

  // Orders
  getOrders(): DBOrder[] {
    if (typeof window === "undefined") return INITIAL_ORDERS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return raw ? JSON.parse(raw) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  },

  addOrder(order: DBOrder) {
    const list = this.getOrders();
    list.unshift(order);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));
    }
  },

  updateOrderStatus(orderId: string, status: DBOrder["status"]) {
    const list = this.getOrders().map((o) => (o.id === orderId ? { ...o, status } : o));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));
    }
  },

  // User Garage
  getUserGarage(): DBBike[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GARAGE);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  saveUserGarage(bikes: DBBike[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.GARAGE, JSON.stringify(bikes));
  },
};
