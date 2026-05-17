import "dotenv/config";
import bcrypt from "bcryptjs";
import { desc, eq } from "drizzle-orm";
import { getDb } from "./client";
import {
  buildSeeds,
  createGeneratedBuilds,
  heroRaceSlugMap,
  heroSeeds,
  mapSeeds,
  matchupSeeds,
  raceSeeds,
  unitSeeds,
} from "./seed-data";
import { buildSteps, builds, favorites, heroes, maps, matchups, races, units, users } from "./schema";

const db = getDb();

const chunk = <T>(items: T[], size: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const seedUsers = async () => {
  const passwordHash = await bcrypt.hash("demo123", 10);

  await db
    .insert(users)
    .values([
      {
        email: "admin@example.com",
        username: "admin",
        passwordHash,
        role: "admin",
      },
      {
        email: "user@example.com",
        username: "user",
        passwordHash,
        role: "user",
      },
    ])
    .onConflictDoNothing();

  return db.select().from(users);
};

const seedRaces = async () => {
  await db
    .insert(races)
    .values(
      raceSeeds.map((race) => ({
        name: race.name,
        slug: race.slug,
        description: race.description,
        identity: race.identity,
        ladderFocus: race.ladderFocus,
      })),
    )
    .onConflictDoNothing();

  return db.select().from(races);
};

const seedHeroes = async (raceMap: Map<string, number>) => {
  await db
    .insert(heroes)
    .values(
      heroSeeds.map((hero) => ({
        raceId: raceMap.get(heroRaceSlugMap[hero.raceName]) ?? 0,
        name: hero.name,
        slug: hero.slug,
        description: hero.description,
        primaryAttribute: hero.primaryAttribute,
        role: hero.role,
      })),
    )
    .onConflictDoNothing();
};

const seedUnits = async (raceMap: Map<string, number>) => {
  await db
    .insert(units)
    .values(
      unitSeeds.map((unit) => ({
        raceId: raceMap.get(unit.raceSlug) ?? 0,
        name: unit.name,
        slug: unit.slug,
        description: unit.description,
        unitType: unit.unitType,
        strengths: unit.strengths,
        weaknesses: unit.weaknesses,
      })),
    )
    .onConflictDoNothing();
};

const seedMaps = async () => {
  await db.insert(maps).values(mapSeeds).onConflictDoNothing();
};

const seedMatchups = async (raceMap: Map<string, number>) => {
  await db
    .insert(matchups)
    .values(
      matchupSeeds.map((matchup) => ({
        raceAId: raceMap.get(matchup.raceASlug) ?? 0,
        raceBId: raceMap.get(matchup.raceBSlug) ?? 0,
        title: matchup.title,
        slug: matchup.slug,
        summary: matchup.summary,
        difficulty: matchup.difficulty,
        earlyGamePlan: matchup.earlyGamePlan,
        midGamePlan: matchup.midGamePlan,
        lateGamePlan: matchup.lateGamePlan,
        commonMistakes: JSON.stringify(matchup.commonMistakes),
      })),
    )
    .onConflictDoNothing();

  return db.select().from(matchups);
};

const seedBaseBuilds = async (
  raceMap: Map<string, number>,
  matchupMap: Map<string, number>,
  adminUserId: number,
) => {
  await db
    .insert(builds)
    .values(
      buildSeeds.map((build) => ({
        raceId: raceMap.get(build.raceSlug) ?? 0,
        matchupId: build.matchupSlug ? matchupMap.get(build.matchupSlug) ?? null : null,
        title: build.title,
        slug: build.slug,
        summary: build.summary,
        difficulty: build.difficulty,
        strategyType: build.strategyType,
        body: `${build.summary}\n\nRecommended for ${build.raceName} players who want a ${build.strategyType.toLowerCase()} plan.`,
        createdByUserId: adminUserId,
        isPublished: true,
      })),
    )
    .onConflictDoNothing();

  const insertedBuilds = await db.select().from(builds);
  const buildMap = new Map(insertedBuilds.map((build) => [build.slug, build.id]));

  const stepRows = buildSeeds.flatMap((build) =>
    build.steps.map((step) => ({
      buildId: buildMap.get(build.slug) ?? 0,
      stepNumber: step.stepNumber,
      supply: step.supply,
      timing: step.timing,
      instruction: step.instruction,
    })),
  );

  await db.insert(buildSteps).values(stepRows).onConflictDoNothing();
};

const seedGeneratedBuilds = async (
  raceMap: Map<string, number>,
  matchupMap: Map<string, number>,
  adminUserId: number,
) => {
  const generatedBuilds = createGeneratedBuilds().map((build, index) => ({
    raceId: raceMap.get(build.raceSlug) ?? 0,
    matchupId: build.matchupSlug ? matchupMap.get(build.matchupSlug) ?? null : null,
    title: build.title,
    slug: build.slug,
    summary: build.summary,
    difficulty: build.difficulty,
    strategyType: build.strategyType,
    body: `${build.summary}\n\nGenerated seed record ${index + 1}.`,
    createdByUserId: adminUserId,
    isPublished: index % 5 !== 0,
  }));

  for (const rows of chunk(generatedBuilds, 500)) {
    await db.insert(builds).values(rows).onConflictDoNothing();
  }
};

const seedFavorites = async (userId: number) => {
  const publishedBuilds = await db
    .select()
    .from(builds)
    .where(eq(builds.isPublished, true))
    .orderBy(desc(builds.id))
    .limit(3);

  if (publishedBuilds.length === 0) {
    return;
  }

  await db
    .insert(favorites)
    .values(
      publishedBuilds.map((build) => ({
        userId,
        buildId: build.id,
      })),
    )
    .onConflictDoNothing();
};

async function main() {
  const seededUsers = await seedUsers();
  const seededRaces = await seedRaces();

  const raceMap = new Map(seededRaces.map((race) => [race.slug, race.id]));
  const adminUser = seededUsers.find((user) => user.email === "admin@example.com");
  const regularUser = seededUsers.find((user) => user.email === "user@example.com");

  if (!adminUser || !regularUser) {
    throw new Error("Demo users were not created.");
  }

  await seedHeroes(raceMap);
  await seedUnits(raceMap);
  await seedMaps();

  const seededMatchups = await seedMatchups(raceMap);
  const matchupMap = new Map(seededMatchups.map((matchup) => [matchup.slug, matchup.id]));

  await seedBaseBuilds(raceMap, matchupMap, adminUser.id);
  await seedGeneratedBuilds(raceMap, matchupMap, adminUser.id);
  await seedFavorites(regularUser.id);

  console.log("Seed complete.");
}

main().catch((error) => {
  console.error("Seed failed.", error);
  process.exit(1);
});
