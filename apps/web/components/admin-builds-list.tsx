"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { AdminBuildListItem } from "@warcraft3-guide-hub/shared";
import { GameImage } from "./game-image";
import { ConfirmDelete } from "./confirm-delete";

const RACE_ICONS: Record<string, string> = {
  human:       "/images/Races/Humans_Icon.png",
  orc:         "/images/Races/Orcs_Icon.png",
  undead:      "/images/Races/Undead_Icon.png",
  "night-elf": "/images/Races/Night_Elves_Icon.png",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy:        "#4ade80",
  Medium:      "#facc15",
  Hard:        "#f97316",
  "Very Hard": "#ef4444",
};

type Props = {
  initialBuilds: AdminBuildListItem[];
  initialHasMore: boolean;
  perPage: number;
  q?: string;
  race?: string;
  difficulty?: string;
  deleteBuildAction: (formData: FormData) => Promise<void>;
};

export function AdminBuildsList({
  initialBuilds,
  initialHasMore,
  perPage,
  q,
  race,
  difficulty,
  deleteBuildAction,
}: Props) {
  const [builds, setBuilds] = useState(initialBuilds);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loaded, setLoaded] = useState(initialBuilds.length);
  const [isPending, startTransition] = useTransition();

  const showMore = () => {
    const nextLoaded = loaded + perPage;
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (race) qs.set("race", race);
    if (difficulty) qs.set("difficulty", difficulty);
    qs.set("perPage", String(perPage));
    qs.set("loaded", String(nextLoaded));

    startTransition(async () => {
      const res = await fetch(`/api/admin/builds?${qs.toString()}`);
      if (!res.ok) return;
      const data = await res.json();
      setBuilds(data.builds);
      setHasMore(data.hasMore);
      setLoaded(nextLoaded);
    });
  };

  return (
    <>
      <div className="admin-list">
        {builds.map((build) => (
          <article key={build.slug} className="admin-list-row">
            <div className="admin-list-row__img">
              <GameImage
                src={RACE_ICONS[build.raceSlug] ?? null}
                alt={build.raceName}
                width={40}
                height={40}
                className="admin-build-race-icon"
              />
            </div>
            <div className="admin-list-row__info">
              <p className="admin-list-row__name">{build.title}</p>
              <div className="admin-card-meta">
                <span className="pill pill--race">{build.raceName}</span>
                <span
                  className="admin-difficulty-badge"
                  style={{
                    color: DIFFICULTY_COLORS[build.difficulty] ?? "var(--color-muted)",
                    borderColor: `${DIFFICULTY_COLORS[build.difficulty] ?? "var(--color-line)"}55`,
                    background: `${DIFFICULTY_COLORS[build.difficulty] ?? "transparent"}12`,
                  }}
                >
                  {build.difficulty}
                </span>
                <span className="muted" style={{ fontSize: "0.78rem" }}>{build.strategyType}</span>
                {!build.isPublished && <span className="pill pill--draft">Draft</span>}
              </div>
            </div>
            <div className="inline-actions">
              <Link href={`/admin/builds/${build.slug}/edit`} className="button button--edit button--sm">Edit</Link>
              <Link href={`/builds/${build.slug}`} className="button button--view button--sm">View</Link>
              <ConfirmDelete action={deleteBuildAction} itemName={build.title} hiddenFields={{ buildId: String(build.id) }} />
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
          <button onClick={showMore} disabled={isPending} className="button button--ghost">
            {isPending ? "Loading…" : "Show more"}
          </button>
        </div>
      )}
    </>
  );
}
