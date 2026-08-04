import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    // Attach live product count for each brand
    const brandsWithCounts = await Promise.all(
      brands.map(async (brand) => {
        const count = await prisma.product.count({
          where: {
            isActive: true,
            brand: { equals: brand.name, mode: "insensitive" },
          },
        });
        return { ...brand, productCount: count };
      })
    );

    return NextResponse.json({ success: true, data: brandsWithCounts });
  } catch (error: any) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
