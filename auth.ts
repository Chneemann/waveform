/**
 * @file auth.ts
 * @description NextAuth configuration defining authentication providers, credentials verification, JWT callbacks, and session handling.
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
       * Authorizes user credentials by checking against database records and verifying the password.
       *
       * @param {Record<string, unknown> | undefined} credentials - The incoming sign-in credentials containing email and password.
       * @returns {Promise<Object | null>} The authenticated user object containing id, name, email, and color, or null if validation fails.
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
          name: user.username,
          email: user.email,
          color: user.color,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * Callback triggered when a JSON Web Token is created or updated.
     *
     * @param {Object} params - Callback parameters.
     * @param {Object} params.token - The current JWT token payload.
     * @param {Object} [params.user] - The authenticated user object available on initial sign in.
     * @returns {Object} The updated JWT token containing custom user claims.
     */
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.color = user.color;
      }
      return token;
    },
    /**
     * Callback triggered whenever a session is checked or accessed.
     *
     * @param {Object} params - Callback parameters.
     * @param {Object} params.session - The current session object.
     * @param {Object} params.token - The decoded JWT token payload.
     * @returns {Object} The updated session object populated with custom token attributes.
     */
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.color = token.color as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
