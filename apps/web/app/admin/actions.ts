"use server";

import {
  createBuilding,
  createBuild,
  createHero,
  createItem,
  createMap,
  createMatchup,
  createRace,
  createUnit,
  deleteBuilding,
  deleteBuild,
  deleteHero,
  deleteItem,
  deleteMap,
  deleteMatchup,
  countActiveRaceDependencies,
  deleteRace,
  deleteUnit,
  hasDatabaseUrl,
  updateBuilding,
  updateBuild,
  updateHero,
  updateItem,
  updateMap,
  updateMatchup,
  updateRace,
  updateUnit,
} from "@warcraft3-guide-hub/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "../../lib/auth";
import { deleteImageByFile, deleteImageByUrl, uploadImage } from "../../lib/upload-image";
import {
  getAdminBuildBySlug,
  getAdminBuildingById,
  getAdminHeroBySlug,
  getAdminItemById,
  getAdminMapBySlug,
  getAdminMatchupBySlug,
  getAdminRaceBySlug,
  getAdminUnitBySlug,
} from "../../lib/content";
import {
  formDataToAdminBuildInput,
  formDataToAdminBuildingInput,
  formDataToAdminHeroInput,
  formDataToAdminItemInput,
  formDataToAdminMapInput,
  formDataToAdminMatchupInput,
  formDataToAdminRaceInput,
  formDataToAdminUnitInput,
} from "../../lib/admin-forms";
import {
  adminBuildSchema,
  adminBuildingSchema,
  adminHeroSchema,
  adminItemSchema,
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

export type FormState = { error: string; fields?: Record<string, string>; key?: number } | null;

const extractFields = (formData: FormData): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
};

const firstErrorMessage = (message: string | undefined) => message ?? "Please fill all the fields.";
const uploadErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Image upload failed.";

export async function createBuildAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const user = await requireAdminMutationContext();
  const fields = extractFields(formData);
  const nextKey = (prevState?.key ?? 0) + 1;
  let input: ReturnType<typeof formDataToAdminBuildInput>;
  try {
    input = formDataToAdminBuildInput(formData);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid form data.";
    return { error: msg, fields, key: nextKey };
  }
  const parsed = adminBuildSchema.safeParse(input);

  if (!parsed.success) {
    return { error: firstErrorMessage(parsed.error.issues[0]?.message), fields, key: nextKey };
  }

  let build;
  try {
    build = await createBuild({ ...parsed.data, createdByUserId: user.id });
  } catch {
    return { error: "Could not save — the Page URL may already be taken.", fields, key: nextKey };
  }
  if (!build) {
    return { error: "Build creation failed.", fields, key: nextKey };
  }

  revalidateTag("builds");
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

  const currentSlug = String(formData.get("currentSlug") ?? "");

  let input: ReturnType<typeof formDataToAdminBuildInput>;
  try {
    input = formDataToAdminBuildInput(formData);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid form data.";
    redirect(`/admin/builds/${currentSlug}/edit?error=${encodeURIComponent(msg)}`);
  }

  const parsed = adminBuildSchema.safeParse(input);

  if (!parsed.success) {
    redirect(`/admin/builds/${currentSlug}/edit?error=${encodeURIComponent(firstErrorMessage(parsed.error.issues[0]?.message))}`);
  }

  let build;
  try {
    build = await updateBuild(buildId, parsed.data);
  } catch {
    redirect(`/admin/builds/${currentSlug}/edit?error=${encodeURIComponent("Could not save — the Page URL may already be taken.")}`);
  }
  if (!build) {
    redirect(`/admin/builds/${currentSlug}/edit?error=${encodeURIComponent("Build not found.")}`);
  }

  revalidateTag("builds");
  revalidatePath("/admin");
  revalidatePath("/builds");
  revalidatePath(`/builds/${build.slug}`);
  redirect(`/admin/builds/${build.slug}/edit?status=updated`);
}

