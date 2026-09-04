/**
 * @file components/friends/AddFriendTab.tsx
 * @description Tab component providing a form to send friend requests via username.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ActionButton } from "../ui/ActionButton";

/**
 * Renders a form to add new friends by entering their username.
 *
 * @returns {JSX.Element} The rendered add friend tab component.
 */
export function AddFriendTab() {
  const router = useRouter();
  const [addUsername, setAddUsername] = useState("");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Handles the form submission to send a friend request asynchronously.
   *
   * @async
   * @function handleSendRequest
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>} Resolves when the friend request process completes.
   */
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    if (!addUsername.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: addUsername }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAddError(data.error || "Failed to send request");
      } else {
        setAddSuccess(
          `Success! Your friend request to ${addUsername} was sent.`,
        );
        setAddUsername("");
        router.refresh();
      }
    } catch {
      setAddError("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full">
      <h3 className="font-semibold text-foreground uppercase tracking-wider text-xs mb-1">
        Add Friend
      </h3>
      <p className="text-xs text-muted mb-4">
        You can add friends with their username.
      </p>

      <form onSubmit={handleSendRequest} className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 relative items-stretch sm:items-center bg-surface rounded-lg p-2 sm:p-3 border border-muted/20 focus-within:border-accent transition-colors">
          <input
            type="text"
            value={addUsername}
            onChange={(e) => setAddUsername(e.target.value)}
            placeholder="You can add friends with their username"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted/60 focus:outline-none py-1 sm:py-0 sm:pr-36"
          />
          <ActionButton
            type="submit"
            variant="primary"
            disabled={loading || !addUsername.trim()}
            size="sm"
          >
            Send Friend Request
          </ActionButton>
        </div>
        {addError && (
          <p className="text-xs text-destructive mt-1">{addError}</p>
        )}
        {addSuccess && <p className="text-xs text-accent mt-1">{addSuccess}</p>}
      </form>
    </div>
  );
}
