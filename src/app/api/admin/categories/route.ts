import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            _count: { select: { products: true } },
          },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
        _count: { select: { products: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    console.error("Error fetching admin categories:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description, parentId, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check slug uniqueness
    const existing = await prisma.category.findUnique({
      where: { slug: generatedSlug },
    });

    const finalSlug = existing ? `${generatedSlug}-${Date.now().toString().slice(-4)}` : generatedSlug;

    let order = Number(sortOrder);
    if (isNaN(order)) {
      order = await prisma.category.count({
        where: { parentId: parentId || null },
      });
    }

    const created = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description?.trim() || null,
        sortOrder: order,
        parentId: parentId || null,
      },
      include: {
        children: true,
        parent: true,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    // Batch Reorder: body can be { action: "reorder", items: [{ id: string, sortOrder: number }] }
    if (body.action === "reorder" && Array.isArray(body.items)) {
      for (const item of body.items) {
        await prisma.category.update({
          where: { id: item.id },
          data: { sortOrder: Number(item.sortOrder) },
        });
      }
      return NextResponse.json({ success: true });
    }

    const { id, name, slug, description, sortOrder, parentId } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (slug) {
      updateData.slug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);
    if (parentId !== undefined) updateData.parentId = parentId || null;

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        children: true,
        parent: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Delete child subcategories first
    await prisma.category.deleteMany({
      where: { parentId: id },
    });

    // Delete target category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
