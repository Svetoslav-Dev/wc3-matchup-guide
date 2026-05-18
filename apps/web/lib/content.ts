import {
  addFavoriteBuildForUser as addDatabaseFavoriteBuildForUser,
  findFavoriteForUserByBuildSlug as findDatabaseFavoriteForUserByBuildSlug,
  getAdminBuildBySlug as getDatabaseAdminBuildBySlug,
  getAdminHeroBySlug as getDatabaseAdminHeroBySlug,
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
  listAdminBuilds as listDatabaseAdminBuilds,
  listAdminHeroes as listDatabaseAdminHeroes,
  listAdminMaps as listDatabaseAdminMaps,
  listAdminMatchups as listDatabaseAdminMatchups,
  listAdminRaces as listDatabaseAdminRaces,
  listAdminUnits as listDatabaseAdminUnits,
  listBuildSubmissionsForUser as listDatabaseBuildSubmissionsForUser,
  listFavoriteBuildsForUser as listDatabaseFavoriteBuildsForUser,
  listBuilds as listDatabaseBuilds,
  listHeroes as listDatabaseHeroes,
  listMaps as listDatabaseMaps,
  listMatchups as listDatabaseMatchups,
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

export const listRaces = async (page = 1, pageSize = 20) =>
  hasDatabaseUrl() ? listDatabaseRaces(page, pageSize) : queryRaces(page, pageSize);

export const getRaceBySlug = async (slug: string) =>
  hasDatabaseUrl() ? findDatabaseRaceBySlug(slug) : getMockRaceBySlug(slug);

export const listHeroes = async (page = 1, pageSize = 20) =>
  hasDatabaseUrl() ? listDatabaseHeroes(page, pageSize) : queryHeroes(page, pageSize);

export const getHeroBySlug = async (slug: string) =>
  hasDatabaseUrl() ? findDatabaseHeroBySlug(slug) : getMockHeroBySlug(slug);

export const listUnits = async (page = 1, pageSize = 20) =>
  hasDatabaseUrl() ? listDatabaseUnits(page, pageSize) : queryUnits(page, pageSize);

export const getUnitBySlug = async (slug: string) =>
  hasDatabaseUrl() ? findDatabaseUnitBySlug(slug) : getMockUnitBySlug(slug);

export const listMaps = async (page = 1, pageSize = 20) =>
  hasDatabaseUrl() ? listDatabaseMaps(page, pageSize) : queryMaps(page, pageSize);

export const getMapBySlug = async (slug: string) =>
  hasDatabaseUrl() ? findDatabaseMapBySlug(slug) : getMockMapBySlug(slug);

export const listMatchups = async (page = 1, pageSize = 20) =>
  hasDatabaseUrl() ? listDatabaseMatchups(page, pageSize) : queryMatchups(page, pageSize);

export const getMatchupBySlug = async (slug: string) =>
  hasDatabaseUrl() ? findDatabaseMatchupBySlug(slug) : getMockMatchupBySlug(slug);

export const listBuilds = async (filters: BuildFilters = {}) =>
  hasDatabaseUrl() ? listDatabaseBuilds(filters) : queryBuilds(filters);

export const getBuildBySlug = async (slug: string) =>
  hasDatabaseUrl() ? findDatabaseBuildBySlug(slug) : getMockBuildBySlug(slug);

export const listAdminBuilds = async (limit = 12) =>
  hasDatabaseUrl() ? listDatabaseAdminBuilds(limit) : [];

export const getAdminBuildBySlug = async (slug: string) =>
  hasDatabaseUrl() ? getDatabaseAdminBuildBySlug(slug) : null;

export const listAdminHeroes = async (limit = 12) =>
  hasDatabaseUrl() ? listDatabaseAdminHeroes(limit) : [];

export const getAdminHeroBySlug = async (slug: string) =>
  hasDatabaseUrl() ? getDatabaseAdminHeroBySlug(slug) : null;

export const listAdminUnits = async (limit = 12) =>
  hasDatabaseUrl() ? listDatabaseAdminUnits(limit) : [];

export const getAdminUnitBySlug = async (slug: string) =>
  hasDatabaseUrl() ? getDatabaseAdminUnitBySlug(slug) : null;

export const listAdminMaps = async (limit = 12) =>
  hasDatabaseUrl() ? listDatabaseAdminMaps(limit) : [];

export const getAdminMapBySlug = async (slug: string) =>
  hasDatabaseUrl() ? getDatabaseAdminMapBySlug(slug) : null;

export const listAdminRaces = async (limit = 12) =>
  hasDatabaseUrl() ? listDatabaseAdminRaces(limit) : [];

export const getAdminRaceBySlug = async (slug: string) =>
  hasDatabaseUrl() ? getDatabaseAdminRaceBySlug(slug) : null;

export const listAdminMatchups = async (limit = 12) =>
  hasDatabaseUrl() ? listDatabaseAdminMatchups(limit) : [];

export const getAdminMatchupBySlug = async (slug: string) =>
  hasDatabaseUrl() ? getDatabaseAdminMatchupBySlug(slug) : null;

export const listFavoriteBuildsForUser = async (userId: number) =>
  hasDatabaseUrl()
    ? listDatabaseFavoriteBuildsForUser(userId)
    : mockFavoriteBuilds.map((build, index) => ({ id: index + 1, build }));

export const listBuildSubmissionsForUser = async (userId: number) =>
  hasDatabaseUrl() ? listDatabaseBuildSubmissionsForUser(userId) : [];

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

export const getHomeStats = async () =>
  hasDatabaseUrl()
    ? (() => getDatabaseContentStats().then((stats) => ({
        ...stats,
        raceTotal: Math.max(0, stats.raceTotal - 1),
      })))()
    : {
        raceTotal: mockRaces.filter((race) => race.slug !== "neutral").length,
        heroTotal: mockHeroes.length,
        matchupTotal: mockMatchups.length,
        buildTotal: queryBuilds().total,
        unitTotal: mockUnits.length,
        mapTotal: mockMaps.length,
      };
