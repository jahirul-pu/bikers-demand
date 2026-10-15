/**
 * Edge-safe admin session helpers.
 *
 * Sessions are stateless HMAC-SHA256 signed tokens (base64url payload +
 * signature) stored in an httpOnly cookie. Uses Web Crypto only, so the same
 * code runs in middleware (Edge runtime) and in Node route handlers.
 */

export const ADMIN_SESSION_COOKIE = "bd_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export interface AdminSession {
  sub: string;
  role: "ADMIN";
  exp: number;
}

const encoder = new TextEncoder();

function base64urlFromBytes(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function bytesFromBase64url(value: string): Uint8Array<ArrayBuffer> {
  const normalised = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = (4 - (normalised.length % 4)) % 4;
  const binary = atob(normalised + "=".repeat(pad));
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export function getSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || null;
}

export async function createSessionToken(
  payload: { sub: string; role?: "ADMIN"; exp?: number },
  secret: string
): Promise<string> {
  const session: AdminSession = {
    sub: payload.sub,
    role: payload.role ?? "ADMIN",
    exp: payload.exp ?? Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = base64urlFromBytes(encoder.encode(JSON.stringify(session)));
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return `${body}.${base64urlFromBytes(new Uint8Array(signature))}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
  secret: string
): Promise<AdminSession | null> {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  try {
    const key = await importKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      bytesFromBase64url(signature),
      encoder.encode(body)
    );
    if (!valid) return null;
    const session = JSON.parse(
      new TextDecoder().decode(bytesFromBase64url(body))
    ) as AdminSession;
    if (session.role !== "ADMIN") return null;
    if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}
