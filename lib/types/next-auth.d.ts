/**
 * Dynamic module declarations extending NextAuth types.
 *
 * @module next-auth
 */

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session user interface to include custom properties.
   *
   * @interface Session
   * @property {Object} user - The authenticated user's session details.
   * @property {string} user.id - The unique database identifier of the user.
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
