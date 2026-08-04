import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    const data = await Promise.all(
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

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching admin brands:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, logoUrl, website, country, flag, description, isFeatured, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Brand name is required" },
        { status: 400 }
      );
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await prisma.brand.findUnique({
      where: { slug: generatedSlug },
    });

    const finalSlug = existing ? `${generatedSlug}-${Date.now().toString().slice(-4)}` : generatedSlug;

    let order = Number(sortOrder);
    if (isNaN(order)) {
      order = await prisma.brand.count();
    }

    const created = await prisma.brand.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        logoUrl: logoUrl?.trim() || null,
        website: website?.trim() || null,
        country: country?.trim() || null,
        flag: flag?.trim() || null,
        description: description?.trim() || null,
        isFeatured: Boolean(isFeatured),
        sortOrder: order,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create brand" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    // Batch Reorder handler
    if (body.action === "reorder" && Array.isArray(body.items)) {
      for (const item of body.items) {
        await prisma.brand.update({
          where: { id: item.id },
          data: { sortOrder: Number(item.sortOrder) },
        });
      }
      return NextResponse.json({ success: true });
    }

    const { id, name, slug, logoUrl, website, country, flag, description, isFeatured, sortOrder } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Brand ID is required" },
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
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl ? logoUrl.trim() : null;
    if (website !== undefined) updateData.website = website ? website.trim() : null;
    if (country !== undefined) updateData.country = country ? country.trim() : null;
    if (flag !== undefined) updateData.flag = flag ? flag.trim() : null;
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);

    const updated = await prisma.brand.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update brand" },
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
        { success: false, error: "Brand ID is required" },
        { status: 400 }
      );
    }

    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete brand" },
      { status: 500 }
    );
  }
}
