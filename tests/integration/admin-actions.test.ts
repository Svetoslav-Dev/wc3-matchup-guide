import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test, { after, afterEach, before, beforeEach } from "node:test";

import { getSql } from "../../packages/db/src/client.ts";
import {
  deleteImageByFile,
  deleteImageByUrl,
} from "../../apps/web/lib/upload-image.ts";
import { setTestSessionUser } from "../../apps/web/lib/test-session.ts";
import {
  createBuildAction,
  createBuildingAction,
  createHeroAction,
  createItemAction,
  createMapAction,
  createMatchupAction,
  createRaceAction,
  createUnitAction,
  deleteBuildAction,
  deleteBuildingAction,
  deleteHeroAction,
  deleteItemAction,
  deleteMapAction,
  deleteMatchupAction,
  deleteRaceAction,
  deleteUnitAction,
  updateBuildAction,
  updateBuildingAction,
  updateHeroAction,
  updateItemAction,
  updateMapAction,
  updateMatchupAction,
  updateRaceAction,
  updateUnitAction,
} from "../../apps/web/app/admin/actions.ts";
import {
  findUserByEmail,
  getAdminBuildBySlug,
  getAdminHeroBySlug,
  getAdminMapBySlug,
  getAdminMatchupBySlug,
  getAdminRaceBySlug,
  getAdminUnitBySlug,
  getAdminBuildingById,
  getAdminItemById,
  listAdminBuildings,
  listAdminItems,
} from "../../packages/db/src/content.ts";

const rootDir = process.cwd();
const webPublicDir = join(rootDir, "apps", "web", "public");
const testImagesDir = join(rootDir, "tests", "testImages");
const supportedExts = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

const imageFixtureNames = readdirSync(testImagesDir)
  .filter((name) => supportedExts.has(name.slice(name.lastIndexOf(".")).toLowerCase()))
  .sort();

let adminSessionUser: { id: number; email: string; username: string; role: "admin" } | null = null;

before(async () => {
  assert.ok(imageFixtureNames.length > 0, `Add at least one test image under ${testImagesDir}.`);

  const admin = await findUserByEmail("admin@example.com");
  assert.ok(admin, "Expected seeded admin@example.com user for admin action integration tests.");

  adminSessionUser = {
    id: admin.id,
    email: admin.email,
    username: admin.username,
    role: "admin",
  };
});

beforeEach(() => {
  assert.ok(adminSessionUser);
  setTestSessionUser(adminSessionUser);
});

afterEach(() => {
  setTestSessionUser(null);
});

after(async () => {
  setTestSessionUser(null);
  await getSql().end();
});

const uniqueKey = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const imageFixture = (index = 0) => {
  const name = imageFixtureNames[index % imageFixtureNames.length];
  const buffer = readFileSync(join(testImagesDir, name));
  const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
  const type =
    ext === ".png" ? "image/png"
    : ext === ".gif" ? "image/gif"
    : ext === ".webp" ? "image/webp"
    : "image/jpeg";

  return new File([buffer], name, { type });
};

const expectRedirect = async (action: () => Promise<unknown>) => {
  try {
    await action();
    assert.fail("Expected Next.js redirect.");
  } catch (error) {
    const digest = typeof error === "object" && error && "digest" in error
      ? String((error as { digest?: string }).digest ?? "")
      : "";
    const message = error instanceof Error ? error.message : String(error);

    assert.match(`${digest} ${message}`, /NEXT_REDIRECT/);
  }
};

const appendFields = (formData: FormData, fields: Record<string, string | null | undefined>) => {
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value ?? "");
  }
  return formData;
};

