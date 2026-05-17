import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { requireRequestSessionUser } from "../../../../../lib/auth";
import { removeFavoriteBuildForUser } from "../../../../../lib/content";

type Props = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, { params }: Props) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "Favorites require DATABASE_URL." }, { status: 503 });
  }

  const { id } = await params;
  const favoriteId = Number.parseInt(id, 10);

  if (!Number.isFinite(favoriteId) || favoriteId < 1) {
    return NextResponse.json({ error: "Invalid favorite id." }, { status: 400 });
  }

  try {
    const user = await requireRequestSessionUser(request);
    const removed = await removeFavoriteBuildForUser(user.id, favoriteId);

    if (!removed) {
      return NextResponse.json({ error: "Favorite not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
