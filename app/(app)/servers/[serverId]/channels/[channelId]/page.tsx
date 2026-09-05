/**
 * @file app/(app)/servers/[serverId]/channels/[channelId]/page.tsx
 * @description Dynamic server channel page component performing authentication, parameter validation, parallel data fetching, and rendering the chat layout.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { getChannelById } from "@/lib/services/channel.service";
import { getChannelMessages } from "@/lib/services/message.service";
import { getServerById } from "@/lib/services/server.service";

/**
 * Regular expression for validating UUID string formats.
 *
 * @type {RegExp}
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Renders the channel chat view by validating parameters, checking user session, fetching channel data, and displaying headers, messages, and input controls.
 *
 * @async
 * @function ChannelPage
 * @param {Object} props - The component props containing route parameters.
 * @param {Promise<{ serverId: string; channelId: string }>} props.params - Route parameters containing server and channel identifiers.
 * @returns {Promise<JSX.Element>} The rendered channel page layout.
 */
export default async function ChannelPage({
  params,
}: {
  params: Promise<{ serverId: string; channelId: string }>;
}) {
  const { serverId, channelId } = await params;

  // 1. Check the UUID format for BOTH parameters
  if (!UUID_REGEX.test(serverId) || !UUID_REGEX.test(channelId)) {
    redirect("/");
  }

  // 2. Auth Guard
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 3. Parallel Loading of Data
  const [server, channel, channelMessages] = await Promise.all([
    getServerById(serverId),
    getChannelById(channelId),
    getChannelMessages(channelId),
  ]);

  if (!channel || !server) {
    redirect("/");
  }
  return (
    <div className="flex p-4 flex-col h-full bg-background min-h-0 overflow-hidden">
      <AppHeader
        title={channel.name}
        showMembersButton
        server={{ id: server.id, name: server.name }}
      />

      <ChatMessages
        type="chat"
        name={channel.name}
        initialMessages={channelMessages}
        currentUserId={session?.user?.id}
      />

      <ChatInput
        type="chat"
        serverId={server.id}
        channelId={channel.id}
        placeholderName={channel.name}
      />
    </div>
  );
}
