import { getSql, hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { NextResponse } from "next/server";

export async function GET() {
  const databaseConfigured = hasDatabaseUrl();
  const authConfigured = Boolean(process.env.JWT_SECRET);
  let databaseReachable = false;

  if (databaseConfigured) {
    try {
      await getSql()`select 1`;
      databaseReachable = true;
    } catch {
      databaseReachable = false;
    }
  }

  return NextResponse.json({
    status: !databaseConfigured || databaseReachable ? "ok" : "degraded",
    service: "warcraft3-strategy-hub",
    readiness: {
      databaseConfigured,
      databaseReachable,
      authConfigured,
    },
  });
}
