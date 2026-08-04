import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const subCategory = searchParams.get("subCategory") || searchParams.get("sub");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");

    const where: any = { isActive: true };
    if (categorySlug) where.category = { slug: categorySlug };
    if (subCategory && subCategory !== "all") {
      where.subCategory = { equals: subCategory, mode: "insensitive" };
    }
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

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error("Error fetching products from DB:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products", data: [] },
      { status: 500 }
    );
  }
}

function mapCert(c?: string): "DOT" | "ECE_2206" | "ECE_2205" | "DOT_AND_ECE" | "NONE" {
  if (!c) return "NONE";
  const upper = c.toUpperCase();
  if (upper.includes("22.06") || upper.includes("2206")) return "ECE_2206";
  if (upper.includes("22.05") || upper.includes("2205")) return "ECE_2205";
  if (upper.includes("DOT") && upper.includes("ECE")) return "DOT_AND_ECE";
  if (upper.includes("DOT")) return "DOT";
  return "NONE";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, brand, sku, price, comparePrice, stockQty, stockStatus, category, subCategory, imageUrl, certification, warranty, description, sizes } = body;

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
    const qty = Number(stockQty) || 0;
    const isOut = stockStatus === "out-of-stock" || qty <= 0;

    const created = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        brand,
        sku,
        price: Number(price) || 0,
        comparePrice: comparePrice !== undefined && comparePrice !== null && comparePrice !== "" ? Number(comparePrice) : null,
        stockQty: qty,
        stockStatus: isOut ? "OUT_OF_STOCK" : "IN_STOCK",
        categoryId: catRecord.id,
        subCategory: subCategory || null,
        description: description || `Genuine ${brand} product.`,
        images: imageUrl ? [imageUrl] : [],
        sizes: Array.isArray(sizes) ? sizes : [],
        certification: mapCert(certification),
        isUniversal: true,
        warrantyDuration: warranty || "No Warranty",
        warrantyFlag: !!(warranty && warranty !== "No Warranty"),
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
    const { id, name, brand, sku, price, comparePrice, stockQty, stockStatus, category, subCategory, imageUrl, certification, warranty, description, sizes } = body;

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

    const updatedData: any = {
      ...(name && { name }),
      ...(brand && { brand }),
      ...(sku && { sku }),
      ...(price !== undefined && { price: Number(price) }),
      ...(comparePrice !== undefined && { comparePrice: comparePrice ? Number(comparePrice) : null }),
      ...(stockQty !== undefined && { stockQty: Number(stockQty) }),
      ...(categoryId && { categoryId }),
      ...(subCategory !== undefined && { subCategory: subCategory || null }),
      ...(description !== undefined && { description }),
      ...(imageUrl && { images: [imageUrl] }),
      ...(sizes && Array.isArray(sizes) && { sizes }),
      ...(certification !== undefined && { certification: mapCert(certification) }),
      ...(warranty !== undefined && {
        warrantyDuration: warranty,
        warrantyFlag: warranty !== "No Warranty",
      }),
    };

    if (stockStatus !== undefined || stockQty !== undefined) {
      const targetQty = stockQty !== undefined ? Number(stockQty) : undefined;
      const isOut = stockStatus === "out-of-stock" || (targetQty !== undefined && targetQty <= 0);
      updatedData.stockStatus = isOut ? "OUT_OF_STOCK" : "IN_STOCK";
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updatedData,
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
