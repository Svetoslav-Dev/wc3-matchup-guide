import type { Build, Matchup } from "@warcraft3-guide-hub/shared";
import {
  builds as sharedBuilds,
  heroes as sharedHeroes,
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

export const mapSeeds = [
  {
    name: "Echo Isles",
    slug: "echo-isles",
    description: "A compact map with fast skirmish timings and contestable merchant play.",
    creepNotes: "Small camp routes accelerate first-hero tempo for all races.",
    expansionNotes: "Natural expansions can be pressured quickly if scouting is weak.",
  },
  {
    name: "Northern Isles",
    slug: "northern-isles",
    description: "A standard ladder map with balanced creep access and multiple attack lanes.",
    creepNotes: "Green into orange camp routing is flexible and easy to contest.",
    expansionNotes: "Expansions are practical but require vision against timing attacks.",
  },
  {
    name: "Concealed Hill",
    slug: "concealed-hill",
    description: "A larger map that rewards map control and disciplined expansion timing.",
    creepNotes: "Wide creep spread favors scouting and mobility.",
    expansionNotes: "Strong expansion potential for players who control central movement.",
  },
];

type MatchupSeed = Matchup & {
  raceASlug: string;
  raceBSlug: string;
};

export const matchupSeeds: MatchupSeed[] = [
  { ...sharedMatchups[0], raceASlug: "orc", raceBSlug: "human" },
  { ...sharedMatchups[1], raceASlug: "human", raceBSlug: "undead" },
  { ...sharedMatchups[2], raceASlug: "night-elf", raceBSlug: "undead" },
  { ...sharedMatchups[3], raceASlug: "undead", raceBSlug: "orc" },
];

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
