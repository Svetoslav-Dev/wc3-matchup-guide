import { readFile } from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import postgres from "postgres";

const envPath = path.resolve(process.cwd(), "../../.env");
dotenv.config({ path: envPath, override: false });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  process.exit(0);
}

const journalPath = path.resolve(process.cwd(), "../../packages/db/drizzle/meta/_journal.json");
const journal = JSON.parse(await readFile(journalPath, "utf8"));
const latestEntry = journal.entries[journal.entries.length - 1];

if (!latestEntry) {
  process.exit(0);
}

const sql = postgres(databaseUrl, { ssl: "require" });

try {
  const existingTables = await sql`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('users', 'races', 'heroes', 'units', 'maps', 'matchups', 'builds', 'build_steps', 'favorites', 'buildings', 'game_items')
  `;

  const tableSet = new Set(existingTables.map((row) => row.table_name));
  const hasExistingSchema = tableSet.size > 0;

  const existingColumns = await sql`
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and (
        (table_name = 'races' and column_name = 'image_url')
        or (table_name = 'heroes' and column_name = 'image_url')
        or (table_name = 'maps' and column_name = 'image_url')
        or (table_name = 'units' and column_name = 'image_url')
      )
  `;

  const columnSet = new Set(existingColumns.map((row) => `${row.table_name}.${row.column_name}`));

  const hasCoreTables = ["users", "races", "heroes", "units", "maps", "matchups", "builds", "build_steps", "favorites"]
    .every((name) => tableSet.has(name));
  const hasImageColumns = ["heroes.image_url", "maps.image_url", "units.image_url"]
    .every((name) => columnSet.has(name));
  const hasLatestSchema = tableSet.has("buildings")
    && tableSet.has("game_items")
    && columnSet.has("races.image_url");

  const syncJournalTable = async (qualifiedTable) => {
    const appliedRows = await sql.unsafe(`select created_at from ${qualifiedTable}`);
    const appliedCreatedAt = new Set(appliedRows.map((row) => Number(row.created_at)));

    const backfill = async (tag) => {
      const entry = journal.entries.find((item) => item.tag === tag);
      if (!entry || appliedCreatedAt.has(entry.when)) {
        return;
      }

      await sql.unsafe(
        `insert into ${qualifiedTable} (hash, created_at) values ($1, $2)`,
        [`bootstrap_${entry.tag}`, entry.when],
      );
      appliedCreatedAt.add(entry.when);
    };

    if (hasExistingSchema && hasCoreTables) {
      await backfill("0000_wandering_cable");
    }

    if (hasImageColumns) {
      await backfill("0001_flippant_the_renegades");
      await backfill("0002_fix_maps_image_url");
    }

    if (hasLatestSchema) {
      await backfill("0003_safe_metal_master");
    }
  };

  await sql`create schema if not exists drizzle`;
  await sql`
    create table if not exists drizzle.__drizzle_migrations (
      id serial primary key,
      hash text not null,
      created_at bigint
    )
  `;
  await sql`
    create table if not exists public.__drizzle_migrations (
      id serial primary key,
      hash text not null,
      created_at bigint
    )
  `;

  await syncJournalTable("drizzle.__drizzle_migrations");
  await syncJournalTable("public.__drizzle_migrations");
} finally {
  await sql.end();
}
