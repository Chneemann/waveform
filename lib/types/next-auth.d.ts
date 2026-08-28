/**
 * @file lib/types/next-auth.d.ts
 * @description TypeScript module augmentation for NextAuth types to add custom user and session attributes.
 */

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the default NextAuth Session interface to include custom user properties.
   *
   * @interface Session
   * @property {Object} user - The session user object.
   * @property {string} user.id - The unique identifier of the user.
   * @property {string} user.color - The custom user interface color preference or avatar fallback color.
   */
  interface Session {
    user: {
      id: string;
      color: string;
    } & DefaultSession["user"];
  }

  /**
   * Extends the default NextAuth User interface to include custom properties.
   *
   * @interface User
   * @property {string} [id] - The optional unique identifier of the user.
   * @property {string} [color] - The optional custom color attribute associated with the user.
   */
  interface User {
    id?: string;
    color?: string;
  }
}
