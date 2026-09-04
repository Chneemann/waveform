/**
 * @file components/friends/PendingRequestsTab.tsx
 * @description Tab component that renders a list of pending friend requests with options to accept, decline, or cancel them.
 */

"use client";

import { Check, X } from "lucide-react";
import { UserAvatar } from "../ui/UserAvatar";
import { Friendship, FriendUser } from "./FriendsView";

/**
 * Properties for the PendingRequestsTab component.
 *
 * @interface PendingRequestsTabProps
 * @property {string} currentUserId - The unique identifier of the currently logged-in user.
 * @property {Friendship[]} pendingRequests - Array of pending friendship objects.
 * @property {(f: Friendship) => FriendUser} getFriendUser - Helper function to extract the friend user from a friendship record.
 * @property {(id: string) => void} onAccept - Callback function triggered to accept an incoming friend request.
 * @property {(id: string) => void} onDeclineOrCancel - Callback function triggered to decline an incoming request or cancel an outgoing one.
 */
interface PendingRequestsTabProps {
  currentUserId: string;
  pendingRequests: Friendship[];
  getFriendUser: (f: Friendship) => FriendUser;
  onAccept: (id: string) => void;
  onDeclineOrCancel: (id: string) => void;
}

/**
 * Renders a list of pending friend requests with options to accept, decline, or cancel them.
 *
 * @param {PendingRequestsTabProps} props - The component props.
 * @param {string} props.currentUserId - The unique identifier of the currently logged-in user.
 * @param {Friendship[]} props.pendingRequests - Array of pending friendship objects.
 * @param {(f: Friendship) => FriendUser} props.getFriendUser - Helper function to extract the friend user.
 * @param {(id: string) => void} props.onAccept - Callback to accept a request.
 * @param {(id: string) => void} props.onDeclineOrCancel - Callback to decline or cancel a request.
 * @returns {JSX.Element} The rendered pending requests tab.
 */
export function PendingRequestsTab({
  currentUserId,
  pendingRequests,
  getFriendUser,
  onAccept,
  onDeclineOrCancel,
}: PendingRequestsTabProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
        Pending Requests — {pendingRequests.length}
      </h3>
      {pendingRequests.length === 0 ? (
        <p className="text-sm text-muted">No pending friend requests.</p>
      ) : (
        <div className="space-y-1">
          {pendingRequests.map((req) => {
            const isIncoming = req.receiverId === currentUserId;
            const friend = getFriendUser(req);

            return (
              <div
                key={req.id}
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
                    <div className="text-xs text-muted truncate">
                      {isIncoming ? "Incoming Request" : "Outgoing Request"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  {isIncoming && (
                    <button
                      type="button"
                      onClick={() => onAccept(req.id)}
                      title="Accept"
                      className="p-2 rounded-full bg-surface hover:bg-accent text-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeclineOrCancel(req.id)}
                    title={isIncoming ? "Decline" : "Cancel Request"}
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
