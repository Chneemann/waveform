/**
 * @file app/api/categories/[categoryId]/route.ts
 * @description API route handler for updating and deleting categories.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { categories, members } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/** Handles PATCH requests to update an existing category's name. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const { categoryId } = await params;
    const session = await auth();
    const { name } = await req.json();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json(
        { error: "Category name cannot be empty" },
        { status: 400 },
      );
    }

    if (name.length > 32) {
      return NextResponse.json(
        { error: "Category name cannot exceed 32 characters" },
        { status: 400 },
      );
    }

    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Check if the user is a member of the server
    const [member] = await db
      .select()
      .from(members)
      .where(
        and(
          eq(members.userId, session.user.id),
          eq(members.serverId, existingCategory.serverId),
        ),
      )
      .limit(1);

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update Category
    const [updatedCategory] = await db
      .update(categories)
      .set({ name: name.trim() })
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("API Category PATCH error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/** Handles DELETE requests to remove an existing category. */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const { categoryId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Check if the user is a member of the server
    const [member] = await db
      .select()
      .from(members)
      .where(
        and(
          eq(members.userId, session.user.id),
          eq(members.serverId, existingCategory.serverId),
        ),
      )
      .limit(1);

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete Category
    await db.delete(categories).where(eq(categories.id, categoryId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Category DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
