"use client";

import { useState } from "react";
import Link from "next/link";
import type { Build, ListResponse } from "@warcraft3-guide-hub/shared";
import { GameImage } from "./game-image";

type Props = {
  initialResult: ListResponse<Build>;
  race?: string;
  matchup?: string;
  search?: string;
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

export function BuildList({ initialResult, race, matchup, search }: Props) {
  const [builds, setBuilds] = useState(initialResult.data);
  const [total, setTotal] = useState(initialResult.total);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const hasMore = builds.length < total;

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
            <div className="list-meta">
              <GameImage
                src={`/images/races/${build.raceSlug}.jpg`}
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
                <span>Difficulty: {build.difficulty}</span>
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
