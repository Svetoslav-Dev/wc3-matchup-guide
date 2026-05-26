"use server";

import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSessionUser } from "../../../lib/auth";
import {
  addFavoriteBuildForUser,
  findFavoriteForUserByBuildSlug,
  removeFavoriteBuildForUser,
} from "../../../lib/content";

export async function saveFavoriteAction(formData: FormData) {
  const buildSlug = formData.get("buildSlug");

  if (typeof buildSlug !== "string" || buildSlug.length === 0) {
    throw new Error("Missing build slug.");
  }

  if (!hasDatabaseUrl()) {
    throw new Error("Favorites require DATABASE_URL.");
  }

  const user = await requireSessionUser().catch(() => null);

  if (!user) {
    redirect("/login");
  }

  await addFavoriteBuildForUser(user.id, buildSlug);
  revalidatePath(`/builds/${buildSlug}`);
  revalidatePath("/builds");
  revalidatePath("/favorites");
}

export async function removeFavoriteAction(formData: FormData) {
  const buildSlug = formData.get("buildSlug");

  if (typeof buildSlug !== "string" || buildSlug.length === 0) {
    throw new Error("Missing build slug.");
  }

  if (!hasDatabaseUrl()) {
    throw new Error("Favorites require DATABASE_URL.");
  }

  const user = await requireSessionUser().catch(() => null);

  if (!user) {
    redirect("/login");
  }

  const favoriteId = await findFavoriteForUserByBuildSlug(user.id, buildSlug);

  if (favoriteId) {
    await removeFavoriteBuildForUser(user.id, favoriteId);
  }

  revalidatePath(`/builds/${buildSlug}`);
  revalidatePath("/builds");
  revalidatePath("/favorites");
}

