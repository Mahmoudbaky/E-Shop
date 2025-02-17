import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export const config = {
  matcher: [
    "/shipping-address",
    "/payment-method",
    "/place-order",
    "/profile",
    "/user/:path*",
    "/order/:path*",
    "/admin/:path*",
    "/", // Add root path to handle cart session
  ],
};

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Check for protected routes
  if (
    request.nextUrl.pathname.match(
      /^\/(?:shipping-address|payment-method|place-order|profile|user|order|admin)/
    )
  ) {
    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // For admin routes, check if user has admin role
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (session.user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  // Handle cart session
  const response = NextResponse.next();

  if (!request.cookies.has("sessionCartId")) {
    const sessionCartId = crypto.randomUUID();
    response.cookies.set("sessionCartId", sessionCartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}
