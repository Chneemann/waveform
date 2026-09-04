/**
 * @file components/friends/AddFriendTab.tsx
 * @description Tab component allowing users to search for others by username, view live results, and send or track friend requests.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ActionButton } from "../ui/ActionButton";
import { UserAvatar } from "../ui/UserAvatar";
import { FriendsViewProps, FriendUser } from "./FriendsView";

/**
 * Renders the add friend tab containing the live search input, results list, and request management.
 *
 * @param {FriendsViewProps} props - The component props.
 * @param {string} props.currentUserId - The unique identifier of the currently logged-in user.
 * @param {Friendship[]} props.initialFriendships - Array of existing friendships.
 * @returns {JSX.Element} The rendered add friend tab container.
 */
export function AddFriendTab({
  currentUserId,
  initialFriendships,
}: FriendsViewProps) {
  const router = useRouter();
  const [addUsername, setAddUsername] = useState("");
  const [searchResults, setSearchResults] = useState<FriendUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [loadingUsername, setLoadingUsername] = useState<string | null>(null);

  // Live search as you type, with debounce
  useEffect(() => {
    const query = addUsername.trim();
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/users/search?q=${encodeURIComponent(query)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [addUsername]);

  /**
   * Checks the friendship status for a specific user ID against the current user.
   *
   * @function getFriendshipStatus
   * @param {string} userId - The unique identifier of the user to check status for.
   * @returns {string | null} The friendship status string ("PENDING", "ACCEPTED", "BLOCKED") or null if none exists.
   */
  const getFriendshipStatus = (userId: string) => {
    const friendship = initialFriendships.find(
      (f) =>
        (f.senderId === userId && f.receiverId === currentUserId) ||
        (f.receiverId === userId && f.senderId === currentUserId),
    );
    return friendship ? friendship.status : null;
  };

  /**
   * Sends a friend request to a specified username asynchronously.
   *
   * @async
   * @function sendRequestToUser
   * @param {string} username - The target username to send a friend request to.
   * @returns {Promise<void>} Resolves when the request completes.
   */
  const sendRequestToUser = async (username: string) => {
    setAddError("");
    setAddSuccess("");
    setLoadingUsername(username);

    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAddError(data.error || "Failed to send request");
      } else {
        setAddSuccess(`Success! Friend request sent to ${username}.`);
        setAddUsername("");
        setSearchResults([]);
        router.refresh();
      }
    } catch {
      setAddError("Internal server error");
    } finally {
      setLoadingUsername(null);
    }
  };

  return (
    <div className="max-w-xl w-full">
      <h3 className="font-semibold text-foreground uppercase tracking-wider text-xs mb-1">
        Add Friend
      </h3>
      <p className="text-xs text-muted mb-4">
        You can add friends by searching for their username.
      </p>

      <div className="relative">
        {/* Search field */}
        <div className="flex items-center bg-surface rounded-lg p-2 sm:p-3 border border-muted/20 focus-within:border-accent transition-colors">
          <input
            type="text"
            value={addUsername}
            onChange={(e) => setAddUsername(e.target.value)}
            placeholder="Type a username..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted/60 focus:outline-none"
          />
        </div>

        {/* Errors */}
        {addError && (
          <p className="text-xs text-destructive mt-2">{addError}</p>
        )}
        {addSuccess && <p className="text-xs text-accent mt-2">{addSuccess}</p>}

        {/* Search Results */}
        {addUsername.trim().length >= 2 && (
          <div className="mt-2 bg-surface rounded-lg border border-muted/20 overflow-hidden shadow-lg">
            {isSearching ? (
              <div className="p-3 text-xs text-muted text-center">
                Searching...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-3 text-xs text-muted text-center">
                No users found matching &quot;{addUsername}&quot;
              </div>
            ) : (
              <div className="divide-y divide-muted/10">
                {searchResults.map((user) => {
                  if (user.id === currentUserId) return null; // Hide your own account

                  const friendshipStatus = getFriendshipStatus(user.id);

                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2.5 hover:bg-background/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <UserAvatar user={user} size="md" />
                        <span className="text-sm font-medium text-foreground truncate">
                          {user.username}
                        </span>
                      </div>

                      {/* Status or Add Button */}
                      {!friendshipStatus ? (
                        <ActionButton
                          type="button"
                          variant="primary"
                          size="sm"
                          disabled={loadingUsername === user.username}
                          onClick={() => sendRequestToUser(user.username)}
                        >
                          {loadingUsername === user.username
                            ? "Sending..."
                            : "Add Friend"}
                        </ActionButton>
                      ) : (
                        <span className="text-xs text-muted font-medium px-2 py-1 rounded bg-background/50 border border-muted/10">
                          {friendshipStatus === "ACCEPTED"
                            ? "Friend"
                            : "Pending"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
