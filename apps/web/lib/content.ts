import { unstable_cache } from "next/cache";
import {
  addFavoriteBuildForUser as addDatabaseFavoriteBuildForUser,
  findFavoriteForUserByBuildSlug as findDatabaseFavoriteForUserByBuildSlug,
  getAdminBuildBySlug as getDatabaseAdminBuildBySlug,
  getUserBuildById as getDatabaseUserBuildById,
  getAdminBuildingById as getDatabaseAdminBuildingById,
  getAdminHeroBySlug as getDatabaseAdminHeroBySlug,
  getAdminItemById as getDatabaseAdminItemById,
  getAdminMapBySlug as getDatabaseAdminMapBySlug,
  getAdminMatchupBySlug as getDatabaseAdminMatchupBySlug,
  getAdminRaceBySlug as getDatabaseAdminRaceBySlug,
  getAdminUnitBySlug as getDatabaseAdminUnitBySlug,
  findBuildBySlug as findDatabaseBuildBySlug,
  findHeroBySlug as findDatabaseHeroBySlug,
  findMapBySlug as findDatabaseMapBySlug,
  findMatchupBySlug as findDatabaseMatchupBySlug,
  findRaceBySlug as findDatabaseRaceBySlug,
  findUnitBySlug as findDatabaseUnitBySlug,
  getContentStats as getDatabaseContentStats,
  hasDatabaseUrl,
  listAdminBuildings as listDatabaseAdminBuildings,
  listAdminBuilds as listDatabaseAdminBuilds,
  listAdminHeroes as listDatabaseAdminHeroes,
  listAdminItems as listDatabaseAdminItems,
  listAdminMaps as listDatabaseAdminMaps,
  listAdminMatchups as listDatabaseAdminMatchups,
  listAdminRaces as listDatabaseAdminRaces,
  listAdminUnits as listDatabaseAdminUnits,
  listBuildSubmissionsForUser as listDatabaseBuildSubmissionsForUser,
  listFavoriteBuildsForUser as listDatabaseFavoriteBuildsForUser,
  listBuilds as listDatabaseBuilds,
  getTopBuildPerRace as getDatabaseTopBuildPerRace,
  listHeroes as listDatabaseHeroes,
  listMaps as listDatabaseMaps,
  listMatchups as listDatabaseMatchups,
  findMatchupsBySlugs as findDatabaseMatchupsBySlugs,
  listRaces as listDatabaseRaces,
  listUnits as listDatabaseUnits,
  removeFavoriteBuildForUser as removeDatabaseFavoriteBuildForUser,
  deleteBuildForUser as deleteDatabaseBuildForUser,
} from "@warcraft3-guide-hub/db";
import {
  favoriteBuilds as mockFavoriteBuilds,
  getBuildBySlug as getMockBuildBySlug,
  getHeroBySlug as getMockHeroBySlug,
  getMapBySlug as getMockMapBySlug,
  getMatchupBySlug as getMockMatchupBySlug,
  getRaceBySlug as getMockRaceBySlug,
  getUnitBySlug as getMockUnitBySlug,
  heroes as mockHeroes,
  maps as mockMaps,
  matchups as mockMatchups,
  queryBuilds,
  queryHeroes,
  queryMaps,
  queryMatchups,
  queryRaces,
  queryUnits,
  races as mockRaces,
  units as mockUnits,
} from "@warcraft3-guide-hub/shared";
import type { BuildFilters } from "@warcraft3-guide-hub/shared";

export const listRaces = unstable_cache(
  async (page = 1, pageSize = 20) =>
    hasDatabaseUrl() ? listDatabaseRaces(page, pageSize) : queryRaces(page, pageSize),
  ["races"],
  { revalidate: 3600, tags: ["races"] },
);

export const getRaceBySlug = unstable_cache(
  async (slug: string) =>
    hasDatabaseUrl() ? findDatabaseRaceBySlug(slug) : getMockRaceBySlug(slug),
  ["race"],
  { revalidate: 3600, tags: ["races"] },
);

