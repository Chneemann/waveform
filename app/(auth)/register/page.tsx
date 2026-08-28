/**
 * @file app/(auth)/register/page.tsx
 * @description Client component rendering the registration page, handling form submissions, account creation logic, error handling, and navigation.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { registerUser } from "@/lib/services/auth.service";

/**
 * Renders the user registration interface and manages sign-up form state.
 *
 * @returns {JSX.Element} The rendered registration page component.
 */
export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Handles user registration form submission, validates form data via auth service,
   * and navigates to summary page on successful registration.
   *
   * @param {React.SubmitEvent<HTMLFormElement>} event - The form submission event.
   * @returns {Promise<void>}
   */
  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const result = await registerUser(payload);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-[hsl(200_6%_8%)] border border-neutral-800 rounded-xl p-8 shadow-2xl">
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
          <h1 className="text-2xl font-bold text-foreground">
            Create an Account
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Get started with Waveform now.
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
              htmlFor="username"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="username"
              maxLength={50}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-foreground placeholder-neutral-500 outline-none focus:border-accent transition-colors text-sm"
            />
          </div>

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
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="•••••••••••••"
              maxLength={72}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-foreground placeholder-neutral-500 outline-none focus:border-accent transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:opacity-90 transition-opacity text-white font-medium py-2.5 rounded-lg text-sm disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? "Register..." : "Register"}
          </button>
        </form>

        <p className="text-xs text-neutral-400 text-center mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
