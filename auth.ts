/**
 * @file auth.ts
 * @description NextAuth configuration handling authentication and lightweight ID-only session management.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/password";

/** NextAuth handlers, authentication methods, and auth utility exports. */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /** Authorizes user credentials against database records. */
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          return null;
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user || !user.password) {
          return null;
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
        };
      },
    }),
  ],
  callbacks: {
    /** Populates the JWT token with the user ID upon initial sign in. */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    /** Attaches the user ID from the JWT token to the active session. */
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: {
    /** Updates the user's status to ONLINE and refreshes lastSeenAt upon successful sign in. */
    async signIn({ user }) {
      if (user?.id) {
        await db
          .update(users)
          .set({
            status: "ONLINE",
            lastSeenAt: new Date(),
          })
          .where(eq(users.id, user.id));
      }
    },
    /** Updates the user's status to OFFLINE upon explicit sign out. */
    async signOut(message) {
      if ("token" in message && message.token?.id) {
        await db
          .update(users)
          .set({
            status: "OFFLINE",
            lastSeenAt: new Date(),
          })
          .where(eq(users.id, message.token.id as string))
          .catch(() => {
            // Silently ignore if user was already deleted from DB
          });
      }
    },
  },
  pages: {
    signIn: "/login",
  },
});