export const listHeroes = unstable_cache(
  async (page = 1, pageSize = 20) =>
    hasDatabaseUrl() ? listDatabaseHeroes(page, pageSize) : queryHeroes(page, pageSize),
  ["heroes"],
  { revalidate: 3600, tags: ["heroes"] },
);

export const getHeroBySlug = unstable_cache(
  async (slug: string) =>
    hasDatabaseUrl() ? findDatabaseHeroBySlug(slug) : getMockHeroBySlug(slug),
  ["hero"],
  { revalidate: 3600, tags: ["heroes"] },
);

export const listUnits = unstable_cache(
  async (page = 1, pageSize = 20) =>
    hasDatabaseUrl() ? listDatabaseUnits(page, pageSize) : queryUnits(page, pageSize),
  ["units"],
  { revalidate: 3600, tags: ["units"] },
);

export const getUnitBySlug = unstable_cache(
  async (slug: string) =>
    hasDatabaseUrl() ? findDatabaseUnitBySlug(slug) : getMockUnitBySlug(slug),
  ["unit"],
  { revalidate: 3600, tags: ["units"] },
);

export const listMaps = unstable_cache(
  async (page = 1, pageSize = 20) =>
    hasDatabaseUrl() ? listDatabaseMaps(page, pageSize) : queryMaps(page, pageSize),
  ["maps"],
  { revalidate: 3600, tags: ["maps"] },
);

export const getMapBySlug = unstable_cache(
  async (slug: string) =>
    hasDatabaseUrl() ? findDatabaseMapBySlug(slug) : getMockMapBySlug(slug),
  ["map"],
  { revalidate: 3600, tags: ["maps"] },
);

export const listMatchups = unstable_cache(
  async (page = 1, pageSize = 20) =>
    hasDatabaseUrl() ? listDatabaseMatchups(page, pageSize) : queryMatchups(page, pageSize),
  ["matchups"],
  { revalidate: 3600, tags: ["matchups"] },
);

export const getMatchupBySlug = unstable_cache(
  async (slug: string) =>
    hasDatabaseUrl() ? findDatabaseMatchupBySlug(slug) : getMockMatchupBySlug(slug),
  ["matchup"],
  { revalidate: 3600, tags: ["matchups"] },
);

export const getMatchupsBySlugs = unstable_cache(
  async (slugs: string[]) =>
    hasDatabaseUrl() ? findDatabaseMatchupsBySlugs(slugs) : mockMatchups.filter((m) => slugs.includes(m.slug)),
  ["matchups-by-slugs"],
  { revalidate: 3600, tags: ["matchups"] },
);

export const listBuilds = unstable_cache(
  async (filters: BuildFilters = {}) =>
    hasDatabaseUrl() ? listDatabaseBuilds(filters) : queryBuilds(filters),
  ["builds"],
  { revalidate: 60, tags: ["builds"] },
);

export const getBuildBySlug = unstable_cache(
  async (slug: string) =>
    hasDatabaseUrl() ? findDatabaseBuildBySlug(slug) : getMockBuildBySlug(slug),
  ["build"],
  { revalidate: 60, tags: ["builds"] },
);

export const listAdminBuilds = async (limit = 12, search?: string, race?: string, difficulty?: string) =>
  hasDatabaseUrl() ? listDatabaseAdminBuilds(limit, search, race, difficulty) : [];

export const getAdminBuildBySlug = async (slug: string) =>
  hasDatabaseUrl() ? getDatabaseAdminBuildBySlug(slug) : null;

export const listAdminHeroes = async (limit = 12, search?: string, race?: string) =>
  hasDatabaseUrl() ? listDatabaseAdminHeroes(limit, search, race) : [];

export const getAdminHeroBySlug = async (slug: string) =>
  hasDatabaseUrl() ? getDatabaseAdminHeroBySlug(slug) : null;

export const listAdminUnits = async (limit = 12, search?: string) =>
  hasDatabaseUrl() ? listDatabaseAdminUnits(limit, search) : [];

export const getAdminUnitBySlug = async (slug: string) =>
  hasDatabaseUrl() ? getDatabaseAdminUnitBySlug(slug) : null;

