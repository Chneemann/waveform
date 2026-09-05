/**
 * @file app/(app)/page.tsx
 * @description Main application page component that performs user authentication checks, fetches raw friendship data from the database, and renders the friends management view.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { friendships } from "@/db/schema";
import { or, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FriendsView, type Friendship } from "@/components/friends/FriendsView";

/**
 * Asynchronously renders the main application page for authenticated users.
 *
 * @async
 * @function AppPage
 * @returns {Promise<JSX.Element>} The rendered application page container with the FriendsView component.
 */
export default async function AppPage() {
  const session = await auth();
  const currentUserId = session?.user?.id;

  // Single Auth Guard
  if (!currentUserId) {
    redirect("/login");
  }

  // Retrieve all of the user's friendships
  const rawFriendships = await db.query.friendships.findMany({
    where: or(
      eq(friendships.senderId, currentUserId),
      eq(friendships.receiverId, currentUserId),
    ),
    with: {
      sender: {
        columns: {
          id: true,
          username: true,
          color: true,
          status: true,
        },
      },
      receiver: {
        columns: {
          id: true,
          username: true,
          color: true,
          status: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col h-full w-full bg-background p-4">
      <FriendsView
        currentUserId={currentUserId}
        initialFriendships={rawFriendships as Friendship[]}
      />
    </div>
  );
}
