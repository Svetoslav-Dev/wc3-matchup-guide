"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DifficultyBadge } from "./difficulty-badge";
import type { Build, ListResponse } from "@warcraft3-guide-hub/shared";
import { GameImage } from "./game-image";
import { saveFavoriteAction, removeFavoriteAction } from "../app/builds/[slug]/favorite-actions";

const RACE_ICONS: Record<string, string> = {
  Human:     "Humans_Icon.png",
  Orc:       "Orcs_Icon.png",
  Undead:    "Undead_Icon.png",
  "Night Elf": "Night_Elves_Icon.png",
};
const raceIcon = (name: string) => RACE_ICONS[name] ?? "Neutral.png";

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

type Props = {
  initialResult: ListResponse<Build>;
  race?: string;
  matchup?: string;
  search?: string;
  difficulty?: string;
  favoriteSlugs?: string[];
};

const PAGE_SIZE_OPTIONS = [20, 50, 100];

async function fetchBuilds(page: number, pageSize: number, race?: string, matchup?: string, search?: string, difficulty?: string): Promise<ListResponse<Build>> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (race) params.set("race", race);
  if (matchup) params.set("matchup", matchup);
  if (search) params.set("search", search);
  if (difficulty) params.set("difficulty", difficulty);
  const res = await fetch(`/api/builds?${params}`);
  if (!res.ok) throw new Error("Failed to fetch builds");
  return res.json();
}

export function BuildList({ initialResult, race, matchup, search, difficulty, favoriteSlugs = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [builds, setBuilds] = useState(initialResult.data);
  const [total, setTotal] = useState(initialResult.total);
  const [page, setPage] = useState(1);

  // When the parent resolves a new filtered result, sync local state.
  // initialResult reference only changes after setResult() in BuildsClient.
  useEffect(() => {
    setBuilds(initialResult.data);
    setTotal(initialResult.total);
    setPage(1);
  }, [initialResult]);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(search ?? "");
  const [favSet, setFavSet] = useState(() => new Set(favoriteSlugs));
  const [, startTransition] = useTransition();
  const hasMore = builds.length < total;

  const toggleFavorite = (slug: string) => {
    const isFav = favSet.has(slug);
    setFavSet((prev) => {
      const next = new Set(prev);
      if (isFav) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
    startTransition(async () => {
      const fd = new FormData();
      fd.append("buildSlug", slug);
      if (isFav) {
        await removeFavoriteAction(fd);
      } else {
        await saveFavoriteAction(fd);
      }
    });
  };

  const submitSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(params.toString() ? `${pathname}?${params}` : pathname);
  };

  const loadMore = async () => {
    setLoading(true);
    try {
      const result = await fetchBuilds(page + 1, pageSize, race, matchup, search, difficulty);
      setBuilds((prev) => [...prev, ...result.data]);
      setTotal(result.total);
      setPage((p) => p + 1);
    } finally {
      setLoading(false);
    }
  };

  const changePageSize = async (newSize: number) => {
    if (newSize === pageSize) return;
    setLoading(true);
    setPageSize(newSize);
    try {
      const result = await fetchBuilds(1, newSize, race, matchup, search, difficulty);
      setBuilds(result.data);
      setTotal(result.total);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="builds-toolbar">
        <p className="muted">Showing {builds.length} of {total} builds.</p>
        <form
          className="builds-search"
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
        >
          <label className="builds-search__label" htmlFor="build-title-search">
            <strong>Search by title</strong>
          </label>
          <input
            id="build-title-search"
            className="builds-search__input"
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search build titles"
          />
          <button className="button button--ghost" type="submit">
            Search
          </button>
        </form>
        <div className="builds-page-size">
          <strong className="muted">Per page:</strong>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              className={`button button--ghost${pageSize === size ? " button--active" : ""}`}
              onClick={() => changePageSize(size)}
              disabled={loading}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div className="list-grid">
        {builds.map((build) => (
          <article key={build.slug} className="card build-card">
            <button
              className={`heart-btn${favSet.has(build.slug) ? " heart-btn--filled" : ""}`}
              type="button"
              aria-label={favSet.has(build.slug) ? "Remove from favorites" : "Save to favorites"}
              onClick={() => toggleFavorite(build.slug)}
            >
              <HeartIcon filled={favSet.has(build.slug)} />
            </button>

            <div className="build-card__header">
              <div className="build-card__header-body">
                <div className="build-card__tags">
                  {build.bestAgainst && build.bestAgainst !== build.raceName ? (
                    <span className="flex items-center gap-2">
                      <GameImage
                        src={build.raceImageUrl ?? `/images/Races/${raceIcon(build.raceName)}`}
                        alt={build.raceName}
                        className="w-8 h-8 rounded-[8px] shrink-0 object-cover shadow-md"
                        width={32}
                        height={32}
                      />
                      <span className="text-[0.8rem] font-bold text-text leading-none">{build.raceName}</span>
                      <span className="text-[0.65rem] font-bold text-muted opacity-60 px-0.5">vs</span>
                      <GameImage
                        src={`/images/Races/${raceIcon(build.bestAgainst)}`}
                        alt={build.bestAgainst}
                        className="w-8 h-8 rounded-[8px] shrink-0 object-cover shadow-md"
                        width={32}
                        height={32}
                      />
                      <span className="text-[0.8rem] font-bold text-text leading-none">{build.bestAgainst}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <GameImage
                        src={build.raceImageUrl ?? `/images/Races/${raceIcon(build.raceName)}`}
                        alt={build.raceName}
                        className="w-8 h-8 rounded-[8px] shrink-0 object-cover shadow-md"
                        width={32}
                        height={32}
                      />
                      <span className="text-[0.8rem] font-bold text-text leading-none">{build.raceName}</span>
                    </span>
                  )}
                  <span className="pill build-card__strategy">{build.strategyType}</span>
                </div>
                <h2 className="build-card__title">{build.title}</h2>
              </div>
            </div>

            <div className="build-card__body">
              <p className="build-card__summary">{build.summary}</p>
              <div className="build-card__footer">
                <DifficultyBadge value={build.difficulty} />
                <Link href={`/builds/${build.slug}`} className="button button--ghost button--sm">
                  Open Build
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {hasMore ? (
        <div className="builds-load-more">
          <button className="button button--ghost" onClick={loadMore} disabled={loading}>
            {loading ? "Loading…" : `Load ${pageSize} More`}
          </button>
        </div>
      ) : null}
    </>
  );
}
