export type Race = {
  slug: string;
  name: string;
  badge: string;
  identity: string;
  description: string;
  strengths: string[];
  signatureHeroes: string[];
  ladderFocus: string;
};

export type Hero = {
  slug: string;
  name: string;
  raceName: string;
  description: string;
  primaryAttribute: string;
  role: string;
  highlights: string[];
  imageUrl?: string | null;
};

export type Unit = {
  slug: string;
  name: string;
  raceName: string;
  description: string;
  unitType: string;
  tier: string;
  food: number;
  gold: number;
  lumber: number;
  strengths: string[];
  weaknesses: string[];
  imageUrl?: string | null;
};

export type MapGuide = {
  slug: string;
  name: string;
  description: string;
  creepNotes: string;
  expansionNotes: string;
  imageUrl?: string | null;
};

export type Matchup = {
  slug: string;
  title: string;
  summary: string;
  difficulty: string;
  earlyGamePlan: string;
  midGamePlan: string;
  lateGamePlan: string;
  commonMistakes: string[];
  heroChoices: string[];
};

export type BuildStep = {
  stepNumber: number;
  supply: number;
  timing: string;
  instruction: string;
};

export type Build = {
  slug: string;
  title: string;
  raceName: string;
  raceSlug: string;
  summary: string;
  difficulty: string;
  strategyType: string;
  matchupSlug?: string;
  bestAgainst?: string;
  steps: BuildStep[];
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ListResponse<T> = {
  data: T[];
} & PaginationMeta;

export type BuildFilters = {
  page?: number;
  pageSize?: number;
  race?: string;
  matchup?: string;
  search?: string;
};

export type UserRole = "user" | "admin";

export type AuthUser = {
  id: number;
  email: string;
  username: string;
  role: UserRole;
};

export type FavoriteBuild = {
  id: number;
  build: Build;
};

export type UserBuildSubmission = {
  id: number;
  slug: string;
  title: string;
  raceSlug: string;
  raceName: string;
  summary: string;
  difficulty: string;
  strategyType: string;
  isPublished: boolean;
};

export type AdminBuildInput = {
  raceSlug: string;
  matchupSlug?: string | null;
  title: string;
  slug: string;
  summary: string;
  difficulty: string;
  strategyType: string;
  body: string;
  isPublished: boolean;
  steps: BuildStep[];
};

export type AdminBuildRecord = AdminBuildInput & {
  id: number;
};

export type AdminMatchupInput = {
  raceASlug: string;
  raceBSlug: string;
  title: string;
  slug: string;
  summary: string;
  difficulty: string;
  earlyGamePlan: string;
  midGamePlan: string;
  lateGamePlan: string;
  commonMistakes: string[];
};

export type AdminMatchupRecord = AdminMatchupInput & {
  id: number;
};

export type AdminHeroInput = {
  raceSlug: string;
  name: string;
  slug: string;
  description: string;
  primaryAttribute: string;
  role: string;
  highlights: string[];
};

export type AdminHeroRecord = AdminHeroInput & {
  id: number;
};

export type AdminUnitInput = {
  raceSlug: string;
  name: string;
  slug: string;
  description: string;
  unitType: string;
  strengths: string[];
  weaknesses: string[];
};

export type AdminUnitRecord = AdminUnitInput & {
  id: number;
};

export type AdminMapInput = {
  name: string;
  slug: string;
  description: string;
  creepNotes: string;
  expansionNotes: string;
};

export type AdminMapRecord = AdminMapInput & {
  id: number;
};

export type AdminRaceInput = {
  name: string;
  slug: string;
  description: string;
  identity: string;
  ladderFocus: string;
};

export type AdminRaceRecord = AdminRaceInput & {
  id: number;
};

export type AdminBuildListItem = {
  id: number;
  slug: string;
  title: string;
  raceSlug: string;
  raceName: string;
  difficulty: string;
  strategyType: string;
  isPublished: boolean;
};

export type AdminMatchupListItem = {
  id: number;
  slug: string;
  title: string;
  raceASlug: string;
  raceBSlug: string;
  difficulty: string;
};

export type AdminHeroListItem = {
  id: number;
  slug: string;
  name: string;
  raceSlug: string;
  raceName: string;
  primaryAttribute: string;
  role: string;
};

export type AdminUnitListItem = {
  id: number;
  slug: string;
  name: string;
  raceSlug: string;
  raceName: string;
  unitType: string;
};

export type AdminMapListItem = {
  id: number;
  slug: string;
  name: string;
};

export type AdminRaceListItem = {
  id: number;
  slug: string;
  name: string;
};
