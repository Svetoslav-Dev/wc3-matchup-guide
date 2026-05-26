import assert from "node:assert/strict";
import test, { after } from "node:test";

import { getSql } from "../../packages/db/src/client.ts";
import {
  createBuild,
  deleteBuildForUser,
  findUserByEmail,
  getUserBuildById,
  listBuildSubmissionsForUser,
} from "../../packages/db/src/content.ts";

const uniqueKey = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

after(async () => {
  await getSql().end();
});

test("user build submission flow lists, fetches, and soft-deletes owned builds", async () => {
  const key = uniqueKey();
  const user = await findUserByEmail("user@example.com");
  assert.ok(user);

  const created = await createBuild({
    raceSlug: "orc",
    matchupSlug: "orc-vs-human",
    title: `User Build ${key}`,
    slug: `user-build-${key}`,
    summary: "User build summary.",
    difficulty: "Medium",
    strategyType: "Timing",
    body: "User build body.",
    isPublished: false,
    createdByUserId: user.id,
    steps: [
      { stepNumber: 1, supply: 10, timing: "0:35", instruction: "Queue peon" },
      { stepNumber: 2, supply: 20, timing: "2:15", instruction: "Start tech" },
    ],
  });

  const submissions = await listBuildSubmissionsForUser(user.id);
  assert.ok(submissions.some((entry) => entry.slug === `user-build-${key}`));

  const fetched = await getUserBuildById(user.id, created!.id);
  assert.equal(fetched?.slug, `user-build-${key}`);
  assert.equal(fetched?.steps.length, 2);
  assert.equal(fetched?.isPublished, false);

  const removed = await deleteBuildForUser(user.id, created!.id);
  assert.equal(removed?.id, created!.id);

  const afterRemoval = await listBuildSubmissionsForUser(user.id);
  assert.ok(afterRemoval.every((entry) => entry.slug !== `user-build-${key}`));
  assert.equal(await getUserBuildById(user.id, created!.id), null);
});
