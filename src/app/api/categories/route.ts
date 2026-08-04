import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const childrenWithCounts = await Promise.all(
          cat.children.map(async (child) => {
            const count = await prisma.product.count({
              where: {
                isActive: true,
                OR: [
                  { categoryId: child.id },
                  { subCategory: { equals: child.slug, mode: "insensitive" } },
                  { subCategory: { equals: child.name, mode: "insensitive" } },
                ],
              },
            });
            return {
              ...child,
              _count: { products: count },
            };
          })
        );

        const parentCount = await prisma.product.count({
          where: {
            isActive: true,
            OR: [
              { categoryId: cat.id },
              { category: { slug: cat.slug } },
            ],
          },
        });

        return {
          ...cat,
          children: childrenWithCounts,
          _count: { products: parentCount },
        };
      })
    );

    return NextResponse.json({ success: true, data: categoriesWithCounts });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
