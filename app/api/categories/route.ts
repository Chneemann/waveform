/**
 * @file app/api/categories/route.ts
 * @description API route handler for creating new categories within a server.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { categories, members } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/** Handles the POST request to create a new category within a specific server. */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, serverId } = await req.json();

    if (!name || !serverId) {
      return NextResponse.json(
        { error: "Name and server ID are required" },
        { status: 400 },
      );
    }

    if (name.length > 32) {
      return NextResponse.json(
        { error: "Category name cannot exceed 32 characters" },
        { status: 400 },
      );
    }

    // Check if the user is a member of the server
    const [member] = await db
      .select()
      .from(members)
      .where(
        and(
          eq(members.userId, session.user.id),
          eq(members.serverId, serverId),
        ),
      )
      .limit(1);

    if (!member) {
      return NextResponse.json(
        { error: "Access denied to this server" },
        { status: 403 },
      );
    }

    // Create the category
    const [newCategory] = await db
      .insert(categories)
      .values({
        name: name.trim(),
        serverId,
      })
      .returning();

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("API Category POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
