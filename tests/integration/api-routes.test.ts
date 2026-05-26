import assert from "node:assert/strict";
import test, { after } from "node:test";

import { getSql } from "../../packages/db/src/client.ts";
import { GET as getHealth } from "../../apps/web/app/api/health/route.ts";

after(async () => {
  await getSql().end();
});

test("health route reports configured and reachable database in integration CI", async () => {
  const response = await getHealth();
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.service, "wc3-matchup-guide");
  assert.equal(payload.readiness.databaseConfigured, true);
  assert.equal(payload.readiness.databaseReachable, true);
  assert.equal(payload.readiness.authConfigured, true);
});
