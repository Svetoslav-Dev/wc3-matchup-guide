import assert from "node:assert/strict";
import test from "node:test";

import {
  adminBuildSchema,
  adminRaceSchema,
  favoriteMutationSchema,
  loginSchema,
  registerSchema,
} from "../apps/web/lib/validation.ts";

test("registerSchema trims inputs and enforces email/password requirements", () => {
  const parsed = registerSchema.parse({
    email: "  user@example.com  ",
    username: "  ladderhero  ",
    password: "demo123",
  });

  assert.deepEqual(parsed, {
    email: "user@example.com",
    username: "ladderhero",
    password: "demo123",
  });
  assert.throws(
    () =>
      registerSchema.parse({
        email: "not-an-email",
        username: "ab",
        password: "123",
      }),
  );
});

test("loginSchema and favoriteMutationSchema reject invalid payloads", () => {
  assert.deepEqual(loginSchema.parse({ email: "test@example.com", password: "secret1" }), {
    email: "test@example.com",
    password: "secret1",
  });
  assert.throws(() => loginSchema.parse({ email: "bad", password: "secret1" }));
  assert.throws(() => favoriteMutationSchema.parse({ buildSlug: "   " }));
});

test("adminBuildSchema requires valid ordered step data", () => {
  const parsed = adminBuildSchema.parse({
    raceSlug: "orc",
    matchupSlug: "orc-vs-human",
    title: "Fast Raiders",
    slug: "fast-raiders",
    summary: "Pressure focused build.",
    difficulty: "Intermediate",
    strategyType: "Timing",
    body: "Hit before the Human expansion stabilizes.",
    isPublished: true,
    steps: [
      {
        stepNumber: 1,
        supply: 10,
        timing: "0:35",
        instruction: "Queue peon",
      },
    ],
  });

  assert.equal(parsed.steps[0]?.stepNumber, 1);
  assert.throws(() =>
    adminBuildSchema.parse({
      ...parsed,
      steps: [{ stepNumber: 0, supply: -1, timing: "", instruction: "" }],
    }),
  );
});

test("adminRaceSchema requires all public-facing copy fields", () => {
  assert.deepEqual(
    adminRaceSchema.parse({
      name: "Orc",
      slug: "orc",
      description: "Aggressive race",
      identity: "Tempo and pressure",
      ladderFocus: "Scout, punish, and hit timings",
    }),
    {
      name: "Orc",
      slug: "orc",
      description: "Aggressive race",
      identity: "Tempo and pressure",
      ladderFocus: "Scout, punish, and hit timings",
    },
  );
  assert.throws(() =>
    adminRaceSchema.parse({
      name: "Orc",
      slug: "orc",
      description: "",
      identity: "Tempo and pressure",
      ladderFocus: "Scout, punish, and hit timings",
    }),
  );
});
