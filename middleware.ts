/**
 * @file middleware.ts
 * @description NextAuth middleware protecting routes, managing authentication state, and redirecting unauthenticated or authenticated users accordingly.
 */

import { auth } from "@/auth";

/**
 * Middleware function that checks authentication status on incoming requests and handles route redirection.
 *
 * @param {Request & { auth?: unknown, nextUrl: URL }} req - The incoming request object extended with NextAuth authentication details and URL helper.
 * @returns {Response | undefined} Redirection response if authentication criteria are not met, or undefined to allow request processing.
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");

  if (!isLoggedIn && !isAuthPage) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL("/", req.nextUrl));
  }
});

/**
 * Middleware execution matcher configuration.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)"],
};
