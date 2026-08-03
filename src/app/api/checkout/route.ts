import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentMethod, PaymentStatus, OrderStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName = "Guest Rider",
      phone,
      email,
      addressLine,
      city = "Dhaka",
      isInsideDhaka = true,
      paymentMethod = "COD",
      items = [],
      notes,
    } = body;

    if (!phone || !addressLine) {
      return NextResponse.json(
        { success: false, error: "Missing required checkout fields (phone & address)" },
        { status: 400 }
      );
    }

    const deliveryCharge = isInsideDhaka ? 60 : 130;
    let subtotal = 0;
    for (const item of items) {
      subtotal += (item.price || 0) * (item.quantity || 1);
    }
    const total = subtotal + deliveryCharge;
    const orderNumber = `BD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Try database transaction
    try {
      const order = await prisma.$transaction(async (tx) => {
        let user = await tx.user.findUnique({ where: { phone } });
        if (!user) {
          user = await tx.user.create({
            data: {
              name: customerName,
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

        const createdOrder = await tx.order.create({
          data: {
            orderNumber,
            userId: user.id,
            addressId: address.id,
            status: OrderStatus.PLACED,
            paymentMethod: paymentMethod as PaymentMethod,
            paymentStatus: PaymentStatus.UNPAID,
            subtotal,
            deliveryCharge,
            total,
            notes: notes || null,
          },
        });

        for (const item of items) {
          if (item.id) {
            const existingProd = await tx.product.findUnique({ where: { id: item.id } });
            if (existingProd) {
              await tx.orderItem.create({
                data: {
                  orderId: createdOrder.id,
                  productId: existingProd.id,
                  quantity: item.quantity || 1,
                  unitPrice: item.price || existingProd.price,
                  size: item.size || null,
                },
              });
            }
          }
        }

        return createdOrder;
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
    } catch (dbError: any) {
      console.error("Database order placement error:", dbError);
      return NextResponse.json(
        { success: false, error: dbError.message || "Failed to place order in database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place order" },
      { status: 500 }
    );
  }
}
