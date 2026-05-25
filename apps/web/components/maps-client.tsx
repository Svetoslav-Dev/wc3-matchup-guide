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
      <div className="builds-toolbar">
        <p className="filter-panel__label" style={{ gridColumn: 1, gridRow: 1, margin: 0 }}>Game Mode</p>
        <p className="muted" style={{ gridColumn: 2, gridRow: "1 / 3", alignSelf: "center", margin: 0 }}>Showing {visibleMaps.length} of {allMaps.length} maps.</p>
        <div className="builds-page-size">
          <button
            type="button"
            className={`button button--ghost${!activeMode ? " button--active" : ""}`}
            onClick={() => handleModeChange(undefined)}
          >
            All
          </button>
          {mapCategories.map((category) => (
            <button
              key={category.slug}
              type="button"
              className={`button button--ghost${activeMode === category.slug ? " button--active" : ""}`}
              onClick={() => handleModeChange(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card-grid">
        {visibleMaps.map((map) => {
          const categories = mapCategories
            .filter((c) => (mapSlugsByCategory[c.slug] ?? []).includes(map.slug))
            .map((c) => mapCategoryNameBySlug[c.slug]);

          return (
            <Link key={map.slug} href={`/maps/${map.slug}`} className="card" style={{ textDecoration: "none" }}>
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
              <div className="list-meta mt-auto">
                <span>{map.creepNotes}</span>
              </div>
            </Link>
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
