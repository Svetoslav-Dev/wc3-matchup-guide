const RACE_IDS: Record<string, number> = {
  human: 1,
  orc: 2,
  undead: 4,
  "night-elf": 8,
};

type WinLossEntry = {
  race: number;
  wins: number;
  losses: number;
  games: number;
  winrate: number;
};

type RatioEntry = {
  race: number;
  winLosses: WinLossEntry[];
};

type MapStats = {
  mapName: string;
  ratio: RatioEntry[];
};

type MmrRangeEntry = {
  mmrRange: number;
  patchToStatsPerModes: Record<string, MapStats[]>;
};

export type MatchupWinRates = Record<string, number>;

// Module-level cache — the raw response is ~10 MB which exceeds Next.js's 2 MB
// fetch-cache limit, so we cache the tiny processed result (8 numbers) ourselves.
let _cached: MatchupWinRates | null = null;
let _expiresAt = 0;
const TTL_MS = 60 * 60 * 1000; // 1 hour

export async function fetchMatchupWinRates(): Promise<MatchupWinRates> {
  if (_cached && Date.now() < _expiresAt) return _cached;

  try {
    const res = await fetch(
      "https://website-backend.w3champions.com/api/w3c-stats/map-race-wins",
      { cache: "no-store" },
    );
    if (!res.ok) return _cached ?? {};

    const data: MmrRangeEntry[] = await res.json();

    const overall = data.find((entry) => entry.mmrRange === 0);
    if (!overall) return _cached ?? {};

    const patches = Object.keys(overall.patchToStatsPerModes).sort();
    const latestPatch = patches[patches.length - 1];
    if (!latestPatch) return _cached ?? {};

    const maps = overall.patchToStatsPerModes[latestPatch];
    const overallMap = maps?.find((m) => m.mapName === "Overall") ?? maps?.[0];
    if (!overallMap) return _cached ?? {};

    const result: MatchupWinRates = {};

    for (const raceSlugA of Object.keys(RACE_IDS)) {
      const raceIdA = RACE_IDS[raceSlugA];
      const ratioEntry = overallMap.ratio.find((r) => r.race === raceIdA);
      if (!ratioEntry) continue;

      for (const raceSlugB of Object.keys(RACE_IDS)) {
        if (raceSlugA === raceSlugB) continue;
        const raceIdB = RACE_IDS[raceSlugB];
        const wl = ratioEntry.winLosses.find((w) => w.race === raceIdB);
        if (wl) {
          result[`${raceSlugA}-vs-${raceSlugB}`] = Math.round(wl.winrate * 100);
        }
      }
    }

    _cached = result;
    _expiresAt = Date.now() + TTL_MS;
    return result;
  } catch {
    return _cached ?? {};
  }
}
