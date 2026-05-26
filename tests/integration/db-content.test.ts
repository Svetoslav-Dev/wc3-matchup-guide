import assert from "node:assert/strict";
import test, { after } from "node:test";

import { getSql } from "../../packages/db/src/client.ts";
import {
  addFavoriteBuildForUser,
  createUser,
  findBuildBySlug,
  findMapBySlug,
  findUserByEmail,
  listBuilds,
  listFavoriteBuildsForUser,
  listMaps,
  removeFavoriteBuildForUser,
} from "../../packages/db/src/content.ts";

after(async () => {
  await getSql().end();
});

test("listMaps and findMapBySlug return enriched map data from the database layer", async () => {
  const page = await listMaps(1, 10);

  assert.ok(page.total > 0);
  assert.ok(page.data.length > 0);

  const echoIsles = await findMapBySlug("echo-isles");

  assert.equal(echoIsles?.name, "Echo Isles");
  assert.ok((echoIsles?.shops.length ?? 0) > 0);
  assert.ok((echoIsles?.availableItems.length ?? 0) > 0);
});

test("listBuilds and findBuildBySlug return published build content with ordered steps", async () => {
  const page = await listBuilds({ race: "human", page: 1, pageSize: 5 });

  assert.ok(page.total > 0);
  assert.ok(page.data.every((build) => build.raceSlug === "human"));

  const build = await findBuildBySlug("human-footmen-paladin-beginner");

  assert.equal(build?.slug, "human-footmen-paladin-beginner");
  assert.ok((build?.steps.length ?? 0) > 0);
  assert.equal(build?.steps[0]?.stepNumber, 1);
});

test("favorite flow can create, list, and remove a user favorite without touching production data", async () => {
  const uniqueKey = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `integration-${uniqueKey}@example.com`;

  const user = await createUser({
    email,
    username: `integration_${uniqueKey}`,
    passwordHash: "integration-test-hash",
    role: "user",
  });

  const existingUser = await findUserByEmail(email);
  assert.equal(existingUser?.id, user.id);

  const favorite = await addFavoriteBuildForUser(user.id, "human-footmen-paladin-beginner");
  assert.equal(typeof favorite.id, "number");

  const favorites = await listFavoriteBuildsForUser(user.id);
  assert.ok(favorites.some((entry) => entry.build.slug === "human-footmen-paladin-beginner"));

  const removed = await removeFavoriteBuildForUser(user.id, favorite.id);
  assert.equal(removed?.id, favorite.id);

  const afterRemoval = await listFavoriteBuildsForUser(user.id);
  assert.ok(afterRemoval.every((entry) => entry.id !== favorite.id));
});
