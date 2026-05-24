import { and, asc, count, desc, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm";
import type {
  AdminBuildInput,
  AdminBuildListItem,
  AdminBuildRecord,
  AdminBuildingInput,
  AdminBuildingListItem,
  AdminBuildingRecord,
  AdminHeroInput,
  AdminHeroListItem,
  AdminHeroRecord,
  AdminItemInput,
  AdminItemListItem,
  AdminItemRecord,
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
import { buildSteps, builds, buildingsTable, favorites, gameItems, heroes, maps, matchups, races, units, users } from "./schema";

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
    imageUrl: record.imageUrl ?? shared?.imageUrl ?? null,
    playDifficulty: shared?.playDifficulty ?? null,
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
    shops: shared?.shops ?? [],
    imageUrl: record.imageUrl ?? shared?.imageUrl ?? "/images/Maps/Wc3LostTempleRoC.png",
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
  const sharedRace = getSharedRaceBySlug(raceSlug);
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
    raceImageUrl: sharedRace?.imageUrl ?? null,
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
  const [total, data] = await Promise.all([
    db.$count(races, isNull(races.deletedAt)),
    db.select().from(races)
      .where(isNull(races.deletedAt))
      .orderBy(sql`CASE ${races.slug}
        WHEN 'human'     THEN 1
        WHEN 'orc'       THEN 2
        WHEN 'night-elf' THEN 3
        WHEN 'undead'    THEN 4
        ELSE 5
      END`)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
  ]);

  return {
    data: data.map(enrichRace),
    ...toPaginationMeta(page, pageSize, total),
  };
};

export const findRaceBySlug = async (slug: string) => {
  const db = getDb();
  const race = await db.query.races.findFirst({
    where: and(eq(races.slug, slug), isNull(races.deletedAt)),
  });

  return race ? enrichRace(race) : undefined;
};

export const listHeroes = async (page = 1, pageSize = 20): Promise<ListResponse<Hero>> => {
  const db = getDb();
  const total = await db.$count(heroes, isNull(heroes.deletedAt));
  const data = await db.query.heroes.findMany({
    with: {
      race: true,
    },
    where: isNull(heroes.deletedAt),
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
    where: and(eq(heroes.slug, slug), isNull(heroes.deletedAt)),
    with: {
      race: true,
    },
  });

  return hero ? enrichHero(hero, hero.race.name) : undefined;
};

export const listUnits = async (page = 1, pageSize = 20): Promise<ListResponse<Unit>> => {
  const db = getDb();
  const total = await db.$count(units, isNull(units.deletedAt));
  const data = await db.query.units.findMany({
    with: {
      race: true,
    },
    where: isNull(units.deletedAt),
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
    where: and(eq(units.slug, slug), isNull(units.deletedAt)),
    with: {
      race: true,
    },
  });

  return unit ? enrichUnit(unit, unit.race.name) : undefined;
};

export const listMaps = async (page = 1, pageSize = 20): Promise<ListResponse<MapGuide>> => {
  const db = getDb();
  const [total, data] = await Promise.all([
    db.$count(maps, isNull(maps.deletedAt)),
    db.select().from(maps).where(isNull(maps.deletedAt)).orderBy(asc(maps.name)).limit(pageSize).offset((page - 1) * pageSize),
  ]);

  return {
    data: data.map(enrichMap),
    ...toPaginationMeta(page, pageSize, total),
  };
};

export const findMapBySlug = async (slug: string) => {
  const db = getDb();
  const map = await db.query.maps.findFirst({
    where: and(eq(maps.slug, slug), isNull(maps.deletedAt)),
  });

  return map ? enrichMap(map) : undefined;
};

export const listMatchups = async (page = 1, pageSize = 20): Promise<ListResponse<Matchup>> => {
  const db = getDb();
  const total = await db.$count(matchups, isNull(matchups.deletedAt));
  const data = await db.query.matchups.findMany({
    with: {
      raceA: true,
      raceB: true,
    },
    where: isNull(matchups.deletedAt),
    orderBy: asc(matchups.title),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return {
    data: data.map((matchup) => enrichMatchup(matchup, matchup.raceA.name, matchup.raceB.name)),
    ...toPaginationMeta(page, pageSize, total),
  };
};

export const findMatchupsBySlugs = async (slugList: string[]): Promise<Matchup[]> => {
  if (slugList.length === 0) return [];
  const db = getDb();
  const data = await db.query.matchups.findMany({
    where: and(inArray(matchups.slug, slugList), isNull(matchups.deletedAt)),
    with: { raceA: true, raceB: true },
  });
  return data.map((m) => enrichMatchup(m, m.raceA.name, m.raceB.name));
};

export const findMatchupBySlug = async (slug: string) => {
  const db = getDb();
  const matchup = await db.query.matchups.findFirst({
    where: and(eq(matchups.slug, slug), isNull(matchups.deletedAt)),
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

  // Inline subqueries — no extra round-trips for race/matchup ID lookups
  const conditions = [
    eq(builds.isPublished, true),
    isNull(builds.deletedAt),
    filters.race
      ? inArray(builds.raceId, db.select({ id: races.id }).from(races).where(eq(races.slug, filters.race)))
      : undefined,
    filters.matchup
      ? inArray(builds.matchupId, db.select({ id: matchups.id }).from(matchups).where(eq(matchups.slug, filters.matchup)))
      : undefined,
    filters.difficulty ? eq(builds.difficulty, filters.difficulty) : undefined,
    search ? buildSearchCondition(search) : undefined,
  ].filter((condition): condition is NonNullable<typeof condition> => Boolean(condition));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Count and data in parallel — one fewer sequential round-trip
  const [totalRows, data] = await Promise.all([
    db.select({ value: count() }).from(builds).where(where),
    db.query.builds.findMany({
      where,
      with: { race: true, matchup: true },
      orderBy: filters.difficulty
        ? asc(builds.title)
        : [
            sql`CASE ${builds.difficulty}
              WHEN 'Easy'      THEN 1
              WHEN 'Medium'    THEN 2
              WHEN 'Hard'      THEN 3
              WHEN 'Very Hard' THEN 4
              ELSE 5 END`,
            asc(builds.title),
          ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
  ]);

  const total = totalRows[0]?.value ?? 0;

  return {
    data: data.map((build) => enrichBuild(build, build.race.name, build.race.slug, build.matchup?.title)),
    ...toPaginationMeta(page, pageSize, total),
  };
};

export const findBuildBySlug = async (slug: string) => {
  const db = getDb();
  const build = await db.query.builds.findFirst({
    where: and(eq(builds.slug, slug), eq(builds.isPublished, true), isNull(builds.deletedAt)),
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

// Single parallel fetch — replaces 4×listBuilds (8 queries) with 4 findFirst (no COUNT).
export const getTopBuildPerRace = async (raceSlugs: string[]): Promise<Build[]> => {
  const db = getDb();
  const results = await Promise.all(
    raceSlugs.map((raceSlug) =>
      db.query.builds.findFirst({
        where: and(
          eq(builds.isPublished, true),
          isNull(builds.deletedAt),
          inArray(builds.raceId, db.select({ id: races.id }).from(races).where(eq(races.slug, raceSlug))),
        ),
        with: { race: true, matchup: true },
        orderBy: desc(builds.createdAt),
      }),
    ),
  );
  return results
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .map((b) => enrichBuild(b, b.race.name, b.race.slug, b.matchup?.title));
};

export const getContentStats = async () => {
  const db = getDb();

  // Single round trip replaces 8 parallel COUNTs
  const [row] = await db.execute<{
    race_total: string; hero_total: string; unit_total: string; map_total: string;
    matchup_total: string; build_total: string; building_total: string; item_total: string;
  }>(sql`
    SELECT
      (SELECT COUNT(*) FROM races      WHERE deleted_at IS NULL)                           AS race_total,
      (SELECT COUNT(*) FROM heroes     WHERE deleted_at IS NULL)                           AS hero_total,
      (SELECT COUNT(*) FROM units      WHERE deleted_at IS NULL)                           AS unit_total,
      (SELECT COUNT(*) FROM maps       WHERE deleted_at IS NULL)                           AS map_total,
      (SELECT COUNT(*) FROM matchups   WHERE deleted_at IS NULL)                           AS matchup_total,
      (SELECT COUNT(*) FROM builds     WHERE is_published = true AND deleted_at IS NULL)   AS build_total,
      (SELECT COUNT(*) FROM buildings  WHERE deleted_at IS NULL)                           AS building_total,
      (SELECT COUNT(*) FROM game_items WHERE deleted_at IS NULL)                           AS item_total
  `);

  const raceTotal     = Number(row.race_total);
  const heroTotal     = Number(row.hero_total);
  const unitTotal     = Number(row.unit_total);
  const mapTotal      = Number(row.map_total);
  const matchupTotal  = Number(row.matchup_total);
  const buildTotal    = Number(row.build_total);
  const buildingTotal = Number(row.building_total);
  const itemTotal     = Number(row.item_total);

  return {
    raceTotal,
    heroTotal,
    unitTotal,
    mapTotal,
    matchupTotal,
    buildTotal,
    buildingTotal,
    itemTotal,
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
  const [removed] = await db.update(builds).set({ deletedAt: new Date() }).where(eq(builds.id, id)).returning();
  return removed ?? null;
};

export const listBuildSubmissionsForUser = async (userId: number): Promise<UserBuildSubmission[]> => {
  const db = getDb();
  const records = await db.query.builds.findMany({
    where: and(eq(builds.createdByUserId, userId), isNull(builds.deletedAt)),
    with: { race: true },
    orderBy: desc(builds.createdAt),
    limit: 100,
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

export const getUserBuildById = async (userId: number, buildId: number): Promise<AdminBuildRecord | null> => {
  const db = getDb();
  const build = await db.query.builds.findFirst({
    where: and(eq(builds.id, buildId), eq(builds.createdByUserId, userId), isNull(builds.deletedAt)),
    with: {
      race: true,
      matchup: true,
      steps: { orderBy: asc(buildSteps.stepNumber) },
    },
  });
  if (!build) return null;
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

export const deleteBuildForUser = async (userId: number, buildId: number) => {
  const db = getDb();
  const [removed] = await db
    .update(builds)
    .set({ deletedAt: new Date() })
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
  const [removed] = await db.update(matchups).set({ deletedAt: new Date() }).where(eq(matchups.id, id)).returning();
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
      imageUrl: input.imageUrl ?? null,
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
      imageUrl: input.imageUrl ?? null,
      updatedAt: new Date(),
    })
    .where(eq(heroes.id, id));

  return findHeroBySlug(input.slug);
};

export const deleteHero = async (id: number) => {
  const db = getDb();
  const [removed] = await db.update(heroes).set({ deletedAt: new Date() }).where(eq(heroes.id, id)).returning();
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
      imageUrl: input.imageUrl ?? null,
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
      imageUrl: input.imageUrl ?? null,
      updatedAt: new Date(),
    })
    .where(eq(units.id, id));

  return findUnitBySlug(input.slug);
};

export const deleteUnit = async (id: number) => {
  const db = getDb();
  const [removed] = await db.update(units).set({ deletedAt: new Date() }).where(eq(units.id, id)).returning();
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
      imageUrl: input.imageUrl ?? null,
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
      imageUrl: input.imageUrl ?? null,
      updatedAt: new Date(),
    })
    .where(eq(maps.id, id));

  return findMapBySlug(input.slug);
};

export const deleteMap = async (id: number) => {
  const db = getDb();
  const [removed] = await db.update(maps).set({ deletedAt: new Date() }).where(eq(maps.id, id)).returning();
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
      imageUrl: input.imageUrl ?? null,
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
      imageUrl: input.imageUrl ?? null,
      updatedAt: new Date(),
    })
    .where(eq(races.id, id));

  return findRaceBySlug(input.slug);
};

export const deleteRace = async (id: number) => {
  const db = getDb();
  const [removed] = await db.update(races).set({ deletedAt: new Date() }).where(eq(races.id, id)).returning();
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

export const listAdminBuilds = async (limit = 12, search?: string, race?: string, difficulty?: string): Promise<AdminBuildListItem[]> => {
  const db = getDb();
  const conditions = [
    isNull(builds.deletedAt),
    search ? ilike(builds.title, `%${search}%`) : undefined,
    race ? inArray(builds.raceId, db.select({ id: races.id }).from(races).where(eq(races.slug, race))) : undefined,
    difficulty ? eq(builds.difficulty, difficulty) : undefined,
  ].filter((c): c is NonNullable<typeof c> => Boolean(c));

  const records = await db.query.builds.findMany({
    with: { race: true },
    where: and(...conditions),
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

export const listAdminMatchups = async (limit = 12, search?: string): Promise<AdminMatchupListItem[]> => {
  const db = getDb();
  const records = await db.query.matchups.findMany({
    with: {
      raceA: true,
      raceB: true,
    },
    where: search ? and(isNull(matchups.deletedAt), ilike(matchups.title, `%${search}%`)) : isNull(matchups.deletedAt),
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
    imageUrl: hero.imageUrl ?? null,
  };
};

export const listAdminHeroes = async (limit = 12, search?: string, race?: string): Promise<AdminHeroListItem[]> => {
  const db = getDb();
  const conditions = [
    isNull(heroes.deletedAt),
    search ? ilike(heroes.name, `%${search}%`) : undefined,
    race ? inArray(heroes.raceId, db.select({ id: races.id }).from(races).where(eq(races.slug, race))) : undefined,
  ].filter((c): c is NonNullable<typeof c> => Boolean(c));
  const records = await db.query.heroes.findMany({
    with: { race: true },
    where: and(...conditions),
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
    imageUrl: hero.imageUrl ?? getSharedHeroBySlug(hero.slug)?.imageUrl ?? null,
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
    imageUrl: unit.imageUrl ?? null,
  };
};

export const listAdminUnits = async (limit = 12, search?: string): Promise<AdminUnitListItem[]> => {
  const db = getDb();
  const records = await db.query.units.findMany({
    with: {
      race: true,
    },
    where: search ? and(isNull(units.deletedAt), ilike(units.name, `%${search}%`)) : isNull(units.deletedAt),
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
    imageUrl: unit.imageUrl ?? getSharedUnitBySlug(unit.slug)?.imageUrl ?? null,
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
    imageUrl: map.imageUrl ?? null,
  };
};

export const listAdminMaps = async (limit = 12, search?: string): Promise<AdminMapListItem[]> => {
  const db = getDb();
  const records = await db
    .select()
    .from(maps)
    .where(search ? and(isNull(maps.deletedAt), ilike(maps.name, `%${search}%`)) : isNull(maps.deletedAt))
    .orderBy(asc(maps.name))
    .limit(limit);

  return records.map((map) => ({
    id: map.id,
    slug: map.slug,
    name: map.name,
    imageUrl: map.imageUrl ?? getSharedMapBySlug(map.slug)?.imageUrl ?? null,
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
    imageUrl: race.imageUrl ?? null,
  };
};

export const listAdminRaces = async (limit = 12, search?: string): Promise<AdminRaceListItem[]> => {
  const db = getDb();
  const records = await db
    .select()
    .from(races)
    .where(search ? and(isNull(races.deletedAt), ilike(races.name, `%${search}%`)) : isNull(races.deletedAt))
    .orderBy(asc(races.name))
    .limit(limit);

  return records.map((race) => ({
    id: race.id,
    slug: race.slug,
    name: race.name,
    imageUrl: race.imageUrl ?? getSharedRaceBySlug(race.slug)?.imageUrl ?? null,
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

// ── Buildings ─────────────────────────────────────────────────────────────────

export const listAdminBuildings = async (limit = 12, search?: string, race?: string): Promise<AdminBuildingListItem[]> => {
  const db = getDb();
  const conditions = [
    isNull(buildingsTable.deletedAt),
    search ? ilike(buildingsTable.name, `%${search}%`) : undefined,
    race ? eq(buildingsTable.race, race) : undefined,
  ].filter((c): c is NonNullable<typeof c> => Boolean(c));
  const records = await db
    .select()
    .from(buildingsTable)
    .where(and(...conditions))
    .orderBy(asc(buildingsTable.name))
    .limit(limit);
  return records.map((b) => ({ id: b.id, name: b.name, race: b.race, imageFile: b.imageFile }));
};

export const getAdminBuildingById = async (id: number): Promise<AdminBuildingRecord | null> => {
  const db = getDb();
  const [b] = await db.select().from(buildingsTable).where(eq(buildingsTable.id, id));
  if (!b) return null;
  return { id: b.id, name: b.name, race: b.race, description: b.description, imageFile: b.imageFile };
};

export const createBuilding = async (input: AdminBuildingInput) => {
  const db = getDb();
  const [b] = await db.insert(buildingsTable).values(input).returning();
  return b;
};

export const updateBuilding = async (id: number, input: AdminBuildingInput) => {
  const db = getDb();
  await db.update(buildingsTable).set({ ...input, updatedAt: new Date() }).where(eq(buildingsTable.id, id));
  return getAdminBuildingById(id);
};

export const deleteBuilding = async (id: number) => {
  const db = getDb();
  const [removed] = await db.update(buildingsTable).set({ deletedAt: new Date() }).where(eq(buildingsTable.id, id)).returning();
  return removed ?? null;
};

// ── Game Items ────────────────────────────────────────────────────────────────

export const listAdminItems = async (limit = 12, search?: string): Promise<AdminItemListItem[]> => {
  const db = getDb();
  const records = await db
    .select()
    .from(gameItems)
    .where(search ? and(isNull(gameItems.deletedAt), ilike(gameItems.name, `%${search}%`)) : isNull(gameItems.deletedAt))
    .orderBy(asc(gameItems.name))
    .limit(limit);
  return records.map((i) => ({
    id: i.id,
    name: i.name,
    category: i.category,
    shops: JSON.parse(i.shops) as string[],
    imageFile: i.imageFile,
  }));
};

export const getAdminItemById = async (id: number): Promise<AdminItemRecord | null> => {
  const db = getDb();
  const [i] = await db.select().from(gameItems).where(eq(gameItems.id, id));
  if (!i) return null;
  return {
    id: i.id,
    name: i.name,
    category: i.category,
    shops: JSON.parse(i.shops) as string[],
    description: i.description,
    imageFile: i.imageFile,
  };
};

export const createItem = async (input: AdminItemInput) => {
  const db = getDb();
  const [i] = await db
    .insert(gameItems)
    .values({ ...input, shops: JSON.stringify(input.shops) })
    .returning();
  return i;
};

export const updateItem = async (id: number, input: AdminItemInput) => {
  const db = getDb();
  await db
    .update(gameItems)
    .set({ ...input, shops: JSON.stringify(input.shops), updatedAt: new Date() })
    .where(eq(gameItems.id, id));
  return getAdminItemById(id);
};

export const deleteItem = async (id: number) => {
  const db = getDb();
  const [removed] = await db.update(gameItems).set({ deletedAt: new Date() }).where(eq(gameItems.id, id)).returning();
  return removed ?? null;
};
