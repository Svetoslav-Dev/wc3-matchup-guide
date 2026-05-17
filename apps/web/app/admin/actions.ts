"use server";

import {
  createBuild,
  createHero,
  createMap,
  createMatchup,
  createRace,
  createUnit,
  deleteBuild,
  deleteHero,
  deleteMap,
  deleteMatchup,
  deleteRace,
  deleteUnit,
  hasDatabaseUrl,
  updateBuild,
  updateHero,
  updateMap,
  updateMatchup,
  updateRace,
  updateUnit,
} from "@warcraft3-guide-hub/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "../../lib/auth";
import {
  getAdminBuildBySlug,
  getAdminHeroBySlug,
  getAdminMapBySlug,
  getAdminMatchupBySlug,
  getAdminRaceBySlug,
  getAdminUnitBySlug,
} from "../../lib/content";
import {
  formDataToAdminBuildInput,
  formDataToAdminHeroInput,
  formDataToAdminMapInput,
  formDataToAdminMatchupInput,
  formDataToAdminRaceInput,
  formDataToAdminUnitInput,
} from "../../lib/admin-forms";
import {
  adminBuildSchema,
  adminHeroSchema,
  adminMapSchema,
  adminMatchupSchema,
  adminRaceSchema,
  adminUnitSchema,
} from "../../lib/validation";

const requireAdminMutationContext = async () => {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    throw new Error("Admin mutations require DATABASE_URL and JWT_SECRET.");
  }

  return requireRole("admin");
};

export async function createBuildAction(formData: FormData) {
  const user = await requireAdminMutationContext();
  const input = formDataToAdminBuildInput(formData);
  const parsed = adminBuildSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid build form submission.");
  }

  const build = await createBuild({
    ...parsed.data,
    createdByUserId: user.id,
  });

  if (!build) {
    throw new Error("Build creation failed.");
  }

  revalidatePath("/admin");
  revalidatePath("/builds");
  redirect(`/admin/builds/${build.slug}/edit?status=created`);
}

export async function updateBuildAction(formData: FormData) {
  await requireAdminMutationContext();
  const buildIdRaw = formData.get("buildId");
  const buildId = Number.parseInt(String(buildIdRaw ?? ""), 10);

  if (!Number.isFinite(buildId) || buildId < 1) {
    throw new Error("Invalid build id.");
  }

  const input = formDataToAdminBuildInput(formData);
  const parsed = adminBuildSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid build form submission.");
  }

  const build = await updateBuild(buildId, parsed.data);

  if (!build) {
    throw new Error("Build not found.");
  }

  revalidatePath("/admin");
  revalidatePath("/builds");
  revalidatePath(`/builds/${build.slug}`);
  redirect(`/admin/builds/${build.slug}/edit?status=updated`);
}

export async function createMatchupAction(formData: FormData) {
  await requireAdminMutationContext();
  const input = formDataToAdminMatchupInput(formData);
  const parsed = adminMatchupSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid matchup form submission.");
  }

  const matchup = await createMatchup(parsed.data);

  if (!matchup) {
    throw new Error("Matchup creation failed.");
  }

  revalidatePath("/admin");
  revalidatePath("/matchups");
  redirect(`/admin/matchups/${matchup.slug}/edit?status=created`);
}

export async function updateMatchupAction(formData: FormData) {
  await requireAdminMutationContext();
  const matchupIdRaw = formData.get("matchupId");
  const matchupId = Number.parseInt(String(matchupIdRaw ?? ""), 10);

  if (!Number.isFinite(matchupId) || matchupId < 1) {
    throw new Error("Invalid matchup id.");
  }

  const input = formDataToAdminMatchupInput(formData);
  const parsed = adminMatchupSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid matchup form submission.");
  }

  const matchup = await updateMatchup(matchupId, parsed.data);

  if (!matchup) {
    throw new Error("Matchup not found.");
  }

  revalidatePath("/admin");
  revalidatePath("/matchups");
  revalidatePath(`/matchups/${matchup.slug}`);
  redirect(`/admin/matchups/${matchup.slug}/edit?status=updated`);
}

