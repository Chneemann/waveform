/**
 * @file app/(app)/dm/[conversationId]/page.tsx
 * @description Server component for direct message conversation pages, handling authentication, route validation, database fetching, and layout rendering.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { conversations, directMessages } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import type { MessageWithMember } from "@/components/chat/ChatItem";

/**
 * Regular expression to validate standard UUID v1-v5 formats.
 *
 * @type {RegExp}
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Renders the direct message conversation page with header, message history, and input field.
 *
 * @async
 * @function DirectMessagePage
 * @param {Object} props - The page props containing parameters.
 * @param {Promise<{ conversationId: string }>} props.params - Route parameters containing the conversation identifier.
 * @returns {Promise<JSX.Element>} The rendered direct message page layout.
 */
export default async function DirectMessagePage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  // 1. Validation
  if (!UUID_REGEX.test(conversationId)) {
    redirect("/");
  }

  // 2. Auth Guard
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 3. Database Queries
  const [conversation, rawMessages] = await Promise.all([
    db.query.conversations.findFirst({
      where: and(
        eq(conversations.id, conversationId),
        or(
          eq(conversations.userOneId, session.user.id),
          eq(conversations.userTwoId, session.user.id),
        ),
      ),
      with: {
        userOne: true,
        userTwo: true,
      },
    }),
    db.query.directMessages.findMany({
      where: eq(directMessages.conversationId, conversationId),
      with: {
        sender: true,
      },
      orderBy: (dm, { asc }) => [asc(dm.createdAt)],
    }),
  ]);

  if (!conversation) {
    redirect("/");
  }

  // 4. Identify the person to contact
  const partner =
    conversation.userOne.id === session.user.id
      ? conversation.userTwo
      : conversation.userOne;

  // 5. Format Messages for UI
  const initialMessages: MessageWithMember[] = rawMessages.map((msg) => ({
    ...msg,
    type: "dm",
    memberId: msg.senderId,
    member: {
      id: msg.sender.id,
      role: "MEMBER",
      user: msg.sender,
    },
  }));

  return (
    <div className="flex p-4 flex-col h-full w-full bg-background min-h-0 overflow-hidden">
      <AppHeader title={partner.username} />

      <ChatMessages
        type="dm"
        name={partner.username}
        initialMessages={initialMessages}
        currentUserId={session.user.id}
      />

      <ChatInput
        type="dm"
        conversationId={conversationId}
        placeholderName={partner.username}
      />
    </div>
  );
}
