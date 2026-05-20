import { useEffect, useState } from "react";
import type { Build, Hero, MapGuide, Matchup, Race, Unit } from "@warcraft3-guide-hub/shared";
import { mobileApi } from "./api";
import {
  getMobileBuild,
  getMobileHero,
  getMobileMap,
  getMobileMatchup,
  getMobileRace,
  getMobileUnit,
  mobileData,
  mobileStats,
} from "./mobile-data";

type RemoteState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  live: boolean;
};

function useRemoteValue<T>(key: string, fetcher: () => Promise<T>, fallback: T): RemoteState<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(Boolean(mobileApi.configReady()));
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!mobileApi.configReady()) {
      setData(fallback);
      setLoading(false);
      setError(null);
      setLive(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetcher();

        if (!cancelled) {
          setData(result);
          setLive(true);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setData(fallback);
          setError(fetchError instanceof Error ? fetchError.message : "Unable to load content.");
          setLive(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [fallback, key]);

  return { data, loading, error, live };
}

export function useHomeContent() {
  const races = useRemoteValue("home-races", async () => {
    const response = await mobileApi.getRaces();
    return response.data;
  }, mobileData.races);
  const matchups = useRemoteValue("home-matchups", async () => {
    const response = await mobileApi.getMatchups();
    return response.data;
  }, mobileData.matchups);
  const builds = useRemoteValue("home-builds", async () => {
    const response = await mobileApi.getBuilds({ page: 1, pageSize: 50 });
    return response.data;
  }, mobileData.builds);

  return {
    races: races.data,
    matchups: matchups.data,
    builds: builds.data,
    stats: {
      races: races.data.length,
      builds: builds.data.length || mobileStats.builds,
      matchups: matchups.data.length,
      heroes: mobileStats.heroes,
    },
    loading: races.loading || matchups.loading || builds.loading,
    error: races.error ?? matchups.error ?? builds.error,
    live: races.live || matchups.live || builds.live,
  };
}

export function useRacesContent() {
  return useRemoteValue("races", async () => {
    const response = await mobileApi.getRaces();
    return response.data;
  }, mobileData.races);
}

export function useRaceContent(slug?: string) {
  const fallbackRace = slug ? getMobileRace(slug) ?? null : null;

  return useRemoteValue(`race:${slug ?? "missing"}`, async () => {
    if (!slug) {
      return null;
    }

    const response = await mobileApi.getRace(slug);
    return response.data;
  }, fallbackRace);
}

export function useMatchupsContent() {
  return useRemoteValue("matchups", async () => {
    const response = await mobileApi.getMatchups();
    return response.data;
  }, mobileData.matchups);
}

export function useMatchupContent(slug?: string) {
  const fallbackMatchup = slug ? getMobileMatchup(slug) ?? null : null;

  return useRemoteValue(`matchup:${slug ?? "missing"}`, async () => {
    if (!slug) {
      return null;
    }

    const response = await mobileApi.getMatchup(slug);
    return response.data;
  }, fallbackMatchup);
}

export function useBuildsContent() {
  return useRemoteValue("builds", async () => {
    const response = await mobileApi.getBuilds({ page: 1, pageSize: 50 });
    return response.data;
  }, mobileData.builds);
}

export function useBuildContent(slug?: string) {
  const fallbackBuild = slug ? getMobileBuild(slug) ?? null : null;

  return useRemoteValue(`build:${slug ?? "missing"}`, async () => {
    if (!slug) {
      return null;
    }

    const response = await mobileApi.getBuild(slug);
    return response.data;
  }, fallbackBuild);
}

export function useHeroesContent() {
  return useRemoteValue("heroes", async () => {
    const response = await mobileApi.getHeroes(1, 50);
    return response.data;
  }, mobileData.heroes);
}

export function useHeroContent(slug?: string) {
  const fallbackHero = slug ? getMobileHero(slug) ?? null : null;

  return useRemoteValue(`hero:${slug ?? "missing"}`, async () => {
    if (!slug) return null;
    const response = await mobileApi.getHero(slug);
    return response.data;
  }, fallbackHero);
}

export function useUnitsContent() {
  return useRemoteValue("units", async () => {
    const response = await mobileApi.getUnits(1, 200);
    return response.data;
  }, mobileData.units);
}

export function useUnitContent(slug?: string) {
  const fallbackUnit = slug ? getMobileUnit(slug) ?? null : null;

  return useRemoteValue(`unit:${slug ?? "missing"}`, async () => {
    if (!slug) return null;
    const response = await mobileApi.getUnit(slug);
    return response.data;
  }, fallbackUnit);
}

export function useMapsContent() {
  return useRemoteValue("maps", async () => {
    const response = await mobileApi.getMaps(1, 50);
    return response.data;
  }, mobileData.maps);
}

export function useMapContent(slug?: string) {
  const fallbackMap = slug ? getMobileMap(slug) ?? null : null;

  return useRemoteValue(`map:${slug ?? "missing"}`, async () => {
    if (!slug) return null;
    const response = await mobileApi.getMap(slug);
    return response.data;
  }, fallbackMap);
}

export type { Build, Hero, MapGuide, Matchup, Race, Unit };
