import { NextResponse } from "next/server";
import { CUSTOMER_SESSION_COOKIE } from "@/lib/customerAuth";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logged out successfully" });
  res.cookies.set({
    name: CUSTOMER_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
