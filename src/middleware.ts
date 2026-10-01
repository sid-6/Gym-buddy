import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE = "gb_session";
const PUBLIC = new Set([
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/legal/terms",
  "/legal/privacy",
]);

function hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function userIdFromToken(token: string | undefined) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  if (Number(exp) < Date.now()) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(process.env.AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = hex(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${userId}.${exp}`)),
  );
  if (expected.length !== sig.length) return null;
  let ok = 0;
  for (let i = 0; i < expected.length; i += 1) ok |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (ok !== 0) return null;
  return userId;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/__nextjs") ||
    PUBLIC.has(pathname) ||
    pathname.startsWith("/legal/") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }
  const userId = await userIdFromToken(request.cookies.get(COOKIE)?.value);
  if (!userId) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico).*)"],
};