export async function createMatchupAction(prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdminMutationContext();
  const fields = extractFields(formData);
  const nextKey = (prevState?.key ?? 0) + 1;
  const input = formDataToAdminMatchupInput(formData);
  const parsed = adminMatchupSchema.safeParse(input);

  if (!parsed.success) {
    return { error: firstErrorMessage(parsed.error.issues[0]?.message), fields, key: nextKey };
  }

  const existing = await getAdminMatchupBySlug(parsed.data.slug);
  if (existing) {
    return { error: `This matchup already exists. Edit it at /admin/matchups/${existing.slug}/edit`, fields, key: nextKey };
  }

  let matchup;
  try {
    matchup = await createMatchup(parsed.data);
  } catch {
    return { error: "Could not save — the Page URL may already be taken.", fields, key: nextKey };
  }
  if (!matchup) {
    return { error: "Matchup creation failed.", fields, key: nextKey };
  }

  revalidateTag("matchups");
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

  const currentSlug = String(formData.get("currentSlug") ?? "");
  const input = formDataToAdminMatchupInput(formData);
  const parsed = adminMatchupSchema.safeParse(input);

  if (!parsed.success) {
    redirect(`/admin/matchups/${currentSlug}/edit?error=${encodeURIComponent(firstErrorMessage(parsed.error.issues[0]?.message))}`);
  }

  let matchup;
  try {
    matchup = await updateMatchup(matchupId, parsed.data);
  } catch {
    redirect(`/admin/matchups/${currentSlug}/edit?error=${encodeURIComponent("Could not save — the Page URL may already be taken.")}`);
  }
  if (!matchup) {
    redirect(`/admin/matchups/${currentSlug}/edit?error=${encodeURIComponent("Matchup not found.")}`);
  }

  revalidateTag("matchups");
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
  revalidateTag("builds");
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
  revalidateTag("matchups");
  revalidatePath("/admin");
  revalidatePath("/matchups");
  redirect("/admin?status=matchup-deleted");
}

export async function createHeroAction(prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdminMutationContext();
  const fields = extractFields(formData);
  const nextKey = (prevState?.key ?? 0) + 1;
  const input = formDataToAdminHeroInput(formData);
  const parsed = adminHeroSchema.safeParse(input);
  if (!parsed.success) return { error: firstErrorMessage(parsed.error.issues[0]?.message), fields, key: nextKey };
  const file = formData.get("imageUpload");
  if (file instanceof File && file.size > 0) {
    try {
      parsed.data.imageUrl = await uploadImage(file, "Heroes", String(formData.get("name") ?? "").trim() || undefined);
    } catch (error) {
      return { error: uploadErrorMessage(error), fields, key: nextKey };
    }
  }
  let hero;
  try {
    hero = await createHero(parsed.data);
  } catch {
    await deleteImageByUrl(parsed.data.imageUrl);
    return { error: "Could not save — the Page URL may already be taken.", fields, key: nextKey };
  }
  if (!hero) return { error: "Hero creation failed.", fields, key: nextKey };
  revalidateTag("heroes");
  revalidatePath("/admin");
  revalidatePath("/heroes");
  redirect(`/admin/heroes/${hero.slug}/edit?status=created`);
}

export async function updateHeroAction(formData: FormData) {
  await requireAdminMutationContext();
  const heroId = Number.parseInt(String(formData.get("heroId") ?? ""), 10);
  if (!Number.isFinite(heroId) || heroId < 1) throw new Error("Invalid hero id.");
  const currentSlug = String(formData.get("currentSlug") ?? "");
  const input = formDataToAdminHeroInput(formData);
  const oldImageUrl = input.imageUrl;
  const file = formData.get("imageUpload");
  if (file instanceof File && file.size > 0) {
    try {
      input.imageUrl = await uploadImage(file, "Heroes");
    } catch (error) {
      redirect(`/admin/heroes/${currentSlug}/edit?error=${encodeURIComponent(uploadErrorMessage(error))}`);
    }
  }
  const parsed = adminHeroSchema.safeParse(input);
  if (!parsed.success) redirect(`/admin/heroes/${currentSlug}/edit?error=${encodeURIComponent(firstErrorMessage(parsed.error.issues[0]?.message))}`);
  let hero;
  try {
    hero = await updateHero(heroId, parsed.data);
  } catch {
    redirect(`/admin/heroes/${currentSlug}/edit?error=${encodeURIComponent("Could not save — the Page URL may already be taken.")}`);
  }
  if (!hero) redirect(`/admin/heroes/${currentSlug}/edit?error=${encodeURIComponent("Hero not found.")}`);
  if (parsed.data.imageUrl !== oldImageUrl) await deleteImageByUrl(oldImageUrl);
  revalidateTag("heroes");
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

  const removed = await deleteHero(heroId);
  await deleteImageByUrl(removed?.imageUrl);
  revalidateTag("heroes");
  revalidatePath("/admin");
  revalidatePath("/heroes");
  redirect("/admin?status=hero-deleted");
}

