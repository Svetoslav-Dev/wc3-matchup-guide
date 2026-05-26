import assert from "node:assert/strict";
import test from "node:test";

import { maps, races, units } from "../../packages/shared/src/index.ts";

const VALID_SHOPS = new Set([
  "Goblin Merchant",
  "Tavern",
  "Goblin Laboratory",
  "Mercenary Camp",
]);

test("map shops use only known neutral building labels", () => {
  for (const map of maps) {
    for (const shop of map.shops) {
      assert.ok(VALID_SHOPS.has(shop), `Unknown shop on ${map.slug}: ${shop}`);
    }
  }
});

test("map mercenary lists stay aligned with Mercenary Camp presence", () => {
  for (const map of maps) {
    const hasMercCamp = map.shops.includes("Mercenary Camp");
    const mercenaries = map.mercenaries ?? [];

    if (mercenaries.length > 0) {
      assert.ok(hasMercCamp, `Map ${map.slug} has mercenaries without a Mercenary Camp`);
    } else {
      assert.ok(true);
    }
  }
});

test("map mercenaries reference known neutral units", () => {
  const unitsByName = new Map(units.map((unit) => [unit.name, unit]));

  for (const map of maps) {
    for (const mercName of map.mercenaries ?? []) {
      const merc = unitsByName.get(mercName);
      assert.ok(merc, `Unknown mercenary on ${map.slug}: ${mercName}`);
      assert.equal(merc?.raceName, "Neutral", `Non-neutral mercenary on ${map.slug}: ${mercName}`);
    }
  }
});

test("map race advantage references valid race names", () => {
  const validRaceNames = new Set(races.map((race) => race.name).filter((name) => name !== "Neutral"));

  for (const map of maps) {
    if (!map.raceAdvantage) {
      continue;
    }

    assert.ok(
      validRaceNames.has(map.raceAdvantage.race),
      `Unknown race advantage on ${map.slug}: ${map.raceAdvantage.race}`,
    );
    assert.ok(map.raceAdvantage.reason.length > 0, `Empty race advantage reason on ${map.slug}`);
  }
});

