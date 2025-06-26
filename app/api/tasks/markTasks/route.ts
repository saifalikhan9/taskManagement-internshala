import { tasks } from "@/db/schema";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { completed, taskId, moduleId } = await req.json();

    if (typeof completed !== "boolean" || !taskId || !moduleId) {
      return NextResponse.json(
        { error: "Invalid data provided from the client" },
        { status: 400 }
      );
    }

    const responseDB = await db
      .update(tasks)
      .set({ completed })
      .where(and(eq(tasks.id, taskId), eq(tasks.moduleId, moduleId)))
      .returning();

    return NextResponse.json(
      { message: "Success", data: responseDB },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
};
