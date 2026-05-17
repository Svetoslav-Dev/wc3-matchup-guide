import {
  builds,
  favoriteBuilds,
  heroes,
  matchups,
  races,
  type Build,
  type Hero,
  type Matchup,
  type Race,
} from "@warcraft3-guide-hub/shared";

export const mobileStats = {
  races: races.length,
  builds: builds.length,
  matchups: matchups.length,
  heroes: heroes.length,
};

export const mobileData = {
  races,
  builds,
  matchups,
  heroes,
  favoriteBuilds,
};

export const getMobileRace = (slug: string): Race | undefined =>
  races.find((race) => race.slug === slug);

export const getMobileBuild = (slug: string): Build | undefined =>
  builds.find((build) => build.slug === slug);

export const getMobileMatchup = (slug: string): Matchup | undefined =>
  matchups.find((matchup) => matchup.slug === slug);

export const getMobileHero = (slug: string): Hero | undefined =>
  heroes.find((hero) => hero.slug === slug);
