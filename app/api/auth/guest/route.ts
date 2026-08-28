/**
 * @file app/api/auth/guest/route.ts
 * @description API route handler for guest authentication utilizing server-side environment variables and auto sign-in.
 */

import { NextResponse } from "next/server";
import { signIn } from "@/auth";

/**
 * Handles POST requests to authenticate as a guest user using environment credentials.
 *
 * @async
 * @returns {Promise<NextResponse>} A JSON response confirming successful guest sign-in or an error message.
 */
export async function POST() {
  const email = process.env.GUEST_EMAIL;
  const password = process.env.GUEST_PASSWORD;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Guest login is not configured on the server." },
      { status: 500 },
    );
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (
      error?.message?.includes("NEXT_REDIRECT") ||
      error?.type === "NavigationFailure"
    ) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    console.error("Guest login error:", error);
    if (
      error?.message?.includes("CredentialsSignin") ||
      error?.type === "CredentialsSignin"
    ) {
      return NextResponse.json(
        { error: "Incorrect guest credentials." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
