import NewDashBoard from "@/components/NewDashBoard";
import { modules } from "@/db/schema";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import React from "react";

const Dashboard = async () => {
    const { userId } = await auth();
  
    if (!userId) return null;
    const userModules = await db.query.modules.findMany({
      where: eq(modules.userId, userId),
      with: { tasks: true },
    });
  return <NewDashBoard taskGroups={userModules} />;
};

export default Dashboard;
