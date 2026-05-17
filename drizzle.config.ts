import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./packages/db/drizzle",
  schema: "./packages/db/src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/warcraft3_strategy_hub",
  },
});

