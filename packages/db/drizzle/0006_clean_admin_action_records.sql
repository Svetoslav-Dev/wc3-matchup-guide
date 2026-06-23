UPDATE "builds"
SET "deleted_at" = now(), "updated_at" = now()
WHERE "deleted_at" IS NULL
  AND (
    "slug" LIKE 'admin-action-build-%'
    OR "title" LIKE 'Admin Action Build %'
    OR "title" LIKE 'Updated Admin Action Build %'
  );
--> statement-breakpoint
UPDATE "matchups"
SET "deleted_at" = now(), "updated_at" = now()
WHERE "deleted_at" IS NULL
  AND (
    "slug" LIKE 'admin-action-matchup-%'
    OR "title" LIKE 'Admin Action Matchup %'
    OR "title" LIKE 'Updated Admin Action Matchup %'
  );
--> statement-breakpoint
UPDATE "heroes"
SET "deleted_at" = now(), "updated_at" = now()
WHERE "deleted_at" IS NULL
  AND (
    "slug" LIKE 'admin-action-hero-%'
    OR "name" LIKE 'Admin Action Hero %'
    OR "name" LIKE 'Updated Admin Action Hero %'
  );
--> statement-breakpoint
UPDATE "units"
SET "deleted_at" = now(), "updated_at" = now()
WHERE "deleted_at" IS NULL
  AND (
    "slug" LIKE 'admin-action-unit-%'
    OR "name" LIKE 'Admin Action Unit %'
    OR "name" LIKE 'Updated Admin Action Unit %'
  );
--> statement-breakpoint
UPDATE "maps"
SET "deleted_at" = now(), "updated_at" = now()
WHERE "deleted_at" IS NULL
  AND (
    "slug" LIKE 'admin-action-map-%'
    OR "name" LIKE 'Admin Action Map %'
    OR "name" LIKE 'Updated Admin Action Map %'
  );
--> statement-breakpoint
UPDATE "races"
SET "deleted_at" = now(), "updated_at" = now()
WHERE "deleted_at" IS NULL
  AND (
    "slug" LIKE 'admin-action-race-%'
    OR "name" LIKE 'Admin Action Race %'
    OR "name" LIKE 'Updated Admin Action Race %'
  );
--> statement-breakpoint
UPDATE "buildings"
SET "deleted_at" = now(), "updated_at" = now()
WHERE "deleted_at" IS NULL
  AND (
    "name" LIKE 'Admin Action Building %'
    OR "name" LIKE 'Updated Admin Action Building %'
  );
--> statement-breakpoint
UPDATE "game_items"
SET "deleted_at" = now(), "updated_at" = now()
WHERE "deleted_at" IS NULL
  AND (
    "name" LIKE 'Admin Action Item %'
    OR "name" LIKE 'Updated Admin Action Item %'
  );
