import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, taskText, moduleId } = await req.json();

    if (!taskId || !taskText || !moduleId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const updated = await db
      .update(tasks)
      .set({ text: taskText })
      .where(and(eq(tasks.id, taskId), eq(tasks.moduleId, moduleId)))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: "Task not found or not updated" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task updated successfully" }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
};
