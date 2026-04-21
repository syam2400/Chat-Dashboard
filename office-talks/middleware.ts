import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value;

  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // ✅ If logged in → block login/signup
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to static files, next internals, images etc
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  // If no token → redirect to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token exists → allow access
  return NextResponse.next();
}


// Apply middleware to all routes except excluded ones
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};