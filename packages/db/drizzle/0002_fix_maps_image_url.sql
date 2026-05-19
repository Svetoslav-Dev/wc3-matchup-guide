ALTER TABLE "heroes" ADD COLUMN IF NOT EXISTS "image_url" varchar(500);--> statement-breakpoint
ALTER TABLE "maps" ADD COLUMN IF NOT EXISTS "image_url" varchar(500);--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN IF NOT EXISTS "image_url" varchar(500);
