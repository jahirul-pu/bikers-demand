import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getSessionSecret,
  verifySessionToken,
} from "@/lib/auth";

const ADMIN_LOGIN_PATH = "/admin/login";

// APIs that are admin-only for every method.
const ADMIN_ONLY_API = ["/api/admin", "/api/upload"];

// Public-read APIs that must be admin-only for write methods.
const ADMIN_WRITE_API = ["/api/bikes", "/api/coupons", "/api/products"];

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page itself must stay reachable.
  if (pathname === ADMIN_LOGIN_PATH) return NextResponse.next();

  const isAdminPage =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = matchesPrefix(pathname, ADMIN_ONLY_API);
  const isAdminWrite =
    req.method !== "GET" &&
    req.method !== "HEAD" &&
    matchesPrefix(pathname, ADMIN_WRITE_API);

  if (!isAdminPage && !isAdminApi && !isAdminWrite) {
    return NextResponse.next();
  }

  const secret = getSessionSecret();
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = secret ? await verifySessionToken(token, secret) : null;

  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = ADMIN_LOGIN_PATH;
  url.search = "";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/upload/:path*",
    "/api/bikes/:path*",
    "/api/coupons/:path*",
    "/api/products/:path*",
  ],
};
