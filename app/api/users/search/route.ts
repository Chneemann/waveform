/**
 * @file app/api/users/search/route.ts
 * @description API route handler for searching users by username with query validation and database lookup.
 */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ilike } from "drizzle-orm";

/**
 * Handles GET requests to search for users based on a query string parameter.
 *
 * @async
 * @function GET
 * @param {Request} request - The incoming HTTP request object containing URL search parameters.
 * @returns {Promise<NextResponse>} A JSON response containing the array of matching users or an error message.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const matchingUsers = await db
      .select({
        id: users.id,
        username: users.username,
        color: users.color,
        status: users.status,
      })
      .from(users)
      .where(ilike(users.username, `%${query}%`))
      .limit(8);

    return NextResponse.json(matchingUsers);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
