import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionCache = globalThis as typeof globalThis & {
  __wc3Sql?: ReturnType<typeof postgres>;
  __wc3Db?: PostgresJsDatabase<typeof schema>;
};

export const hasDatabaseUrl = () => Boolean(process.env.DATABASE_URL);

export const getDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }

  return databaseUrl;
};

export const getSql = () => {
  if (!connectionCache.__wc3Sql) {
    connectionCache.__wc3Sql = postgres(getDatabaseUrl(), {
      max: 1,
      prepare: false,
    });
  }

  return connectionCache.__wc3Sql;
};

export const getDb = () => {
  if (!connectionCache.__wc3Db) {
    connectionCache.__wc3Db = drizzle(getSql(), { schema });
  }

  return connectionCache.__wc3Db;
};

