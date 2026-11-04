import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_TTL_SECONDS,
  createCustomerSessionToken,
  verifyPassword,
} from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneOrEmail, password } = body;

    const identifier = typeof phoneOrEmail === "string" ? phoneOrEmail.trim() : "";
    const cleanPassword = typeof password === "string" ? password : "";

    if (!identifier || !cleanPassword) {
      return NextResponse.json(
        { success: false, error: "Phone number or email and password are required." },
        { status: 400 }
      );
    }

    const isEmail = identifier.includes("@");
    const user = isEmail
      ? await prisma.user.findUnique({ where: { email: identifier.toLowerCase() } })
      : await prisma.user.findUnique({ where: { phone: identifier } });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No account found with this phone number or email." },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(cleanPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect password. Please try again." },
        { status: 401 }
      );
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
      message: "Logged in successfully!",
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
  } catch (error) {
    console.error("Customer login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
