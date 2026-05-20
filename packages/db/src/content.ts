import { and, asc, count, desc, eq, ilike, inArray, or } from "drizzle-orm";
import type {
  AdminBuildInput,
  AdminBuildListItem,
  AdminBuildRecord,
  AdminHeroInput,
  AdminHeroListItem,
  AdminHeroRecord,
  AdminMapInput,
  AdminMapListItem,
  AdminMapRecord,
  AdminMatchupListItem,
  AdminMatchupInput,
  AdminMatchupRecord,
  AdminRaceInput,
  AdminRaceListItem,
  AdminRaceRecord,
  AdminUnitInput,
  AdminUnitListItem,
  AdminUnitRecord,
  AuthUser,
  Build,
  BuildFilters,
  BuildStep,
  FavoriteBuild,
  Hero,
  MapGuide,
  ListResponse,
  Matchup,
  Race,
  UserBuildSubmission,
  Unit,
} from "@warcraft3-guide-hub/shared";
import {
  getBuildBySlug as getSharedBuildBySlug,
  getHeroBySlug as getSharedHeroBySlug,
  getMapBySlug as getSharedMapBySlug,
  getMatchupBySlug as getSharedMatchupBySlug,
  getRaceBySlug as getSharedRaceBySlug,
  getUnitBySlug as getSharedUnitBySlug,
} from "@warcraft3-guide-hub/shared";
import { getDb } from "./client";
import { buildSteps, builds, favorites, heroes, maps, matchups, races, units, users } from "./schema";

const toPaginationMeta = (page: number, pageSize: number, total: number) => ({
  page,
  pageSize,
  total,
  totalPages: Math.max(1, Math.ceil(total / pageSize)),
});

const enrichRace = (record: typeof races.$inferSelect): Race => {
  const shared = getSharedRaceBySlug(record.slug);

  return {
    slug: record.slug,
    name: record.name,
    badge: shared?.badge ?? `${record.name} Doctrine`,
    identity: record.identity,
    description: record.description,
    strengths: shared?.strengths ?? [],
    signatureHeroes: shared?.signatureHeroes ?? [],
    ladderFocus: record.ladderFocus,
    imageUrl: shared?.imageUrl ?? null,
  };
};

const enrichHero = (record: typeof heroes.$inferSelect, raceName: string): Hero => {
  const shared = getSharedHeroBySlug(record.slug);

  return {
    slug: record.slug,
    name: record.name,
    raceName: shared?.raceName ?? raceName,
    description: record.description,
    primaryAttribute: record.primaryAttribute,
    role: record.role,
    highlights: shared?.highlights ?? [],
    bestItems: shared?.bestItems ?? [],
    spells: shared?.spells ?? [],
    imageUrl: record.imageUrl ?? shared?.imageUrl ?? null,
  };
};

const enrichUnit = (record: typeof units.$inferSelect, raceName: string): Unit => {
  const shared = getSharedUnitBySlug(record.slug);

  return {
    slug: record.slug,
    name: record.name,
    raceName,
    description: record.description,
    unitType: record.unitType,
    tier: shared?.tier ?? "Tier 1",
    food: shared?.food ?? 0,
    gold: shared?.gold ?? 0,
    lumber: shared?.lumber ?? 0,
    strengths: shared?.strengths ?? record.strengths.split(",").map((value) => value.trim()),
    weaknesses: shared?.weaknesses ?? record.weaknesses.split(",").map((value) => value.trim()),
    imageUrl: record.imageUrl ?? shared?.imageUrl ?? null,
  };
};

const enrichMap = (record: typeof maps.$inferSelect): MapGuide => {
  const shared = getSharedMapBySlug(record.slug);

  return {
    slug: record.slug,
    name: record.name,
    description: record.description,
    creepNotes: shared?.creepNotes ?? record.creepNotes,
    expansionNotes: shared?.expansionNotes ?? record.expansionNotes,
    availableItems: shared?.availableItems ?? [],
    imageUrl: record.imageUrl ?? null,
  };
};

