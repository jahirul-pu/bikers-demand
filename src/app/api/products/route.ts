import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FALLBACK_PRODUCTS = [
  {
    id: "prod-1",
    sku: "PARTS-EXH-001",
    name: "Performance Slip-On Racing Exhaust (Black Coated)",
    slug: "performance-slip-on-racing-exhaust-black",
    description: "High-flow stainless steel racing exhaust muffler designed for 150-160cc street bikes.",
    brand: "Akrapovič Replica",
    price: 6500,
    comparePrice: 7200,
    stockQty: 14,
    stockStatus: "IN_STOCK",
    category: { slug: "parts-mods", name: "Parts & Mods" },
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80"],
    isUniversal: false,
    certification: "NONE",
    warrantyFlag: false,
    warrantyDuration: "No Warranty",
  },
  {
    id: "prod-2",
    sku: "PARTS-CHN-002",
    name: "O-Ring Heavy Duty Chain & Sprocket Set (428H - 132L)",
    slug: "o-ring-heavy-duty-chain-sprocket-set-428h",
    description: "JIS certified hardened steel front sprocket, rear sprocket, and gold O-Ring chain.",
    brand: "DID Japan",
    price: 3450,
    comparePrice: null,
    stockQty: 8,
    stockStatus: "IN_STOCK",
    category: { slug: "parts-mods", name: "Parts & Mods" },
    images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=80"],
    isUniversal: false,
    certification: "NONE",
    warrantyFlag: false,
    warrantyDuration: "No Warranty",
  },
  {
    id: "prod-4",
    sku: "ELEC-FOG-004",
    name: "Dual Lens High Power LED Fog Lights with Bracket & Relay Wire",
    slug: "dual-lens-high-power-led-fog-lights",
    description: "40W dual beam waterproof IP67 LED fog lamps with wiring harness.",
    brand: "Future Eye",
    price: 2950,
    comparePrice: null,
    stockQty: 22,
    stockStatus: "IN_STOCK",
    category: { slug: "electronics", name: "Electronics" },
    images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop&q=80"],
    isUniversal: true,
    certification: "NONE",
    warrantyFlag: true,
    warrantyDuration: "6 Months Replacement",
  },
  {
    id: "prod-5",
    sku: "GEAR-HLM-005",
    name: "MT Thunder 4 SV Full Face Helmet (Matt Black)",
    slug: "mt-thunder-4-sv-full-face-helmet-matt-black",
    description: "ECE 22.06 & DOT certified polycarbonate full-face helmet with drop-down sun visor.",
    brand: "MT Helmets",
    price: 9800,
    comparePrice: 10500,
    stockQty: 9,
    stockStatus: "IN_STOCK",
    category: { slug: "riding-gear", name: "Riding Gear" },
    images: ["https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&auto=format&fit=crop&q=80"],
    isUniversal: true,
    certification: "ECE_2206",
    warrantyFlag: true,
    warrantyDuration: "1 Year Manufacturer Warranty",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");

    const where: any = { isActive: true };
    if (categorySlug) where.category = { slug: categorySlug };
    if (brand && brand !== "all") where.brand = { equals: brand, mode: "insensitive" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    if (products.length === 0) {
      return NextResponse.json({ success: true, count: FALLBACK_PRODUCTS.length, data: FALLBACK_PRODUCTS });
    }

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.warn("DB offline, serving fallback products:", error);
    return NextResponse.json({ success: true, count: FALLBACK_PRODUCTS.length, data: FALLBACK_PRODUCTS });
  }
}
