/**
 * @file app/(app)/page.tsx
 * @description Main application layout page featuring the FriendsView.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { friendships } from "@/db/schema";
import { or, eq } from "drizzle-orm";
import { AppHeader } from "@/components/layout/AppHeader";
import { FriendsView, Friendship } from "@/components/friends/FriendsView";

export default async function AppPage() {
  const session = await auth();

  let initialFriendships: Friendship[] = [];

  if (session?.user?.id) {
    const currentUserId = session.user.id;

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

    initialFriendships = rawFriendships as Friendship[];
  }

  return (
    <div className="flex flex-col h-full w-full bg-background p-4">
      {session?.user?.id ? (
        <FriendsView
          currentUserId={session.user.id}
          initialFriendships={initialFriendships}
        />
      ) : (
        <>
          <AppHeader />
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-xl font-bold text-white mb-2">Welcome back!</h2>
            <p className="text-muted max-w-sm">
              Please sign in to view your friends list or start a conversation.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
