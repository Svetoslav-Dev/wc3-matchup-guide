DROP INDEX "builds_slug_idx";--> statement-breakpoint
DROP INDEX "heroes_slug_idx";--> statement-breakpoint
DROP INDEX "maps_slug_idx";--> statement-breakpoint
DROP INDEX "matchups_slug_idx";--> statement-breakpoint
DROP INDEX "races_slug_idx";--> statement-breakpoint
DROP INDEX "units_slug_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "builds_slug_idx" ON "builds" USING btree ("slug") WHERE deleted_at is null;--> statement-breakpoint
CREATE UNIQUE INDEX "heroes_slug_idx" ON "heroes" USING btree ("slug") WHERE deleted_at is null;--> statement-breakpoint
CREATE UNIQUE INDEX "maps_slug_idx" ON "maps" USING btree ("slug") WHERE deleted_at is null;--> statement-breakpoint
CREATE UNIQUE INDEX "matchups_slug_idx" ON "matchups" USING btree ("slug") WHERE deleted_at is null;--> statement-breakpoint
CREATE UNIQUE INDEX "races_slug_idx" ON "races" USING btree ("slug") WHERE deleted_at is null;--> statement-breakpoint
CREATE UNIQUE INDEX "units_slug_idx" ON "units" USING btree ("slug") WHERE deleted_at is null;