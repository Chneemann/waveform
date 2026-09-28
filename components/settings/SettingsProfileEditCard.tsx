/**
 * @file components/settings/SettingsProfileEditCard.tsx
 * @description Card component for changing user details like email, username, and password with guest protection.
 */

"use client";

import { useState } from "react";
import { useUser } from "@/lib/context/UserContext";
import {
  User,
  Mail,
  Lock,
  AlertTriangle,
  ChevronDown,
  Save,
} from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { profileUpdateSchema } from "@/lib/schemas/auth.schema";

/** Props for the SettingsProfileEditCard component. */
interface SettingsProfileEditCardProps {
  defaultOpen?: boolean;
}

/** Renders a collapsible card allowing users to update username, email, and password. */
export function SettingsProfileEditCard({
  defaultOpen = false,
}: SettingsProfileEditCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { currentUser, updateCurrentUser } = useUser();

  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!currentUser) return null;

  const guestEmail = process.env.NEXT_PUBLIC_GUEST_EMAIL;
  const isGuest = Boolean(
    guestEmail && currentUser.email?.toLowerCase() === guestEmail.toLowerCase(),
  );

  // Simple check for changes & password match
  const hasChanges =
    username !== currentUser.username ||
    email !== currentUser.email ||
    password.length > 0;

  const isPasswordMatch = !password || password === confirmPassword;
  const isSaveDisabled = !hasChanges || !isPasswordMatch || isLoading;

  /** Validates form inputs and sends account detail updates to the server. */
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (isGuest || isSaveDisabled) return;

    setError(null);
    setSuccess(null);

    // Zod Validation
    const validationResult = profileUpdateSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message;
      setError(firstError || "Validation failed.");
      return;
    }

    try {
      setIsLoading(true);

      const payload: Record<string, string> = {};
      if (username !== currentUser.username) payload.username = username;
      if (email !== currentUser.email) payload.email = email;
      if (password) payload.password = password;

      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile.");
      }

      updateCurrentUser({
        ...(payload.username && { username: payload.username }),
        ...(payload.email && { email: payload.email }),
      });

      setPassword("");
      setConfirmPassword("");
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-muted/20 rounded-xl overflow-hidden transition-all shrink-0">
      {/* Header / Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10 text-accent">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Account Details</h2>
            <p className="text-sm text-muted">
              Change your username, email address, or password.
            </p>
          </div>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Collapsible Body */}
      {isOpen && (
        <div className="p-6 pt-0 space-y-4 border-t border-muted/10 mt-2">
          {isGuest ? (
            <div className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-amber-500/10 text-amber-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Guest accounts cannot modify their account details.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-4 space-y-4">
              {error && <p className="text-xs text-red-400">{error}</p>}
              {success && <p className="text-xs text-emerald-400">{success}</p>}

              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Username
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 absolute left-3.5 text-muted" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    maxLength={50}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-background border border-surface/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3.5 text-muted" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    maxLength={255}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-background border border-surface/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    New Password (optional)
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 absolute left-3.5 text-muted" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="•••••••••••••"
                      value={password}
                      maxLength={72}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-background border border-surface/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 absolute left-3.5 text-muted" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="•••••••••••••"
                      value={confirmPassword}
                      maxLength={72}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading || !password}
                      className="w-full bg-background border border-surface/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <ActionButton
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  disabled={isSaveDisabled}
                  icon={Save}
                >
                  Save Changes
                </ActionButton>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
