import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try finding by slug first, then fall back to ID lookup
    let product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        compatibilities: {
          include: {
            bikeModel: true,
          },
        },
      },
    });

    if (!product) {
      // Fallback: try by ID
      product = await prisma.product.findUnique({
        where: { id: slug },
        include: {
          category: true,
          compatibilities: {
            include: {
              bikeModel: true,
            },
          },
        },
      });
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch related products in same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
    });

    return NextResponse.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
