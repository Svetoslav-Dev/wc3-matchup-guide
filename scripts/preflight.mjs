import "dotenv/config";
import postgres from "postgres";

const results = [];

const addResult = (label, ok, detail) => {
  results.push({ label, ok, detail });
};

const hasValue = (value) => typeof value === "string" && value.trim().length > 0;

const main = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const publicAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  addResult(
    "DATABASE_URL",
    hasValue(databaseUrl),
    hasValue(databaseUrl) ? "Configured." : "Missing. Required for database-backed features.",
  );

  addResult(
    "JWT_SECRET",
    hasValue(jwtSecret) && (jwtSecret?.length ?? 0) >= 24,
    hasValue(jwtSecret)
      ? (jwtSecret?.length ?? 0) >= 24
        ? "Configured."
        : "Present but shorter than recommended for production."
      : "Missing. Required for auth and protected routes.",
  );

  addResult(
    "NEXT_PUBLIC_API_URL",
    hasValue(publicApiUrl),
    hasValue(publicApiUrl) ? `Configured as ${publicApiUrl}.` : "Missing.",
  );

  addResult(
    "NEXT_PUBLIC_APP_URL",
    hasValue(publicAppUrl),
    hasValue(publicAppUrl) ? `Configured as ${publicAppUrl}.` : "Missing.",
  );

  if (hasValue(databaseUrl)) {
    const sql = postgres(databaseUrl, {
      max: 1,
      prepare: false,
      connect_timeout: 5,
    });

    try {
      await sql`select 1`;
      addResult("Database connection", true, "Connected successfully.");
    } catch (error) {
      addResult(
        "Database connection",
        false,
        error instanceof Error ? error.message : "Database connection failed.",
      );
    } finally {
      await sql.end({ timeout: 1 });
    }
  } else {
    addResult("Database connection", false, "Skipped because DATABASE_URL is missing.");
  }

  console.log("\nWarcraft 3 Strategy Hub deployment preflight\n");

  for (const result of results) {
    console.log(`${result.ok ? "PASS" : "FAIL"}  ${result.label}: ${result.detail}`);
  }

  const failed = results.filter((result) => !result.ok);
  console.log("");

  if (failed.length > 0) {
    console.log(`Preflight failed with ${failed.length} issue(s).`);
    process.exit(1);
  }

  console.log("Preflight passed.");
};

main().catch((error) => {
  console.error("Preflight crashed.", error);
  process.exit(1);
});
