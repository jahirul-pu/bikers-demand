import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSessionFromRequest } from "@/lib/customerAuth";
import { ADMIN_SESSION_COOKIE, getSessionSecret, verifySessionToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");

    // 1. Check if an admin is logged in
    const adminSecret = getSessionSecret();
    const adminCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isAdmin = adminSecret && adminCookie ? await verifySessionToken(adminCookie, adminSecret) : null;

    // 2. Check if a customer is logged in
    const customerSession = getCustomerSessionFromRequest(request);

    // Scenario A: Admin request
    if (isAdmin) {
      if (id || orderNumber) {
        const order = await prisma.order.findFirst({
          where: {
            OR: [
              ...(id ? [{ id }] : []),
              ...(orderNumber ? [{ orderNumber }] : []),
            ],
          },
          include: {
            items: { include: { product: true } },
            address: true,
          },
        });
        if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: order });
      }

      if (phone) {
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) return NextResponse.json({ success: true, data: [] });
        const orders = await prisma.order.findMany({
          where: { userId: user.id },
          include: {
            items: { include: { product: true } },
            address: true,
          },
          orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ success: true, data: orders });
      }

      // Return recent orders for admin
      const allOrders = await prisma.order.findMany({
        include: {
          items: { include: { product: true } },
          address: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      return NextResponse.json({ success: true, data: allOrders });
    }

    // Scenario B: Authenticated Customer
    if (customerSession) {
      if (id || orderNumber) {
        const order = await prisma.order.findFirst({
          where: {
            userId: customerSession.userId,
            OR: [
              ...(id ? [{ id }] : []),
              ...(orderNumber ? [{ orderNumber }] : []),
            ],
          },
          include: {
            items: { include: { product: true } },
            address: true,
          },
        });
        if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: order });
      }

      // Customer fetching their own order history
      const orders = await prisma.order.findMany({
        where: { userId: customerSession.userId },
        include: {
          items: { include: { product: true } },
          address: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, data: orders });
    }

    // Scenario C: Unauthenticated Guest Tracking
    // Must provide BOTH (id or orderNumber) AND matching phone number to prevent order harvesting
    if ((id || orderNumber) && phone) {
      const cleanPhone = phone.trim();
      const order = await prisma.order.findFirst({
        where: {
          address: {
            phone: cleanPhone,
          },
          OR: [
            ...(id ? [{ id }] : []),
            ...(orderNumber ? [{ orderNumber: orderNumber.trim() }] : []),
          ],
        },
        include: {
          items: { include: { product: true } },
          address: true,
        },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: "No order found matching the provided order number and phone number." },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: order });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Authentication required to view order history. For guest tracking, please provide both orderNumber and phone.",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error in orders API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}
