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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, brand, sku, price, stockQty, category, imageUrl, certification, warranty, description } = body;

    if (!name || !brand || !sku) {
      return NextResponse.json(
        { success: false, error: "Product name, brand, and SKU are required" },
        { status: 400 }
      );
    }

    // Ensure category exists
    const categorySlug = typeof category === "string" ? category : category?.slug || "riding-gear";
    let catRecord = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!catRecord) {
      catRecord = await prisma.category.create({
        data: {
          name: categorySlug.replace("-", " ").toUpperCase(),
          slug: categorySlug,
        },
      });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const created = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        brand,
        sku,
        price: Number(price) || 0,
        stockQty: Number(stockQty) || 0,
        categoryId: catRecord.id,
        description: description || `Genuine ${brand} product.`,
        images: imageUrl ? [imageUrl] : [],
        isUniversal: true,
        warrantyDuration: warranty || "1 Year Warranty",
        warrantyFlag: !!warranty,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("Error creating product in DB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, name, brand, sku, price, stockQty, category, imageUrl, warranty, description } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
    }

    const categorySlug = typeof category === "string" ? category : category?.slug;
    let categoryId = undefined;
    if (categorySlug) {
      let catRecord = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (!catRecord) {
        catRecord = await prisma.category.create({
          data: { name: categorySlug.replace("-", " ").toUpperCase(), slug: categorySlug },
        });
      }
      categoryId = catRecord.id;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(brand && { brand }),
        ...(sku && { sku }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stockQty !== undefined && { stockQty: Number(stockQty) }),
        ...(categoryId && { categoryId }),
        ...(description && { description }),
        ...(imageUrl && { images: [imageUrl] }),
        ...(warranty && { warrantyDuration: warranty, warrantyFlag: true }),
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating product in DB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    console.error("Error deleting product in DB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
