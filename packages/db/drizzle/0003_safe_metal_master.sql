CREATE TABLE IF NOT EXISTS "buildings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "buildings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(120) NOT NULL,
	"race" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"image_file" varchar(120) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "game_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(120) NOT NULL,
	"category" varchar(20) NOT NULL,
	"shops" text NOT NULL,
	"description" text NOT NULL,
	"image_file" varchar(120) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "races" ADD COLUMN IF NOT EXISTS "image_url" varchar(500);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "buildings_race_idx" ON "buildings" USING btree ("race");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "game_items_category_idx" ON "game_items" USING btree ("category");
