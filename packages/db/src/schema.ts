import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable(
  "users",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    email: varchar("email", { length: 255 }).notNull(),
    username: varchar("username", { length: 50 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").default("user").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    uniqueIndex("users_username_idx").on(table.username),
  ],
);

export const races = pgTable(
  "races",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    description: text("description").notNull(),
    identity: text("identity").notNull(),
    ladderFocus: text("ladder_focus").notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    deletedAt: timestamp("deleted_at"),
    ...timestamps,
  },
  (table) => [uniqueIndex("races_slug_idx").on(table.slug)],
);

export const heroes = pgTable(
  "heroes",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    raceId: integer("race_id")
      .notNull()
      .references(() => races.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    description: text("description").notNull(),
    primaryAttribute: varchar("primary_attribute", { length: 40 }).notNull(),
    role: varchar("role", { length: 80 }).notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    deletedAt: timestamp("deleted_at"),
    ...timestamps,
  },
  (table) => [uniqueIndex("heroes_slug_idx").on(table.slug), index("heroes_race_id_idx").on(table.raceId)],
);

export const units = pgTable(
  "units",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    raceId: integer("race_id")
      .notNull()
      .references(() => races.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    description: text("description").notNull(),
    unitType: varchar("unit_type", { length: 80 }).notNull(),
    strengths: text("strengths").notNull(),
    weaknesses: text("weaknesses").notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    deletedAt: timestamp("deleted_at"),
    ...timestamps,
  },
  (table) => [uniqueIndex("units_slug_idx").on(table.slug), index("units_race_id_idx").on(table.raceId)],
);

export const maps = pgTable(
  "maps",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    description: text("description").notNull(),
    creepNotes: text("creep_notes").notNull(),
    expansionNotes: text("expansion_notes").notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    deletedAt: timestamp("deleted_at"),
    ...timestamps,
  },
  (table) => [uniqueIndex("maps_slug_idx").on(table.slug)],
);

export const matchups = pgTable(
  "matchups",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    raceAId: integer("race_a_id")
      .notNull()
      .references(() => races.id, { onDelete: "cascade" }),
    raceBId: integer("race_b_id")
      .notNull()
      .references(() => races.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    summary: text("summary").notNull(),
    difficulty: varchar("difficulty", { length: 50 }).notNull(),
    earlyGamePlan: text("early_game_plan").notNull(),
    midGamePlan: text("mid_game_plan").notNull(),
    lateGamePlan: text("late_game_plan").notNull(),
    commonMistakes: text("common_mistakes").notNull(),
    deletedAt: timestamp("deleted_at"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("matchups_slug_idx").on(table.slug),
    index("matchups_race_a_id_idx").on(table.raceAId),
    index("matchups_race_b_id_idx").on(table.raceBId),
  ],
);

export const builds = pgTable(
  "builds",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    raceId: integer("race_id")
      .notNull()
      .references(() => races.id, { onDelete: "cascade" }),
    matchupId: integer("matchup_id").references(() => matchups.id, { onDelete: "set null" }),
    title: varchar("title", { length: 180 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    summary: text("summary").notNull(),
    difficulty: varchar("difficulty", { length: 50 }).notNull(),
    strategyType: varchar("strategy_type", { length: 80 }).notNull(),
    body: text("body").notNull(),
    createdByUserId: integer("created_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    isPublished: boolean("is_published").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("builds_slug_idx").on(table.slug),
    index("builds_race_id_idx").on(table.raceId),
    index("builds_matchup_id_idx").on(table.matchupId),
    index("builds_created_by_user_id_idx").on(table.createdByUserId),
  ],
);

export const buildSteps = pgTable(
  "build_steps",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    buildId: integer("build_id")
      .notNull()
      .references(() => builds.id, { onDelete: "cascade" }),
    stepNumber: integer("step_number").notNull(),
    supply: integer("supply").notNull(),
    timing: varchar("timing", { length: 20 }).notNull(),
    instruction: text("instruction").notNull(),
    ...timestamps,
  },
  (table) => [
    index("build_steps_build_id_idx").on(table.buildId),
    uniqueIndex("build_steps_build_id_step_number_idx").on(table.buildId, table.stepNumber),
  ],
);

export const favorites = pgTable(
  "favorites",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    buildId: integer("build_id")
      .notNull()
      .references(() => builds.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("favorites_user_id_idx").on(table.userId),
    index("favorites_build_id_idx").on(table.buildId),
    uniqueIndex("favorites_user_id_build_id_idx").on(table.userId, table.buildId),
  ],
);

export const buildingsTable = pgTable(
  "buildings",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 120 }).notNull(),
    race: varchar("race", { length: 50 }).notNull(),
    description: text("description").notNull(),
    imageFile: varchar("image_file", { length: 120 }).notNull(),
    deletedAt: timestamp("deleted_at"),
    ...timestamps,
  },
  (table) => [index("buildings_race_idx").on(table.race)],
);

export const gameItems = pgTable(
  "game_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 120 }).notNull(),
    category: varchar("category", { length: 20 }).notNull(),
    shops: text("shops").notNull(),
    description: text("description").notNull(),
    imageFile: varchar("image_file", { length: 120 }).notNull(),
    deletedAt: timestamp("deleted_at"),
    ...timestamps,
  },
  (table) => [index("game_items_category_idx").on(table.category)],
);

export const usersRelations = relations(users, ({ many }) => ({
  builds: many(builds),
  favorites: many(favorites),
}));

export const racesRelations = relations(races, ({ many }) => ({
  heroes: many(heroes),
  units: many(units),
  matchupsAsRaceA: many(matchups, { relationName: "raceA" }),
  matchupsAsRaceB: many(matchups, { relationName: "raceB" }),
  builds: many(builds),
}));

export const heroesRelations = relations(heroes, ({ one }) => ({
  race: one(races, {
    fields: [heroes.raceId],
    references: [races.id],
  }),
}));

export const unitsRelations = relations(units, ({ one }) => ({
  race: one(races, {
    fields: [units.raceId],
    references: [races.id],
  }),
}));

export const matchupsRelations = relations(matchups, ({ many, one }) => ({
  raceA: one(races, {
    relationName: "raceA",
    fields: [matchups.raceAId],
    references: [races.id],
  }),
  raceB: one(races, {
    relationName: "raceB",
    fields: [matchups.raceBId],
    references: [races.id],
  }),
  builds: many(builds),
}));

export const buildsRelations = relations(builds, ({ many, one }) => ({
  race: one(races, {
    fields: [builds.raceId],
    references: [races.id],
  }),
  matchup: one(matchups, {
    fields: [builds.matchupId],
    references: [matchups.id],
  }),
  author: one(users, {
    fields: [builds.createdByUserId],
    references: [users.id],
  }),
  steps: many(buildSteps),
  favorites: many(favorites),
}));

export const buildStepsRelations = relations(buildSteps, ({ one }) => ({
  build: one(builds, {
    fields: [buildSteps.buildId],
    references: [builds.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  build: one(builds, {
    fields: [favorites.buildId],
    references: [builds.id],
  }),
}));

