import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { moduleRelations, modules, taskRelations, tasks } from "@/db/schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, {
  schema: { modules,tasks,moduleRelations,taskRelations},
});
