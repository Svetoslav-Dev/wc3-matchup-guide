import {
  builds,
  favoriteBuilds,
  heroes,
  maps,
  matchups,
  races,
  units,
  type Build,
  type Hero,
  type MapGuide,
  type Matchup,
  type Race,
  type Unit,
} from "@warcraft3-guide-hub/shared";

export const mobileStats = {
  races: races.length,
  builds: builds.length,
  matchups: matchups.length,
  heroes: heroes.length,
  units: units.length,
  maps: maps.length,
};

export const mobileData = {
  races,
  builds,
  matchups,
  heroes,
  units,
  maps,
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

export const getMobileUnit = (slug: string): Unit | undefined =>
  units.find((unit) => unit.slug === slug);

export const getMobileMap = (slug: string): MapGuide | undefined =>
  maps.find((map) => map.slug === slug);
