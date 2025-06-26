import { tasks } from "@/db/schema";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { taskId, moduleId } = await req.json();
    if (!taskId && !moduleId) {
      return NextResponse.json({ error: "not found" }, { status: 400 });
    }
    const responseDB = await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.moduleId, moduleId)))
      .returning();
    if (!responseDB) {
      return NextResponse.json({ error: "Database Error" }, { status: 409 });
    }
    return NextResponse.json({ message: "successfull" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "internal server Error", data: error },
      { status: 500 }
    );
  }
};
