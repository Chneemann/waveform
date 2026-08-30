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

/**
 * NextAuth handlers, authentication methods, and auth utility exports.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Authorizes user credentials against database records.
       *
       * @function authorize
       * @param {Record<string, unknown> | undefined} credentials - The incoming sign-in credentials containing email and password.
       * @returns {Promise<{ id: string } | null>} The authenticated user object containing only the user ID, or null if validation fails.
       */
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
    /**
     * Populates the JWT token with the user ID upon initial sign in.
     *
     * @function jwt
     * @param {Object} params - The callback parameters.
     * @param {import("next-auth/jwt").JWT} params.token - The current JSON Web Token.
     * @param {import("next-auth").User} [params.user] - The authenticated user object (available on first sign in).
     * @returns {import("next-auth/jwt").JWT} The updated JWT token.
     */
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    /**
     * Attaches the user ID from the JWT token to the active session.
     *
     * @function session
     * @param {Object} params - The callback parameters.
     * @param {import("next-auth").Session} params.session - The current user session object.
     * @param {import("next-auth/jwt").JWT} params.token - The active JSON Web Token.
     * @returns {import("next-auth").Session} The updated session object.
     */
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: {
    /**
     * Updates the user's status to ONLINE and refreshes lastSeenAt upon successful sign in.
     *
     * @function signIn
     * @param {Object} params - The event parameters.
     * @param {import("next-auth").User} params.user - The signed-in user object.
     * @returns {Promise<void>}
     */
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
  },
  pages: {
    signIn: "/login",
  },
});
