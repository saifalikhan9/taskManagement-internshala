ALTER TABLE "tasks" DROP CONSTRAINT "tasks_module_id_modules_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "moduleId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_moduleId_modules_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "module_id";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "completed";