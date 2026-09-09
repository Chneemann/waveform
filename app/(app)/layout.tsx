/**
 * @file app/(app)/layout.tsx
 * @description Main application layout component that handles authentication, parallel data fetching for servers and conversations, and global sidebar state.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { users, conversations } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { getUserServers } from "@/lib/services/server.service";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MemberSidebar } from "@/components/layout/MemberSidebar";
import { ServerProvider } from "@/lib/context/ServerContext";
import { redirect } from "next/navigation";
import { getUserFriendships } from "@/lib/services/friends.service";

/** Renders the primary application layout with authentication checks, database fetching, and sidebar structure. */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  // Single Auth Guard
  if (!currentUserId) {
    redirect("/login");
  }

  // Parallel Loading: User Details, Servers & DM-Conversations
  const [[currentUser], userServers, userConversations] = await Promise.all([
    db
      .select({
        id: users.id,
        username: users.username,
        color: users.color,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, currentUserId))
      .limit(1),
    getUserServers(currentUserId),
    db.query.conversations.findMany({
      where: or(
        eq(conversations.userOneId, currentUserId),
        eq(conversations.userTwoId, currentUserId),
      ),
      with: {
        userOne: true,
        userTwo: true,
      },
    }),
  ]);

  if (!currentUser) {
    redirect("/login");
  }

  // Transform conversations to isolate the respective conversation partner
  const formattedConversations = userConversations.map((c) => {
    const partner = c.userOne.id === currentUserId ? c.userTwo : c.userOne;

    return {
      id: c.id,
      partner: {
        id: partner.id,
        username: partner.username,
        color: partner.color,
        status: partner.status,
      },
    };
  });

  // Loading Friendships data
  const [friendships] = await Promise.all([
    getUserFriendships(session.user.id),
  ]);

  return (
    <ServerProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <AppSidebar
          servers={userServers}
          conversations={formattedConversations}
          user={currentUser}
        />
        <div className="flex-1 flex min-w-0">{children}</div>
        <MemberSidebar
          currentUserId={currentUserId}
          userFriendships={friendships}
        />
      </div>
    </ServerProvider>
  );
}