export async function createUnitAction(prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdminMutationContext();
  const fields = extractFields(formData);
  const nextKey = (prevState?.key ?? 0) + 1;
  const input = formDataToAdminUnitInput(formData);
  const parsed = adminUnitSchema.safeParse(input);
  if (!parsed.success) return { error: firstErrorMessage(parsed.error.issues[0]?.message), fields, key: nextKey };
  const file = formData.get("imageUpload");
  if (file instanceof File && file.size > 0) {
    try {
      parsed.data.imageUrl = await uploadImage(file, "Units", String(formData.get("name") ?? "").trim() || undefined);
    } catch (error) {
      return { error: uploadErrorMessage(error), fields, key: nextKey };
    }
  }
  let unit;
  try {
    unit = await createUnit(parsed.data);
  } catch {
    await deleteImageByUrl(parsed.data.imageUrl);
    return { error: "Could not save — the Page URL may already be taken.", fields, key: nextKey };
  }
  if (!unit) return { error: "Unit creation failed.", fields, key: nextKey };
  revalidateTag("units");
  revalidatePath("/admin");
  revalidatePath("/units");
  redirect(`/admin/units/${unit.slug}/edit?status=created`);
}

export async function updateUnitAction(formData: FormData) {
  await requireAdminMutationContext();
  const unitId = Number.parseInt(String(formData.get("unitId") ?? ""), 10);
  if (!Number.isFinite(unitId) || unitId < 1) throw new Error("Invalid unit id.");
  const currentSlug = String(formData.get("currentSlug") ?? "");
  const input = formDataToAdminUnitInput(formData);
  const oldImageUrl = input.imageUrl;
  const file = formData.get("imageUpload");
  if (file instanceof File && file.size > 0) {
    try {
      input.imageUrl = await uploadImage(file, "Units");
    } catch (error) {
      redirect(`/admin/units/${currentSlug}/edit?error=${encodeURIComponent(uploadErrorMessage(error))}`);
    }
  }
  const parsed = adminUnitSchema.safeParse(input);
  if (!parsed.success) redirect(`/admin/units/${currentSlug}/edit?error=${encodeURIComponent(firstErrorMessage(parsed.error.issues[0]?.message))}`);
  let unit;
  try {
    unit = await updateUnit(unitId, parsed.data);
  } catch {
    redirect(`/admin/units/${currentSlug}/edit?error=${encodeURIComponent("Could not save — the Page URL may already be taken.")}`);
  }
  if (!unit) redirect(`/admin/units/${currentSlug}/edit?error=${encodeURIComponent("Unit not found.")}`);
  if (parsed.data.imageUrl !== oldImageUrl) await deleteImageByUrl(oldImageUrl);
  revalidateTag("units");
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

  const removed = await deleteUnit(unitId);
  await deleteImageByUrl(removed?.imageUrl);
  revalidateTag("units");
  revalidatePath("/admin");
  revalidatePath("/units");
  redirect("/admin?status=unit-deleted");
}

export async function createMapAction(prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdminMutationContext();
  const fields = extractFields(formData);
  const nextKey = (prevState?.key ?? 0) + 1;
  const input = formDataToAdminMapInput(formData);
  const parsed = adminMapSchema.safeParse(input);
  if (!parsed.success) return { error: firstErrorMessage(parsed.error.issues[0]?.message), fields, key: nextKey };
  const file = formData.get("imageUpload");
  if (file instanceof File && file.size > 0) {
    try {
      parsed.data.imageUrl = await uploadImage(file, "Maps", String(formData.get("name") ?? "").trim() || undefined);
    } catch (error) {
      return { error: uploadErrorMessage(error), fields, key: nextKey };
    }
  }
  let map;
  try {
    map = await createMap(parsed.data);
  } catch {
    await deleteImageByUrl(parsed.data.imageUrl);
    return { error: "Could not save — the Page URL may already be taken.", fields, key: nextKey };
  }
  if (!map) return { error: "Map creation failed.", fields, key: nextKey };
  revalidateTag("maps");
  revalidatePath("/admin");
  revalidatePath("/maps");
  redirect(`/admin/maps/${map.slug}/edit?status=created`);
}

