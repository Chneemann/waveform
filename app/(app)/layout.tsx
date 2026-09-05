/**
 * @file app/(app)/layout.tsx
 * @description Main application layout component that handles user authentication guards, parallel data loading for servers and direct messages, and wraps the app with navigation sidebars and server context.
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

/**
 * Renders the primary application layout with authentication checks, database fetching, and sidebar structure.
 *
 * @async
 * @function AppLayout
 * @param {Object} props - The layout properties.
 * @param {React.ReactNode} props.children - The nested child route content to be rendered within the layout.
 * @returns {Promise<JSX.Element>} The rendered application layout container.
 */
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

  return (
    <ServerProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <AppSidebar
          servers={userServers}
          conversations={formattedConversations}
          user={currentUser}
        />
        <div className="flex-1 flex min-w-0">{children}</div>
        <MemberSidebar />
      </div>
    </ServerProvider>
  );
}
