/**
 * @file components/friends/AllFriendsTab.tsx
 * @description Component rendering the list of all accepted friends along with status indicators, messaging options, and remove actions.
 */

"use client";

import { MessageSquare, X } from "lucide-react";
import { UserAvatar } from "../ui/UserAvatar";
import { Friendship, FriendUser } from "./FriendsView";
import { useRouter } from "next/navigation";

/**
 * Properties for the AllFriendsTab component.
 *
 * @interface AllFriendsTabProps
 * @property {Friendship[]} acceptedFriends - Array of accepted friendship objects.
 * @property {(f: Friendship) => FriendUser} getFriendUser - Helper function to retrieve user details from a friendship relationship.
 * @property {(id: string) => void} onRemove - Callback function to remove a friend by their friendship ID.
 */
interface AllFriendsTabProps {
  acceptedFriends: Friendship[];
  getFriendUser: (f: Friendship) => FriendUser;
  onRemove: (id: string) => void;
}

/**
 * Renders the list of all accepted friends along with status, message, and remove actions.
 *
 * @param {AllFriendsTabProps} props - The component props.
 * @param {Friendship[]} props.acceptedFriends - Array of accepted friendship objects.
 * @param {(f: Friendship) => FriendUser} props.getFriendUser - Helper function to extract user details.
 * @param {(id: string) => void} props.onRemove - Callback function to remove a friend.
 * @returns {JSX.Element} The rendered list of all accepted friends.
 */
export function AllFriendsTab({
  acceptedFriends,
  getFriendUser,
  onRemove,
}: AllFriendsTabProps) {
  const router = useRouter();

  const handleStartConversation = async (recipientId: string) => {
    try {
      const res = await fetch("/api/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId }),
      });

      if (res.ok) {
        const conversation = await res.json();
        router.push(`/dm/${conversation.id}`);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
        All Friends — {acceptedFriends.length}
      </h3>

      {acceptedFriends.length === 0 ? (
        <p className="text-sm text-muted">You have no friends yet.</p>
      ) : (
        <div className="space-y-1">
          {acceptedFriends.map((f) => {
            const friend = getFriendUser(f);

            return (
              <div
                key={f.id}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface/50 border-t border-muted/10 group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="relative shrink-0">
                    <UserAvatar user={friend} size="md" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {friend.username}
                    </div>
                    <div className="text-xs text-muted truncate capitalize">
                      {friend.status.toLowerCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartConversation(friend.id)}
                    title="Message"
                    className="p-2 rounded-full bg-surface hover:bg-muted/30 text-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(f.id)}
                    title="Remove Friend"
                    className="p-2 rounded-full bg-surface hover:bg-destructive text-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
