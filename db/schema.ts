// db/schema.ts
import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  heading: text("heading").notNull(),
  tag: text("tag").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  completed: boolean("completed").default(false),
  moduleId: integer("moduleId")
    .references(() => modules.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const moduleRelations = relations(modules, ({ many }) => ({
  tasks: many(tasks),
}));

export const taskRelations = relations(tasks, ({ one }) => ({
  modules: one(modules, {
    fields: [tasks.moduleId],
    references: [modules.id],
  }),
}));
