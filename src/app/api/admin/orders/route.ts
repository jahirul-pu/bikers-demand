import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

// GET list of all orders with optional status filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as OrderStatus | null;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, phone: true, email: true } },
        address: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("Admin order fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin orders" },
      { status: 500 }
    );
  }
}

// PATCH update order status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, paymentStatus, notes } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "orderId is required" },
        { status: 400 }
      );
    }

    const data: any = {};
    if (status) data.status = status as OrderStatus;
    if (paymentStatus) data.paymentStatus = paymentStatus as PaymentStatus;
    if (notes !== undefined) data.notes = notes;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data,
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error("Admin order status update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
