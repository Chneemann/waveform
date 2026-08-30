/**
 * @file lib/types/next-auth.d.ts
 * @description TypeScript module augmentation for NextAuth types to add custom user and session attributes.
 */

import { DefaultSession } from "next-auth";
import type { UserStatus } from "@/db/schema";

declare module "next-auth" {
  /**
   * Extends the default NextAuth Session interface to include custom user properties.
   */
  interface Session {
    user: {
      id: string;
      username: string;
      color: string;
      status: UserStatus;
    } & DefaultSession["user"];
  }

  /**
   * Extends the default NextAuth User interface to include custom properties.
   */
  interface User {
    id?: string;
    username?: string;
    color?: string;
    status?: UserStatus;
  }
}
