/**
 * @file components/friends/FriendsView.tsx
 * @description Interactive Discord-style friends list view component orchestrating tabs.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { TabType } from "@/components/friends/FriendsHeader";
import { AddFriendTab } from "./AddFriendTab";
import { PendingRequestsTab } from "./PendingRequestsTab";
import { AllFriendsTab } from "./AllFriendsTab";
import { UserStatus } from "@/db/schema";

/**
 * Status types for a friendship relation.
 *
 * @type {FriendshipStatus}
 */
export type FriendshipStatus = "PENDING" | "ACCEPTED" | "BLOCKED";

/**
 * Represents a user within a friendship context.
 *
 * @interface FriendUser
 * @property {string} id - The unique identifier of the user.
 * @property {string} username - The display username of the user.
 * @property {string} color - The associated profile color of the user.
 * @property {UserStatus} status - The current online/activity status of the user.
 */
export interface FriendUser {
  id: string;
  username: string;
  color: string;
  status: UserStatus;
}

/**
 * Represents a friendship entry between two users.
 *
 * @interface Friendship
 * @property {string} id - The unique identifier of the friendship record.
 * @property {string} senderId - The user ID of the friend request sender.
 * @property {string} receiverId - The user ID of the friend request receiver.
 * @property {FriendshipStatus} status - The current status of the friendship.
 * @property {FriendUser} sender - The profile details of the sender user.
 * @property {FriendUser} receiver - The profile details of the receiver user.
 */
export interface Friendship {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendshipStatus;
  sender: FriendUser;
  receiver: FriendUser;
}

/**
 * Properties for the FriendsView component.
 *
 * @interface FriendsViewProps
 * @property {string} currentUserId - The unique identifier of the currently logged-in user.
 * @property {Friendship[]} initialFriendships - Initial list of friendships fetched from the server.
 */
interface FriendsViewProps {
  currentUserId: string;
  initialFriendships: Friendship[];
}

/**
 * Renders the friends view container, managing navigation tabs, state synchronization, and friendship mutation actions.
 *
 * @param {FriendsViewProps} props - The component props.
 * @param {string} props.currentUserId - The unique identifier of the currently logged-in user.
 * @param {Friendship[]} props.initialFriendships - Initial list of friendships.
 * @returns {JSX.Element} The rendered friends view interface.
 */
export function FriendsView({
  currentUserId,
  initialFriendships,
}: FriendsViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [friendships, setFriendships] =
    useState<Friendship[]>(initialFriendships);

  useEffect(() => {
    setFriendships(initialFriendships);
  }, [initialFriendships]);

  /**
   * Retrieves the counter-party user object from a given friendship record relative to the current user.
   *
   * @function getFriendUser
   * @param {Friendship} f - The friendship object to evaluate.
   * @returns {FriendUser} The other user involved in the friendship.
   */
  const getFriendUser = (f: Friendship): FriendUser => {
    return f.senderId === currentUserId ? f.receiver : f.sender;
  };

  const pendingRequests = friendships.filter((f) => f.status === "PENDING");
  const acceptedFriends = friendships.filter((f) => f.status === "ACCEPTED");

  /**
   * Handles accepting a pending friend request via API.
   *
   * @async
   * @function handleAccept
   * @param {string} friendshipId - The unique identifier of the friendship request to accept.
   * @returns {Promise<void>} Resolves when the request is processed.
   */
  const handleAccept = async (friendshipId: string) => {
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" }),
      });
      if (res.ok) {
        setFriendships((prev) =>
          prev.map((item) =>
            item.id === friendshipId ? { ...item, status: "ACCEPTED" } : item,
          ),
        );
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to accept request:", err);
    }
  };

  /**
   * Handles deleting or declining a friendship or pending request via API.
   *
   * @async
   * @function handleDeleteOrDecline
   * @param {string} friendshipId - The unique identifier of the friendship to delete.
   * @returns {Promise<void>} Resolves when the deletion is processed.
   */
  const handleDeleteOrDecline = async (friendshipId: string) => {
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFriendships((prev) =>
          prev.filter((item) => item.id !== friendshipId),
        );
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete friendship/request:", err);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background text-white">
      {/* Header */}
      <AppHeader
        showFriendsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allCount={acceptedFriends.length}
        pendingCount={pendingRequests.length}
      />

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto pt-4">
        {activeTab === "add" && <AddFriendTab />}

        {activeTab === "pending" && (
          <PendingRequestsTab
            currentUserId={currentUserId}
            pendingRequests={pendingRequests}
            getFriendUser={getFriendUser}
            onAccept={handleAccept}
            onDeclineOrCancel={handleDeleteOrDecline}
          />
        )}

        {activeTab === "all" && (
          <AllFriendsTab
            acceptedFriends={acceptedFriends}
            getFriendUser={getFriendUser}
            onRemove={handleDeleteOrDecline}
          />
        )}
      </div>
    </div>
  );
}
