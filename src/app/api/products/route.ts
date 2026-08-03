import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error("Error fetching products from DB:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products", data: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, brand, sku, price, stockQty, category, imageUrl, certification, warranty, description, sizes } = body;

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
        sizes: Array.isArray(sizes) ? sizes : [],
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
    const { id, name, brand, sku, price, stockQty, category, imageUrl, warranty, description, sizes } = body;

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
        ...(sizes && Array.isArray(sizes) && { sizes }),
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
