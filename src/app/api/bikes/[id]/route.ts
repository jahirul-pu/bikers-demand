import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { brand, model, variant, cc } = body;

    const updated = await prisma.bikeModel.update({
      where: { id },
      data: {
        ...(brand && { brand: brand.trim() }),
        ...(model && { model: model.trim() }),
        ...(variant !== undefined && { variant: variant ? variant.trim() : null }),
        ...(cc !== undefined && { cc: Number(cc) }),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        brand: updated.brand,
        model: updated.model,
        variant: updated.variant,
        displacementCc: updated.cc,
        slug: `${updated.brand}-${updated.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      },
    });
  } catch (error: any) {
    console.error("Error updating bike model in DB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update bike model" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.bikeModel.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Bike model deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting bike model in DB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete bike model" },
      { status: 500 }
    );
  }
}
