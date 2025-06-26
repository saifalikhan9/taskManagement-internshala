import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { modules, tasks } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { heading, tag, tasks: taskList } = body;

    if (!heading || !tag || !Array.isArray(taskList) || taskList.length === 0) {
      return NextResponse.json(
        { error: "Missing required module data" },
        { status: 400 }
      );
    }

    // 1. Save the module
    const [savedModule] = await db
      .insert(modules)
      .values({ userId, heading, tag })
      .returning();

    console.log(savedModule);

    // 2. Save the tasks with moduleId
    const tasksToInsert = taskList.map(
      (task: { text: string; completed: boolean }) => ({
        moduleId: savedModule.id,
        text: task.text,
        isCompleted: task.completed,
      })
    );
    console.log(tasksToInsert, "insert");

    await db.insert(tasks).values(tasksToInsert);

    return NextResponse.json(
      { success: true, moduleId: savedModule.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving module and tasks:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
