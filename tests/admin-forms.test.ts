import assert from "node:assert/strict";
import test from "node:test";

import {
  formDataToAdminBuildInput,
  formatBuildStepsInput,
  parseBuildStepsInput,
  parseCommonMistakesInput,
} from "../apps/web/lib/admin-forms.ts";

test("parseBuildStepsInput preserves instruction pipes and numeric fields", () => {
  const steps = parseBuildStepsInput("1 | 10 | 0:35 | Queue peon | scout left\n2 | 20 | 2:15 | Tech to tier 2");

  assert.deepEqual(steps, [
    {
      stepNumber: 1,
      supply: 10,
      timing: "0:35",
      instruction: "Queue peon | scout left",
    },
    {
      stepNumber: 2,
      supply: 20,
      timing: "2:15",
      instruction: "Tech to tier 2",
    },
  ]);
  assert.equal(
    formatBuildStepsInput(steps),
    "1 | 10 | 0:35 | Queue peon | scout left\n2 | 20 | 2:15 | Tech to tier 2",
  );
});

test("parseBuildStepsInput rejects malformed step lines", () => {
  assert.throws(
    () => parseBuildStepsInput("1 | 10 | missing instruction"),
    /Invalid build step format on line 1/,
  );
  assert.throws(() => parseBuildStepsInput("0 | 10 | 0:35 | Open altar"), /Invalid step number on line 1/);
});

test("formDataToAdminBuildInput normalizes checkbox and matchup values", () => {
  const formData = new FormData();
  formData.set("raceSlug", "orc");
  formData.set("matchupSlug", "   ");
  formData.set("title", "Fast Raiders");
  formData.set("slug", "fast-raiders");
  formData.set("summary", "Midgame pressure build.");
  formData.set("difficulty", "Intermediate");
  formData.set("strategyType", "Timing");
  formData.set("body", "Pressure the expansion before breakers arrive.");
  formData.set("isPublished", "on");
  formData.set("stepsInput", "1 | 10 | 0:35 | Queue peon");

  assert.deepEqual(formDataToAdminBuildInput(formData), {
    raceSlug: "orc",
    matchupSlug: null,
    title: "Fast Raiders",
    slug: "fast-raiders",
    summary: "Midgame pressure build.",
    difficulty: "Intermediate",
    strategyType: "Timing",
    body: "Pressure the expansion before breakers arrive.",
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
});

test("parseCommonMistakesInput trims and drops blank lines", () => {
  assert.deepEqual(parseCommonMistakesInput("  overexpand \n\n late scout  \n"), ["overexpand", "late scout"]);
});
