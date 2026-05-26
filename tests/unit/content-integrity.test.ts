import assert from "node:assert/strict";
import test from "node:test";

import {
  builds,
  heroes,
  items,
  maps,
  matchups,
  races,
  units,
} from "../../packages/shared/src/index.ts";

const unique = <T>(values: T[]) => new Set(values);

test("content collections keep unique slugs", () => {
  const slugCollections = [
    races.map((race) => race.slug),
    heroes.map((hero) => hero.slug),
    units.map((unit) => unit.slug),
    maps.map((map) => map.slug),
    matchups.map((matchup) => matchup.slug),
    builds.map((build) => build.slug),
  ];

  for (const slugs of slugCollections) {
    assert.equal(unique(slugs).size, slugs.length);
  }
});

test("builds reference existing races and matchups", () => {
  const raceSlugs = new Set(races.map((race) => race.slug));
  const matchupSlugs = new Set(matchups.map((matchup) => matchup.slug));

  for (const build of builds) {
    assert.ok(raceSlugs.has(build.raceSlug), `Unknown raceSlug for build ${build.slug}: ${build.raceSlug}`);

    if (build.matchupSlug) {
      assert.ok(
        matchupSlugs.has(build.matchupSlug),
        `Unknown matchupSlug for build ${build.slug}: ${build.matchupSlug}`,
      );
    }
  }
});

test("hero best items and map available items reference known item records", () => {
  const itemNames = new Set(items.map((item) => item.name));

  for (const hero of heroes) {
    for (const itemName of hero.bestItems) {
      assert.ok(itemNames.has(itemName), `Unknown hero best item for ${hero.slug}: ${itemName}`);
    }
  }

  for (const map of maps) {
    for (const itemName of map.availableItems) {
      assert.ok(itemNames.has(itemName), `Unknown map item for ${map.slug}: ${itemName}`);
    }
  }
});

test("every build keeps ordered positive step data", () => {
  for (const build of builds) {
    assert.ok(build.steps.length > 0, `Build ${build.slug} has no steps`);

    for (const [index, step] of build.steps.entries()) {
      assert.equal(step.stepNumber, index + 1, `Build ${build.slug} step number mismatch at index ${index}`);
      assert.ok(step.supply > 0, `Build ${build.slug} has non-positive supply at step ${step.stepNumber}`);
      assert.ok(step.timing.length > 0, `Build ${build.slug} has empty timing at step ${step.stepNumber}`);
      assert.ok(step.instruction.length > 0, `Build ${build.slug} has empty instruction at step ${step.stepNumber}`);
    }
  }
});

