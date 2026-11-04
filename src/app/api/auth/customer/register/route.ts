import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_TTL_SECONDS,
  createCustomerSessionToken,
  hashPassword,
} from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, password, bikeModelId } = body;

    const cleanPhone = typeof phone === "string" ? phone.trim() : "";
    const cleanPassword = typeof password === "string" ? password : "";
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" && email.includes("@") ? email.trim().toLowerCase() : null;

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: "A valid Bangladeshi phone number is required (e.g. 017XXXXXXXX)." },
        { status: 400 }
      );
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (existing && existing.passwordHash && !existing.passwordHash.includes("guestfallback")) {
      return NextResponse.json(
        { success: false, error: "An account with this phone number already exists. Please log in." },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(cleanPassword);

    let user;
    if (existing) {
      user = await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: cleanName || existing.name || "Rider",
          email: cleanEmail || existing.email,
          passwordHash: hashedPassword,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: cleanName || "Rider",
          phone: cleanPhone,
          email: cleanEmail,
          passwordHash: hashedPassword,
        },
      });
    }

    // Attach primary bike if chosen
    if (bikeModelId) {
      const bikeModel = await prisma.bikeModel.findUnique({ where: { id: bikeModelId } });
      if (bikeModel) {
        await prisma.userBike.upsert({
          where: {
            userId_bikeModelId: {
              userId: user.id,
              bikeModelId,
            },
          },
          update: { isPrimary: true },
          create: {
            userId: user.id,
            bikeModelId,
            isPrimary: true,
          },
        });
      }
    }

    const token = createCustomerSessionToken({
      userId: user.id,
      phone: user.phone,
      email: user.email,
      name: user.name,
    });

    const res = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
      message: "Account registered successfully!",
    });

    res.cookies.set({
      name: CUSTOMER_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: CUSTOMER_SESSION_TTL_SECONDS,
    });

    return res;
  } catch (error: any) {
    console.error("Customer registration error:", error);
    return NextResponse.json(
      { success: false, error: "Registration failed. Please check your details and try again." },
      { status: 500 }
    );
  }
}
