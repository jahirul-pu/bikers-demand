import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal = 0, cartItems = [] } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, valid: false, error: "Coupon code is required." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { success: false, valid: false, error: `Invalid or expired coupon code '${cleanCode}'.` },
        { status: 404 }
      );
    }

    const currentSubtotal = Math.max(0, Number(subtotal) || 0);

    // Calculate eligible subtotal based on categoryTarget
    let eligibleSubtotal = currentSubtotal;
    if (coupon.categoryTarget && coupon.categoryTarget !== "ALL") {
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        const eligibleItems = cartItems.filter(
          (item: any) =>
            item.category === coupon.categoryTarget ||
            (typeof item.category === "object" && item.category?.slug === coupon.categoryTarget)
        );
        if (eligibleItems.length === 0) {
          return NextResponse.json(
            {
              success: false,
              valid: false,
              categoryTarget: coupon.categoryTarget,
              minOrder: coupon.minOrder,
              error: `Coupon '${cleanCode}' is only valid for ${coupon.categoryTarget} products.`,
            },
            { status: 400 }
          );
        }
        eligibleSubtotal = eligibleItems.reduce(
          (sum: number, i: any) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1),
          0
        );
      }
    }

    if (coupon.minOrder > 0 && eligibleSubtotal < coupon.minOrder) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          categoryTarget: coupon.categoryTarget,
          minOrder: coupon.minOrder,
          eligibleSubtotal,
          error: `Coupon '${cleanCode}' requires a minimum spend of ৳${coupon.minOrder.toLocaleString("en-BD")}.`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENT" || coupon.discountType === "PERCENTAGE") {
      discountAmount = Math.round((eligibleSubtotal * coupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(eligibleSubtotal, coupon.discountValue);
    }

    return NextResponse.json({
      success: true,
      valid: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrder: coupon.minOrder,
        categoryTarget: coupon.categoryTarget,
        discountAmount,
        message: `Coupon '${cleanCode}' applied: ৳${discountAmount.toLocaleString("en-BD")} discount.`,
      },
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { success: false, valid: false, error: "Failed to validate coupon." },
      { status: 500 }
    );
  }
}