const enrichMatchup = (
  record: typeof matchups.$inferSelect,
  raceAName: string,
  raceBName: string,
): Matchup => {
  const shared = getSharedMatchupBySlug(record.slug);

  return {
    slug: record.slug,
    title: record.title || `${raceAName} vs ${raceBName}`,
    summary: record.summary,
    difficulty: record.difficulty,
    earlyGamePlan: record.earlyGamePlan,
    midGamePlan: record.midGamePlan,
    lateGamePlan: record.lateGamePlan,
    commonMistakes: JSON.parse(record.commonMistakes) as string[],
    heroChoices: shared?.heroChoices ?? [],
  };
};

const enrichBuild = (
  record: typeof builds.$inferSelect,
  raceName: string,
  raceSlug: string,
  matchupTitle?: string | null,
  steps: BuildStep[] = [],
): Build => {
  const shared = getSharedBuildBySlug(record.slug);
  const inferredBestAgainst = (() => {
    if (shared?.bestAgainst) {
      return shared.bestAgainst;
    }

    if (!matchupTitle) {
      return undefined;
    }

    const [leftRace, rightRace] = matchupTitle.split(" vs ").map((value) => value.trim());

    if (leftRace === raceName) {
      return rightRace;
    }

    if (rightRace === raceName) {
      return leftRace;
    }

    return undefined;
  })();

  return {
    slug: record.slug,
    title: record.title,
    raceName,
    raceSlug,
    summary: record.summary,
    difficulty: record.difficulty,
    strategyType: record.strategyType,
    matchupSlug: shared?.matchupSlug,
    bestAgainst: inferredBestAgainst,
    steps,
  };
};

export const listRaces = async (page = 1, pageSize = 20): Promise<ListResponse<Race>> => {
  const db = getDb();
  const total = await db.$count(races);
  const data = await db
    .select()
    .from(races)
    .orderBy(asc(races.name))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return {
    data: data.map(enrichRace),
    ...toPaginationMeta(page, pageSize, total),
  };
};

export const findRaceBySlug = async (slug: string) => {
  const db = getDb();
  const race = await db.query.races.findFirst({
    where: eq(races.slug, slug),
  });

  return race ? enrichRace(race) : undefined;
};

