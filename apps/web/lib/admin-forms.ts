import type {
  AdminBuildInput,
  AdminHeroInput,
  AdminMapInput,
  AdminMatchupInput,
  AdminRaceInput,
  AdminUnitInput,
  BuildStep,
} from "@warcraft3-guide-hub/shared";

export const parseBuildStepsInput = (value: string): BuildStep[] => {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => {
    const parts = line.split("|").map((part) => part.trim());

    if (parts.length < 4) {
      throw new Error(`Invalid build step format on line ${index + 1}. Use step|supply|timing|instruction.`);
    }

    const [stepNumberRaw, supplyRaw, timing, ...instructionParts] = parts;
    const stepNumber = Number.parseInt(stepNumberRaw, 10);
    const supply = Number.parseInt(supplyRaw, 10);
    const instruction = instructionParts.join(" | ").trim();

    if (!Number.isFinite(stepNumber) || stepNumber < 1) {
      throw new Error(`Invalid step number on line ${index + 1}.`);
    }

    if (!Number.isFinite(supply) || supply < 0) {
      throw new Error(`Invalid supply value on line ${index + 1}.`);
    }

    if (!timing || !instruction) {
      throw new Error(`Missing timing or instruction on line ${index + 1}.`);
    }

    return {
      stepNumber,
      supply,
      timing,
      instruction,
    };
  });
};

export const formatBuildStepsInput = (steps: BuildStep[]) =>
  steps.map((step) => `${step.stepNumber} | ${step.supply} | ${step.timing} | ${step.instruction}`).join("\n");

export const parseCommonMistakesInput = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export const formatCommonMistakesInput = (items: string[]) => items.join("\n");
export const formatLineItemsInput = (items: string[]) => items.join("\n");

export const formDataToAdminBuildInput = (formData: FormData): AdminBuildInput => ({
  raceSlug: String(formData.get("raceSlug") ?? ""),
  matchupSlug: String(formData.get("matchupSlug") ?? "").trim() || null,
  title: String(formData.get("title") ?? ""),
  slug: String(formData.get("slug") ?? ""),
  summary: String(formData.get("summary") ?? ""),
  difficulty: String(formData.get("difficulty") ?? ""),
  strategyType: String(formData.get("strategyType") ?? ""),
  body: String(formData.get("body") ?? ""),
  isPublished: formData.get("isPublished") === "on",
  steps: parseBuildStepsInput(String(formData.get("stepsInput") ?? "")),
});

export const formDataToAdminMatchupInput = (formData: FormData): AdminMatchupInput => ({
  raceASlug: String(formData.get("raceASlug") ?? ""),
  raceBSlug: String(formData.get("raceBSlug") ?? ""),
  title: String(formData.get("title") ?? ""),
  slug: String(formData.get("slug") ?? ""),
  summary: String(formData.get("summary") ?? ""),
  difficulty: String(formData.get("difficulty") ?? ""),
  earlyGamePlan: String(formData.get("earlyGamePlan") ?? ""),
  midGamePlan: String(formData.get("midGamePlan") ?? ""),
  lateGamePlan: String(formData.get("lateGamePlan") ?? ""),
  commonMistakes: parseCommonMistakesInput(String(formData.get("commonMistakesInput") ?? "")),
});

export const formDataToAdminHeroInput = (formData: FormData): AdminHeroInput => ({
  raceSlug: String(formData.get("raceSlug") ?? ""),
  name: String(formData.get("name") ?? ""),
  slug: String(formData.get("slug") ?? ""),
  description: String(formData.get("description") ?? ""),
  primaryAttribute: String(formData.get("primaryAttribute") ?? ""),
  role: String(formData.get("role") ?? ""),
  highlights: parseCommonMistakesInput(String(formData.get("highlightsInput") ?? "")),
  imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
});

export const formDataToAdminUnitInput = (formData: FormData): AdminUnitInput => ({
  raceSlug: String(formData.get("raceSlug") ?? ""),
  name: String(formData.get("name") ?? ""),
  slug: String(formData.get("slug") ?? ""),
  description: String(formData.get("description") ?? ""),
  unitType: String(formData.get("unitType") ?? ""),
  strengths: parseCommonMistakesInput(String(formData.get("strengthsInput") ?? "")),
  weaknesses: parseCommonMistakesInput(String(formData.get("weaknessesInput") ?? "")),
  imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
});

export const formDataToAdminMapInput = (formData: FormData): AdminMapInput => ({
  name: String(formData.get("name") ?? ""),
  slug: String(formData.get("slug") ?? ""),
  description: String(formData.get("description") ?? ""),
  creepNotes: String(formData.get("creepNotes") ?? ""),
  expansionNotes: String(formData.get("expansionNotes") ?? ""),
  imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
});

export const formDataToAdminRaceInput = (formData: FormData): AdminRaceInput => ({
  name: String(formData.get("name") ?? ""),
  slug: String(formData.get("slug") ?? ""),
  description: String(formData.get("description") ?? ""),
  identity: String(formData.get("identity") ?? ""),
  ladderFocus: String(formData.get("ladderFocus") ?? ""),
  imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
});

export const formDataToAdminBuildingInput = (formData: FormData) => ({
  name: String(formData.get("name") ?? ""),
  race: String(formData.get("race") ?? ""),
  description: String(formData.get("description") ?? ""),
  imageFile: String(formData.get("imageFile") ?? "").trim(),
});

export const formDataToAdminItemInput = (formData: FormData) => ({
  name: String(formData.get("name") ?? ""),
  category: String(formData.get("category") ?? ""),
  shops: String(formData.get("shopsInput") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
  description: String(formData.get("description") ?? ""),
  imageFile: String(formData.get("imageFile") ?? "").trim(),
});