export async function ensureAdminBuildEditor(slug: string) {
  await requireAdminMutationContext();
  return getAdminBuildBySlug(slug);
}

export async function ensureAdminMatchupEditor(slug: string) {
  await requireAdminMutationContext();
  return getAdminMatchupBySlug(slug);
}

export async function ensureAdminHeroEditor(slug: string) {
  await requireAdminMutationContext();
  return getAdminHeroBySlug(slug);
}

export async function ensureAdminUnitEditor(slug: string) {
  await requireAdminMutationContext();
  return getAdminUnitBySlug(slug);
}

export async function ensureAdminMapEditor(slug: string) {
  await requireAdminMutationContext();
  return getAdminMapBySlug(slug);
}

export async function ensureAdminRaceEditor(slug: string) {
  await requireAdminMutationContext();
  return getAdminRaceBySlug(slug);
}

export async function deleteBuildAction(formData: FormData) {
  await requireAdminMutationContext();
  const buildId = Number.parseInt(String(formData.get("buildId") ?? ""), 10);

  if (!Number.isFinite(buildId) || buildId < 1) {
    throw new Error("Invalid build id.");
  }

  await deleteBuild(buildId);
  revalidatePath("/admin");
  revalidatePath("/builds");
  redirect("/admin?status=build-deleted");
}

export async function deleteMatchupAction(formData: FormData) {
  await requireAdminMutationContext();
  const matchupId = Number.parseInt(String(formData.get("matchupId") ?? ""), 10);

  if (!Number.isFinite(matchupId) || matchupId < 1) {
    throw new Error("Invalid matchup id.");
  }

  await deleteMatchup(matchupId);
  revalidatePath("/admin");
  revalidatePath("/matchups");
  redirect("/admin?status=matchup-deleted");
}

export async function createHeroAction(formData: FormData) {
  await requireAdminMutationContext();
  const input = formDataToAdminHeroInput(formData);
  const parsed = adminHeroSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid hero form submission.");
  }

  const hero = await createHero(parsed.data);

  if (!hero) {
    throw new Error("Hero creation failed.");
  }

  revalidatePath("/admin");
  revalidatePath("/heroes");
  redirect(`/admin/heroes/${hero.slug}/edit?status=created`);
}

export async function updateHeroAction(formData: FormData) {
  await requireAdminMutationContext();
  const heroId = Number.parseInt(String(formData.get("heroId") ?? ""), 10);

  if (!Number.isFinite(heroId) || heroId < 1) {
    throw new Error("Invalid hero id.");
  }

  const input = formDataToAdminHeroInput(formData);
  const parsed = adminHeroSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid hero form submission.");
  }

  const hero = await updateHero(heroId, parsed.data);

  if (!hero) {
    throw new Error("Hero not found.");
  }

  revalidatePath("/admin");
  revalidatePath("/heroes");
  revalidatePath(`/heroes/${hero.slug}`);
  redirect(`/admin/heroes/${hero.slug}/edit?status=updated`);
}

export async function deleteHeroAction(formData: FormData) {
  await requireAdminMutationContext();
  const heroId = Number.parseInt(String(formData.get("heroId") ?? ""), 10);

  if (!Number.isFinite(heroId) || heroId < 1) {
    throw new Error("Invalid hero id.");
  }

  await deleteHero(heroId);
  revalidatePath("/admin");
  revalidatePath("/heroes");
  redirect("/admin?status=hero-deleted");
}

export async function createUnitAction(formData: FormData) {
  await requireAdminMutationContext();
  const input = formDataToAdminUnitInput(formData);
  const parsed = adminUnitSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid unit form submission.");
  }

  const unit = await createUnit(parsed.data);

  if (!unit) {
    throw new Error("Unit creation failed.");
  }

  revalidatePath("/admin");
  revalidatePath("/units");
  redirect(`/admin/units/${unit.slug}/edit?status=created`);
}

