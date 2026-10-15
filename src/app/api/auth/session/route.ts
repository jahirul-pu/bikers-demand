import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getSessionSecret,
  verifySessionToken,
} from "@/lib/auth";

export async function GET(req: Request) {
  const secret = getSessionSecret();
  const cookieHeader = req.headers.get("cookie") || "";
  const raw = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.slice(ADMIN_SESSION_COOKIE.length + 1);

  const token = raw ? decodeURIComponent(raw) : null;
  const session = secret ? await verifySessionToken(token, secret) : null;

  return NextResponse.json({
    success: true,
    authenticated: Boolean(session),
    email: session?.sub ?? null,
  });
}
