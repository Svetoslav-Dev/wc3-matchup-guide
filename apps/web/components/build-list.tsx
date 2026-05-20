"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DifficultyBadge } from "./difficulty-badge";
import type { Build, ListResponse } from "@warcraft3-guide-hub/shared";
import { GameImage } from "./game-image";
import { saveFavoriteAction, removeFavoriteAction } from "../app/builds/[slug]/favorite-actions";

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
  favoriteSlugs?: string[];
};

const PAGE_SIZE_OPTIONS = [20, 50, 100];

async function fetchBuilds(page: number, pageSize: number, race?: string, matchup?: string, search?: string): Promise<ListResponse<Build>> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (race) params.set("race", race);
  if (matchup) params.set("matchup", matchup);
  if (search) params.set("search", search);
  const res = await fetch(`/api/builds?${params}`);
  if (!res.ok) throw new Error("Failed to fetch builds");
  return res.json();
}

export function BuildList({ initialResult, race, matchup, search, favoriteSlugs = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [builds, setBuilds] = useState(initialResult.data);
  const [total, setTotal] = useState(initialResult.total);
  const [page, setPage] = useState(1);
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
      const result = await fetchBuilds(page + 1, pageSize, race, matchup, search);
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
      const result = await fetchBuilds(1, newSize, race, matchup, search);
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
            Search by title
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
          <span className="muted">Per page:</span>
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
          <article key={build.slug} className="card">
            <button
              className={`heart-btn${favSet.has(build.slug) ? " heart-btn--filled" : ""}`}
              type="button"
              aria-label={favSet.has(build.slug) ? "Remove from favorites" : "Save to favorites"}
              onClick={() => toggleFavorite(build.slug)}
            >
              <HeartIcon filled={favSet.has(build.slug)} />
            </button>
            <div className="list-meta">
              <GameImage
                src={build.raceImageUrl ?? `/images/Races/${build.raceSlug}.jpg`}
                alt={build.raceName}
                className="game-image--icon"
                width={64}
                height={64}
              />
              <p className="pill pill--race">{build.raceName}</p>
              <p className="pill">{build.strategyType}</p>
            </div>
            <h2>{build.title}</h2>
            <p>{build.summary}</p>
            <div className="card__footer">
              <div className="list-meta">
                <span>Difficulty: <DifficultyBadge value={build.difficulty} /></span>
                {build.bestAgainst ? <span>Best against: {build.bestAgainst}</span> : null}
              </div>
              <Link href={`/builds/${build.slug}`} className="button button--ghost">
                Open Build
              </Link>
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
