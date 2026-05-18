import type { Build, Matchup } from "@warcraft3-guide-hub/shared";
import {
  builds as sharedBuilds,
  heroes as sharedHeroes,
  maps as sharedMaps,
  matchups as sharedMatchups,
  races as sharedRaces,
  units as sharedUnits,
} from "@warcraft3-guide-hub/shared";

export const raceSeeds = sharedRaces;
export const heroSeeds = sharedHeroes;
export const buildSeeds = sharedBuilds;

export const heroRaceSlugMap: Record<string, string> = {
  Human: "human",
  Orc: "orc",
  "Night Elf": "night-elf",
  Undead: "undead",
  Tavern: "neutral",
};

const unitRaceSlugMap: Record<string, string> = {
  Human: "human",
  Orc: "orc",
  Undead: "undead",
  "Night Elf": "night-elf",
  Neutral: "neutral",
};

export const unitSeeds = sharedUnits.map((unit) => ({
  raceSlug: unitRaceSlugMap[unit.raceName],
  name: unit.name,
  slug: unit.slug,
  description: unit.description,
  unitType: unit.unitType,
  strengths: unit.strengths.join(", "),
  weaknesses: unit.weaknesses.join(", "),
}));

export const mapSeeds = sharedMaps;

type MatchupSeed = Matchup & {
  raceASlug: string;
  raceBSlug: string;
};

const raceNameToSlug: Record<string, string> = {
  Human: "human",
  Orc: "orc",
  Undead: "undead",
  "Night Elf": "night-elf",
};

export const matchupSeeds: MatchupSeed[] = sharedMatchups.map((matchup) => {
  const [raceAName, raceBName] = matchup.title.split(" vs ").map((value) => value.trim());

  return {
    ...matchup,
    raceASlug: raceNameToSlug[raceAName],
    raceBSlug: raceNameToSlug[raceBName],
  };
});

export const generatedBuildCount = 10_000;

export const createGeneratedBuilds = (): Build[] =>
  Array.from({ length: generatedBuildCount }, (_, index) => {
    const baseBuild = sharedBuilds[index % sharedBuilds.length];
    const variantNumber = index + 1;

    return {
      ...baseBuild,
      slug: `${baseBuild.slug}-variant-${variantNumber}`,
      title: `${baseBuild.title} Variant ${variantNumber}`,
      summary: `${baseBuild.summary} Generated seed variant ${variantNumber} for pagination and performance testing.`,
      steps: [],
    };
  });
