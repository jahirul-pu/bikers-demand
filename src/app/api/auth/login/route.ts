import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  getSessionSecret,
} from "@/lib/auth";

export async function POST(req: Request) {
  const secret = getSessionSecret();
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!secret || !adminEmail || !adminPassword) {
    return NextResponse.json(
      { success: false, error: "Admin authentication is not configured." },
      { status: 500 }
    );
  }

  let body: { email?: unknown; password?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (email !== adminEmail.toLowerCase() || password !== adminPassword) {
    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = await createSessionToken({ sub: adminEmail, role: "ADMIN" }, secret);

  const res = NextResponse.json({ success: true, data: { email: adminEmail } });
  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
