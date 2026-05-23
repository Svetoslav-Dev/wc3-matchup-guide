ALTER TABLE "buildings" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "builds" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "game_items" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "heroes" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "maps" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "matchups" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "races" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN "deleted_at" timestamp;