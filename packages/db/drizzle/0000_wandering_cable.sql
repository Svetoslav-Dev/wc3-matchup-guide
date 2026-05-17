CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "build_steps" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "build_steps_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"build_id" integer NOT NULL,
	"step_number" integer NOT NULL,
	"supply" integer NOT NULL,
	"timing" varchar(20) NOT NULL,
	"instruction" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "builds" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "builds_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"race_id" integer NOT NULL,
	"matchup_id" integer,
	"title" varchar(180) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"summary" text NOT NULL,
	"difficulty" varchar(50) NOT NULL,
	"strategy_type" varchar(80) NOT NULL,
	"body" text NOT NULL,
	"created_by_user_id" integer NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "favorites_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"build_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "heroes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "heroes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"race_id" integer NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"primary_attribute" varchar(40) NOT NULL,
	"role" varchar(80) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maps" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "maps_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"creep_notes" text NOT NULL,
	"expansion_notes" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matchups" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "matchups_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"race_a_id" integer NOT NULL,
	"race_b_id" integer NOT NULL,
	"title" varchar(160) NOT NULL,
	"slug" varchar(160) NOT NULL,
	"summary" text NOT NULL,
	"difficulty" varchar(50) NOT NULL,
	"early_game_plan" text NOT NULL,
	"mid_game_plan" text NOT NULL,
	"late_game_plan" text NOT NULL,
	"common_mistakes" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "races" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "races_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"identity" text NOT NULL,
	"ladder_focus" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "units_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"race_id" integer NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"unit_type" varchar(80) NOT NULL,
	"strengths" text NOT NULL,
	"weaknesses" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "build_steps" ADD CONSTRAINT "build_steps_build_id_builds_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."builds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "builds" ADD CONSTRAINT "builds_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "builds" ADD CONSTRAINT "builds_matchup_id_matchups_id_fk" FOREIGN KEY ("matchup_id") REFERENCES "public"."matchups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "builds" ADD CONSTRAINT "builds_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_build_id_builds_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."builds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "heroes" ADD CONSTRAINT "heroes_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchups" ADD CONSTRAINT "matchups_race_a_id_races_id_fk" FOREIGN KEY ("race_a_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchups" ADD CONSTRAINT "matchups_race_b_id_races_id_fk" FOREIGN KEY ("race_b_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "build_steps_build_id_idx" ON "build_steps" USING btree ("build_id");--> statement-breakpoint
CREATE UNIQUE INDEX "build_steps_build_id_step_number_idx" ON "build_steps" USING btree ("build_id","step_number");--> statement-breakpoint
CREATE UNIQUE INDEX "builds_slug_idx" ON "builds" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "builds_race_id_idx" ON "builds" USING btree ("race_id");--> statement-breakpoint
CREATE INDEX "builds_matchup_id_idx" ON "builds" USING btree ("matchup_id");--> statement-breakpoint
CREATE INDEX "builds_created_by_user_id_idx" ON "builds" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "favorites_user_id_idx" ON "favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "favorites_build_id_idx" ON "favorites" USING btree ("build_id");--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_id_build_id_idx" ON "favorites" USING btree ("user_id","build_id");--> statement-breakpoint
CREATE UNIQUE INDEX "heroes_slug_idx" ON "heroes" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "heroes_race_id_idx" ON "heroes" USING btree ("race_id");--> statement-breakpoint
CREATE UNIQUE INDEX "maps_slug_idx" ON "maps" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "matchups_slug_idx" ON "matchups" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "matchups_race_a_id_idx" ON "matchups" USING btree ("race_a_id");--> statement-breakpoint
CREATE INDEX "matchups_race_b_id_idx" ON "matchups" USING btree ("race_b_id");--> statement-breakpoint
CREATE UNIQUE INDEX "races_slug_idx" ON "races" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "units_slug_idx" ON "units" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "units_race_id_idx" ON "units" USING btree ("race_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");