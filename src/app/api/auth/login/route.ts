import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  getSessionSecret,
} from "@/lib/auth";

// In-memory rate limiting map: ip -> { count, expiresAt }
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 15 * 60 * 1000 });
    return false;
  }
  if (record.count >= 5) {
    return true;
  }
  record.count += 1;
  return false;
}

function safeCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export async function POST(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many login attempts. Please wait 15 minutes before trying again." },
      { status: 429 }
    );
  }

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

  const isEmailMatch = safeCompare(email, adminEmail.toLowerCase());
  const isPasswordMatch = safeCompare(password, adminPassword);

  if (!isEmailMatch || !isPasswordMatch) {
    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  }

  // Clear rate limiting on successful login
  rateLimitMap.delete(ip);

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
