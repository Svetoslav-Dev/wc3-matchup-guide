"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Build } from "@warcraft3-guide-hub/shared";
import { DifficultyBadge } from "./difficulty-badge";
import { GameImage } from "./game-image";

const raceImages: Record<string, string> = {
  "human":     "/images/Races/Humans_Icon.png",
  "orc":       "/images/Races/Orcs_Icon.png",
  "night-elf": "/images/Races/Night_Elves_Icon.png",
  "undead":    "/images/Races/Undead_Icon.png",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FeaturedBuild({ builds }: { builds: Build[] }) {
  const [ordered, setOrdered] = useState<Build[]>([]);

  useEffect(() => {
    if (builds.length === 0) return;
    setOrdered(shuffle(builds));
  }, []);

  if (ordered.length === 0) return null;

  return (
    <aside className="panel hero-aside flex flex-col gap-4 self-stretch">
      <p className="section-label m-0">Random Builds for each race</p>
      <div className="flex flex-col flex-1 gap-2.5">
        {ordered.map((build) => (
          <Link
            key={build.slug}
            href={`/builds/${build.slug}`}
            className="flex flex-1 flex-col gap-2 px-3.5 py-3 rounded-[14px] border border-line bg-white/[.02] hover:bg-white/[.05] hover:border-gold/40 transition-all duration-150"
            style={{ borderTop: "2px solid rgba(201,163,91,0.45)" }}
          >
            <div className="flex items-center gap-2.5">
              <GameImage
                src={raceImages[build.raceSlug] ?? "/placeholder.svg"}
                alt={build.raceName}
                className="w-9 h-9 rounded-[8px] shrink-0 object-cover border border-line"
                width={36}
                height={36}
              />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[0.68rem] uppercase tracking-widest text-muted leading-none">{build.raceName}</span>
                <span className="text-[0.88rem] font-bold text-text leading-snug truncate">{build.title}</span>
              </div>
              <span className="text-muted text-[0.75rem] opacity-50 shrink-0">→</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <DifficultyBadge value={build.difficulty} />
              {build.strategyType && (
                <span className="pill" style={{ fontSize: "0.65rem", padding: "0.15rem 0.6rem" }}>
                  {build.strategyType}
                </span>
              )}
            </div>
            <p className="text-muted m-0 leading-snug line-clamp-2" style={{ fontSize: "0.78rem" }}>
              {build.summary}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
