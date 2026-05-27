import assert from "node:assert/strict";
import test, { after } from "node:test";

import { getSql } from "../../packages/db/src/client.ts";
import {
  createBuild,
  createBuilding,
  createHero,
  createItem,
  createMap,
  createMatchup,
  createRace,
  createUnit,
  deleteBuild,
  deleteBuilding,
  deleteHero,
  deleteItem,
  deleteMap,
  deleteMatchup,
  deleteRace,
  deleteUnit,
  getAdminBuildBySlug,
  getAdminBuildingById,
  getAdminHeroBySlug,
  getAdminItemById,
  getAdminMapBySlug,
  getAdminMatchupBySlug,
  getAdminRaceBySlug,
  getAdminUnitBySlug,
  listAdminBuilds,
  listAdminBuildings,
  listAdminHeroes,
  listAdminItems,
  listAdminMaps,
  listAdminMatchups,
  listAdminRaces,
  listAdminUnits,
  findUserByEmail,
  updateBuild,
  updateBuilding,
  updateHero,
  updateItem,
  updateMap,
  updateMatchup,
  updateRace,
  updateUnit,
} from "../../packages/db/src/content.ts";

const uniqueKey = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

after(async () => {
  await getSql().end();
});

test("admin build CRUD works end-to-end through the DB layer", async () => {
  const key = uniqueKey();
  const admin = await findUserByEmail("admin@example.com");
  assert.ok(admin);

  const created = await createBuild({
    raceSlug: "human",
    matchupSlug: "human-vs-orc",
    title: `Integration Build ${key}`,
    slug: `integration-build-${key}`,
    summary: "Integration build summary.",
    difficulty: "Easy",
    strategyType: "Timing",
    body: "Integration build body.",
    isPublished: true,
    createdByUserId: admin.id,
    steps: [{ stepNumber: 1, supply: 10, timing: "0:35", instruction: "Queue peasant" }],
  });

  assert.equal(created?.slug, `integration-build-${key}`);
  assert.equal(created?.steps.length, 1);
  assert.ok((await listAdminBuilds(50, key)).some((build) => build.slug === `integration-build-${key}`));

  const updated = await updateBuild(created!.id, {
    raceSlug: "human",
    matchupSlug: null,
    title: `Updated Integration Build ${key}`,
    slug: `integration-build-${key}`,
    summary: "Updated integration build summary.",
    difficulty: "Medium",
    strategyType: "Macro",
    body: "Updated body.",
    isPublished: false,
    steps: [{ stepNumber: 1, supply: 12, timing: "0:45", instruction: "Build altar" }],
  });

  assert.equal(updated?.title, `Updated Integration Build ${key}`);
  assert.equal(updated?.difficulty, "Medium");
  assert.equal(updated?.steps[0]?.supply, 12);

  await deleteBuild(created!.id);

  assert.equal(await getAdminBuildBySlug(`integration-build-${key}`), null);
  assert.ok((await listAdminBuilds(50, key)).every((build) => build.id !== created!.id));
});

test("admin matchup, race, and map CRUD work through the DB layer", async () => {
  const key = uniqueKey();

  const race = await createRace({
    name: `Integration Race ${key}`,
    slug: `integration-race-${key}`,
    description: "Integration race description.",
    identity: "Integration identity.",
    ladderFocus: "Integration ladder focus.",
    imageUrl: null,
  });
  assert.equal(race?.slug, `integration-race-${key}`);

  const updatedRace = await updateRace((await getAdminRaceBySlug(`integration-race-${key}`))!.id, {
    name: `Updated Integration Race ${key}`,
    slug: `integration-race-${key}`,
    description: "Updated race description.",
    identity: "Updated identity.",
    ladderFocus: "Updated ladder focus.",
    imageUrl: null,
  });
  assert.equal(updatedRace?.name, `Updated Integration Race ${key}`);
  assert.ok((await listAdminRaces(50, key)).some((entry) => entry.slug === `integration-race-${key}`));

  const matchup = await createMatchup({
    raceASlug: "human",
    raceBSlug: "orc",
    title: `Integration Matchup ${key}`,
    slug: `integration-matchup-${key}`,
    summary: "Integration matchup summary.",
    difficulty: "Medium",
    earlyGamePlan: "Early game.",
    midGamePlan: "Mid game.",
    lateGamePlan: "Late game.",
    commonMistakes: ["Float resources"],
  });
  assert.equal(matchup?.slug, `integration-matchup-${key}`);

  const updatedMatchup = await updateMatchup((await getAdminMatchupBySlug(`integration-matchup-${key}`))!.id, {
    raceASlug: "human",
    raceBSlug: "orc",
    title: `Updated Integration Matchup ${key}`,
    slug: `integration-matchup-${key}`,
    summary: "Updated matchup summary.",
    difficulty: "Hard",
    earlyGamePlan: "Updated early game.",
    midGamePlan: "Updated mid game.",
    lateGamePlan: "Updated late game.",
    commonMistakes: ["Miss scouting"],
  });
  assert.equal(updatedMatchup?.difficulty, "Hard");
  assert.ok((await listAdminMatchups(50, key)).some((entry) => entry.slug === `integration-matchup-${key}`));

  const map = await createMap({
    name: `Integration Map ${key}`,
    slug: `integration-map-${key}`,
    description: "Integration map description.",
    creepNotes: "Creep note.",
    expansionNotes: "Expansion note.",
    imageUrl: null,
  });
  assert.equal(map?.slug, `integration-map-${key}`);

  const updatedMap = await updateMap((await getAdminMapBySlug(`integration-map-${key}`))!.id, {
    name: `Updated Integration Map ${key}`,
    slug: `integration-map-${key}`,
    description: "Updated map description.",
    creepNotes: "Updated creep note.",
    expansionNotes: "Updated expansion note.",
    imageUrl: null,
  });
  assert.equal(updatedMap?.name, `Updated Integration Map ${key}`);
  assert.ok((await listAdminMaps(50, key)).some((entry) => entry.slug === `integration-map-${key}`));

  await deleteMap((await getAdminMapBySlug(`integration-map-${key}`))!.id);
  await deleteMatchup((await getAdminMatchupBySlug(`integration-matchup-${key}`))!.id);
  await deleteRace((await getAdminRaceBySlug(`integration-race-${key}`))!.id);

  assert.ok((await listAdminMaps(50, key)).every((entry) => entry.slug !== `integration-map-${key}`));
  assert.ok((await listAdminMatchups(50, key)).every((entry) => entry.slug !== `integration-matchup-${key}`));
  assert.ok((await listAdminRaces(50, key)).every((entry) => entry.slug !== `integration-race-${key}`));
});

