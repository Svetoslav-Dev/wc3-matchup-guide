import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { requireRequestSessionUser } from "../../../../lib/auth";
import { addFavoriteBuildForUser, listFavoriteBuildsForUser } from "../../../../lib/content";
import { favoriteMutationSchema } from "../../../../lib/validation";

export async function GET(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "Favorites require DATABASE_URL." }, { status: 503 });
  }

  try {
    const user = await requireRequestSessionUser(request);
    const favorites = await listFavoriteBuildsForUser(user.id);
    return NextResponse.json({ data: favorites });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "Favorites require DATABASE_URL." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const parsed = favoriteMutationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const user = await requireRequestSessionUser(request);
    const favorite = await addFavoriteBuildForUser(user.id, parsed.data.buildSlug);
    return NextResponse.json({ data: favorite }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 404 },
    );
  }
}
