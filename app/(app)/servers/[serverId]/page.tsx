/**
 * @file app/servers/[serverId]/page.tsx
 * @description Page component redirecting to the first available channel of a server.
 */

import { auth } from "@/auth";
import { getServerWithChannels } from "@/lib/services/server.service";
import { redirect } from "next/navigation";

export default async function ServerPage({
  params,
}: {
  params: Promise<{ serverId: string }>;
}) {
  const { serverId } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const server = await getServerWithChannels(serverId, session.user.id);

  if (!server) redirect("/");

  // Falls doch jemand direkt /servers/[serverId] aufruft
  if (server.channels.length > 0) {
    redirect(`/servers/${serverId}/channels/${server.channels[0].id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <h2 className="text-xl font-bold text-white mb-2">
        Welcome to {server.name}!
      </h2>
      <p className="text-muted max-w-sm">
        No channels have been created on this server yet. Create a channel to
        chat.
      </p>
    </div>
  );
}
