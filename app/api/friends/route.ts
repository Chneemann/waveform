/**
 * @file app/api/friends/route.ts
 * @description API route handlers for managing user friendships, supporting fetching user friendships via GET and creating new friend requests via POST.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { friendships, users } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Handles GET requests to retrieve all friendships and friend requests for the authenticated user.
 *
 * @async
 * @function GET
 * @returns {Promise<NextResponse>} A JSON response containing the list of friendships or an error object.
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;

    // Fetch all friendships where current user is either sender or receiver
    const list = await db.query.friendships.findMany({
      where: or(
        eq(friendships.senderId, currentUserId),
        eq(friendships.receiverId, currentUserId),
      ),
      with: {
        sender: {
          columns: {
            id: true,
            username: true,
            color: true,
            status: true,
          },
        },
        receiver: {
          columns: {
            id: true,
            username: true,
            color: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(list);
  } catch (error) {
    console.error("API Friends GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * Handles POST requests to create a new friend request based on a target username.
 *
 * @async
 * @function POST
 * @param {Request} req - The incoming HTTP request containing the target username in the JSON body.
 * @returns {Promise<NextResponse>} A JSON response containing the created friendship record or an error message.
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    const { username } = await req.json();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trimmedUsername = username?.trim();

    if (!trimmedUsername) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    // Find the target user by username
    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, trimmedUsername))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent sending a request to oneself
    if (targetUser.id === session.user.id) {
      return NextResponse.json(
        { error: "You cannot add yourself as a friend" },
        { status: 400 },
      );
    }

    // Check if a friendship or request already exists between these users
    const [existingFriendship] = await db
      .select()
      .from(friendships)
      .where(
        or(
          and(
            eq(friendships.senderId, session.user.id),
            eq(friendships.receiverId, targetUser.id),
          ),
          and(
            eq(friendships.senderId, targetUser.id),
            eq(friendships.receiverId, session.user.id),
          ),
        ),
      )
      .limit(1);

    if (existingFriendship) {
      return NextResponse.json(
        { error: "A friendship or request already exists with this user" },
        { status: 400 },
      );
    }

    // Create new friend request
    const [newFriendship] = await db
      .insert(friendships)
      .values({
        senderId: session.user.id,
        receiverId: targetUser.id,
        status: "PENDING",
      })
      .returning();

    return NextResponse.json(newFriendship, { status: 201 });
  } catch (error) {
    console.error("API Friends POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