export const listAdminMaps = async (limit = 12, search?: string) =>
  hasDatabaseUrl() ? listDatabaseAdminMaps(limit, search) : [];

export const getAdminMapBySlug = async (slug: string) =>
  hasDatabaseUrl() ? getDatabaseAdminMapBySlug(slug) : null;

export const listAdminRaces = async (limit = 12, search?: string) =>
  hasDatabaseUrl() ? listDatabaseAdminRaces(limit, search) : [];

export const getAdminRaceBySlug = async (slug: string) =>
  hasDatabaseUrl() ? getDatabaseAdminRaceBySlug(slug) : null;

export const listAdminMatchups = async (limit = 12, search?: string) =>
  hasDatabaseUrl() ? listDatabaseAdminMatchups(limit, search) : [];

export const getAdminMatchupBySlug = async (slug: string) =>
  hasDatabaseUrl() ? getDatabaseAdminMatchupBySlug(slug) : null;

export const listAdminBuildings = async (limit = 12, search?: string, race?: string) =>
  hasDatabaseUrl() ? listDatabaseAdminBuildings(limit, search, race) : [];

export const getAdminBuildingById = async (id: number) =>
  hasDatabaseUrl() ? getDatabaseAdminBuildingById(id) : null;

export const listAdminItems = async (limit = 12, search?: string) =>
  hasDatabaseUrl() ? listDatabaseAdminItems(limit, search) : [];

export const getAdminItemById = async (id: number) =>
  hasDatabaseUrl() ? getDatabaseAdminItemById(id) : null;

export const listFavoriteBuildsForUser = async (userId: number) =>
  hasDatabaseUrl()
    ? listDatabaseFavoriteBuildsForUser(userId)
    : mockFavoriteBuilds.map((build, index) => ({ id: index + 1, build }));

export const listBuildSubmissionsForUser = async (userId: number) =>
  hasDatabaseUrl() ? listDatabaseBuildSubmissionsForUser(userId) : [];

export const getUserBuildById = async (userId: number, buildId: number) =>
  hasDatabaseUrl() ? getDatabaseUserBuildById(userId, buildId) : null;

export const findFavoriteForUserByBuildSlug = async (userId: number, buildSlug: string) =>
  hasDatabaseUrl()
    ? findDatabaseFavoriteForUserByBuildSlug(userId, buildSlug)
    : mockFavoriteBuilds.find((build) => build.slug === buildSlug)?.slug
        ? 1
        : null;

export const addFavoriteBuildForUser = async (userId: number, buildSlug: string) =>
  hasDatabaseUrl() ? addDatabaseFavoriteBuildForUser(userId, buildSlug) : null;

export const removeFavoriteBuildForUser = async (userId: number, favoriteId: number) =>
  hasDatabaseUrl() ? removeDatabaseFavoriteBuildForUser(userId, favoriteId) : null;

export const deleteBuildForUser = async (userId: number, buildId: number) =>
  hasDatabaseUrl() ? deleteDatabaseBuildForUser(userId, buildId) : null;

export const getTopBuildPerRace = unstable_cache(
  async (raceSlugs: string[]) =>
    hasDatabaseUrl() ? getDatabaseTopBuildPerRace(raceSlugs) : [],
  ["top-build-per-race"],
  { revalidate: 300, tags: ["builds"] },
);

export const getHomeStats = unstable_cache(
  async () => {
    if (!hasDatabaseUrl()) {
      return {
        raceTotal: mockRaces.filter((race) => race.slug !== "neutral").length,
        heroTotal: mockHeroes.length,
        matchupTotal: mockMatchups.length,
        buildTotal: queryBuilds().total,
        unitTotal: mockUnits.length,
        mapTotal: mockMaps.length,
        buildingTotal: 0,
        itemTotal: 0,
      };
    }
    const stats = await getDatabaseContentStats();
    return { ...stats, raceTotal: Math.max(0, stats.raceTotal - 1) };
  },
  ["home-stats"],
  { revalidate: 300, tags: ["races", "heroes", "builds", "matchups", "units", "maps"] },
);
