/**
 * @file app/(app)/servers/[serverId]/layout.tsx
 * @description Server layout component synchronizing active server state and guarding server route access.
 */

import { auth } from "@/auth";
import { getServerWithChannels } from "@/lib/services/server.service";
import { ServerStateSync } from "@/lib/providers/ServerStateSync";
import { redirect } from "next/navigation";

/**
 * Properties for the ServerLayout component.
 *
 * @interface ServerLayoutProps
 * @property {React.ReactNode} children - Child elements to be rendered within the layout context.
 * @property {Promise<{ serverId: string }>} params - Asynchronous route parameters containing the active serverId.
 */
interface ServerLayoutProps {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}

/**
 * Server component that verifies user authentication, retrieves the target server with its channels, synchronizes server state, and wraps child routes.
 *
 * @param {ServerLayoutProps} props - The component props.
 * @returns {Promise<JSX.Element>} The rendered server layout tree.
 */
export default async function ServerLayout({
  children,
  params,
}: ServerLayoutProps) {
  const { serverId } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const server = await getServerWithChannels(serverId, session.user.id);

  if (!server) redirect("/");

  return (
    <div className="flex h-full w-full min-w-0">
      <ServerStateSync server={server} />
      <div className="flex-1 flex flex-col h-full bg-background min-w-0">
        {children}
      </div>
    </div>
  );
}
