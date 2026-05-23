import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "wc3_auth";

type TokenPayload = { role?: string };

const getSession = async (request: NextRequest): Promise<TokenPayload | null> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify<TokenPayload>(
      token,
      new TextEncoder().encode(secret),
    );
    return payload;
  } catch {
    return null;
  }
};

const AUTH_PATHS = ["/favorites", "/builds/my-builds", "/builds/submit"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const home = new URL("/", request.url);

  const isAdmin = pathname.startsWith("/admin");
  const isAuthRequired = AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!isAdmin && !isAuthRequired) return NextResponse.next();

  const session = await getSession(request);

  if (!session) return NextResponse.redirect(home);
  if (isAdmin && session.role !== "admin") return NextResponse.redirect(home);

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/favorites", "/builds/my-builds", "/builds/submit"],
};