const assertPublicImageExists = (urlPath: string | null | undefined) => {
  assert.ok(urlPath, "Expected image URL to be present.");
  assert.ok(existsSync(join(webPublicDir, urlPath!.replace(/^\//, ""))), `Expected uploaded image ${urlPath} to exist.`);
};


test("admin build actions create, update, and delete builds", async () => {
  const key = uniqueKey("build");
  const slug = `admin-action-build-${key}`;

  const createForm = appendFields(new FormData(), {
    raceSlug: "human",
    matchupSlug: "human-vs-orc",
    title: `Admin Action Build ${key}`,
    slug,
    summary: "Integration-created build summary.",
    difficulty: "Easy",
    strategyType: "Timing",
    body: "Integration-created build body.",
    isPublished: "on",
    stepsInput: "[10f, 0:35] Queue peasants\n[14f, 1:10] Build altar",
  });

  await expectRedirect(() => createBuildAction(null, createForm));

  const created = await getAdminBuildBySlug(slug);
  assert.equal(created?.title, `Admin Action Build ${key}`);
  assert.equal(created?.steps.length, 2);

  const updateForm = appendFields(new FormData(), {
    buildId: String(created?.id ?? ""),
    currentSlug: slug,
    raceSlug: "human",
    matchupSlug: "",
    title: `Updated Admin Action Build ${key}`,
    slug,
    summary: "Updated integration build summary.",
    difficulty: "Medium",
    strategyType: "Macro",
    body: "Updated integration build body.",
    isPublished: "",
    stepsInput: "[12f, 0:45] Build altar\n[18f, 1:30] Build barracks",
  });

  await expectRedirect(() => updateBuildAction(updateForm));

  const updated = await getAdminBuildBySlug(slug);
  assert.equal(updated?.title, `Updated Admin Action Build ${key}`);
  assert.equal(updated?.difficulty, "Medium");
  assert.equal(updated?.steps[0]?.supply, 12);

  const deleteForm = appendFields(new FormData(), { buildId: String(updated?.id ?? "") });
  await expectRedirect(() => deleteBuildAction(deleteForm));

  const deleted = await getAdminBuildBySlug(slug);
  assert.ok(!deleted || deleted.deletedAt);
});

test("admin matchup actions create, update, and delete matchups", async () => {
  const key = uniqueKey("matchup");
  const slug = `admin-action-matchup-${key}`;

  const createForm = appendFields(new FormData(), {
    raceASlug: "human",
    raceBSlug: "orc",
    title: `Admin Action Matchup ${key}`,
    slug,
    summary: "Integration matchup summary.",
    difficulty: "Medium",
    earlyGamePlan: "Scout fast and defend the first pressure wave.",
    midGamePlan: "Transition into casters with expansion support.",
    lateGamePlan: "Control upkeep and deny key hero levels.",
    commonMistakesInput: "Skipping scout\nOvercommitting to militia",
  });

  await expectRedirect(() => createMatchupAction(null, createForm));

  const created = await getAdminMatchupBySlug(slug);
  assert.equal(created?.title, `Admin Action Matchup ${key}`);

  const updateForm = appendFields(new FormData(), {
    matchupId: String(created?.id ?? ""),
    currentSlug: slug,
    raceASlug: "human",
    raceBSlug: "orc",
    title: `Updated Admin Action Matchup ${key}`,
    slug,
    summary: "Updated matchup summary.",
    difficulty: "Hard",
    earlyGamePlan: "Updated early game plan.",
    midGamePlan: "Updated mid game plan.",
    lateGamePlan: "Updated late game plan.",
    commonMistakesInput: "Floating resources\nMissing dispel timing",
  });

  await expectRedirect(() => updateMatchupAction(updateForm));

  const updated = await getAdminMatchupBySlug(slug);
  assert.equal(updated?.difficulty, "Hard");
  assert.deepEqual(updated?.commonMistakes, ["Floating resources", "Missing dispel timing"]);

  const deleteForm = appendFields(new FormData(), { matchupId: String(updated?.id ?? "") });
  await expectRedirect(() => deleteMatchupAction(deleteForm));

  const deleted = await getAdminMatchupBySlug(slug);
  assert.ok(!deleted || deleted.deletedAt);
});

test("admin hero actions create, update, and delete heroes with uploaded images", async () => {
  const key = uniqueKey("hero");
  const slug = `admin-action-hero-${key}`;
  let originalImageUrl: string | null = null;

  const createForm = appendFields(new FormData(), {
    raceSlug: "human",
    name: `Admin Action Hero ${key}`,
    slug,
    description: "Integration hero description.",
    primaryAttribute: "Strength",
    role: "Support",
    highlightsInput: "Sustain\nControl",
    imageUrl: "",
  });
  createForm.set("imageUpload", imageFixture(0));

  try {
    await expectRedirect(() => createHeroAction(null, createForm));

    const created = await getAdminHeroBySlug(slug);
    originalImageUrl = created?.imageUrl ?? null;
    assert.equal(created?.slug, slug);
    assertPublicImageExists(created?.imageUrl);

    const updateForm = appendFields(new FormData(), {
      heroId: String(created?.id ?? ""),
      currentSlug: slug,
      raceSlug: "human",
      name: `Updated Admin Action Hero ${key}`,
      slug,
      description: "Updated hero description.",
      primaryAttribute: "Intelligence",
      role: "Caster",
      highlightsInput: "Mana control\nLate-game scaling",
      imageUrl: created?.imageUrl ?? "",
    });
    updateForm.set("imageUpload", imageFixture(1));

    await expectRedirect(() => updateHeroAction(updateForm));

    const updated = await getAdminHeroBySlug(slug);
    assert.equal(updated?.role, "Caster");
    assertPublicImageExists(updated?.imageUrl);

    const deleteForm = appendFields(new FormData(), { heroId: String(updated?.id ?? "") });
    await expectRedirect(() => deleteHeroAction(deleteForm));

    const deleted = await getAdminHeroBySlug(slug);
    assert.ok(!deleted || deleted.deletedAt);
  } finally {
    await deleteImageByUrl(originalImageUrl);
  }
});

test("admin unit actions create, update, and delete units with uploaded images", async () => {
  const key = uniqueKey("unit");
  const slug = `admin-action-unit-${key}`;
  let originalImageUrl: string | null = null;

  const createForm = appendFields(new FormData(), {
    raceSlug: "orc",
    name: `Admin Action Unit ${key}`,
    slug,
    description: "Integration unit description.",
    unitType: "Melee",
    strengthsInput: "Frontline\nPressure",
    weaknessesInput: "Kiting\nMagic damage",
    imageUrl: "",
  });
  createForm.set("imageUpload", imageFixture(0));

  try {
    await expectRedirect(() => createUnitAction(null, createForm));

    const created = await getAdminUnitBySlug(slug);
    originalImageUrl = created?.imageUrl ?? null;
    assert.equal(created?.slug, slug);
    assertPublicImageExists(created?.imageUrl);

    const updateForm = appendFields(new FormData(), {
      unitId: String(created?.id ?? ""),
      currentSlug: slug,
      raceSlug: "orc",
      name: `Updated Admin Action Unit ${key}`,
      slug,
      description: "Updated unit description.",
      unitType: "Ranged",
      strengthsInput: "Range\nFocus fire",
      weaknessesInput: "Fragile\nSetup time",
      imageUrl: created?.imageUrl ?? "",
    });
    updateForm.set("imageUpload", imageFixture(1));

    await expectRedirect(() => updateUnitAction(updateForm));

    const updated = await getAdminUnitBySlug(slug);
    assert.equal(updated?.unitType, "Ranged");
    assertPublicImageExists(updated?.imageUrl);

    const deleteForm = appendFields(new FormData(), { unitId: String(updated?.id ?? "") });
    await expectRedirect(() => deleteUnitAction(deleteForm));

    const deleted = await getAdminUnitBySlug(slug);
    assert.ok(!deleted || deleted.deletedAt);
  } finally {
    await deleteImageByUrl(originalImageUrl);
  }
});

test("admin map actions create, update, and delete maps with uploaded images", async () => {
  const key = uniqueKey("map");
  const slug = `admin-action-map-${key}`;
  let originalImageUrl: string | null = null;

  const createForm = appendFields(new FormData(), {
    name: `Admin Action Map ${key}`,
    slug,
    description: "Integration map description.",
    creepNotes: "Contest the green camp early.",
    expansionNotes: "Natural expansion is vulnerable without scouting.",
    imageUrl: "",
  });
  createForm.set("imageUpload", imageFixture(0));

  try {
    await expectRedirect(() => createMapAction(null, createForm));

    const created = await getAdminMapBySlug(slug);
    originalImageUrl = created?.imageUrl ?? null;
    assert.equal(created?.slug, slug);
    assertPublicImageExists(created?.imageUrl);

    const updateForm = appendFields(new FormData(), {
      mapId: String(created?.id ?? ""),
      currentSlug: slug,
      name: `Updated Admin Action Map ${key}`,
      slug,
      description: "Updated map description.",
      creepNotes: "Updated creep notes.",
      expansionNotes: "Updated expansion notes.",
      imageUrl: created?.imageUrl ?? "",
    });
    updateForm.set("imageUpload", imageFixture(1));

    await expectRedirect(() => updateMapAction(updateForm));

    const updated = await getAdminMapBySlug(slug);
    assert.equal(updated?.name, `Updated Admin Action Map ${key}`);
    assertPublicImageExists(updated?.imageUrl);

    const deleteForm = appendFields(new FormData(), { mapId: String(updated?.id ?? "") });
    await expectRedirect(() => deleteMapAction(deleteForm));

    const deleted = await getAdminMapBySlug(slug);
    assert.ok(!deleted || deleted.deletedAt);
  } finally {
    await deleteImageByUrl(originalImageUrl);
  }
});

test("admin race actions create, update, and delete races with uploaded images", async () => {
  const key = uniqueKey("race");
  const slug = `admin-action-race-${key}`;
  let originalImageUrl: string | null = null;

  const createForm = appendFields(new FormData(), {
    name: `Admin Action Race ${key}`,
    slug,
    description: "Integration race description.",
    identity: "Flexible tech paths and structured macro.",
    ladderFocus: "Secure map control before committing to expansions.",
    imageUrl: "",
  });
  createForm.set("imageUpload", imageFixture(0));

  try {
    await expectRedirect(() => createRaceAction(null, createForm));

    const created = await getAdminRaceBySlug(slug);
    originalImageUrl = created?.imageUrl ?? null;
    assert.equal(created?.slug, slug);
    assertPublicImageExists(created?.imageUrl);

    const updateForm = appendFields(new FormData(), {
      raceId: String(created?.id ?? ""),
      currentSlug: slug,
      name: `Updated Admin Action Race ${key}`,
      slug,
      description: "Updated race description.",
      identity: "Updated identity.",
      ladderFocus: "Updated ladder focus.",
      imageUrl: created?.imageUrl ?? "",
    });
    updateForm.set("imageUpload", imageFixture(1));

    await expectRedirect(() => updateRaceAction(updateForm));

    const updated = await getAdminRaceBySlug(slug);
    assert.equal(updated?.name, `Updated Admin Action Race ${key}`);
    assertPublicImageExists(updated?.imageUrl);

    const deleteForm = appendFields(new FormData(), { raceId: String(updated?.id ?? "") });
    await expectRedirect(() => deleteRaceAction(deleteForm));

    const deleted = await getAdminRaceBySlug(slug);
    assert.ok(!deleted || deleted.deletedAt);
  } finally {
    await deleteImageByUrl(originalImageUrl);
  }
});

test("admin building actions create, update, and delete buildings with uploaded images", async () => {
  const key = uniqueKey("building");
  const name = `Admin Action Building ${key}`;
  let originalImageFile = "";

  const createForm = appendFields(new FormData(), {
    name,
    race: "human",
    description: "Integration building description.",
    imageFile: "",
  });
  createForm.set("imageUpload", imageFixture(0));

  try {
    await expectRedirect(() => createBuildingAction(null, createForm));

    const created = (await listAdminBuildings(50, key)).find((entry) => entry.name === name);
    assert.ok(created);
    originalImageFile = created.imageFile;
    assertPublicImageExists(created.imageFile);

    const updateForm = appendFields(new FormData(), {
      buildingId: String(created.id),
      name: `Updated ${name}`,
      race: "human",
      description: "Updated building description.",
      imageFile: created.imageFile,
    });
    updateForm.set("imageUpload", imageFixture(1));

    await expectRedirect(() => updateBuildingAction(updateForm));

    const updated = await getAdminBuildingById(created.id);
    assert.equal(updated?.name, `Updated ${name}`);
    assert.ok(updated?.imageFile);
    assertPublicImageExists(updated!.imageFile);

    const deleteForm = appendFields(new FormData(), { buildingId: String(created.id) });
    await expectRedirect(() => deleteBuildingAction(deleteForm));

    const deleted = await getAdminBuildingById(created.id);
    assert.ok(!deleted || deleted.deletedAt);
  } finally {
    await deleteImageByFile("Buildings", originalImageFile);
  }
});

test("admin item actions create, update, and delete items with uploaded images", async () => {
  const key = uniqueKey("item");
  const name = `Admin Action Item ${key}`;
  let originalImageFile = "";

  const createForm = appendFields(new FormData(), {
    name,
    category: "permanent",
    shopsInput: "goblin-merchant, creep-drop",
    description: "Integration item description.",
    imageFile: "",
  });
  createForm.set("imageUpload", imageFixture(0));

  try {
    await expectRedirect(() => createItemAction(null, createForm));

    const created = (await listAdminItems(50, key)).find((entry) => entry.name === name);
    assert.ok(created);
    originalImageFile = created.imageFile;
    assertPublicImageExists(created.imageFile);

    const updateForm = appendFields(new FormData(), {
      itemId: String(created.id),
      name: `Updated ${name}`,
      category: "consumable",
      shopsInput: "creep-drop",
      description: "Updated item description.",
      imageFile: created.imageFile,
    });
    updateForm.set("imageUpload", imageFixture(1));

    await expectRedirect(() => updateItemAction(updateForm));

    const updated = await getAdminItemById(created.id);
    assert.equal(updated?.name, `Updated ${name}`);
    assert.deepEqual(updated?.shops, ["creep-drop"]);
    assert.ok(updated?.imageFile);
    assertPublicImageExists(updated!.imageFile);

    const deleteForm = appendFields(new FormData(), { itemId: String(created.id) });
    await expectRedirect(() => deleteItemAction(deleteForm));

    const deleted = await getAdminItemById(created.id);
    assert.ok(!deleted || deleted.deletedAt);
  } finally {
    await deleteImageByFile("Items", originalImageFile);
  }
});
