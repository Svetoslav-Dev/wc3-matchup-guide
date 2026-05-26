import { z } from "zod";

const slugField = (maxLen = 160) =>
  z
    .string()
    .trim()
    .min(1, "Page URL is required.")
    .max(maxLen, `Page URL must be ${maxLen} characters or fewer.`)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Page URL may only contain lowercase letters, numbers, and hyphens — no spaces or special characters (e.g. twisted-meadows)."
    );

export const registerSchema = z.object({
  email: z.string().trim().email().max(255),
  username: z.string().trim().min(3).max(50),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(100),
});

export const favoriteMutationSchema = z.object({
  buildSlug: z.string().trim().min(1).max(180),
});

const buildStepSchema = z.object({
  stepNumber: z.number().int().min(1),
  supply: z.number().int().min(0),
  timing: z.string().trim().min(1).max(20),
  instruction: z.string().trim().min(1).max(1000),
});

export const adminBuildSchema = z.object({
  raceSlug: z.string().trim().min(1).max(120),
  matchupSlug: z.string().trim().max(160).optional().nullable(),
  title: z.string().trim().min(1).max(180),
  slug: slugField(180),
  summary: z.string().trim().min(1).max(2000),
  difficulty: z.string().trim().min(1).max(50),
  strategyType: z.string().trim().min(1).max(80),
  body: z.string().trim().min(1).max(10000),
  isPublished: z.boolean(),
  steps: z.array(buildStepSchema).max(40),
});

export const adminMatchupSchema = z.object({
  raceASlug: z.string().trim().min(1).max(120),
  raceBSlug: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(160),
  slug: slugField(160),
  summary: z.string().trim().min(1).max(2000),
  difficulty: z.string().trim().min(1).max(50),
  earlyGamePlan: z.string().trim().min(1).max(4000),
  midGamePlan: z.string().trim().min(1).max(4000),
  lateGamePlan: z.string().trim().min(1).max(4000),
  commonMistakes: z.array(z.string().trim().min(1).max(500)).max(20),
});

export const adminHeroSchema = z.object({
  raceSlug: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(120),
  slug: slugField(120),
  description: z.string().trim().min(1).max(2000),
  primaryAttribute: z.string().trim().min(1).max(40),
  role: z.string().trim().min(1).max(80),
  highlights: z.array(z.string().trim().min(1).max(500)).max(20),
  imageUrl: z.string().trim().max(500).optional().nullable(),
});

export const adminUnitSchema = z.object({
  raceSlug: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(120),
  slug: slugField(120),
  description: z.string().trim().min(1).max(2000),
  unitType: z.string().trim().min(1).max(80),
  strengths: z.array(z.string().trim().min(1).max(500)).max(20),
  weaknesses: z.array(z.string().trim().min(1).max(500)).max(20),
  imageUrl: z.string().trim().max(500).optional().nullable(),
});

export const adminMapSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: slugField(120),
  description: z.string().trim().min(1).max(2000),
  creepNotes: z.string().trim().min(1).max(4000),
  expansionNotes: z.string().trim().min(1).max(4000),
  imageUrl: z.string().trim().max(500).optional().nullable(),
});

export const adminRaceSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: slugField(120),
  description: z.string().trim().min(1).max(2000),
  identity: z.string().trim().min(1).max(2000),
  ladderFocus: z.string().trim().min(1).max(4000),
  imageUrl: z.string().trim().max(500).optional().nullable(),
});

export const adminBuildingSchema = z.object({
  name: z.string().trim().min(1).max(120),
  race: z.string().trim().min(1).max(50),
  description: z.string().trim().min(1).max(2000),
  imageFile: z.string().trim().max(120),
});

export const adminItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(20),
  shops: z.array(z.string().trim()).max(10),
  description: z.string().trim().min(1).max(2000),
  imageFile: z.string().trim().max(120),
});
