/**
 * @file app/(auth)/register/page.tsx
 * @description Client component rendering the registration page, handling form submissions, client-side validation, form completion checks, error handling, autocomplete, and navigation.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { registerUser } from "@/lib/services/auth.service";

/** Renders the user registration interface, manages sign-up form state, and requires all fields to be filled before submission. */
export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isFormValid =
    username.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "";

  /** Clears active error state when user modifies input fields. */
  const handleInputChange = () => {
    if (error) {
      setError(null);
    }
  };

  /** Handles user registration form submission, validates form data via auth service, and navigates to summary page on successful registration. */
  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFormValid) return;
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    // Client-side password matching validation
    if (payload.password !== payload.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

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
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                handleInputChange();
              }}
              placeholder="username"
              maxLength={50}
              autoComplete="username"
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleInputChange();
              }}
              placeholder="name@example.com"
              maxLength={255}
              autoComplete="email"
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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                handleInputChange();
              }}
              placeholder="•••••••••••••"
              maxLength={72}
              autoComplete="new-password"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-foreground placeholder-neutral-500 outline-none focus:border-accent transition-colors text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                handleInputChange();
              }}
              placeholder="•••••••••••••"
              maxLength={72}
              autoComplete="new-password"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-foreground placeholder-neutral-500 outline-none focus:border-accent transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-accent hover:opacity-90 transition-opacity text-white font-medium py-2.5 rounded-lg text-sm disabled:opacity-50 mt-2 cursor-pointer disabled:cursor-not-allowed"
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
