/**
 * @file app/(app)/layout.tsx
 * @description Root application layout wrapping sidebars and main workspace content within the ServerProvider context.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserServers } from "@/lib/services/server.service";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MemberSidebar } from "@/components/layout/MemberSidebar";
import { ServerProvider } from "@/lib/context/ServerContext";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [currentUser] = await db
    .select({
      id: users.id,
      username: users.username,
      color: users.color,
      status: users.status,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!currentUser) {
    redirect("/login");
  }

  const userServers = await getUserServers(session.user.id);

  return (
    <ServerProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <AppSidebar servers={userServers} user={currentUser} />
        <div className="flex-1 flex min-w-0">{children}</div>
        <MemberSidebar />
      </div>
    </ServerProvider>
  );
}
