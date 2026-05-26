import { NextRequest, NextResponse } from "next/server";
import { hasDatabaseUrl, createBuild } from "@warcraft3-guide-hub/db";
import { requireAdminApiAccess } from "../../../../lib/admin";
import { adminBuildSchema } from "../../../../lib/validation";
import { getSessionUser } from "../../../../lib/auth";
import { listAdminBuilds } from "../../../../lib/content";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = request.nextUrl.searchParams;
  const q          = sp.get("q")          || undefined;
  const race       = sp.get("race")       || undefined;
  const difficulty = sp.get("difficulty") || undefined;
  const perPage    = Math.min(100, Math.max(20, Number(sp.get("perPage")) || 20));
  const loaded     = Math.min(2000, Math.max(perPage, Number(sp.get("loaded")) || perPage));

  if (!hasDatabaseUrl()) return NextResponse.json({ builds: [], hasMore: false });

  const records = await listAdminBuilds(loaded + 1, q, race, difficulty);
  return NextResponse.json({
    builds:  records.slice(0, loaded),
    hasMore: records.length > loaded,
  });
}

export async function POST(request: Request) {
  const access = await requireAdminApiAccess(request);

  if (!access.ok) {
    return access.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = adminBuildSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const build = await createBuild({
      ...parsed.data,
      createdByUserId: access.user.id,
    });

    return NextResponse.json({ data: build }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Build creation failed." },
      { status: 400 },
    );
  }
}
