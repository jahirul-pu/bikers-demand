import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSessionFromRequest } from "@/lib/customerAuth";

// GET user's saved bikes (My Garage)
export async function GET(request: NextRequest) {
  try {
    const session = getCustomerSessionFromRequest(request);
    const { searchParams } = new URL(request.url);
    const phoneParam = searchParams.get("phone");

    let userId = session?.userId;

    // If no session but phone is supplied (e.g. during guest checkout/garage sync)
    if (!userId && phoneParam) {
      const user = await prisma.user.findUnique({ where: { phone: phoneParam.trim() } });
      userId = user?.id;
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required to access My Garage." },
        { status: 401 }
      );
    }

    const userBikes = await prisma.userBike.findMany({
      where: { userId },
      include: {
        bikeModel: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: userBikes });
  } catch (error) {
    console.error("Error fetching My Garage:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch garage bikes." },
      { status: 500 }
    );
  }
}

// POST add bike to My Garage
export async function POST(request: NextRequest) {
  try {
    const session = getCustomerSessionFromRequest(request);
    const body = await request.json();
    const { bikeModelId, nickname, isPrimary = false, phone } = body;

    let userId = session?.userId;
    if (!userId && phone) {
      const cleanPhone = String(phone).trim();
      let user = await prisma.user.findUnique({ where: { phone: cleanPhone } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            phone: cleanPhone,
            passwordHash: "$2a$10$guestfallbackhash",
          },
        });
      }
      userId = user.id;
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required to add bike to My Garage." },
        { status: 401 }
      );
    }

    if (!bikeModelId) {
      return NextResponse.json(
        { success: false, error: "bikeModelId is required." },
        { status: 400 }
      );
    }

    // Verify bike model exists
    const bikeModel = await prisma.bikeModel.findUnique({ where: { id: bikeModelId } });
    if (!bikeModel) {
      return NextResponse.json(
        { success: false, error: "Bike model not found in registry." },
        { status: 404 }
      );
    }

    // If making primary, unmark other garage bikes
    if (isPrimary) {
      await prisma.userBike.updateMany({
        where: { userId },
        data: { isPrimary: false },
      });
    }

    const userBike = await prisma.userBike.upsert({
      where: {
        userId_bikeModelId: {
          userId,
          bikeModelId,
        },
      },
      update: {
        nickname: nickname || undefined,
        isPrimary: Boolean(isPrimary),
      },
      create: {
        userId,
        bikeModelId,
        nickname: nickname || undefined,
        isPrimary: Boolean(isPrimary),
      },
      include: {
        bikeModel: true,
      },
    });

    return NextResponse.json({ success: true, data: userBike });
  } catch (error) {
    console.error("Error updating My Garage:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save bike to garage." },
      { status: 500 }
    );
  }
}

// DELETE remove bike from My Garage
export async function DELETE(request: NextRequest) {
  try {
    const session = getCustomerSessionFromRequest(request);
    const { searchParams } = new URL(request.url);
    const userBikeId = searchParams.get("id");
    const bikeModelId = searchParams.get("bikeModelId");

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    if (userBikeId) {
      await prisma.userBike.deleteMany({
        where: { id: userBikeId, userId: session.userId },
      });
    } else if (bikeModelId) {
      await prisma.userBike.deleteMany({
        where: { bikeModelId, userId: session.userId },
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Missing bike reference to remove." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: "Bike removed from garage." });
  } catch (error) {
    console.error("Error removing bike from garage:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove bike from garage." },
      { status: 500 }
    );
  }
}
