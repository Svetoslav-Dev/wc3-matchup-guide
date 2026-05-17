import assert from "node:assert/strict";
import test from "node:test";

import { builds, filterBuilds, paginate, queryBuilds } from "../packages/shared/src/index.ts";

test("filterBuilds narrows by race, matchup, and search", () => {
  const results = filterBuilds(builds, {
    race: "orc",
    matchup: "orc-vs-human",
    search: "shadow hunter",
  });

  assert.ok(results.length > 0);
  assert.ok(results.every((build) => build.raceSlug === "orc"));
  assert.ok(results.every((build) => build.matchupSlug === "orc-vs-human"));
  assert.ok(
    results.every((build) =>
      `${build.title} ${build.summary} ${build.strategyType} ${build.raceName}`
        .toLowerCase()
        .includes("shadow hunter"),
    ),
  );
});

test("paginate falls back to safe defaults for invalid page inputs", () => {
  const page = paginate([1, 2, 3, 4, 5], 0, Number.NaN);

  assert.deepEqual(page.data, [1, 2, 3, 4, 5]);
  assert.equal(page.page, 1);
  assert.equal(page.pageSize, 20);
  assert.equal(page.total, 5);
  assert.equal(page.totalPages, 1);
});

test("queryBuilds paginates filtered results predictably", () => {
  const filtered = filterBuilds(builds, { race: "orc" });
  const page = queryBuilds({ race: "orc", page: 2, pageSize: 1 });

  assert.equal(page.page, 2);
  assert.equal(page.pageSize, 1);
  assert.equal(page.total, filtered.length);
  assert.equal(page.totalPages, filtered.length);
  assert.deepEqual(page.data, filtered.slice(1, 2));
});