export async function updateUnitAction(formData: FormData) {
  await requireAdminMutationContext();
  const unitId = Number.parseInt(String(formData.get("unitId") ?? ""), 10);

  if (!Number.isFinite(unitId) || unitId < 1) {
    throw new Error("Invalid unit id.");
  }

  const input = formDataToAdminUnitInput(formData);
  const parsed = adminUnitSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid unit form submission.");
  }

  const unit = await updateUnit(unitId, parsed.data);

  if (!unit) {
    throw new Error("Unit not found.");
  }

  revalidatePath("/admin");
  revalidatePath("/units");
  revalidatePath(`/units/${unit.slug}`);
  redirect(`/admin/units/${unit.slug}/edit?status=updated`);
}

export async function deleteUnitAction(formData: FormData) {
  await requireAdminMutationContext();
  const unitId = Number.parseInt(String(formData.get("unitId") ?? ""), 10);

  if (!Number.isFinite(unitId) || unitId < 1) {
    throw new Error("Invalid unit id.");
  }

  await deleteUnit(unitId);
  revalidatePath("/admin");
  revalidatePath("/units");
  redirect("/admin?status=unit-deleted");
}

export async function createMapAction(formData: FormData) {
  await requireAdminMutationContext();
  const input = formDataToAdminMapInput(formData);
  const parsed = adminMapSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid map form submission.");
  }

  const map = await createMap(parsed.data);

  if (!map) {
    throw new Error("Map creation failed.");
  }

  revalidatePath("/admin");
  revalidatePath("/maps");
  redirect(`/admin/maps/${map.slug}/edit?status=created`);
}

export async function updateMapAction(formData: FormData) {
  await requireAdminMutationContext();
  const mapId = Number.parseInt(String(formData.get("mapId") ?? ""), 10);

  if (!Number.isFinite(mapId) || mapId < 1) {
    throw new Error("Invalid map id.");
  }

  const input = formDataToAdminMapInput(formData);
  const parsed = adminMapSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid map form submission.");
  }

  const map = await updateMap(mapId, parsed.data);

  if (!map) {
    throw new Error("Map not found.");
  }

  revalidatePath("/admin");
  revalidatePath("/maps");
  revalidatePath(`/maps/${map.slug}`);
  redirect(`/admin/maps/${map.slug}/edit?status=updated`);
}

export async function deleteMapAction(formData: FormData) {
  await requireAdminMutationContext();
  const mapId = Number.parseInt(String(formData.get("mapId") ?? ""), 10);

  if (!Number.isFinite(mapId) || mapId < 1) {
    throw new Error("Invalid map id.");
  }

  await deleteMap(mapId);
  revalidatePath("/admin");
  revalidatePath("/maps");
  redirect("/admin?status=map-deleted");
}

export async function createRaceAction(formData: FormData) {
  await requireAdminMutationContext();
  const input = formDataToAdminRaceInput(formData);
  const parsed = adminRaceSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid race form submission.");
  }

  const race = await createRace(parsed.data);

  if (!race) {
    throw new Error("Race creation failed.");
  }

  revalidatePath("/admin");
  revalidatePath("/races");
  redirect(`/admin/races/${race.slug}/edit?status=created`);
}

export async function updateRaceAction(formData: FormData) {
  await requireAdminMutationContext();
  const raceId = Number.parseInt(String(formData.get("raceId") ?? ""), 10);

  if (!Number.isFinite(raceId) || raceId < 1) {
    throw new Error("Invalid race id.");
  }

  const input = formDataToAdminRaceInput(formData);
  const parsed = adminRaceSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid race form submission.");
  }

  const race = await updateRace(raceId, parsed.data);

  if (!race) {
    throw new Error("Race not found.");
  }

  revalidatePath("/admin");
  revalidatePath("/races");
  revalidatePath(`/races/${race.slug}`);
  redirect(`/admin/races/${race.slug}/edit?status=updated`);
}

export async function deleteRaceAction(formData: FormData) {
  await requireAdminMutationContext();
  const raceId = Number.parseInt(String(formData.get("raceId") ?? ""), 10);

  if (!Number.isFinite(raceId) || raceId < 1) {
    throw new Error("Invalid race id.");
  }

  await deleteRace(raceId);
  revalidatePath("/admin");
  revalidatePath("/races");
  redirect("/admin?status=race-deleted");
}
