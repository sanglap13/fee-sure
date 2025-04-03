import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/";

  // Get the token from the cookies
  const token = request.cookies.get("auth-token")?.value || "";

  // Redirect logic
  if (isPublicPath && token) {
    // If user is on public path but has token, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicPath && !token) {
    // If user is on protected path but has no token, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
