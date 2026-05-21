"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Build, ListResponse } from "@warcraft3-guide-hub/shared";
import { BuildFilterBar } from "./build-filter-bar";
import { BuildList } from "./build-list";

type Props = {
  initialResult: ListResponse<Build>;
  initialRace?: string;
  initialDifficulty?: string;
  initialSearch?: string;
  favoriteSlugs: string[];
};

async function fetchBuilds(params: {
  race?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<ListResponse<Build>> {
  const qs = new URLSearchParams();
  if (params.race)       qs.set("race", params.race);
  if (params.difficulty) qs.set("difficulty", params.difficulty);
  if (params.search)     qs.set("search", params.search);
  if (params.page)       qs.set("page", String(params.page));
  if (params.pageSize)   qs.set("pageSize", String(params.pageSize));
  const res = await fetch(`/api/builds?${qs}`);
  if (!res.ok) throw new Error("Failed to fetch builds");
  return res.json();
}

export function BuildsClient({ initialResult, initialRace, initialDifficulty, initialSearch, favoriteSlugs }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [race, setRace] = useState(initialRace);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [result, setResult] = useState(initialResult);

  const updateUrl = useCallback((r?: string, d?: string) => {
    const qs = new URLSearchParams();
    if (r) qs.set("race", r);
    if (d) qs.set("difficulty", d);
    const str = qs.toString();
    router.replace(str ? `${pathname}?${str}` : pathname, { scroll: false });
  }, [router, pathname]);

  const applyFilters = useCallback((r?: string, d?: string) => {
    setRace(r);
    setDifficulty(d);
    updateUrl(r, d);
    startTransition(async () => {
      const data = await fetchBuilds({ race: r, difficulty: d, search: initialSearch });
      setResult(data);
    });
  }, [updateUrl, initialSearch]);

  const handleRaceChange = (r?: string) => applyFilters(r, difficulty);
  const handleDifficultyChange = (d?: string) => applyFilters(race, d);

  return (
    <div style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 150ms ease" }}>
      <BuildFilterBar
        activeRace={race}
        activeDifficulty={difficulty}
        onRaceChange={handleRaceChange}
        onDifficultyChange={handleDifficultyChange}
      />
      <BuildList
        key={`${race ?? ""}-${difficulty ?? ""}`}
        initialResult={result}
        race={race}
        difficulty={difficulty}
        search={initialSearch}
        favoriteSlugs={favoriteSlugs}
      />
    </div>
  );
}
