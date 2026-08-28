/**
 * @file app/api/auth/register/route.ts
 * @description API route handler for user registration, validating request payloads, checking duplicate accounts, hashing passwords, and storing new user records.
 */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/schemas/auth.schema";
import { eq, or } from "drizzle-orm";

/**
 * Handles HTTP POST requests for registering a new user.
 *
 * @param {Request} req - The incoming HTTP request object containing the JSON registration payload.
 * @returns {Promise<NextResponse>} JSON response indicating successful creation (201), validation failure (400), conflict (409), or server error (500).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.issues[0].message },
        { status: 400 },
      );
    }

    const { username, email, password } = validationResult.data;

    // Check whether the email address or username already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1);

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { message: "This email address is already in use." },
          { status: 409 },
        );
      }

      if (existingUser.username === username) {
        return NextResponse.json(
          { message: "This username is already taken." },
          { status: 409 },
        );
      }
    }

    // Hash a Password & Create a User
    const hashedPassword = await hashPassword(password);

    await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Fehler beim Erstellen des Benutzers." },
      { status: 500 },
    );
  }
}
