import assert from "node:assert/strict";
import test from "node:test";

import { getItemInfo } from "../../apps/web/lib/item-lookup.ts";

test("getItemInfo returns correct source labels for known edge-case items", () => {
  assert.deepEqual(getItemInfo("Mask of Death"), {
    imageFile: "MaskOfDeath",
    source: "Drop",
  });
  assert.deepEqual(getItemInfo("Orb of Lightning"), {
    imageFile: "OrbOfLightning",
    source: "Shop",
  });
  assert.deepEqual(getItemInfo("Orb of Corruption"), {
    imageFile: "OrbOfCorruption",
    source: "Shop",
  });
  assert.deepEqual(getItemInfo("Wand of Illusion"), {
    imageFile: "WandOfIllusion",
    source: "Drop / Shop",
  });
});

test("getItemInfo keeps claws variants marked as drops", () => {
  assert.equal(getItemInfo("Claws of Attack +3").source, "Drop");
  assert.equal(getItemInfo("Claws of Attack +6").source, "Drop");
  assert.equal(getItemInfo("Claws of Attack +9").source, "Drop");
  assert.equal(getItemInfo("Claws of Attack +12").source, "Drop");
});

test("getItemInfo falls back safely for unknown items", () => {
  assert.deepEqual(getItemInfo("Unknown Ladder Relic"), {
    imageFile: null,
    source: "Drop / Shop",
  });
});

