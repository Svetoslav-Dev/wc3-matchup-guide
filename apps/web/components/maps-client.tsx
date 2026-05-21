"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { GameImage } from "./game-image";
import type { MapGuide } from "@warcraft3-guide-hub/shared";
import { mapCategories, mapCategoryNameBySlug, mapSlugsByCategory } from "../app/maps/categories";

type Props = {
  allMaps: MapGuide[];
  initialMode?: string;
};

const categoryOrder = mapCategories.map((c) => c.slug);

const minCategoryIndex = (slug: string) => {
  const indices = categoryOrder.map((cat, i) =>
    (mapSlugsByCategory[cat] ?? []).includes(slug) ? i : Infinity,
  );
  return Math.min(...indices);
};

export function MapsClient({ allMaps, initialMode }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMode, setActiveMode] = useState(initialMode);

  const handleModeChange = useCallback((mode: string | undefined) => {
    setActiveMode(mode);
    const url = mode ? `${pathname}?mode=${mode}` : pathname;
    router.replace(url, { scroll: false });
  }, [router, pathname]);

  const visibleMaps = activeMode
    ? allMaps.filter((map) => (mapSlugsByCategory[activeMode] ?? []).includes(map.slug))
    : [...allMaps].sort((a, b) => minCategoryIndex(a.slug) - minCategoryIndex(b.slug));

  return (
    <>
      <div className="filter-panel">
        <div className="filter-panel__group">
          <span className="filter-panel__label">Game Mode</span>
          <div className="filter-chip-row">
            <button
              type="button"
              className={`filter-chip${!activeMode ? " filter-chip--active" : ""}`}
              onClick={() => handleModeChange(undefined)}
            >
              All
            </button>
            {mapCategories.map((category) => (
              <button
                key={category.slug}
                type="button"
                className={`filter-chip${activeMode === category.slug ? " filter-chip--active" : ""}`}
                onClick={() => handleModeChange(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-grid">
        {visibleMaps.map((map) => {
          const categories = mapCategories
            .filter((c) => (mapSlugsByCategory[c.slug] ?? []).includes(map.slug))
            .map((c) => mapCategoryNameBySlug[c.slug]);

          return (
            <article key={map.slug} className="card">
              <p className="pill">{categories.join(" · ")}</p>
              <div className="title-row">
                <GameImage
                  src={map.imageUrl ?? `/images/maps/${map.slug}.jpg`}
                  alt={map.name}
                  className="game-image--icon"
                  width={64}
                  height={64}
                />
                <div className="title-stack">
                  <h2>{map.name}</h2>
                </div>
              </div>
              <p>{map.description}</p>
              <div className="card__footer">
                <div className="list-meta">
                  <span>{map.creepNotes}</span>
                </div>
                <div className="card__footer-action card__footer-action--center">
                  <Link href={`/maps/${map.slug}`} className="button button--ghost">
                    View Map Guide
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {visibleMaps.length === 0 ? (
        <article className="detail-panel">
          <h2>No maps found</h2>
          <p>There are no maps assigned to this category yet.</p>
        </article>
      ) : null}
    </>
  );
}
