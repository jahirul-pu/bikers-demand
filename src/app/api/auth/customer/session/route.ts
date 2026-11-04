import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSessionFromRequest } from "@/lib/customerAuth";

export async function GET(req: NextRequest) {
  try {
    const session = getCustomerSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        garageBikes: {
          include: {
            bikeModel: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Session lookup error:", error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
