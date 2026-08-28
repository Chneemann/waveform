/**
 * @file app/api/auth/[...nextauth]/route.ts
 * @description NextAuth API route handlers for HTTP GET and POST authentication requests.
 */

import { handlers } from "@/auth";

/**
 * HTTP GET and POST request handlers exported from NextAuth configuration.
 */
export const { GET, POST } = handlers;