export async function updateMapAction(formData: FormData) {
  await requireAdminMutationContext();
  const mapId = Number.parseInt(String(formData.get("mapId") ?? ""), 10);
  if (!Number.isFinite(mapId) || mapId < 1) throw new Error("Invalid map id.");
  const currentSlug = String(formData.get("currentSlug") ?? "");
  const input = formDataToAdminMapInput(formData);
  const oldImageUrl = input.imageUrl;
  const file = formData.get("imageUpload");
  if (file instanceof File && file.size > 0) {
    try {
      input.imageUrl = await uploadImage(file, "Maps");
    } catch (error) {
      redirect(`/admin/maps/${currentSlug}/edit?error=${encodeURIComponent(uploadErrorMessage(error))}`);
    }
  }
  const parsed = adminMapSchema.safeParse(input);

  if (!parsed.success) {
    redirect(`/admin/maps/${currentSlug}/edit?error=${encodeURIComponent(firstErrorMessage(parsed.error.issues[0]?.message))}`);
  }

  let map;
  try {
    map = await updateMap(mapId, parsed.data);
  } catch {
    redirect(`/admin/maps/${currentSlug}/edit?error=${encodeURIComponent("Could not save — the Page URL may already be taken.")}`);
  }
  if (!map) {
    redirect(`/admin/maps/${currentSlug}/edit?error=${encodeURIComponent("Map not found.")}`);
  }

  if (parsed.data.imageUrl !== oldImageUrl) await deleteImageByUrl(oldImageUrl);
  revalidateTag("maps");
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

  const removed = await deleteMap(mapId);
  await deleteImageByUrl(removed?.imageUrl);
  revalidateTag("maps");
  revalidatePath("/admin");
  revalidatePath("/maps");
  redirect("/admin?status=map-deleted");
}

export async function createRaceAction(prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdminMutationContext();
  const fields = extractFields(formData);
  const nextKey = (prevState?.key ?? 0) + 1;
  const input = formDataToAdminRaceInput(formData);
  const parsed = adminRaceSchema.safeParse(input);
  if (!parsed.success) return { error: firstErrorMessage(parsed.error.issues[0]?.message), fields, key: nextKey };
  const file = formData.get("imageUpload");
  if (file instanceof File && file.size > 0) {
    try {
      parsed.data.imageUrl = await uploadImage(file, "Races", String(formData.get("name") ?? "").trim() || undefined);
    } catch (error) {
      return { error: uploadErrorMessage(error), fields, key: nextKey };
    }
  }
  let race;
  try {
    race = await createRace(parsed.data);
  } catch {
    await deleteImageByUrl(parsed.data.imageUrl);
    return { error: "Could not save — the Page URL may already be taken.", fields, key: nextKey };
  }
  if (!race) return { error: "Race creation failed.", fields, key: nextKey };
  revalidateTag("races");
  revalidatePath("/admin");
  revalidatePath("/races");
  redirect(`/admin/races/${race.slug}/edit?status=created`);
}

