import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentMethod, PaymentStatus, OrderStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      phone,
      email,
      addressLine,
      city = "Dhaka",
      isInsideDhaka = true, // Tk 60 inside Dhaka, Tk 130 outside Dhaka
      paymentMethod = PaymentMethod.COD,
      items, // array of { productId, quantity, price, size }
      notes,
    } = body;

    if (!phone || !addressLine || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required checkout fields" },
        { status: 400 }
      );
    }

    // Dynamic delivery charge calculation per PRD 4.4
    const deliveryCharge = isInsideDhaka ? 60 : 130;

    // Calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    const total = subtotal + deliveryCharge;
    const orderNumber = `BD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create address & order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Find or create customer
      let user = await tx.user.findUnique({ where: { phone } });
      if (!user) {
        user = await tx.user.create({
          data: {
            name: customerName || "Guest Rider",
            phone,
            email: email || null,
            passwordHash: "$2a$10$guestpasswordhash",
          },
        });
      }

      const address = await tx.address.create({
        data: {
          userId: user.id,
          label: "Delivery Address",
          line1: addressLine,
          city,
          district: city,
          isInsideDhaka,
          phone,
        },
      });

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          addressId: address.id,
          status: OrderStatus.PLACED,
          paymentMethod,
          paymentStatus: PaymentStatus.UNPAID,
          subtotal,
          deliveryCharge,
          total,
          notes: notes || null,
          items: {
            create: items.map((i: any) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.price,
              size: i.size || null,
            })),
          },
        },
        include: {
          items: {
            include: { product: true },
          },
          address: true,
        },
      });

      // Atomic inventory decrement for owned stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQty: { decrement: item.quantity },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        deliveryCharge: order.deliveryCharge,
        status: order.status,
        message: "Order placed successfully. Confirmation call/SMS will follow.",
      },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place order" },
      { status: 500 }
    );
  }
}
