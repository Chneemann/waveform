/**
 * @file app/lib/services/auth.service.ts
 * @description Authentication service providing helper functions for guest credentials, sign-in, and registration.
 */

import { loginSchema, registerSchema } from "@/lib/schemas/auth.schema";
import { signIn } from "next-auth/react";

/**
 * Triggers guest authentication securely via the backend API route.
 *
 * @async
 * @returns {Promise<{ success?: boolean; error?: string }>} An object indicating success or describing the error.
 */
export async function loginAsGuest() {
  try {
    const response = await fetch("/api/auth/guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Guest login failed." };
    }

    return { success: true };
  } catch (err: any) {
    return { error: "Server error: API endpoint not available" };
  }
}

/**
 * Authenticates a user using email and password credentials, performing client-side validation first.
 *
 * @async
 * @param {string} email - The user's email address.
 * @param {string} password - The user's account password.
 * @returns {Promise<{ success?: boolean; error?: string }>} An object indicating sign-in success or an error message.
 */
export async function loginUser(email: string, password: string) {
  const validationResult = loginSchema.safeParse({ email, password });

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  try {
    const res = await signIn("credentials", {
      email: validationResult.data.email,
      password: validationResult.data.password,
      redirect: false,
    });

    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        return { error: "Incorrect email address or password." };
      }
      return { error: "An unexpected error has occurred." };
    }

    return { success: true };
  } catch (err: any) {
    if (
      err?.message?.includes("fetch") ||
      err?.name === "TypeError" ||
      err?.message?.includes("network")
    ) {
      return { error: "Server error: API endpoint not available" };
    }
    return { error: err?.message || "An unexpected error has occurred." };
  }
}

/**
 * Registers a new user account by validating the form data and submitting it to the backend registration route.
 *
 * @async
 * @param {Record<string, any>} payload - The user registration form payload containing credentials and user details.
 * @returns {Promise<{ success?: boolean; error?: string }>} An object indicating successful registration or an error message.
 */
export async function registerUser(payload: Record<string, any>) {
  const validationResult = registerSchema.safeParse(payload);

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validationResult.data),
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (jsonErr) {
        return { error: "Server error: Invalid response format" };
      }
    } else {
      throw new Error("Server error: API endpoint not available");
    }

    if (!response.ok) {
      return { error: data.message || "Something went wrong." };
    }

    const loginResult = await autoLogin(
      validationResult.data.email,
      validationResult.data.password,
    );

    if (!loginResult.success) {
      return { error: loginResult.error };
    }

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Something went wrong." };
  }
}

/**
 * Performs client-side automatic login using user credentials.
 *
 * @async
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<{ success: boolean; error?: string }>} The result of the sign-in operation.
 */
export async function autoLogin(email: string, password: string) {
  try {
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      return {
        success: false,
        error: "Automatic sign-in failed. Please log in manually.",
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "An unexpected error occurred during auto-login.",
    };
  }
}
