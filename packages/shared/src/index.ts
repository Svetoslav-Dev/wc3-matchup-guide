export * from "./types";
export * from "./data";

import { builds, heroes, maps, matchups, races, units } from "./data";
import type { Build, BuildFilters, ListResponse, PaginationMeta } from "./types";

export const getRaceBySlug = (slug: string) => races.find((race) => race.slug === slug);
export const getHeroBySlug = (slug: string) => heroes.find((hero) => hero.slug === slug);
export const getUnitBySlug = (slug: string) => units.find((unit) => unit.slug === slug);
export const getMapBySlug = (slug: string) => maps.find((map) => map.slug === slug);
export const getMatchupBySlug = (slug: string) => matchups.find((matchup) => matchup.slug === slug);
export const getBuildBySlug = (slug: string) => builds.find((build) => build.slug === slug);

const normalizeSearch = (value: string) => value.trim().toLowerCase();

const toPositiveInt = (value: number | undefined, fallback: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return value >= 1 ? Math.floor(value) : fallback;
};

const buildPaginationMeta = (page: number, pageSize: number, total: number): PaginationMeta => ({
  page,
  pageSize,
  total,
  totalPages: Math.max(1, Math.ceil(total / pageSize)),
});

export const paginate = <T>(items: T[], page = 1, pageSize = 20): ListResponse<T> => {
  const safePage = toPositiveInt(page, 1);
  const safePageSize = toPositiveInt(pageSize, 20);
  const start = (safePage - 1) * safePageSize;

  return {
    data: items.slice(start, start + safePageSize),
    ...buildPaginationMeta(safePage, safePageSize, items.length),
  };
};

export const filterBuilds = (items: Build[], filters: BuildFilters = {}) => {
  const search = filters.search ? normalizeSearch(filters.search) : "";

  return items.filter((build) => {
    if (filters.race && build.raceSlug !== filters.race) {
      return false;
    }

    if (filters.matchup && build.matchupSlug !== filters.matchup) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = normalizeSearch(
      [build.title, build.summary, build.strategyType, build.raceName].join(" "),
    );

    return haystack.includes(search);
  });
};

export const queryBuilds = (filters: BuildFilters = {}) => {
  const filtered = filterBuilds(builds, filters);
  return paginate(filtered, filters.page ?? 1, filters.pageSize ?? 20);
};

export const queryHeroes = (page = 1, pageSize = 20) => paginate(heroes, page, pageSize);
export const queryUnits = (page = 1, pageSize = 20) => paginate(units, page, pageSize);
export const queryMaps = (page = 1, pageSize = 20) => paginate(maps, page, pageSize);
export const queryMatchups = (page = 1, pageSize = 20) => paginate(matchups, page, pageSize);
export const queryRaces = (page = 1, pageSize = 20) => paginate(races, page, pageSize);
