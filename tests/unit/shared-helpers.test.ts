import assert from "node:assert/strict";
import test from "node:test";

import {
  getBuildBySlug,
  getItemsByCategory,
  getItemsByShop,
  getMapBySlug,
  getRaceBySlug,
  queryMaps,
} from "../../packages/shared/src/index.ts";
import { slugify } from "../../apps/web/lib/admin-forms.ts";

test("slugify normalizes titles into stable admin-friendly slugs", () => {
  assert.equal(slugify("  Human Footmen + Paladin Beginner  "), "human-footmen-paladin-beginner");
  assert.equal(slugify("!!!"), "build");
  assert.equal(slugify("Orc   Raider   Timing"), "orc-raider-timing");
});

test("shared lookup helpers return known content and miss unknown slugs safely", () => {
  assert.equal(getRaceBySlug("orc")?.name, "Orc");
  assert.equal(getMapBySlug("echo-isles")?.name, "Echo Isles");
  assert.equal(getBuildBySlug("human-footmen-paladin-beginner")?.raceSlug, "human");

  assert.equal(getRaceBySlug("unknown-race"), undefined);
  assert.equal(getMapBySlug("unknown-map"), undefined);
  assert.equal(getBuildBySlug("unknown-build"), undefined);
});

test("shared item helpers filter by shop and category", () => {
  const goblinMerchantItems = getItemsByShop("goblin-merchant");
  const tomeItems = getItemsByCategory("tome");

  assert.ok(goblinMerchantItems.some((item) => item.name === "Boots of Speed"));
  assert.ok(goblinMerchantItems.every((item) => item.shops.includes("goblin-merchant")));

  assert.ok(tomeItems.some((item) => item.name === "Tome of Strength"));
  assert.ok(tomeItems.every((item) => item.category === "tome"));
});

test("queryMaps returns predictable pagination metadata", () => {
  const page = queryMaps(2, 3);

  assert.equal(page.page, 2);
  assert.equal(page.pageSize, 3);
  assert.ok(page.total >= page.data.length);
  assert.ok(page.totalPages >= 1);
  assert.deepEqual(page.data, queryMaps(1, 100).data.slice(3, 6));
});
