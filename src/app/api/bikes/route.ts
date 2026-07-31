import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bikeModels = await prisma.bikeModel.findMany({
      orderBy: [{ brand: "asc" }, { model: "asc" }],
    });

    // Group by Brand -> Model -> Variants
    const grouped: Record<
      string,
      { model: string; variants: { id: string; variant: string | null; cc: number }[] }[]
    > = {};

    for (const bike of bikeModels) {
      if (!grouped[bike.brand]) {
        grouped[bike.brand] = [];
      }

      let modelObj = grouped[bike.brand].find((m) => m.model === bike.model);
      if (!modelObj) {
        modelObj = { model: bike.model, variants: [] };
        grouped[bike.brand].push(modelObj);
      }

      modelObj.variants.push({
        id: bike.id,
        variant: bike.variant,
        cc: bike.cc,
      });
    }

    return NextResponse.json({ success: true, data: grouped });
  } catch (error) {
    console.error("Error fetching bike models:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bike registry" },
      { status: 500 }
    );
  }
}