test("admin hero, unit, building, and item CRUD work through the DB layer", async () => {
  const key = uniqueKey();

  const hero = await createHero({
    raceSlug: "human",
    name: `Integration Hero ${key}`,
    slug: `integration-hero-${key}`,
    description: "Integration hero description.",
    primaryAttribute: "Strength",
    role: "Support",
    highlights: ["Support"],
    imageUrl: null,
  });
  assert.equal(hero?.slug, `integration-hero-${key}`);

  const updatedHero = await updateHero((await getAdminHeroBySlug(`integration-hero-${key}`))!.id, {
    raceSlug: "human",
    name: `Updated Integration Hero ${key}`,
    slug: `integration-hero-${key}`,
    description: "Updated hero description.",
    primaryAttribute: "Intelligence",
    role: "Caster",
    highlights: ["Caster"],
    imageUrl: null,
  });
  assert.equal(updatedHero?.role, "Caster");

  const unit = await createUnit({
    raceSlug: "orc",
    name: `Integration Unit ${key}`,
    slug: `integration-unit-${key}`,
    description: "Integration unit description.",
    unitType: "Melee",
    strengths: ["Pressure"],
    weaknesses: ["Kiting"],
    imageUrl: null,
  });
  assert.equal(unit?.slug, `integration-unit-${key}`);

  const updatedUnit = await updateUnit((await getAdminUnitBySlug(`integration-unit-${key}`))!.id, {
    raceSlug: "orc",
    name: `Updated Integration Unit ${key}`,
    slug: `integration-unit-${key}`,
    description: "Updated unit description.",
    unitType: "Ranged",
    strengths: ["Range"],
    weaknesses: ["Fragile"],
    imageUrl: null,
  });
  assert.equal(updatedUnit?.unitType, "Ranged");

  const building = await createBuilding({
    name: `Integration Building ${key}`,
    race: "human",
    description: "Integration building description.",
    imageFile: "TownHall",
  });
  const fetchedBuilding = await getAdminBuildingById(building.id);
  assert.equal(fetchedBuilding?.name, `Integration Building ${key}`);

  const updatedBuilding = await updateBuilding(building.id, {
    name: `Updated Integration Building ${key}`,
    race: "human",
    description: "Updated building description.",
    imageFile: "Keep",
  });
  assert.equal(updatedBuilding?.imageFile, "Keep");

  const item = await createItem({
    name: `Integration Item ${key}`,
    category: "permanent",
    shops: ["goblin-merchant", "creep-drop"],
    description: "Integration item description.",
    imageFile: "CircletOfNobility",
  });
  const fetchedItem = await getAdminItemById(item.id);
  assert.equal(fetchedItem?.name, `Integration Item ${key}`);

  const updatedItem = await updateItem(item.id, {
    name: `Updated Integration Item ${key}`,
    category: "consumable",
    shops: ["creep-drop"],
    description: "Updated item description.",
    imageFile: "WandOfIllusion",
  });
  assert.equal(updatedItem?.category, "consumable");
  assert.deepEqual(updatedItem?.shops, ["creep-drop"]);

  assert.ok((await listAdminHeroes(50, key)).some((entry) => entry.slug === `integration-hero-${key}`));
  assert.ok((await listAdminUnits(50, key)).some((entry) => entry.slug === `integration-unit-${key}`));
  assert.ok((await listAdminBuildings(50, key)).some((entry) => entry.id === building.id));
  assert.ok((await listAdminItems(50, key)).some((entry) => entry.id === item.id));

  await deleteItem(item.id);
  await deleteBuilding(building.id);
  await deleteUnit((await getAdminUnitBySlug(`integration-unit-${key}`))!.id);
  await deleteHero((await getAdminHeroBySlug(`integration-hero-${key}`))!.id);

  assert.ok((await listAdminItems(50, key)).every((entry) => entry.id !== item.id));
  assert.ok((await listAdminBuildings(50, key)).every((entry) => entry.id !== building.id));
  assert.ok((await listAdminUnits(50, key)).every((entry) => entry.slug !== `integration-unit-${key}`));
  assert.ok((await listAdminHeroes(50, key)).every((entry) => entry.slug !== `integration-hero-${key}`));
});