export const listHeroes = async (page = 1, pageSize = 20): Promise<ListResponse<Hero>> => {
  const db = getDb();
  const total = await db.$count(heroes);
  const data = await db.query.heroes.findMany({
    with: {
      race: true,
    },
    orderBy: asc(heroes.name),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return {
    data: data.map((hero) => enrichHero(hero, hero.race.name)),
    ...toPaginationMeta(page, pageSize, total),
  };
};

export const findHeroBySlug = async (slug: string) => {
  const db = getDb();
  const hero = await db.query.heroes.findFirst({
    where: eq(heroes.slug, slug),
    with: {
      race: true,
    },
  });

  return hero ? enrichHero(hero, hero.race.name) : undefined;
};

export const listUnits = async (page = 1, pageSize = 20): Promise<ListResponse<Unit>> => {
  const db = getDb();
  const total = await db.$count(units);
  const data = await db.query.units.findMany({
    with: {
      race: true,
    },
    orderBy: asc(units.name),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return {
    data: data.map((unit) => enrichUnit(unit, unit.race.name)),
    ...toPaginationMeta(page, pageSize, total),
  };
};

export const findUnitBySlug = async (slug: string) => {
  const db = getDb();
  const unit = await db.query.units.findFirst({
    where: eq(units.slug, slug),
    with: {
      race: true,
    },
  });

  return unit ? enrichUnit(unit, unit.race.name) : undefined;
};

export const listMaps = async (page = 1, pageSize = 20): Promise<ListResponse<MapGuide>> => {
  const db = getDb();
  const total = await db.$count(maps);
  const data = await db
    .select()
    .from(maps)
    .orderBy(asc(maps.name))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return {
    data: data.map(enrichMap),
    ...toPaginationMeta(page, pageSize, total),
  };
};

export const findMapBySlug = async (slug: string) => {
  const db = getDb();
  const map = await db.query.maps.findFirst({
    where: eq(maps.slug, slug),
  });

  return map ? enrichMap(map) : undefined;
};

export const listMatchups = async (page = 1, pageSize = 20): Promise<ListResponse<Matchup>> => {
  const db = getDb();
  const total = await db.$count(matchups);
  const data = await db.query.matchups.findMany({
    with: {
      raceA: true,
      raceB: true,
    },
    orderBy: asc(matchups.title),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return {
    data: data.map((matchup) => enrichMatchup(matchup, matchup.raceA.name, matchup.raceB.name)),
    ...toPaginationMeta(page, pageSize, total),
  };
};

export const findMatchupBySlug = async (slug: string) => {
  const db = getDb();
  const matchup = await db.query.matchups.findFirst({
    where: eq(matchups.slug, slug),
    with: {
      raceA: true,
      raceB: true,
    },
  });

  return matchup ? enrichMatchup(matchup, matchup.raceA.name, matchup.raceB.name) : undefined;
};

const buildSearchCondition = (search: string) =>
  or(
    ilike(builds.title, `%${search}%`),
    ilike(builds.summary, `%${search}%`),
    ilike(builds.strategyType, `%${search}%`),
  );

export const listBuilds = async (filters: BuildFilters = {}): Promise<ListResponse<Build>> => {
  const db = getDb();
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const search = filters.search?.trim();

  const raceIds =
    filters.race
      ? (
          await db
            .select({ id: races.id })
            .from(races)
            .where(eq(races.slug, filters.race))
        ).map((record) => record.id)
      : undefined;

  const matchupIds =
    filters.matchup
      ? (
          await db
            .select({ id: matchups.id })
            .from(matchups)
            .where(eq(matchups.slug, filters.matchup))
        ).map((record) => record.id)
      : undefined;

  if ((filters.race && raceIds?.length === 0) || (filters.matchup && matchupIds?.length === 0)) {
    return {
      data: [],
      ...toPaginationMeta(page, pageSize, 0),
    };
  }

  const conditions = [
    eq(builds.isPublished, true),
    filters.race && raceIds ? inArray(builds.raceId, raceIds) : undefined,
    filters.matchup && matchupIds ? inArray(builds.matchupId, matchupIds) : undefined,
    search ? buildSearchCondition(search) : undefined,
  ].filter((condition): condition is NonNullable<typeof condition> => Boolean(condition));

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const totalRows = await db
    .select({ value: count() })
    .from(builds)
    .where(where);
  const total = totalRows[0]?.value ?? 0;

  const data = await db.query.builds.findMany({
    where,
    with: {
      race: true,
      matchup: true,
    },
    orderBy: asc(builds.title),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return {
    data: data.map((build) => enrichBuild(build, build.race.name, build.race.slug, build.matchup?.title)),
    ...toPaginationMeta(page, pageSize, total),
  };
};

export const findBuildBySlug = async (slug: string) => {
  const db = getDb();
  const build = await db.query.builds.findFirst({
    where: and(eq(builds.slug, slug), eq(builds.isPublished, true)),
    with: {
      race: true,
      matchup: true,
      steps: {
        orderBy: asc(buildSteps.stepNumber),
      },
    },
  });

  if (!build) {
    return undefined;
  }

  return enrichBuild(
    build,
    build.race.name,
    build.race.slug,
    build.matchup?.title,
    build.steps.map((step) => ({
      stepNumber: step.stepNumber,
      supply: step.supply,
      timing: step.timing,
      instruction: step.instruction,
    })),
  );
};

export const getContentStats = async () => {
  const db = getDb();

  const [raceTotal, heroTotal, unitTotal, mapTotal, matchupTotal, buildTotal] = await Promise.all([
    db.$count(races),
    db.$count(heroes),
    db.$count(units),
    db.$count(maps),
    db.$count(matchups),
    db.$count(builds),
  ]);

  return {
    raceTotal,
    heroTotal,
    unitTotal,
    mapTotal,
    matchupTotal,
    buildTotal,
  };
};

export const listFavoriteBuildsForUser = async (userId: number): Promise<FavoriteBuild[]> => {
  const db = getDb();
  const records = await db.query.favorites.findMany({
    where: eq(favorites.userId, userId),
    with: {
      build: {
        with: {
          race: true,
          matchup: true,
        },
      },
    },
    orderBy: asc(favorites.id),
  });

  return records.map((favorite) => ({
    id: favorite.id,
    build: enrichBuild(
      favorite.build,
      favorite.build.race.name,
      favorite.build.race.slug,
      favorite.build.matchup?.title,
    ),
  }));
};

export const findFavoriteForUserByBuildSlug = async (userId: number, buildSlug: string) => {
  const db = getDb();
  const favorite = await db.query.favorites.findFirst({
    where: eq(favorites.userId, userId),
    with: {
      build: true,
    },
  });

  if (!favorite || favorite.build.slug !== buildSlug) {
    const matchingFavorite = await db
      .select({
        id: favorites.id,
      })
      .from(favorites)
      .innerJoin(builds, eq(favorites.buildId, builds.id))
      .where(and(eq(favorites.userId, userId), eq(builds.slug, buildSlug)))
      .limit(1);

    return matchingFavorite[0]?.id ?? null;
  }

  return favorite.id;
};

export const addFavoriteBuildForUser = async (userId: number, buildSlug: string) => {
  const db = getDb();
  const build = await db.query.builds.findFirst({
    where: eq(builds.slug, buildSlug),
  });

  if (!build) {
    throw new Error("Build not found.");
  }

  const existing = await db.query.favorites.findFirst({
    where: and(eq(favorites.userId, userId), eq(favorites.buildId, build.id)),
  });

  if (existing) {
    return existing;
  }

  const [favorite] = await db
    .insert(favorites)
    .values({
      userId,
      buildId: build.id,
    })
    .returning();

  return favorite;
};

export const removeFavoriteBuildForUser = async (userId: number, favoriteId: number) => {
  const db = getDb();
  const [removed] = await db
    .delete(favorites)
    .where(and(eq(favorites.id, favoriteId), eq(favorites.userId, userId)))
    .returning();

  return removed ?? null;
};

const resolveRaceIdBySlug = async (slug: string) => {
  const db = getDb();
  const race = await db.query.races.findFirst({
    where: eq(races.slug, slug),
  });

  if (!race) {
    throw new Error(`Race '${slug}' not found.`);
  }

  return race.id;
};

const resolveMatchupIdBySlug = async (slug: string) => {
  const db = getDb();
  const matchup = await db.query.matchups.findFirst({
    where: eq(matchups.slug, slug),
  });

  if (!matchup) {
    throw new Error(`Matchup '${slug}' not found.`);
  }

  return matchup.id;
};

export const createBuild = async (input: AdminBuildInput & { createdByUserId: number }) => {
  const db = getDb();
  const raceId = await resolveRaceIdBySlug(input.raceSlug);
  const matchupId = input.matchupSlug ? await resolveMatchupIdBySlug(input.matchupSlug) : null;

  const [build] = await db
    .insert(builds)
    .values({
      raceId,
      matchupId,
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      difficulty: input.difficulty,
      strategyType: input.strategyType,
      body: input.body,
      isPublished: input.isPublished,
      createdByUserId: input.createdByUserId,
    })
    .returning();

  if (input.steps.length > 0) {
    await db.insert(buildSteps).values(
      input.steps.map((step) => ({
        buildId: build.id,
        stepNumber: step.stepNumber,
        supply: step.supply,
        timing: step.timing,
        instruction: step.instruction,
      })),
    );
  }

  return getAdminBuildBySlug(build.slug);
};

export const updateBuild = async (
  id: number,
  input: AdminBuildInput,
) => {
  const db = getDb();
  const existing = await db.query.builds.findFirst({
    where: eq(builds.id, id),
  });

  if (!existing) {
    return null;
  }

  const raceId = await resolveRaceIdBySlug(input.raceSlug);
  const matchupId = input.matchupSlug ? await resolveMatchupIdBySlug(input.matchupSlug) : null;

  await db
    .update(builds)
    .set({
      raceId,
      matchupId,
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      difficulty: input.difficulty,
      strategyType: input.strategyType,
      body: input.body,
      isPublished: input.isPublished,
      updatedAt: new Date(),
    })
    .where(eq(builds.id, id));

  await db.delete(buildSteps).where(eq(buildSteps.buildId, id));

  if (input.steps.length > 0) {
    await db.insert(buildSteps).values(
      input.steps.map((step) => ({
        buildId: id,
        stepNumber: step.stepNumber,
        supply: step.supply,
        timing: step.timing,
        instruction: step.instruction,
      })),
    );
  }

  return getAdminBuildBySlug(input.slug);
};

export const deleteBuild = async (id: number) => {
  const db = getDb();
  const [removed] = await db.delete(builds).where(eq(builds.id, id)).returning();
  return removed ?? null;
};

export const listBuildSubmissionsForUser = async (userId: number): Promise<UserBuildSubmission[]> => {
  const db = getDb();
  const records = await db.query.builds.findMany({
    where: eq(builds.createdByUserId, userId),
    with: {
      race: true,
    },
    orderBy: desc(builds.createdAt),
  });

  return records.map((build) => ({
    id: build.id,
    slug: build.slug,
    title: build.title,
    raceSlug: build.race.slug,
    raceName: build.race.name,
    summary: build.summary,
    difficulty: build.difficulty,
    strategyType: build.strategyType,
    isPublished: build.isPublished,
  }));
};

export const deleteBuildForUser = async (userId: number, buildId: number) => {
  const db = getDb();
  const [removed] = await db
    .delete(builds)
    .where(and(eq(builds.id, buildId), eq(builds.createdByUserId, userId)))
    .returning();

  return removed ?? null;
};

export const createMatchup = async (input: AdminMatchupInput) => {
  const db = getDb();
  const raceAId = await resolveRaceIdBySlug(input.raceASlug);
  const raceBId = await resolveRaceIdBySlug(input.raceBSlug);

  const [matchup] = await db
    .insert(matchups)
    .values({
      raceAId,
      raceBId,
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      difficulty: input.difficulty,
      earlyGamePlan: input.earlyGamePlan,
      midGamePlan: input.midGamePlan,
      lateGamePlan: input.lateGamePlan,
      commonMistakes: JSON.stringify(input.commonMistakes),
    })
    .returning();

  return getAdminMatchupBySlug(matchup.slug);
};

export const updateMatchup = async (
  id: number,
  input: AdminMatchupInput,
) => {
  const db = getDb();
  const existing = await db.query.matchups.findFirst({
    where: eq(matchups.id, id),
  });

  if (!existing) {
    return null;
  }

  const raceAId = await resolveRaceIdBySlug(input.raceASlug);
  const raceBId = await resolveRaceIdBySlug(input.raceBSlug);

  await db
    .update(matchups)
    .set({
      raceAId,
      raceBId,
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      difficulty: input.difficulty,
      earlyGamePlan: input.earlyGamePlan,
      midGamePlan: input.midGamePlan,
      lateGamePlan: input.lateGamePlan,
      commonMistakes: JSON.stringify(input.commonMistakes),
      updatedAt: new Date(),
    })
    .where(eq(matchups.id, id));

  return getAdminMatchupBySlug(input.slug);
};

export const deleteMatchup = async (id: number) => {
  const db = getDb();
  const [removed] = await db.delete(matchups).where(eq(matchups.id, id)).returning();
  return removed ?? null;
};

export const createHero = async (input: AdminHeroInput) => {
  const db = getDb();
  const raceId = await resolveRaceIdBySlug(input.raceSlug);

  const [hero] = await db
    .insert(heroes)
    .values({
      raceId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      primaryAttribute: input.primaryAttribute,
      role: input.role,
    })
    .returning();

  return findHeroBySlug(hero.slug);
};

export const updateHero = async (id: number, input: AdminHeroInput) => {
  const db = getDb();
  const existing = await db.query.heroes.findFirst({
    where: eq(heroes.id, id),
  });

  if (!existing) {
    return null;
  }

  const raceId = await resolveRaceIdBySlug(input.raceSlug);

  await db
    .update(heroes)
    .set({
      raceId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      primaryAttribute: input.primaryAttribute,
      role: input.role,
      updatedAt: new Date(),
    })
    .where(eq(heroes.id, id));

  return findHeroBySlug(input.slug);
};

export const deleteHero = async (id: number) => {
  const db = getDb();
  const [removed] = await db.delete(heroes).where(eq(heroes.id, id)).returning();
  return removed ?? null;
};

export const createUnit = async (input: AdminUnitInput) => {
  const db = getDb();
  const raceId = await resolveRaceIdBySlug(input.raceSlug);

  const [unit] = await db
    .insert(units)
    .values({
      raceId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      unitType: input.unitType,
      strengths: input.strengths.join(", "),
      weaknesses: input.weaknesses.join(", "),
    })
    .returning();

  return findUnitBySlug(unit.slug);
};

export const updateUnit = async (id: number, input: AdminUnitInput) => {
  const db = getDb();
  const existing = await db.query.units.findFirst({
    where: eq(units.id, id),
  });

  if (!existing) {
    return null;
  }

  const raceId = await resolveRaceIdBySlug(input.raceSlug);

  await db
    .update(units)
    .set({
      raceId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      unitType: input.unitType,
      strengths: input.strengths.join(", "),
      weaknesses: input.weaknesses.join(", "),
      updatedAt: new Date(),
    })
    .where(eq(units.id, id));

  return findUnitBySlug(input.slug);
};

export const deleteUnit = async (id: number) => {
  const db = getDb();
  const [removed] = await db.delete(units).where(eq(units.id, id)).returning();
  return removed ?? null;
};

export const createMap = async (input: AdminMapInput) => {
  const db = getDb();
  const [map] = await db
    .insert(maps)
    .values({
      name: input.name,
      slug: input.slug,
      description: input.description,
      creepNotes: input.creepNotes,
      expansionNotes: input.expansionNotes,
    })
    .returning();

  return findMapBySlug(map.slug);
};

export const updateMap = async (id: number, input: AdminMapInput) => {
  const db = getDb();
  const existing = await db.query.maps.findFirst({
    where: eq(maps.id, id),
  });

  if (!existing) {
    return null;
  }

  await db
    .update(maps)
    .set({
      name: input.name,
      slug: input.slug,
      description: input.description,
      creepNotes: input.creepNotes,
      expansionNotes: input.expansionNotes,
      updatedAt: new Date(),
    })
    .where(eq(maps.id, id));

  return findMapBySlug(input.slug);
};

export const deleteMap = async (id: number) => {
  const db = getDb();
  const [removed] = await db.delete(maps).where(eq(maps.id, id)).returning();
  return removed ?? null;
};

export const createRace = async (input: AdminRaceInput) => {
  const db = getDb();
  const [race] = await db
    .insert(races)
    .values({
      name: input.name,
      slug: input.slug,
      description: input.description,
      identity: input.identity,
      ladderFocus: input.ladderFocus,
    })
    .returning();

  return findRaceBySlug(race.slug);
};

export const updateRace = async (id: number, input: AdminRaceInput) => {
  const db = getDb();
  const existing = await db.query.races.findFirst({
    where: eq(races.id, id),
  });

  if (!existing) {
    return null;
  }

  await db
    .update(races)
    .set({
      name: input.name,
      slug: input.slug,
      description: input.description,
      identity: input.identity,
      ladderFocus: input.ladderFocus,
      updatedAt: new Date(),
    })
    .where(eq(races.id, id));

  return findRaceBySlug(input.slug);
};

export const deleteRace = async (id: number) => {
  const db = getDb();
  const [removed] = await db.delete(races).where(eq(races.id, id)).returning();
  return removed ?? null;
};

export const getAdminBuildBySlug = async (slug: string): Promise<AdminBuildRecord | null> => {
  const db = getDb();
  const build = await db.query.builds.findFirst({
    where: eq(builds.slug, slug),
    with: {
      race: true,
      matchup: true,
      steps: {
        orderBy: asc(buildSteps.stepNumber),
      },
    },
  });

  if (!build) {
    return null;
  }

  return {
    id: build.id,
    raceSlug: build.race.slug,
    matchupSlug: build.matchup?.slug ?? null,
    title: build.title,
    slug: build.slug,
    summary: build.summary,
    difficulty: build.difficulty,
    strategyType: build.strategyType,
    body: build.body,
    isPublished: build.isPublished,
    steps: build.steps.map((step) => ({
      stepNumber: step.stepNumber,
      supply: step.supply,
      timing: step.timing,
      instruction: step.instruction,
    })),
  };
};

export const listAdminBuilds = async (limit = 12): Promise<AdminBuildListItem[]> => {
  const db = getDb();
  const records = await db.query.builds.findMany({
    with: {
      race: true,
    },
    orderBy: asc(builds.title),
    limit,
  });

  return records.map((build) => ({
    id: build.id,
    slug: build.slug,
    title: build.title,
    raceSlug: build.race.slug,
    raceName: build.race.name,
    difficulty: build.difficulty,
    strategyType: build.strategyType,
    isPublished: build.isPublished,
  }));
};

export const getAdminMatchupBySlug = async (slug: string): Promise<AdminMatchupRecord | null> => {
  const db = getDb();
  const matchup = await db.query.matchups.findFirst({
    where: eq(matchups.slug, slug),
    with: {
      raceA: true,
      raceB: true,
    },
  });

  if (!matchup) {
    return null;
  }

  return {
    id: matchup.id,
    raceASlug: matchup.raceA.slug,
    raceBSlug: matchup.raceB.slug,
    title: matchup.title,
    slug: matchup.slug,
    summary: matchup.summary,
    difficulty: matchup.difficulty,
    earlyGamePlan: matchup.earlyGamePlan,
    midGamePlan: matchup.midGamePlan,
    lateGamePlan: matchup.lateGamePlan,
    commonMistakes: JSON.parse(matchup.commonMistakes) as string[],
  };
};

export const listAdminMatchups = async (limit = 12): Promise<AdminMatchupListItem[]> => {
  const db = getDb();
  const records = await db.query.matchups.findMany({
    with: {
      raceA: true,
      raceB: true,
    },
    orderBy: asc(matchups.title),
    limit,
  });

  return records.map((matchup) => ({
    id: matchup.id,
    slug: matchup.slug,
    title: matchup.title,
    raceASlug: matchup.raceA.slug,
    raceBSlug: matchup.raceB.slug,
    difficulty: matchup.difficulty,
  }));
};

export const getAdminHeroBySlug = async (slug: string): Promise<AdminHeroRecord | null> => {
  const db = getDb();
  const hero = await db.query.heroes.findFirst({
    where: eq(heroes.slug, slug),
    with: {
      race: true,
    },
  });

  if (!hero) {
    return null;
  }

  return {
    id: hero.id,
    raceSlug: hero.race.slug,
    name: hero.name,
    slug: hero.slug,
    description: hero.description,
    primaryAttribute: hero.primaryAttribute,
    role: hero.role,
    highlights: getSharedHeroBySlug(hero.slug)?.highlights ?? [],
  };
};

export const listAdminHeroes = async (limit = 12): Promise<AdminHeroListItem[]> => {
  const db = getDb();
  const records = await db.query.heroes.findMany({
    with: {
      race: true,
    },
    orderBy: asc(heroes.name),
    limit,
  });

  return records.map((hero) => ({
    id: hero.id,
    slug: hero.slug,
    name: hero.name,
    raceSlug: hero.race.slug,
    raceName: hero.race.name,
    primaryAttribute: hero.primaryAttribute,
    role: hero.role,
  }));
};

export const getAdminUnitBySlug = async (slug: string): Promise<AdminUnitRecord | null> => {
  const db = getDb();
  const unit = await db.query.units.findFirst({
    where: eq(units.slug, slug),
    with: {
      race: true,
    },
  });

  if (!unit) {
    return null;
  }

  return {
    id: unit.id,
    raceSlug: unit.race.slug,
    name: unit.name,
    slug: unit.slug,
    description: unit.description,
    unitType: unit.unitType,
    strengths: getSharedUnitBySlug(unit.slug)?.strengths ?? unit.strengths.split(",").map((value) => value.trim()),
    weaknesses: getSharedUnitBySlug(unit.slug)?.weaknesses ?? unit.weaknesses.split(",").map((value) => value.trim()),
  };
};

export const listAdminUnits = async (limit = 12): Promise<AdminUnitListItem[]> => {
  const db = getDb();
  const records = await db.query.units.findMany({
    with: {
      race: true,
    },
    orderBy: asc(units.name),
    limit,
  });

  return records.map((unit) => ({
    id: unit.id,
    slug: unit.slug,
    name: unit.name,
    raceSlug: unit.race.slug,
    raceName: unit.race.name,
    unitType: unit.unitType,
  }));
};

export const getAdminMapBySlug = async (slug: string): Promise<AdminMapRecord | null> => {
  const db = getDb();
  const map = await db.query.maps.findFirst({
    where: eq(maps.slug, slug),
  });

  if (!map) {
    return null;
  }

  return {
    id: map.id,
    name: map.name,
    slug: map.slug,
    description: map.description,
    creepNotes: map.creepNotes,
    expansionNotes: map.expansionNotes,
  };
};

export const listAdminMaps = async (limit = 12): Promise<AdminMapListItem[]> => {
  const db = getDb();
  const records = await db
    .select()
    .from(maps)
    .orderBy(asc(maps.name))
    .limit(limit);

  return records.map((map) => ({
    id: map.id,
    slug: map.slug,
    name: map.name,
  }));
};

export const getAdminRaceBySlug = async (slug: string): Promise<AdminRaceRecord | null> => {
  const db = getDb();
  const race = await db.query.races.findFirst({
    where: eq(races.slug, slug),
  });

  if (!race) {
    return null;
  }

  return {
    id: race.id,
    name: race.name,
    slug: race.slug,
    description: race.description,
    identity: race.identity,
    ladderFocus: race.ladderFocus,
  };
};

export const listAdminRaces = async (limit = 12): Promise<AdminRaceListItem[]> => {
  const db = getDb();
  const records = await db
    .select()
    .from(races)
    .orderBy(asc(races.name))
    .limit(limit);

  return records.map((race) => ({
    id: race.id,
    slug: race.slug,
    name: race.name,
  }));
};

const toAuthUser = (user: typeof users.$inferSelect): AuthUser => ({
  id: user.id,
  email: user.email,
  username: user.username,
  role: user.role,
});

export const findUserByEmail = async (email: string) => {
  const db = getDb();
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

export const findUserByUsername = async (username: string) => {
  const db = getDb();
  return db.query.users.findFirst({
    where: eq(users.username, username),
  });
};

export const findUserById = async (id: number) => {
  const db = getDb();
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

export const createUser = async (input: {
  email: string;
  username: string;
  passwordHash: string;
  role?: AuthUser["role"];
}) => {
  const db = getDb();
  const [user] = await db
    .insert(users)
    .values({
      email: input.email,
      username: input.username,
      passwordHash: input.passwordHash,
      role: input.role ?? "user",
    })
    .returning();

  return user;
};

export const sanitizeUser = (user: typeof users.$inferSelect): AuthUser => toAuthUser(user);