export async function updateRaceAction(formData: FormData) {
  await requireAdminMutationContext();
  const raceId = Number.parseInt(String(formData.get("raceId") ?? ""), 10);
  if (!Number.isFinite(raceId) || raceId < 1) throw new Error("Invalid race id.");
  const currentSlug = String(formData.get("currentSlug") ?? "");
  const input = formDataToAdminRaceInput(formData);
  const oldImageUrl = input.imageUrl;
  const file = formData.get("imageUpload");
  if (file instanceof File && file.size > 0) {
    try {
      input.imageUrl = await uploadImage(file, "Races");
    } catch (error) {
      redirect(`/admin/races/${currentSlug}/edit?error=${encodeURIComponent(uploadErrorMessage(error))}`);
    }
  }
  const parsed = adminRaceSchema.safeParse(input);
  if (!parsed.success) redirect(`/admin/races/${currentSlug}/edit?error=${encodeURIComponent(firstErrorMessage(parsed.error.issues[0]?.message))}`);
  let race;
  try {
    race = await updateRace(raceId, parsed.data);
  } catch {
    redirect(`/admin/races/${currentSlug}/edit?error=${encodeURIComponent("Could not save — the Page URL may already be taken.")}`);
  }
  if (!race) redirect(`/admin/races/${currentSlug}/edit?error=${encodeURIComponent("Race not found.")}`);
  if (parsed.data.imageUrl !== oldImageUrl) await deleteImageByUrl(oldImageUrl);
  revalidateTag("races");
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

  const deps = await countActiveRaceDependencies(raceId);
  const parts = [
    deps.heroes > 0 ? `${deps.heroes} hero${deps.heroes !== 1 ? "es" : ""}` : null,
    deps.units > 0 ? `${deps.units} unit${deps.units !== 1 ? "s" : ""}` : null,
    deps.buildings > 0 ? `${deps.buildings} building${deps.buildings !== 1 ? "s" : ""}` : null,
    deps.matchups > 0 ? `${deps.matchups} matchup${deps.matchups !== 1 ? "s" : ""}` : null,
    deps.builds > 0 ? `${deps.builds} build${deps.builds !== 1 ? "s" : ""}` : null,
  ].filter(Boolean);
  if (parts.length > 0) {
    redirect(`/admin/races?error=${encodeURIComponent(`Cannot delete this race. Please delete first: ${parts.join(", ")}.`)}`);
  }

  const removed = await deleteRace(raceId);
  await deleteImageByUrl(removed?.imageUrl);
  revalidateTag("races");
  revalidatePath("/admin");
  revalidatePath("/races");
  redirect(`/admin/races?status=race-deleted`);
}

// ── Buildings ────────────────────────────────────────────────────────────────

export async function ensureAdminBuildingEditor(id: number) {
  return getAdminBuildingById(id);
}

export async function createBuildingAction(prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdminMutationContext();
  const fields = extractFields(formData);
  const nextKey = (prevState?.key ?? 0) + 1;
  const input = formDataToAdminBuildingInput(formData);
  const parsed = adminBuildingSchema.safeParse(input);
  if (!parsed.success) return { error: firstErrorMessage(parsed.error.issues[0]?.message), fields, key: nextKey };
  const file = formData.get("imageUpload");
  if (file instanceof File && file.size > 0) {
    try {
      const url = await uploadImage(file, "Buildings");
      if (url) parsed.data.imageFile = url.split("/").pop() ?? parsed.data.imageFile;
    } catch (error) {
      return { error: uploadErrorMessage(error), fields, key: nextKey };
    }
  }
  let building;
  try {
    building = await createBuilding(parsed.data);
  } catch {
    return { error: "Could not save — the Page URL may already be taken.", fields, key: nextKey };
  }
  if (!building) return { error: "Building creation failed.", fields, key: nextKey };
  revalidatePath("/admin");
  redirect(`/admin/buildings/${building.id}/edit?status=created`);
}

export async function updateBuildingAction(formData: FormData) {
  await requireAdminMutationContext();
  const buildingId = Number.parseInt(String(formData.get("buildingId") ?? ""), 10);
  if (!Number.isFinite(buildingId) || buildingId < 1) throw new Error("Invalid building id.");
  const input = formDataToAdminBuildingInput(formData);
  const oldImageFile = input.imageFile;
  const file = formData.get("imageUpload");
  if (file instanceof File && file.size > 0) {
    try {
      const url = await uploadImage(file, "Buildings");
      if (url) input.imageFile = url.split("/").pop() ?? input.imageFile;
    } catch (error) {
      redirect(`/admin/buildings/${buildingId}/edit?error=${encodeURIComponent(uploadErrorMessage(error))}`);
    }
  }
  const parsed = adminBuildingSchema.safeParse(input);
  if (!parsed.success) redirect(`/admin/buildings/${buildingId}/edit?error=${encodeURIComponent(firstErrorMessage(parsed.error.issues[0]?.message))}`);
  let building;
  try {
    building = await updateBuilding(buildingId, parsed.data);
  } catch {
    redirect(`/admin/buildings/${buildingId}/edit?error=${encodeURIComponent("Could not save — the Page URL may already be taken.")}`);
  }
  if (!building) redirect(`/admin/buildings/${buildingId}/edit?error=${encodeURIComponent("Building not found.")}`);
  if (parsed.data.imageFile !== oldImageFile) await deleteImageByFile("Buildings", oldImageFile);
  revalidatePath("/admin");
  redirect(`/admin/buildings/${building.id}/edit?status=updated`);
}

