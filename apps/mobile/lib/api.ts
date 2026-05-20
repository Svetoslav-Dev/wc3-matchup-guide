import type {
  AuthUser,
  Build,
  FavoriteBuild,
  Hero,
  ListResponse,
  MapGuide,
  Matchup,
  Race,
  Unit,
} from "@warcraft3-guide-hub/shared";

type ApiErrorPayload = {
  error?: string;
};

type AuthResponse = {
  data: AuthUser;
  token: string;
};

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  token?: string | null;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const getApiBaseUrl = () => {
  const value = process.env.EXPO_PUBLIC_API_URL?.trim();

  return value ? trimTrailingSlash(value) : null;
};

const buildRequestHeaders = (token?: string | null) => {
  const headers = new Headers({
    "content-type": "application/json",
  });

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  return headers;
};

async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new Error("EXPO_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: buildRequestHeaders(options.token),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = (await response.json().catch(() => null)) as T | ApiErrorPayload | null;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload && payload.error
        ? payload.error
        : "Request failed.";

    throw new Error(message);
  }

  return payload as T;
}

export const mobileApi = {
  configReady: () => Boolean(getApiBaseUrl()),
  login: (input: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: input,
    }),
  register: (input: { email: string; username: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: input,
    }),
  getCurrentUser: (token: string) =>
    apiRequest<{ data: AuthUser }>("/auth/me", {
      token,
    }),
  getFavorites: (token: string) =>
    apiRequest<{ data: FavoriteBuild[] }>("/me/favorites", {
      token,
    }),
  addFavorite: (token: string, buildSlug: string) =>
    apiRequest<{ data: FavoriteBuild }>("/me/favorites", {
      method: "POST",
      token,
      body: { buildSlug },
    }),
  removeFavorite: (token: string, favoriteId: number) =>
    apiRequest<{ success: boolean }>(`/me/favorites/${favoriteId}`, {
      method: "DELETE",
      token,
    }),
  getRaces: () =>
    apiRequest<{ data: Race[] }>("/races"),
  getRace: (slug: string) =>
    apiRequest<{ data: Race }>(`/races/${slug}`),
  getMatchups: () =>
    apiRequest<ListResponse<Matchup>>("/matchups"),
  getMatchup: (slug: string) =>
    apiRequest<{ data: Matchup }>(`/matchups/${slug}`),
  getHeroes: (page = 1, pageSize = 20) =>
    apiRequest<ListResponse<Hero>>(`/heroes?page=${page}&pageSize=${pageSize}`),
  getHero: (slug: string) =>
    apiRequest<{ data: Hero }>(`/heroes/${slug}`),
  getBuilds: (query?: { page?: number; pageSize?: number; race?: string; matchup?: string; search?: string }) => {
    const searchParams = new URLSearchParams();

    if (query?.page) {
      searchParams.set("page", String(query.page));
    }

    if (query?.pageSize) {
      searchParams.set("pageSize", String(query.pageSize));
    }

    if (query?.race) {
      searchParams.set("race", query.race);
    }

    if (query?.matchup) {
      searchParams.set("matchup", query.matchup);
    }

    if (query?.search) {
      searchParams.set("search", query.search);
    }

    const suffix = searchParams.size > 0 ? `?${searchParams.toString()}` : "";
    return apiRequest<ListResponse<Build>>(`/builds${suffix}`);
  },
  getBuild: (slug: string) =>
    apiRequest<{ data: Build }>(`/builds/${slug}`),
  getUnits: (page = 1, pageSize = 200) =>
    apiRequest<ListResponse<Unit>>(`/units?page=${page}&pageSize=${pageSize}`),
  getUnit: (slug: string) =>
    apiRequest<{ data: Unit }>(`/units/${slug}`),
  getMaps: (page = 1, pageSize = 50) =>
    apiRequest<ListResponse<MapGuide>>(`/maps?page=${page}&pageSize=${pageSize}`),
  getMap: (slug: string) =>
    apiRequest<{ data: MapGuide }>(`/maps/${slug}`),
};
