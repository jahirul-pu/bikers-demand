import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentMethod, PaymentStatus, OrderStatus } from "@prisma/client";
import { getCustomerSessionFromRequest } from "@/lib/customerAuth";

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
      couponCode,
      items = [],
      notes,
    } = body;

    // 1. Validate required contact and address info
    const cleanPhone = typeof phone === "string" ? phone.trim() : "";
    const cleanAddress = typeof addressLine === "string" ? addressLine.trim() : "";
    if (!cleanPhone || !cleanAddress) {
      return NextResponse.json(
        { success: false, error: "Missing required checkout fields: phone number and delivery address." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your cart is empty. Please add items before checking out." },
        { status: 400 }
      );
    }

    // 2. Identify authenticated session if present
    const session = getCustomerSessionFromRequest(request);

    // 3. Compute delivery charge per PRD 4.4 (Tk 60 inside Dhaka, Tk 130 outside Dhaka)
    const deliveryCharge = Boolean(isInsideDhaka) ? 60 : 130;

    // 4. Collision-proof order number (trillions of combinations)
    const year = new Date().getFullYear();
    const timePart = Date.now().toString(36).slice(-4).toUpperCase();
    const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `BD-${year}-${timePart}-${randPart}`;

    // 5. Execute checkout in an atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // Step A: Load and validate all requested products from database
      let calculatedSubtotal = 0;
      const verifiedItems: Array<{
        product: any;
        quantity: number;
        unitPrice: number;
        size: string | null;
      }> = [];

      for (const rawItem of items) {
        const targetId = rawItem.productId || rawItem.id;
        const targetSlug = rawItem.slug;
        const quantity = Math.max(1, Math.min(50, Math.floor(Number(rawItem.quantity) || 1)));

        let dbProduct: any = null;
        if (targetId && typeof targetId === "string") {
          dbProduct = await tx.product.findUnique({ where: { id: targetId } });
        }
        if (!dbProduct && targetSlug && typeof targetSlug === "string") {
          dbProduct = await tx.product.findUnique({ where: { slug: targetSlug } });
        }

        if (!dbProduct || !dbProduct.isActive) {
          throw new Error(
            `Item "${rawItem.name || targetSlug || targetId || "Item"}" is no longer available. Please remove it from your cart.`
          );
        }

        if (dbProduct.stockQty < quantity) {
          throw new Error(
            `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stockQty} item(s) in stock, but ${quantity} requested.`
          );
        }

        // Trust only the server database price
        const unitPrice = dbProduct.price;
        calculatedSubtotal += unitPrice * quantity;

        verifiedItems.push({
          product: dbProduct,
          quantity,
          unitPrice,
          size: typeof rawItem.size === "string" ? rawItem.size.trim() : null,
        });
      }

      // Step B: Verify coupon server-side
      let discount = 0;
      let appliedCouponCode: string | null = null;
      if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
        const cleanCoupon = couponCode.trim().toUpperCase();
        const dbCoupon = await tx.coupon.findUnique({ where: { code: cleanCoupon } });

        if (!dbCoupon || !dbCoupon.isActive) {
          throw new Error(`Coupon code "${cleanCoupon}" is invalid or expired.`);
        }

        if (calculatedSubtotal < dbCoupon.minOrder) {
          throw new Error(
            `Coupon "${cleanCoupon}" requires a minimum order amount of ৳${dbCoupon.minOrder}. Current subtotal is ৳${calculatedSubtotal}.`
          );
        }

        if (dbCoupon.discountType === "PERCENT" || dbCoupon.discountType === "PERCENTAGE") {
          discount = Math.round((calculatedSubtotal * dbCoupon.discountValue) / 100);
        } else {
          discount = Math.min(calculatedSubtotal, dbCoupon.discountValue);
        }
        appliedCouponCode = cleanCoupon;
      }

      // Step C: Calculate total
      const total = Math.max(0, calculatedSubtotal + deliveryCharge - discount);

      // Step D: Find or create user
      let userId = session?.userId;
      if (!userId) {
        let existingUser = await tx.user.findUnique({ where: { phone: cleanPhone } });
        if (!existingUser) {
          existingUser = await tx.user.create({
            data: {
              name: typeof customerName === "string" ? customerName.trim() : "Guest Rider",
              phone: cleanPhone,
              email: typeof email === "string" && email.includes("@") ? email.trim().toLowerCase() : null,
              passwordHash: "$2a$10$guestfallbackhash",
            },
          });
        }
        userId = existingUser.id;
      }

      // Step E: Create delivery address record
      const address = await tx.address.create({
        data: {
          userId,
          label: "Delivery Address",
          line1: cleanAddress,
          city: typeof city === "string" ? city.trim() : "Dhaka",
          district: typeof city === "string" ? city.trim() : "Dhaka",
          isInsideDhaka: Boolean(isInsideDhaka),
          phone: cleanPhone,
        },
      });

      // Step F: Format notes
      const formattedNotes = appliedCouponCode
        ? `Coupon: ${appliedCouponCode} (-৳${discount}). ${notes ? String(notes).trim() : ""}`.trim()
        : notes ? String(notes).trim() : null;

      // Valid payment methods
      const validPaymentMethods: PaymentMethod[] = ["COD", "BKASH", "NAGAD", "ROCKET", "BANGLAQR"];
      const resolvedPaymentMethod: PaymentMethod = validPaymentMethods.includes(paymentMethod as PaymentMethod)
        ? (paymentMethod as PaymentMethod)
        : PaymentMethod.COD;

      // Step G: Create order
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: address.id,
          status: OrderStatus.PLACED,
          paymentMethod: resolvedPaymentMethod,
          paymentStatus: PaymentStatus.UNPAID,
          subtotal: calculatedSubtotal,
          deliveryCharge,
          total,
          notes: formattedNotes,
        },
      });

      // Step H: Decrement stock atomically and record order items
      for (const item of verifiedItems) {
        const remainingStock = item.product.stockQty - item.quantity;
        const newStockStatus =
          remainingStock <= 0
            ? "OUT_OF_STOCK"
            : remainingStock <= 3
            ? "LOW_STOCK"
            : "IN_STOCK";

        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stockQty: { decrement: item.quantity },
            stockStatus: newStockStatus,
          },
        });

        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            size: item.size,
          },
        });
      }

      return {
        order: createdOrder,
        subtotal: calculatedSubtotal,
        deliveryCharge,
        discount,
        couponCode: appliedCouponCode,
        total,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: result.order.id,
        orderNumber: result.order.orderNumber,
        subtotal: result.subtotal,
        deliveryCharge: result.deliveryCharge,
        couponCode: result.couponCode,
        discountAmount: result.discount,
        total: result.total,
        status: result.order.status,
        message: "Order placed successfully! A confirmation call will follow.",
      },
    });
  } catch (err: any) {
    console.error("Checkout transaction error:", err);
    // If the error message is one of our business validations, send safe message
    const message =
      typeof err?.message === "string" && !err.message.includes("prisma") && !err.message.includes("invocation")
        ? err.message
        : "Failed to place order. Please review your cart and try again.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