export async function deleteBuildingAction(formData: FormData) {
  await requireAdminMutationContext();
  const buildingId = Number.parseInt(String(formData.get("buildingId") ?? ""), 10);
  if (!Number.isFinite(buildingId) || buildingId < 1) throw new Error("Invalid building id.");
  const removed = await deleteBuilding(buildingId);
  await deleteImageByFile("Buildings", removed?.imageFile);
  revalidatePath("/admin");
  redirect("/admin?status=building-deleted");
}

// ── Items ────────────────────────────────────────────────────────────────────

export async function ensureAdminItemEditor(id: number) {
  return getAdminItemById(id);
}

export async function createItemAction(prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdminMutationContext();
  const fields = extractFields(formData);
  const nextKey = (prevState?.key ?? 0) + 1;
  const input = formDataToAdminItemInput(formData);
  const parsed = adminItemSchema.safeParse(input);
  if (!parsed.success) return { error: firstErrorMessage(parsed.error.issues[0]?.message), fields, key: nextKey };
  const file = formData.get("imageUpload");
  if (file instanceof File && file.size > 0) {
    try {
      const url = await uploadImage(file, "Items");
      if (url) parsed.data.imageFile = url.split("/").pop() ?? parsed.data.imageFile;
    } catch (error) {
      return { error: uploadErrorMessage(error), fields, key: nextKey };
    }
  }
  let item;
  try {
    item = await createItem(parsed.data);
  } catch {
    return { error: "Could not save — the Page URL may already be taken.", fields, key: nextKey };
  }
  if (!item) return { error: "Item creation failed.", fields, key: nextKey };
  revalidatePath("/admin");
  redirect(`/admin/items/${item.id}/edit?status=created`);
}

export async function updateItemAction(formData: FormData) {
  await requireAdminMutationContext();
  const itemId = Number.parseInt(String(formData.get("itemId") ?? ""), 10);
  if (!Number.isFinite(itemId) || itemId < 1) throw new Error("Invalid item id.");
  const input = formDataToAdminItemInput(formData);
  const oldImageFile = input.imageFile;
  const file = formData.get("imageUpload");
  if (file instanceof File && file.size > 0) {
    try {
      const url = await uploadImage(file, "Items");
      if (url) input.imageFile = url.split("/").pop() ?? input.imageFile;
    } catch (error) {
      redirect(`/admin/items/${itemId}/edit?error=${encodeURIComponent(uploadErrorMessage(error))}`);
    }
  }
  const parsed = adminItemSchema.safeParse(input);
  if (!parsed.success) redirect(`/admin/items/${itemId}/edit?error=${encodeURIComponent(firstErrorMessage(parsed.error.issues[0]?.message))}`);
  let item;
  try {
    item = await updateItem(itemId, parsed.data);
  } catch {
    redirect(`/admin/items/${itemId}/edit?error=${encodeURIComponent("Could not save — the Page URL may already be taken.")}`);
  }
  if (!item) redirect(`/admin/items/${itemId}/edit?error=${encodeURIComponent("Item not found.")}`);
  if (parsed.data.imageFile !== oldImageFile) await deleteImageByFile("Items", oldImageFile);
  revalidatePath("/admin");
  redirect(`/admin/items/${item.id}/edit?status=updated`);
}

export async function deleteItemAction(formData: FormData) {
  await requireAdminMutationContext();
  const itemId = Number.parseInt(String(formData.get("itemId") ?? ""), 10);
  if (!Number.isFinite(itemId) || itemId < 1) throw new Error("Invalid item id.");
  const removed = await deleteItem(itemId);
  await deleteImageByFile("Items", removed?.imageFile);
  revalidatePath("/admin");
  redirect("/admin?status=item-deleted");
}
