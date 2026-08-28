/**
 * @file app/(auth)/login/page.tsx
 * @description Client component rendering the login page, handling form submission, authentication requests, error messaging, and redirection.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loginAsGuest, loginUser } from "@/lib/services/auth.service";

/**
 * Renders the user login interface and manages authentication form state.
 *
 * @returns {JSX.Element} The rendered login page component.
 */
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<
    "credentials" | "guest" | null
  >(null);

  /**
   * Form submit handler extracting credentials from FormData and delegating to handleSignIn.
   *
   * @param {React.SubmitEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await handleSignIn(email, password, "credentials");
  };

  /**
   * Authenticates the user with provided credentials and redirects upon success.
   *
   */
  const handleSignIn = async (
    email: string,
    password: string,
    type: "credentials" | "guest",
  ) => {
    setError(null);
    setLoadingType(type);

    const result = await loginUser(email, password);

    if (result.error) {
      setError(result.error);
      setLoadingType(null);
    } else {
      router.push("/");
    }
  };

  /**
   * Triggers secure guest authentication via the backend service.
   *
   * @async
   */
  const handleGuestLogin = async () => {
    setError(null);
    setLoadingType("guest");

    const result = await loginAsGuest();

    if (result.error) {
      setError(result.error);
      setLoadingType(null);
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-[hsl(200_6%_8%)] border border-neutral-800 rounded-xl p-8 shadow-2xl">
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-16 h-16 mb-2">
            <Image
              src="/logo.png"
              alt="Waveform Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-sm text-neutral-400 mt-1">
            We're looking forward to seeing you again.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              maxLength={255}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-foreground placeholder-neutral-500 outline-none focus:border-accent transition-colors text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="•••••••••••••"
              maxLength={72}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-foreground placeholder-neutral-500 outline-none focus:border-accent transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loadingType !== null}
            className="w-full bg-accent hover:opacity-90 transition-opacity text-white font-medium py-2.5 rounded-lg text-sm disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loadingType === "credentials" ? "Signing in..." : "Sign In"}{" "}
          </button>
        </form>

        <div className="relative flex items-center pt-4 pb-2">
          <div className="grow border-t border-neutral-800"></div>
          <span className="shrink mx-4 text-xs text-muted uppercase">or</span>
          <div className="grow border-t border-neutral-800"></div>
        </div>

        <button
          type="button"
          disabled={loadingType !== null}
          onClick={handleGuestLogin}
          className="w-full bg-transparent hover:bg-accent/10 text-accent border border-accent/40 hover:border-accent transition-all font-medium py-2.5 rounded-lg text-sm disabled:opacity-50 mt-2 cursor-pointer"
        >
          {loadingType === "guest"
            ? "Signing in as Guest..."
            : "Sign in as Guest"}
        </button>

        {/* Footer Link */}
        <p className="text-xs text-neutral-400 text-center mt-6">
          Don't have an account yet?{" "}
          <Link
            href="/register"
            className="text-accent hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
