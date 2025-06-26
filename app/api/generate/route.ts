// app/api/generate-tasks/route.ts

import gemini from "@/lib/gemini"; // This should be the function that returns tasks[]
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { task } = await req.json();  

    if (!task || typeof task !== "string") {
      return NextResponse.json(
        { error: "Invalid request. 'task' is required." },
        { status: 400 }
      );
    }

    const tasks = await gemini(task);

    return NextResponse.json({ moduleData : tasks }, { status: 200 });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
};
