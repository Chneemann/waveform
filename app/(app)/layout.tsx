/**
 * @file app/(app)/layout.tsx
 * @description Root application layout wrapping sidebars and main workspace content within the ServerProvider context.
 */

import { auth } from "@/auth";
import { getUserServers } from "@/lib/services/server.service";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MemberSidebar } from "@/components/layout/MemberSidebar";
import { ServerProvider } from "@/lib/context/ServerContext";
import { redirect } from "next/navigation";

/**
 * Server component layout wrapper for authenticated application views.
 * Handles session verification, fetches user servers, and renders global layout components.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child page content to render inside the main viewport layout.
 * @returns {Promise<JSX.Element>} The rendered application layout hierarchy with provider contexts.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userServers = await getUserServers(session.user.id);

  return (
    <ServerProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <AppSidebar servers={userServers} />
        <div className="flex-1 flex min-w-0">{children}</div>
        <MemberSidebar />
      </div>
    </ServerProvider>
  );
}
