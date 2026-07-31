import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FALLBACK_BIKES: Record<
  string,
  { model: string; variants: { id: string; variant: string | null; cc: number }[] }[]
> = {
  Yamaha: [
    { model: "FZS-Fi", variants: [{ id: "b1", variant: "v3", cc: 149 }, { id: "b2", variant: "v2", cc: 149 }] },
    { model: "R15", variants: [{ id: "b3", variant: "v4", cc: 155 }, { id: "b4", variant: "v3", cc: 155 }] },
    { model: "MT-15", variants: [{ id: "b5", variant: "v2", cc: 155 }] },
  ],
  Honda: [
    { model: "CB Hornet", variants: [{ id: "b6", variant: "160R ABS", cc: 162 }] },
    { model: "CBR", variants: [{ id: "b7", variant: "150R Tricolor", cc: 149 }] },
    { model: "XBlade", variants: [{ id: "b8", variant: "160 Dual Disc", cc: 162 }] },
  ],
  Suzuki: [
    { model: "Gixxer", variants: [{ id: "b9", variant: "155 FI ABS", cc: 155 }] },
    { model: "GSX-R150", variants: [{ id: "b10", variant: "Keyless ABS", cc: 147 }] },
  ],
  Bajaj: [
    { model: "Pulsar N160", variants: [{ id: "b11", variant: "Dual Channel ABS", cc: 164 }] },
    { model: "Pulsar NS160", variants: [{ id: "b12", variant: "FI ABS", cc: 160 }] },
  ],
  TVS: [
    { model: "Apache RTR 160 4V", variants: [{ id: "b13", variant: "Special Edition ABS", cc: 159 }] },
    { model: "Raider 125", variants: [{ id: "b14", variant: "Disc", cc: 124 }] },
  ],
};

export async function GET() {
  try {
    const bikeModels = await prisma.bikeModel.findMany({
      orderBy: [{ brand: "asc" }, { model: "asc" }],
    });

    if (bikeModels.length === 0) {
      return NextResponse.json({ success: true, data: FALLBACK_BIKES });
    }

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
    console.warn("DB offline, serving fallback bike registry:", error);
    return NextResponse.json({ success: true, data: FALLBACK_BIKES });
  }
}
