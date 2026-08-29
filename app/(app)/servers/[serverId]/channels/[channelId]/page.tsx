/**
 * @file app/servers/[serverId]/channels/[channelId]/page.tsx
 * @description Page component for viewing a specific channel and its messages.
 */

import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { getChannelById } from "@/lib/services/channel.service";
import { getChannelMessages } from "@/lib/services/message.service";

/**
 * Server component that fetches and renders a channel's details and message feed based on route parameters.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ channelId: string }>} props.params - Async route parameters containing the channel ID.
 * @returns {Promise<JSX.Element>} The rendered channel page view or triggers a 404 notFound error.
 */
export default async function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;

  // Paralleles Laden von Kanal-Daten und Nachrichten
  const [channel, channelMessages] = await Promise.all([
    getChannelById(channelId),
    getChannelMessages(channelId),
  ]);

  if (!channel) return notFound();

  return (
    <div className="flex p-4 flex-col h-full bg-background">
      {/* Header */}
      <AppHeader title={channel.name} showMembersButton />

      {/* Messages Feed */}
      <ChatMessages channelName={channel.name} messages={channelMessages} />

      {/* Input Field */}
      <ChatInput />
    </div>
  );
}
