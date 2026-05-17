import "server-only";
import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { requireRequestRole } from "./auth";

export const requireAdminApiAccess = async (request: Request) => {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Admin access requires DATABASE_URL and JWT_SECRET." },
        { status: 503 },
      ),
    };
  }

  try {
    const user = await requireRequestRole(request, "admin");
    return { ok: true as const, user };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message === "Forbidden" ? 403 : 401;

    return {
      ok: false as const,
      response: NextResponse.json({ error: message }, { status }),
    };
  }
};
