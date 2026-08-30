/**
 * @file app/servers/[serverId]/channels/[channelId]/page.tsx
 * @description Dynamic page component for displaying a specific channel within a server, including its messages and chat input.
 */

import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { getChannelById } from "@/lib/services/channel.service";
import { getChannelMessages } from "@/lib/services/message.service";
import { getServerById } from "@/lib/services/server.service";

/**
 * Renders the channel view by fetching server, channel, and message details in parallel based on route parameters.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ serverId: string; channelId: string }>} props.params - A promise resolving to the route parameters containing serverId and channelId.
 * @returns {Promise<JSX.Element>} The rendered channel page interface.
 */
export default async function ChannelPage({
  params,
}: {
  params: Promise<{ serverId: string; channelId: string }>;
}) {
  const { serverId, channelId } = await params;

  // Parallel loading of server, channel, and messages
  const [server, channel, channelMessages] = await Promise.all([
    getServerById(serverId),
    getChannelById(channelId),
    getChannelMessages(channelId),
  ]);

  if (!channel || !server) redirect("/");

  return (
    <div className="flex p-4 flex-col h-full bg-background">
      {/* Header */}
      <AppHeader
        title={channel.name}
        showMembersButton
        server={{ id: server.id, name: server.name }}
      />

      {/* Messages Feed */}
      <ChatMessages channelName={channel.name} messages={channelMessages} />

      {/* Input Field */}
      <ChatInput
        serverId={server.id}
        channelId={channel.id}
        channelName={channel.name}
      />
    </div>
  );
}
