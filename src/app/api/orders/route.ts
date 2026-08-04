import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const orderNumber = searchParams.get("orderNumber");

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: { product: true },
          },
          address: true,
        },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: order });
    }

    if (phone) {
      const user = await prisma.user.findUnique({ where: { phone } });
      if (!user) {
        return NextResponse.json({ success: true, data: [] });
      }

      const orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: {
          items: {
            include: { product: true },
          },
          address: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ success: true, data: orders });
    }

    return NextResponse.json(
      { success: false, error: "Missing search filter (orderNumber or phone)" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching order status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
