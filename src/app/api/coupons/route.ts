import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_COUPONS = [
  {
    id: "cp-1",
    code: "BIKERS500",
    discountType: "FLAT",
    discountValue: 500,
    minOrder: 3000,
    categoryTarget: "ALL",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cp-2",
    code: "RIDER10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrder: 2000,
    categoryTarget: "ALL",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cp-3",
    code: "GEAR15",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minOrder: 4000,
    categoryTarget: "riding-gear",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (coupons.length === 0) {
      return NextResponse.json({ success: true, data: DEFAULT_COUPONS });
    }

    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    console.warn("Error fetching coupons from DB:", error);
    return NextResponse.json({ success: true, data: DEFAULT_COUPONS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, discountType, discountValue, minOrder, categoryTarget, isActive } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: "Coupon code is required" }, { status: 400 });
    }

    const created = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        discountType: discountType || "FLAT",
        discountValue: Number(discountValue) || 0,
        minOrder: Number(minOrder) || 0,
        categoryTarget: categoryTarget || "ALL",
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("Error creating coupon in DB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create coupon" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, code, discountType, discountValue, minOrder, categoryTarget, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Coupon ID is required" }, { status: 400 });
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        ...(code && { code: code.trim().toUpperCase() }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: Number(discountValue) }),
        ...(minOrder !== undefined && { minOrder: Number(minOrder) }),
        ...(categoryTarget && { categoryTarget }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating coupon in DB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Coupon ID is required" }, { status: 400 });
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Coupon deleted" });
  } catch (error: any) {
    console.error("Error deleting coupon from DB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
