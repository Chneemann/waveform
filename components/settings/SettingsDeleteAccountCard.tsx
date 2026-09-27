/**
 * @file components/settings/SettingsDeleteAccountCard.tsx
 * @description Card component for handling account deletion with dynamic button inline confirmation and guest protection.
 */

"use client";

import { useState } from "react";
import { useUser } from "@/lib/context/UserContext";
import { Trash2, AlertTriangle, ChevronDown } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { signOut } from "next-auth/react";

interface SettingsDeleteAccountCardProps {
  defaultOpen?: boolean;
}

export function SettingsDeleteAccountCard({
  defaultOpen = false,
}: SettingsDeleteAccountCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentUser } = useUser();

  if (!currentUser) return null;

  const guestEmail = process.env.NEXT_PUBLIC_GUEST_EMAIL;
  const isGuest = Boolean(
    guestEmail && currentUser.email?.toLowerCase() === guestEmail.toLowerCase(),
  );

  /** Handles the two-step delete trigger and API request. */
  const handleDelete = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    if (isDeleting) return;

    try {
      setIsDeleting(true);
      setError(null);

      const res = await fetch("/api/users/profile", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account");
      }

      await signOut({ callbackUrl: "/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  return (
    <div className="bg-surface border border-rose-500/20 rounded-xl overflow-hidden transition-all shrink-0">
      {/* Header / Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-rose-400">Delete Account</h2>
            <p className="text-sm text-muted">
              Permanently delete your account and all associated data.
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
        <div className="p-6 pt-0 space-y-4 border-t border-rose-500/10 mt-2">
          {isGuest ? (
            <div className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-amber-500/10 text-amber-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Guest accounts cannot be deleted.</span>
            </div>
          ) : (
            <div className="pt-4 space-y-4">
              <p className="text-sm text-muted">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <div className="flex items-center gap-3">
                <ActionButton
                  type="button"
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  icon={Trash2}
                >
                  {isConfirmingDelete ? "Sure?" : "Delete Account"}
                </ActionButton>

                {isConfirmingDelete && (
                  <ActionButton
                    type="button"
                    variant="secondary"
                    onClick={() => setIsConfirmingDelete(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </ActionButton>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
